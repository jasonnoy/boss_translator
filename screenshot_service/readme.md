
# 网站截图服务

这是一个使用 Puppeteer 和 Express 构建的简单网站截图服务，可以生成任何网页的高质量截图。

## 功能特点

- 支持任何公开可访问的网页截图
- 可自定义截图尺寸
- 支持 PNG 格式输出
- 自动缓存生成的截图
- 提供 REST API 接口

## 系统要求

- Node.js 14.0 或更高版本
- npm 或 yarn 包管理器

## 安装步骤

1. 克隆或下载本项目

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 启动服务
```bash
npm start
# 或
yarn start
```

服务将在 `http://localhost:3000` 启动。

## API 使用说明

### 生成网页截图

**请求**:

```
POST /capture
Content-Type: application/json
```

**请求体**:

```json
{
  "url": "https://example.com",
  "width": 1024,
  "height": 768,
  "format": "png"
}
```

参数说明:
- `url`: 必填，要截图的网页地址
- `width`: 可选，截图宽度，默认 1024
- `height`: 可选，截图高度，默认 768
- `format`: 可选，图片格式，目前支持 png，默认为 png

**成功响应**:

```json
{
  "success": true,
  "imageUrl": "http://localhost:3000/screenshots/example_com_1633456789.png",
  "filename": "example_com_1633456789.png"
}
```

**错误响应**:

```json
{
  "error": "截图生成失败",
  "message": "导航超时，网页加载时间过长"
}
```

### 检查服务健康状态

**请求**:

```
GET /health
```

**响应**:

```json
{
  "status": "ok"
}
```

## 在你的应用中使用

在客户端 JavaScript 中调用服务：

```javascript
async function getScreenshot(url) {
  try {
    const response = await fetch('http://localhost:3000/capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        width: 1024,
        height: 768
      })
    });
    
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('截图服务请求失败:', error);
    return null;
  }
}
```

## 部署建议

在生产环境部署时，建议：

1. 使用 PM2 或 Docker 管理服务
2. 设置合适的超时时间和内存限制
3. 配置 HTTPS 以保证安全性
4. 添加访问限制或身份验证

## 许可证

MIT 