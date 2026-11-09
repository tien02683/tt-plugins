# HƯỚNG DẪN DÀNH CHO CÁC AI AGENT: HỆ THỐNG WEBSITE TT PLUGINS & CỔNG UPLOAD

> **Dành cho:** Antigravity, Claude Code, Maki, Codex, GPT, hoặc bất kỳ Autonomous Agent nào làm việc trong thư mục `tt-plugins`.
> **Cập nhật:** 09/11/2026.
> ⚡ **Cẩm nang tăng tốc (Speedrun Playbook):** Xem file [FAST_TRACK_PLAYBOOK.md](./FAST_TRACK_PLAYBOOK.md) để xuất bản plugin mới chỉ trong 30 giây (Zero-GUI).

---

## 🌐 1. TRẠNG THÁI PRODUCTION HIỆN TẠI (ĐÃ TRIỂN KHAI HOÀN TẤT)

- 🏠 **Website chính thức:** [https://tt-plugins.pages.dev](https://tt-plugins.pages.dev)
- 🚀 **Cổng Upload trực tuyến:** [https://tt-plugins.pages.dev/portal/](https://tt-plugins.pages.dev/portal/)
- 📦 **GitHub Repository:** [https://github.com/tien02683/tt-plugins](https://github.com/tien02683/tt-plugins) (Branch: `main`)
- ☁️ **Cloudflare Pages:** Project `tt-plugins` đã liên kết trực tiếp với GitHub qua GitHub App.
- 🔄 **Cơ chế CI/CD tự động:** Mỗi commit push lên `main` sẽ tự động trigger Cloudflare Pages build và deploy trong ~45 giây.

---

## ⚡ 2. QUY TRÌNH XUẤT BẢN PLUGIN SIÊU TỐC CHO AGENT (KHÔNG DÙNG GUI TRÌNH DUYỆT)

> [!IMPORTANT]
> **Tuyệt đối không cần mở trình duyệt hay thao tác Cloudflare GUI nữa!**
> Mọi thao tác xuất bản plugin mới chỉ cần thực hiện hoàn toàn qua dòng lệnh theo 3 bước sau:

### Bước 1: Tạo sản phẩm bằng CLI
```bash
node scripts/agent-publish.mjs \
  --title "TT My Tool" \
  --slug "tt-my-tool" \
  --category "Modeling" \
  --version "1.0.0" \
  --summary "Mô tả ngắn của plugin" \
  --price "free" \
  --rbz "path/to/plugin.rbz" \
  --cover "path/to/cover.png"
```

### Bước 2: Đồng bộ mã nguồn từ ổ `X:` sang ổ vật lý `D:\tt-plugins`
*(Tránh lỗi file-lock WebDAV của RaiDrive trên ổ X:)*
```powershell
robocopy "X:\TT-Plugins-Website-Starter\tt-plugins" "D:\tt-plugins" /E /XD .git node_modules /XF .git* /NDL /NFL /NJH /NJS
```

### Bước 3: Đẩy commit lên GitHub
```powershell
git -C D:\tt-plugins add .
git -C D:\tt-plugins commit -m "Publish plugin tt-my-tool v1.0.0"
git -C D:\tt-plugins push origin main
```
Cloudflare Pages sẽ tự động kích hoạt build `npm run build` và cập nhật live website trong vòng 45 giây.

---

## 3. CÁC CỔNG UPLOAD HỖ TRỢ KHÁC

1. **Cổng Web trực quan:** [https://tt-plugins.pages.dev/portal/](https://tt-plugins.pages.dev/portal/) (kéo thả file `.rbz`, live preview YouTube/ảnh, tự sinh slug và markdown).
2. **Local Upload Server (Port 4322):** `npm run upload-server` (nhận `POST /api/publish`).
3. **Decap CMS:** [https://tt-plugins.pages.dev/admin/](https://tt-plugins.pages.dev/admin/) (hỗ trợ offline qua `local_backend: true`).

---

## 4. BÀI HỌC KINH NGHIỆM KHI DÙNG AGENT-DESKTOP TRÊN WINDOWS

Nếu trong tương lai bắt buộc phải điều khiển Chrome qua `agent-desktop`:
- **Quản lý cửa sổ:** Dùng `agent-desktop restore --app chrome` (không dùng focus-window).
- **Tránh lỗi UIA hidden state unknown:** Đối với radio button trong web, không click trực tiếp ref. Hãy gán giá trị vào ô search trước (`set-value`), sau đó `agent-desktop press tab` rồi `press space`.
- **Tránh lỗi offscreen:** Cuộn trang trước khi click (`agent-desktop press pagedown`), hoặc lấy tọa độ `get <REF> --property bounds` rồi dùng `mouse-click --xy X,Y --headed`.
- **Dọn dẹp:** Sau khi xong việc luôn chạy `agent-desktop session end <id>` và `session gc --ended`.
