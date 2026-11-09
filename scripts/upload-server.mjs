// scripts/upload-server.mjs — Cổng Upload Server Cục Bộ Độc Lập cho TT Plugins
// Chạy bằng lệnh: node scripts/upload-server.mjs

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 4322;

const PLUGINS_DIR = path.join(ROOT_DIR, 'src', 'content', 'plugins');
const UPLOADS_DIR = path.join(ROOT_DIR, 'public', 'uploads');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');

// Đảm bảo các thư mục tồn tại
[PLUGINS_DIR, UPLOADS_DIR, IMAGES_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  // 1. Health check & status
  if (req.method === 'GET' && parsedUrl.pathname === '/api/status') {
    const files = fs.readdirSync(PLUGINS_DIR).filter((f) => f.endsWith('.md'));
    return sendJson(res, 200, {
      status: 'online',
      message: 'Cổng Upload Server TT Plugins đang hoạt động',
      root: ROOT_DIR,
      total_plugins: files.length,
      plugins: files
    });
  }

  // 2. API Publish Markdown
  if (req.method === 'POST' && parsedUrl.pathname === '/api/publish') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 50 * 1024 * 1024) {
        req.destroy(); // Giới hạn 50MB
      }
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { slug, markdown, rbz_base64, rbz_filename, image_base64, image_filename } = payload;

        if (!slug || !markdown) {
          return sendJson(res, 400, {
            success: false,
            error: 'Thiếu trường slug hoặc nội dung markdown'
          });
        }

        const safeSlug = slug.toLowerCase().replace(/[^a-z0-9\-]/g, '');
        const targetMdPath = path.join(PLUGINS_DIR, `${safeSlug}.md`);

        // Ghi file markdown
        fs.writeFileSync(targetMdPath, markdown, 'utf8');

        // Ghi file RBZ nếu có đính kèm base64
        let savedRbzPath = null;
        if (rbz_base64 && rbz_filename) {
          const safeRbzName = path.basename(rbz_filename);
          const rbzDest = path.join(UPLOADS_DIR, safeRbzName);
          const buffer = Buffer.from(rbz_base64, 'base64');
          fs.writeFileSync(rbzDest, buffer);
          savedRbzPath = `/uploads/${safeRbzName}`;
        }

        // Ghi file ảnh nếu có đính kèm base64
        let savedImgPath = null;
        if (image_base64 && image_filename) {
          const pluginImgDir = path.join(IMAGES_DIR, safeSlug);
          if (!fs.existsSync(pluginImgDir)) fs.mkdirSync(pluginImgDir, { recursive: true });
          const safeImgName = path.basename(image_filename);
          const imgDest = path.join(pluginImgDir, safeImgName);
          const buffer = Buffer.from(image_base64, 'base64');
          fs.writeFileSync(imgDest, buffer);
          savedImgPath = `/images/${safeSlug}/${safeImgName}`;
        }

        console.log(`[UPLOAD PORTAL] Đã xuất bản thành công: ${safeSlug}.md`);

        return sendJson(res, 200, {
          success: true,
          message: 'Xuất bản plugin thành công vào codebase',
          slug: safeSlug,
          path: `src/content/plugins/${safeSlug}.md`,
          saved_rbz: savedRbzPath,
          saved_image: savedImgPath
        });
      } catch (err) {
        console.error('[UPLOAD PORTAL] Lỗi xử lý:', err);
        return sendJson(res, 500, {
          success: false,
          error: err.message
        });
      }
    });
    return;
  }

  // 3. Phục vụ giao diện Portal Standalone nếu truy cập root
  if (req.method === 'GET' && (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>TT Plugins — Cổng Upload Server Cục Bộ</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; margin: 0; }
    .card { max-width: 650px; margin: 0 auto; background: #1e293b; padding: 32px; border-radius: 12px; border: 1px solid #334155; }
    h1 { color: #38bdf8; margin-top: 0; font-size: 24px; }
    p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
    .status { background: #064e3b; color: #34d399; padding: 8px 14px; border-radius: 6px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
    .btn { display: inline-block; background: #0284c7; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px; }
    .btn:hover { background: #0369a1; }
    code { background: #0b1329; padding: 3px 6px; border-radius: 4px; color: #7dd3fc; }
  </style>
</head>
<body>
  <div class="card">
    <div class="status">● Cổng Upload Server đang chạy tại PORT ${PORT}</div>
    <h1>TT Plugins Local Upload Gateway</h1>
    <p>Server cục bộ này sẵn sàng nhận yêu cầu ghi file tự động từ các Agent hoặc từ giao diện web portal.</p>
    <p>Để mở giao diện upload đầy đủ có preview:</p>
    <a class="btn" href="http://localhost:4321/portal" target="_blank">Mở Giao Diện Web Portal (localhost:4321/portal) →</a>
    <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;">
    <p><small>API Endpoints: <code>POST /api/publish</code> | <code>GET /api/status</code></small></p>
  </div>
</body>
</html>`);
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 TT Plugins Upload Server đang chạy tại:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   API Endpoint: http://localhost:${PORT}/api/publish`);
  console.log(`   Lưu Markdown tại: ${PLUGINS_DIR}`);
  console.log(`=======================================================`);
});
