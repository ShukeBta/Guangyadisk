# Shuk-光鸭云盘

MoviePilot / Emby 光鸭云盘存储插件，支持扫码登录、文件管理、存储挂载。

## 功能特性

- **扫码登录** — 光鸭云盘原生设备码 OAuth2 授权
- **Token 自动刷新** — 过期自动续签，无需手动干预
- **文件管理** — 浏览、上传、下载、删除、重命名、新建文件夹
- **存储挂载** — 作为 MoviePilot / Emby 外部存储源使用
- **Vue 前端** — 现代化界面

## 安装

### 插件市场安装（推荐）

1. MoviePilot 后台 → **设置** → **插件市场**
2. 添加自定义源：

```
https://github.com/ShukeBta/Guangyadisk
```

3. 刷新市场，搜索 `Shuk-光鸭云盘`，点击安装

### 本地安装

将 `plugins.v2/shuk-guangyadisk/` 目录复制到 MoviePilot 的 `app/plugins/` 目录下，重启即可。

## 使用

1. 启用插件
2. 点击「获取二维码」，用光鸭云盘 App 扫码
3. 扫码完成后自动登录
4. 在存储管理中选择「Shuk-光鸭云盘」即可使用

## 配置项

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| 启用插件 | 是否启用 | false |
| Client ID | 客户端标识 | guangya_web |
| 每页数量 | 文件列表每页条数 | 100 |
| 排序字段 | 文件排序方式 | 3 |
| 排序类型 | 升序/降序 | 1 |
| 永久删除 | 删除时跳过回收站 | false |

## 文件结构

```
plugins.v2/shuk-guangyadisk/
├── __init__.py          # 插件入口
├── guangya_client.py    # HTTP 客户端 & 登录
├── guangya_api.py       # 文件操作 API
├── requirements.txt     # Python 依赖
└── dist/                # Vue 前端资源
    ├── index.html
    └── assets/
```

## 许可证

MIT
