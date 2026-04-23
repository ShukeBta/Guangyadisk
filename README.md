# Shuk-光鸭云盘 (GuangYaDisk)

<div align="center">

**MoviePilot / Emby / Jellyfin 光鸭云盘存储插件**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.2.0-green.svg)](https://github.com/ShukeBta/Guangyadisk/releases)
[![MoviePilot](https://img.shields.io/badge/MoviePilot-V2-orange.svg)](https://github.com/jxxghp/MoviePilot)
[![WebDAV](https://img.shields.io/badge/WebDAV-1%2C2-brightgreen.svg)]()

</div>

---

## ✨ 功能特性

- 🔐 **扫码登录** — 光鸭云盘原生设备码 OAuth2 授权，安全便捷
- 🔄 **Token 自动刷新** — 过期自动续签，无需手动重新登录
- 📂 **完整文件管理** — 浏览、上传（支持秒传）、下载、删除、重命名、新建文件夹
- 💾 **存储挂载** — 作为 MoviePilot 外部存储源
- 🎬 **流式播放** (`/stream`) — Emby/Jellyfin 直连播放网盘视频，无需下载到本地
- 📡 **目录浏览** (`/browse`) — JSON API 枚举网盘目录结构及播放链接
- 🌐 **WebDAV 服务** (`/webdav`) — **Emby/Jellyfin 可通过 WebDAV 协议直接挂载为媒体库** ✨
- 🎨 **现代化界面** — Vue 前端，响应式设计
- ⚡ **高性能** — 秒传检测、分片上传、并行批量操作
- 🗑️ **延迟彻底删除** — 自动清理回收站，避免残留

## 📸 界面预览

插件提供现代化的 Vue 管理界面，集成在 MoviePilot 插件面板中，支持：
- 二维码扫码登录
- 用户信息与空间使用量展示
- 文件浏览与操作管理

## 📦 安装

### 方式一：插件市场安装（推荐）

1. 进入 MoviePilot 后台 → **设置** → **插件市场**
2. 点击「添加源」，输入：

```
https://github.com/ShukeBta/Guangyadisk
```

3. 点击**刷新**，搜索 `Shuk-光鸭云盘` 或 `shuk-guangyadisk`
4. 点击**安装**

> ⚠️ 如已安装旧版本，请先卸载后再安装新版本

### 方式二：本地安装

1. 下载本仓库的 `plugins.v2/shuk-guangyadisk/` 目录
2. 将其复制到 MoviePilot 的 `app/plugins/` 目录下
3. 重启 MoviePilot

## 🚀 使用指南

### 第一步：登录光鸭云盘

1. 在 MoviePilot 的 **插件** 页面找到「Shuk-光鸭云盘」
2. 启用插件后点击 **「获取二维码」**
3. 使用**光鸭云盘 App** 扫描二维码授权
4. 扫码成功后自动完成登录

### 第二步：作为 MoviePilot 存储使用

登录成功后，插件会自动注册名为 **「Shuk-光鸭云盘」** 的存储：

| 使用场景 | 说明 |
|---------|------|
| **MoviePilot 下载/整理** | 在文件操作中选择存储目标为 `Shuk-光鸭云盘` |
| **文件浏览** | 在 MoviePilot 文件管理中直接浏览和管理云盘文件 |

### 第三步：Emby / Jellyfin 直连播放（推荐）

插件提供三种方式让媒体服务器访问光鸭云盘：

#### 🅰️ WebDAV 挂载（v2.2.0+，推荐 ✨）

Emby/Jellyfin 通过 WebDAV 协议直接把光鸭云盘当作"网络磁盘"，像本地文件夹一样扫描和播放。

**前提条件：** MoviePilot 和 Emby 在同一 Docker 网络（如 `1panel-network`）或能互通。

**在 Emby 中配置：**
1. 打开 Emby 管理后台 → **媒体库** → **添加媒体库**
2. 选择类型（电影/电视剧等）
3. 添加文件夹时选择**网络共享/NAS**
4. 路径填入：
   ```
   http://moviepilot-v2:3001/plugin/shuk-guangyadisk/webdav/
   ```
   > 如果你的网盘根目录是 `/BMH`，则路径改为：
   > ```
   > http://moviepilot-v2:3001/plugin/shuk-guangyadisk/webdav/BMH
   > ```

5. 认证方式：填入 MoviePilot 的 **API Token**（在 MoviePilot → 设置 → 安全设置 中生成）
6. 保存后点击扫描

> 💡 **原理：** Emby 通过 PROPFIND 方法遍历网盘目录结构，找到视频文件后通过 GET 方法流式播放。所有数据走光鸭签名 URL，不经过 MoviePilot 本地磁盘。

#### 🅱️ HTTP 流式代理（v2.1.0+）

适用于需要单个文件直连的场景：

```
# 浏览网盘目录
GET /plugin/shuk-guangyadisk/browse?path=/BMH

# 流式播放单个文件
GET /plugin/shuk-guangyadisk/stream?path=/BMH/电影/xxx.mkv
```

支持 HTTP Range 请求，可拖拽进度条。

#### 🅲️ MoviePilot 中转下载

传统模式：MoviePilot 先将文件从网盘下载到本地，再由 Emby 扫描本地目录播放。

| 对比项 | WebDAV 挂载 (🅰) | HTTP 代理 (🅱) | 中转下载 (🅲) |
|--------|------------------|---------------|--------------|
| Emby 能扫描？ | ✅ 完整支持 | ❌ 需手动 | ✅ |
| 占用磁盘空间？ | ❌ 不占 | ❌ 不占 | ✅ 占用 |
| 拖拽进度条 | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| 延迟 | 低 | 低 | 高（需等待下载） |

### 第四步：配置选项

可在插件设置页面调整以下参数：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| 启用插件 | 开关控制 | 关闭 |
| Client ID | 客户端标识（一般无需修改） | `guangya_web` |
| 每页数量 | 文件列表每页条数 | `100` |
| 排序字段 | 文件排序方式（3=按时间） | `3` |
| 排序类型 | 升序(1) / 降序(2) | `1` |
| 永久删除 | 删除时跳过回收站直接清除 | 关闭 |

## 🏗️ 技术架构

```
plugins.v2/shuk-guangyadisk/
├── __init__.py              # 插件入口 & API 路由 & MoviePilot 存储适配器
├── guangya_client.py        # HTTP 客户端 & OAuth2 登录流程
├── guangya_api.py           # 文件操作 API（CRUD + 上传下载）
├── webdav_provider.py       # WebDAV 协议适配器（v2.2.0+）
├── requirements.txt         # Python 依赖
├── plugin.json              # 插件元信息
├── README.md                # 本文件
└── dist/                    # Vue 前端资源（Module Federation）
    ├── index.html           # 入口 HTML
    └── assets/
        ├── remoteEntry.js   # Module Federation 远程入口
        ├── __federation_expose_Page.js    # 主页面组件
        ├── __federation_expose_Config.js # 配置页组件
        ├── Page-*.css       # 样式文件
        └── ...
```

### 核心模块说明

| 模块 | 职责 |
|------|------|
| `__init__.py` | 插件生命周期管理、API 路由注册（含 /stream /browse /webdav）、存储适配器暴露 |
| `guangya_client.py` | 光鸭云盘 HTTP API 封装、OAuth2 设备码授权、Token 刷新 |
| `guangya_api.py` | 文件系统操作抽象层（list/download/upload/delete/rename/move/copy） |
| `webdav_provider.py` | WebDAV 协议实现（PROPFIND/GET/HEAD/MKCOL 等），供 Emby/Jellyfin 挂载 |
| `dist/` | Vue 3 前端，通过 Webpack Module Federation 与 MoviePilot 集成 |

### 数据流架构

```
                    ┌─────────────────────────────────────┐
                    │          Emby / Jellyfin             │
                    │         (媒体服务器 :8096)            │
                    └──────┬──────────────┬────────────────┘
                           │              │
               WebDAV      │     HTTP     │  MoviePilot 存储
               PROPFIND/GET│   /stream    │  下载→本地
                           ▼              ▼
┌──────────────────────────────────────────────────────────┐
│                  MoviePilot V2 (:3001)                   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │            Shuk-光鸭云盘 插件                      │    │
│  │                                                  │    │
│  │  /webdav  ──→ webdav_provider.py (WebDAV协议)     │    │
│  │  /stream ──→ stream_file() (HTTP流式代理)         │    │
│  │  /browse ──→ browse_path() (JSON目录API)          │    │
│  │                                                  │    │
│  │  guangya_api.py  ←→  guangya_client.py            │    │
│  │                          ↓                        │    │
│  │              光鸭云盘 REST API                     │    │
│  │              (签名URL / OAuth2)                   │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼ signedURL
                ┌────────────────────┐
                │    光鸭云盘服务器     │
                │  (CDN 边缘节点)     │
                └────────────────────┘
```

## 📡 API 端点一览

| 端点 | 方法 | 用途 | 认证 | 版本 |
|------|------|------|------|------|
| `/plugin/shuk-guangyadisk/config` | GET/POST | 插件配置 | Bearer | v1.0+ |
| `/plugin/shuk-guangyadisk/login/qrcode` | GET | 获取登录二维码 | Bearer | v1.0+ |
| `/plugin/shuk-guangyadisk/login/poll` | GET | 轮询扫码状态 | Bearer | v1.0+ |
| `/plugin/shuk-guangyadisk/login/logout` | POST | 退出登录 | Bearer | v1.0+ |
| `/plugin/shuk-guangyadisk/stream` | GET | 流式播放文件 | Bearer | v2.1.0+ |
| `/plugin/shuk-guangyadisk/browse` | GET | 浏览目录(JSON) | Bearer | v2.1.0+ |
| `/plugin/shuk-guangyadisk/webdav/*` | 全部 | WebDAV 协议服务 | Bearer | v2.2.0+ |

## 🔧 开发环境

```bash
# 克隆仓库
git clone https://github.com/ShukeBta/Guangyadisk.git

# 前端开发（需要 Node.js）
cd plugins.v2/shuk-guangyadisk/dist
npm install
npm run dev
```

### Python 依赖

```
requests>=2.28.0
oss2>=2.18.0
```

> **注意：** WebDAV 功能使用纯 Python 标准库实现（xml.etree.ElementTree），无需额外依赖。

## 📋 版本历史

| 版本 | 更新内容 |
|------|---------|
| **v2.2.0** | 🆕 新增 **WebDAV 服务端**（`/webdav` 端点）：支持 PROPFIND/GET/HEAD/MKCOL/DELETE/PUT/MOVE/COPY，Emby/Jellyfin 可通过 WebDAV 直接挂载光鸭云盘为媒体库 |
| **v2.1.0** | 🆕 新增 `/stream` 流式代理端点（支持 Range seeking）、`/browse` 目录浏览 API |
| **v2.0.3** | 🐛 修复 remoteEntry.js CSS 引用路径错误导致前端加载失败；恢复原始 GuangyaDisk 图标 |
| **v2.0.2** | 🐛 修复插件不显示在"我的插件"列表中；统一 icon 字段为 PNG 图标 |
| **v2.0.1** | 🐛 修复 package.v2.json 兼容格式、二维码过期无法刷新；添加仓库级 README 和 MIT License |
| **v2.0.0** | 🎉 MoviePilot V2 版本初始发布：扫码登录、文件管理、存储挂载 |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing-feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 [MIT License](./LICENSE) 开源。

```
Copyright (c) 2026 ShukeBta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY
OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
```

## 🙏 致谢

- [MoviePilot](https://github.com/jxxghp/MoviePilot) — 强大的影视媒体库管理工具
- [光鸭云盘](https://guangya.net/) — 云存储服务
