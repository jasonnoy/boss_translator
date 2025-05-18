const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// 创建 Express 应用
const app = express();
const port = process.env.PORT || 3000;

// 配置中间件
app.use(express.json());
app.use(cors());

// 确保缓存目录存在
const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}

// 静态文件服务
app.use('/screenshots', express.static(cacheDir));

// 截图服务路由
app.post('/capture', async (req, res) => {
    try {
        const { url, width = 1024, height = 768, format = 'png', customHeaders = {} } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: '需要提供URL参数' });
        }
        
        // 生成唯一的文件名
        const domain = new URL(url).hostname.replace(/\./g, '_');
        const timestamp = Date.now();
        const filename = `${domain}_${timestamp}.${format}`;
        const filepath = path.join(cacheDir, filename);
        
        console.log(`开始为 ${url} 生成截图...`);
        
        // 启动 Puppeteer
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ 
            width: parseInt(width), 
            height: parseInt(height),
            deviceScaleFactor: 1
        });
        
        // 设置页面加载超时时间
        await page.setDefaultNavigationTimeout(30000);
        
        // 设置请求头以绕开网站反爬机制
        const defaultHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1'
        };
        
        // 合并默认请求头和自定义请求头
        const headers = { ...defaultHeaders, ...customHeaders };
        await page.setExtraHTTPHeaders(headers);
        
        // 访问页面
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // 生成截图
        await page.screenshot({ path: filepath, type: format });
        
        // 关闭浏览器
        await browser.close();
        
        console.log(`截图完成: ${filepath}`);
        
        // 返回截图URL
        const screenshotUrl = `${req.protocol}://${req.get('host')}/screenshots/${filename}`;
        
        return res.json({
            success: true,
            imageUrl: screenshotUrl,
            filename: filename
        });
        
    } catch (error) {
        console.error('截图过程中出错:', error);
        return res.status(500).json({
            error: '截图生成失败',
            message: error.message
        });
    }
});

// 健康检查路由
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// 启动服务器
app.listen(port, () => {
    console.log(`截图服务正在监听端口 ${port}`);
}); 