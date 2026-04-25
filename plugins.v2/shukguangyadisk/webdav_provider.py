"""
光鸭云盘 WebDAV 适配器

将光鸭云盘 API 适配为标准 WebDAV 文件系统接口，
供 Emby / Jellyfin 等媒体服务器通过 WebDAV 协议直接挂载和播放。

支持的 WebDAV 方法:
- PROPFIND: 列目录/获取文件属性（Emby 扫描媒体库时使用）
- GET:       下载/播放文件（流式代理）
- HEAD:      获取文件元信息
- MKCOL:     创建目录（可选）
- DELETE:    删除文件（可选）
- MOVE:      移动/重命名（可选）
- PUT:       上传文件（可选）
"""

from __future__ import annotations

import os
import time
from typing import Any, Dict, List, Optional, Tuple
from xml.etree import ElementTree as ET
from xml.etree.ElementTree import Element, SubElement, tostring

from fastapi import Request, Response
from fastapi.responses import Response, StreamingResponse

from app.log import logger

# WebDAV XML 命名空间
DAV_NS = "DAV:"
NSMAP = {"d": DAV_NS}


class GuangyaWebDAVProvider:
    """
    光鸭云盘 → WebDAV 适配器。
    
    将 GuangYaApi 的文件操作映射为 WebDAV HTTP 接口，
    使 Emby 等支持 WebDAV 的应用可以直接挂载光鸭云盘。
    """

    def __init__(self, guangya_api, client):
        self._api = guangya_api
        self._client = client

    def handle_request(self, request: Request, path: str = "") -> Response:
        """
        分发 WebDAV 请求到对应的方法处理器。
        """
        method = request.method.upper()

        # 规范化路径
        normalized_path = str(path or "").replace("\\", "/").strip()
        if not normalized_path.startswith("/"):
            normalized_path = f"/{normalized_path}"
        normalized_path = normalized_path.rstrip("/") or "/"

        logger.debug(f"【WebDAV】{method} {normalized_path}")

        handlers = {
            "OPTIONS": self._handle_options,
            "PROPFIND": self._handle_propfind,
            "GET": self._handle_get,
            "HEAD": self._handle_head,
            "MKCOL": self._handle_mkcol,
            "DELETE": self._handle_delete,
            "PUT": self._handle_put,
            "MOVE": self._handle_move,
            "COPY": self._handle_copy,
        }

        handler = handlers.get(method)
        if not handler:
            return Response(
                content=f"Method {method} not allowed",
                status_code=405,
                headers={"Allow": ", ".join(handlers.keys())},
            )

        try:
            return handler(request, normalized_path)
        except Exception as err:
            logger.error(f"【WebDAV】{method} {normalized_path} 失败: {err}")
            return Response(
                content=f'<?xml version="1.0" encoding="utf-8"?>\n'
                        f'<d:error xmlns:d="DAV:"><s:message>{str(err)}</s:message></d:error>',
                status_code=500,
                media_type="application/xml; charset=utf-8",
            )

    # ------------------------------------------------------------------
    # OPTIONS
    # ------------------------------------------------------------------
    @staticmethod
    def _handle_options(_request: Request, _path: str) -> Response:
        """返回服务器支持的 WebDAV 能力。"""
        return Response(
            status_code=200,
            headers={
                "Allow": "OPTIONS, PROPFIND, GET, HEAD, MKCOL, DELETE, PUT, MOVE, COPY",
                "DAV": "1,2",
                "MS-Author-Via": "DAV",
            },
        )

    # ------------------------------------------------------------------
    # PROPFIND — 核心：Emby/Jellyfin 用它扫描目录
    # ------------------------------------------------------------------
    def _handle_propfind(self, request: Request, path: str) -> Response:
        """
        列出目录内容或获取文件属性。
        
        Emby 在扫描 WebDAV 媒体库时会大量调用此方法：
        - depth:0 → 获取当前路径自身的属性
        - depth:1 → 列出直接子项
        """
        from pathlib import Path as PathLib

        depth = request.headers.get("depth", "1").strip()

        # 解析请求体（可能包含需要查询的属性列表）
        requested_props = self._parse_propfind_request(request)

        item = self._api.get_item(PathLib(path))
        if not item:
            return Response(status_code=404)

        # 构建多状态响应
        responses: List[Element] = []

        # 当前路径自身
        responses.append(self._build_propstat_response(path, item, requested_props))

        # 如果是目录且 depth != "0"，列出子项
        if item.type == "dir" and depth != "0":
            children = self._api.list(item)
            for child in (children or []):
                child_path = child.path if child.path else f"{path.rstrip('/')}/{child.name}"
                responses.append(self._build_propstat_response(child_path, child, requested_props))

        # 构建 XML 响应
        multistatus = Element(f"{{{DAV_NS}}}multistatus")
        for resp in responses:
            multistatus.append(resp)

        xml_str = tostring(multistatus, encoding="unicode", xml_declaration=False)
        pretty_xml = self._prettify_xml(xml_str)

        return Response(
            content=f'<?xml version="1.0" encoding="utf-8"?>\n{pretty_xml}',
            status_code=207,  # Multi-Status
            media_type="application/xml; charset=utf-8",
            headers={"DAV": "1,2"},
        )

    def _parse_propfind_request(self, request: Request) -> List[str]:
        """
        解析 PROPFIND 请求体中请求的属性列表。
        返回空列表表示 allprop。
        """
        try:
            body = request.body
            if not body:
                return []
            root = ET.fromstring(body)
            # 检查是否是 <allprop/>
            for elem in root.iter():
                if elem.tag == f"{{{DAV_NS}}}allprop":
                    return []
                if elem.tag == f"{{{DAV_NS}}}propname":
                    return ["propname"]
            # 提取 <prop> 中的属性
            prop_elem = root.find(f"{{{DAV_NS}}}prop")
            if prop_elem is not None:
                return [child.tag.split("}")[-1] if "}" in child.tag else child.tag
                        for child in prop_elem]
            return []
        except Exception:
            return []

    def _build_propstat_response(
        self, path: str, item: Any, requested_props: List[str]
    ) -> Element:
        """
        为单个文件/目录构建 DAV:response 元素。
        """
        from datetime import datetime, timezone

        response = Element(f"{{{DAV_NS}}}response")

        # href
        href = SubElement(response, f"{{{DAV_NS}}}href")
        # 确保 URL 编码正确
        encoded_path = path.encode("utf-8") if isinstance(path, str) else path
        href.text = encoded_path.decode("utf-8") if isinstance(encoded_path, bytes) else str(path)

        # propstat
        propstat = SubElement(response, f"{{{DAV_NS}}}propstat")
        prop = SubElement(propstat, f"{{{DAV_NS}}}prop")

        # 决定要返回哪些属性
        is_allprop = not requested_props or "propname" in requested_props
        props_to_return = requested_props if not is_allprop else []

        prop_definitions = {
            "creationdate": lambda: time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(item.modify_time or time.time())),
            "displayname": lambda: item.name or "",
            "getlastmodified": lambda: (
                time.strftime("%a, %d %b %Y %H:%M:%S GMT", time.gmtime(item.modify_time or time.time()))
                if item.modify_time else ""
            ),
            "getlastmodified_2": lambda: (
                datetime.fromtimestamp(item.modify_time or time.time(), tz=timezone.utc).isoformat()
                if item.modify_time else ""
            ),
            "getetag": lambda: f'"{hash(str(item.path) + str(item.modify_time))}"',
            "getcontentlength": lambda: str(item.size or 0) if item.type == "file" else None,
            "getcontenttype": lambda: self._guess_content_type(item),
            "resourcetype": lambda: self._build_resource_type(item),
            "iscollection": lambda: ("true" if item.type == "dir" else "false"),
            "supportedlock": lambda: None,
            "lockdiscovery": lambda: None,
        }

        if is_allprops := (is_allprop or not props_to_return):
            # 返回所有标准属性
            for prop_name, value_fn in prop_definitions.items():
                if prop_name.endswith("_2"):
                    continue
                try:
                    value = value_fn()
                    if value is not None:
                        elem = SubElement(prop, f"{{{DAV_NS}}}{prop_name}")
                        if isinstance(value, Element):
                            elem.append(value)
                        elif value:
                            elem.text = str(value)
                except Exception:
                    pass
        else:
            # 只返回请求的属性
            for prop_name in props_to_return:
                fn = prop_definitions.get(prop_name)
                if fn:
                    try:
                        value = fn()
                        if value is not None:
                            elem = SubElement(prop, f"{{{DAV_NS}}}{prop_name}")
                            if isinstance(value, Element):
                                elem.append(value)
                            elif value:
                                elem.text = str(value)
                    except Exception:
                        pass

        status = SubElement(propstat, f"{{{DAV_NS}}}status")
        status.text = "HTTP/1.1 200 OK"

        return response

    @staticmethod
    def _build_resource_type(item: Any) -> Optional[Element]:
        """构建 resourcetype 元素。"""
        if item.type == "dir":
            collection = Element(f"{{{DAV_NS}}}collection")
            return collection
        return None  # 文件不添加子元素

    @staticmethod
    def _guess_content_type(item: Any) -> Optional[str]:
        """根据扩展名猜测 Content-Type。"""
        if item.type != "file" or not item.extension:
            return None

        ext_map = {
            "mp4": "video/mp4",
            "mkv": "video/x-matroska",
            "avi": "video/x-msvideo",
            "mov": "video/quicktime",
            "wmv": "video/x-ms-wmv",
            "flv": "video/x-flv",
            "webm": "video/webm",
            "ts": "video/mp2t",
            "m2ts": "video/mp2t",
            "mp3": "audio/mpeg",
            "flac": "audio/flac",
            "wav": "audio/wav",
            "aac": "audio/aac",
            "ogg": "audio/ogg",
            "m4a": "audio/mp4",
            "srt": "text/plain",
            "ass": "text/plain",
            "ssa": "text/plain",
            "sub": "text/plain",
            "idx": "text/plain",
            "smi": "text/plain",
            "nfo": "text/xml",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "gif": "image/gif",
            "bmp": "image/bmp",
            "tiff": "image/tiff",
            "iso": "application/x-iso9660-image",
            "zip": "application/zip",
            "rar": "application/vnd.rar",
            "7z": "application/x-7z-compressed",
        }
        return ext_map.get(item.extension.lower(), "application/octet-stream")

    @staticmethod
    def _prettify_xml(xml_str: str) -> str:
        """简单格式化 XML（保持兼容性）。"""
        try:
            try:
                root = ET.fromstring(xml_str)
                ET.indent(root, space="  ")
                return ET.tostring(root, encoding="unicode")
            except (LookupError, TypeError):
                # Python < 3.9 不支持 indent，返回原始
                return xml_str
        except Exception:
            return xml_str

    # ------------------------------------------------------------------
    # GET / HEAD — 流式下载/播放
    # ------------------------------------------------------------------
    def _handle_get(self, request: Request, path: str) -> Response:
        """GET 下载/流式播放文件。"""
        import requests as http_requests
        from pathlib import Path as PathLib

        item = self._api.get_item(PathLib(path))
        if not item:
            return Response(status_code=404)
        if item.type != "file":
            return Response(status_code=403, content="Cannot GET a directory")

        logger.info(f"【WebDAV】GET file: {path}, name={item.name}, size={item.size}")

        # 获取签名下载 URL
        dl_response = self._client.get_download_url(item.fileid)
        if dl_response.get("msg") != "success" and dl_response.get("code") != 0:
            return Response(
                status_code=502,
                content=f"Failed to get download URL: {dl_response.get('msg', 'unknown')}",
            )

        data = dl_response.get("data", {}) or {}
        download_url = data.get("signedURL") or data.get("downloadUrl")
        if not download_url:
            return Response(status_code=502, content="No download URL available")

        # 转发头
        forward_headers = {
            "User-Agent": request.headers.get("user-agent", "Mozilla/5.0 (WebDAV/1 GuangyaDisk)"),
            "Referer": "https://www.guangyupan.com/",
        }
        range_header = request.headers.get("range")
        if range_header:
            forward_headers["Range"] = range_header

        req = http_requests.get(
            download_url,
            headers=forward_headers,
            stream=True,
            timeout=300,
            allow_redirects=True,
        )

        if req.status_code >= 400:
            error_msg = f"Upstream error: HTTP {req.status_code}"
            logger.error(f"【WebDAV】{error_msg}")
            return Response(status_code=req.status_code, content=error_msg)

        # 构建响应头
        response_headers = {
            "Content-Type": req.headers.get("content-type", self._guess_content_type(item) or "application/octet-stream"),
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=3600",
            "X-Content-Duration": "",
        }
        content_length = req.headers.get("content-length")
        if content_length:
            response_headers["Content-Length"] = content_length
        content_range = req.headers.get("content-range")
        if content_range:
            response_headers["Content-Range"] = content_range
        response_headers["Content-Disposition"] = f'inline; filename="{item.name}"'

        def generate():
            try:
                for chunk in req.iter_content(chunk_size=256 * 1024):
                    if chunk:
                        yield chunk
            except Exception as e:
                logger.warning(f"【WebDAV】Stream interrupted: {e}")
            finally:
                req.close()

        status_code = req.status_code if range_header else 200
        return StreamingResponse(
            generate(),
            status_code=status_code,
            headers=response_headers,
        )

    def _handle_head(self, request: Request, path: str) -> Response:
        """HEAD 获取文件元信息（不返回 body）。"""
        from pathlib import Path as PathLib

        item = self._api.get_item(PathLib(path))
        if not item:
            return Response(status_code=404)
        if item.type != "file":
            return Response(status_code=403)

        content_type = self._guess_content_type(item) or "application/octet-stream"
        headers = {
            "Content-Type": content_type,
            "Accept-Ranges": "bytes",
            "Content-Length": str(item.size or 0),
            "Cache-Control": "public, max-age=3600",
            "Last-Modified": time.strftime(
                "%a, %d %b %Y %H:%M:%S GMT",
                time.gmtime(item.modify_time or time.time()),
            ),
        }
        return Response(headers=headers)

    # ------------------------------------------------------------------
    # MKCOL — 创建目录
    # ------------------------------------------------------------------
    def _handle_mkcol(self, request: Request, path: str) -> Response:
        """创建集合（目录）。"""
        from pathlib import Path as PathLib

        parent_path = str(PathLib(path).parent).replace("\\", "/") or "/"
        dir_name = PathLib(path).name

        parent_item = self._api.get_item(PathLib(parent_path))
        if not parent_item:
            return Response(status_code=409, content="Parent not found")

        result = self._api.create_folder(parent_item, dir_name)
        if result:
            return Response(status_code=201)  # Created
        return Response(status_code=405, content="Cannot create folder")

    # ------------------------------------------------------------------
    # DELETE — 删除
    # ------------------------------------------------------------------
    def _handle_delete(self, request: Request, path: str) -> Response:
        """删除资源。"""
        from pathlib import Path as PathLib

        item = self._api.get_item(PathLib(path))
        if not item:
            return Response(status_code=404)

        result = self._api.delete(item)
        if result:
            return Response(status_code=204)  # No Content
        return Response(status_code=500, content="Delete failed")

    # ------------------------------------------------------------------
    # PUT — 上传
    # ------------------------------------------------------------------
    def _handle_put(self, request: Request, path: str) -> Response:
        """上传/创建文件。"""
        from pathlib import Path as PathLib
        import tempfile

        parent_path = str(PathLib(path).parent).replace("\\", "/") or "/"
        file_name = PathLib(path).name

        parent_item = self._api.get_item(PathLib(parent_path))
        if not parent_item:
            return Response(status_code=409, content="Parent not found")

        # 将上传内容写入临时文件（同步环境下从 _body 缓存读取）
        body = getattr(request, '_body', None) or b""
        if not body:
            return Response(status_code=400, content="Empty body")

        with tempfile.NamedTemporaryFile(suffix=f"_{file_name}", delete=False, mode="wb") as tmp:
            tmp.write(body)
            tmp_path = tmp.name

        try:
            local_path = PathLib(tmp_path)
            result = self._api.upload(parent_item, local_path, new_name=file_name)
            if result:
                return Response(status_code=201 if not item else 204)
            return Response(status_code=500, content="Upload failed")
        finally:
            try:
                os.unlink(tmp_path)
            except Exception:
                pass

    # ------------------------------------------------------------------
    # MOVE — 移动/重命名
    # ------------------------------------------------------------------
    def _handle_move(self, request: Request, path: str) -> Response:
        """移动资源。"""
        destination = request.headers.get("destination", "")
        if not destination:
            return Response(status_code=400, content="Missing Destination header")

        from pathlib import Path as PathLib
        from urllib.parse import urlparse

        parsed = urlparse(destination)
        dest_path = parsed.path.replace("\\", "/").rstrip("/") or "/"

        item = self._api.get_item(PathLib(path))
        if not item:
            return Response(status_code=404)

        target_parent = str(PathLib(dest_path).parent).replace("\\", "/") or "/"
        new_name = PathLib(dest_path).name

        result = self._api.move(item, PathLib(target_parent), new_name=new_name)
        if result:
            return Response(status_code=201)
        return Response(status_code=500, content="Move failed")

    # ------------------------------------------------------------------
    # COPY — 复制
    # ------------------------------------------------------------------
    def _handle_copy(self, request: Request, path: str) -> Response:
        """复制资源。"""
        destination = request.headers.get("destination", "")
        if not destination:
            return Response(status_code=400, content="Missing Destination header")

        from pathlib import Path as PathLib
        from urllib.parse import urlparse

        parsed = urlparse(destination)
        dest_path = parsed.path.replace("\\", "/").rstrip("/") or "/"

        item = self._api.get_item(PathLib(path))
        if not item:
            return Response(status_code=404)

        target_parent = str(PathLib(dest_path).parent).replace("\\", "/") or "/"
        new_name = PathLib(dest_path).name

        result = self._api.copy(item, PathLib(target_parent), new_name=new_name)
        if result:
            return Response(status_code=201)
        return Response(status_code=500, content="Copy failed")
