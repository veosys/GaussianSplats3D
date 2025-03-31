const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const port = 8080;

// Enable CORS for all routes with specific headers
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Range'],
    exposedHeaders: ['Content-Range', 'Content-Length', 'Accept-Ranges'],
    credentials: true
}));

// Add security headers for SharedArrayBuffer support
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

// Serve static files from build/demo directory
app.use(express.static(path.join(__dirname, '../build/demo')));

// Proxy middleware configuration
app.use('/proxy', createProxyMiddleware({
    target: 'https://storage.googleapis.com',
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': ''
    },
    onProxyRes: function(proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Cross-Origin-Opener-Policy'] = 'same-origin';
        proxyRes.headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
    }
}));

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
}); 