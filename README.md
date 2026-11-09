# TT Plugins — SketchUp Extension Store

Website giới thiệu và phân phối plugin SketchUp, thương hiệu TT Plugins.

## Thành phần

- Astro: website tĩnh, tải nhanh, responsive.
- Decap CMS: quản trị sản phẩm tại `/admin`.
- GitHub: lưu mã nguồn và nội dung sản phẩm.
- Cloudflare Pages: hosting và tự động build khi push Git.
- Cloudflare Worker: OAuth proxy để Decap CMS đăng nhập GitHub.
- GitHub Releases: nơi lưu các bản `.rbz` (khuyến nghị).

## 1. Chuẩn bị

Cài Node.js LTS và Git:
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/
- Tạo tài khoản GitHub: https://github.com/
- Tạo tài khoản Cloudflare: https://dash.cloudflare.com/

Giải nén source code. Mở terminal tại thư mục dự án:

```bash
npm install
npm run dev
```

Mở URL localhost được hiển thị (thường là http://localhost:4321).

Build thử:

```bash
npm run build
```

## 2. Đưa mã nguồn lên GitHub

1. Tạo repository tên `tt-plugins`. Nếu muốn tự kiểm soát source, nên để Private.
2. Sửa `public/admin/config.yml`: thay `tien02683/tt-plugins` bằng owner/repository thật.
3. Sửa các placeholder GitHub/email trong Footer và nội dung mẫu.
4. Chạy:

```bash
git init
git add .
git commit -m "Initial TT Plugins website"
git branch -M main
git remote add origin https://github.com/tien02683/tt-plugins.git
git push -u origin main
```

## 3. Deploy website lên Cloudflare Pages

1. Đăng nhập Cloudflare Dashboard.
2. Mở **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Chọn repository `tt-plugins`.
4. Build settings:
   - Production branch: `main`
   - Framework preset: Astro (nếu được hỏi)
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Chọn **Save and Deploy**.

Cloudflare cấp URL dạng `https://<project-name>.pages.dev`.
Nếu đổi project name, cập nhật `site`, `site_url`, `display_url`, `ALLOWED_ORIGIN` ở các file tương ứng.

## 4. Cài đăng nhập CMS (GitHub OAuth + Cloudflare Worker)

CMS dùng GitHub backend. Worker OAuth riêng là cần thiết để GitHub cấp token cho cửa sổ Decap CMS. Không đưa `CLIENT_SECRET` vào website hoặc file config công khai.

### 4.1 Tạo GitHub OAuth App

Trong GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**.

- Application name: `TT Plugins CMS`
- Homepage URL: URL Pages của bạn, ví dụ `https://tt-plugins.pages.dev`
- Authorization callback URL: `https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/callback`

Tạo app, ghi lại **Client ID**, sau đó tạo **Client Secret**.

### 4.2 Deploy Worker

Mở terminal:

```bash
cd worker
npm install
npx wrangler login
```

Cập nhật `worker/wrangler.toml`, thay `ALLOWED_ORIGIN` bằng đúng URL website (không có dấu `/` cuối).

Đặt secrets:

```bash
npx wrangler secret put CLIENT_ID
npx wrangler secret put CLIENT_SECRET
```

Nhập giá trị GitHub OAuth App tương ứng khi được hỏi.

Deploy:

```bash
npx wrangler deploy
```

Sau deploy, Worker có URL dạng `https://tt-plugins-decap-oauth.<account>.workers.dev`.

### 4.3 Kết nối CMS với Worker

Mở `public/admin/config.yml` và sửa:

```yaml
backend:
  name: github
  repo: YOUR-GITHUB-USERNAME/tt-plugins
  branch: main
  base_url: https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev
  auth_endpoint: auth
```

Commit và push:

```bash
git add .
git commit -m "Configure CMS OAuth"
git push
```

Đợi Pages build hoàn tất, mở `https://<project>.pages.dev/admin/` và chọn Login with GitHub.

Tài khoản GitHub đăng nhập phải có quyền write vào repository nội dung. Không cấp quyền write cho người không đáng tin cậy vì họ có thể sửa nội dung và source repo.

## 5. Đăng sản phẩm mới

1. Vào `/admin`.
2. Đăng nhập GitHub.
3. Chọn **Plugins → New Plugins**.
4. Điền tên, slug, danh mục, mô tả, phiên bản, tương thích, giá.
5. Tải ảnh đại diện lên CMS.
6. Dán URL file RBZ vào `Link tải trực tiếp RBZ`, hoặc URL GitHub Releases.
7. Bật `Đã xuất bản`.
8. Chọn **Publish**.

Decap CMS sẽ commit nội dung Markdown và ảnh lên GitHub. Cloudflare Pages tự build lại website sau commit.

## 6. Quản lý file RBZ và bản trả phí

Khuyến nghị không lưu RBZ lớn trong thư mục public của website.

- Tạo GitHub Release cho mỗi plugin.
- Dùng tag phiên bản, ví dụ `tt-multi-view-v1.2.0`.
- Đính kèm file `.rbz` vào Release.
- Dán URL tải asset hoặc URL trang Release vào CMS.

Với sản phẩm trả phí, trường `price_type` và `price_label` chỉ hiển thị nhãn. Website hiện tại **chưa có checkout, thanh toán, cấp license hoặc bảo vệ link tải trả phí**. Không coi link GitHub Release công khai là cơ chế bảo vệ sản phẩm. Muốn bán thực sự, cần bổ sung backend xác thực đơn hàng/license và kho file riêng (ví dụ Cloudflare R2 + Worker).

## 7. Cập nhật tương thích SketchUp

Mỗi plugin có trường `compatibility`. Hãy ghi rõ các phiên bản đã test thực tế, không nên ghi `SketchUp 2023+` nếu chưa kiểm tra tất cả.

## 8. Cấu trúc thư mục

```text
tt-plugins/
├── public/
│   ├── admin/
│   │   ├── index.html
│   │   └── config.yml
│   ├── images/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── content/plugins/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── worker/
│   ├── src/index.js
│   └── wrangler.toml
├── astro.config.mjs
├── package.json
└── README.md
```

## 9. Lưu ý bảo mật và giới hạn

- Giữ GitHub OAuth Client Secret trong Worker Secrets, tuyệt đối không commit.
- Worker kiểm tra OAuth `state` và giới hạn origin của CMS.
- Chỉ cấp quyền repository cho tài khoản quản trị tin cậy.
- Bật 2FA cho GitHub và Cloudflare.
- Bản mẫu hiện dùng CMS dạng Git-based: thao tác xuất bản sẽ tạo commit lên GitHub.
- Hosting miễn phí có quota và điều khoản sử dụng; xem lại trang pricing hiện hành trước khi vận hành thương mại.
- `tt-plugins.pages.dev` là URL ví dụ; cần thay bằng URL Pages thật của bạn.

## Tài liệu chính thức

- Astro trên Cloudflare Pages: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- Pages build settings: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Decap CMS GitHub backend: https://decapcms.org/docs/github-backend/
- Decap CMS OAuth proxy: https://decapcms.org/docs/backends-overview/
- Cloudflare Workers: https://developers.cloudflare.com/workers/
