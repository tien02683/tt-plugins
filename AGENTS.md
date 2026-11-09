# HƯỚNG DẪN DÀNH CHO CÁC AI AGENT: HỆ THỐNG WEBSITE TT PLUGINS & CỔNG UPLOAD

> **Dành cho:** Antigravity, Claude Code, Maki, Codex, GPT, hoặc bất kỳ Autonomous Agent nào làm việc trong thư mục `tt-plugins`.  
> **Cập nhật:** 09/11/2026.  
> ⚡ **Cẩm nang tăng tốc (Speedrun Playbook):** Xem file [FAST_TRACK_PLAYBOOK.md](./FAST_TRACK_PLAYBOOK.md) để xuất bản plugin mới chỉ trong 30 giây (Zero-GUI).

---

## 🌐 1. THÔNG TIN PRODUCTION HIỆN TẠI (ĐÃ TRIỂN KHAI HOÀN TẤT)

- 🏠 **Website chính thức:** [https://tt-plugins.pages.dev](https://tt-plugins.pages.dev)
- 🚀 **Cổng Upload trực tuyến (Được bảo vệ bởi Admin Gate):** [https://tt-plugins.pages.dev/portal/](https://tt-plugins.pages.dev/portal/)
- 📦 **GitHub Repository:** [https://github.com/tien02683/tt-plugins](https://github.com/tien02683/tt-plugins) (Branch: `main`)
- ☁️ **Cloudflare Pages:** Project `tt-plugins` đã liên kết trực tiếp với GitHub qua GitHub App.
- 🔄 **Cơ chế CI/CD tự động:** Mỗi commit push lên `main` sẽ tự động trigger Cloudflare Pages build và deploy trong ~45 giây.

### 📞 Kênh Thông Tin & Hỗ Trợ Chính Thức
- **Nhóm Zalo hỗ trợ:** [https://zalo.me/g/nnukch714](https://zalo.me/g/nnukch714)
- **Kênh YouTube:** [https://www.youtube.com/@minhtien4163](https://www.youtube.com/@minhtien4163)
- **Hotline / SĐT Admin:** `0365 100 994`

---

## 🛡️ 2. QUY CHUẨN PHÂN QUYỀN: KHÁCH CÔNG KHAI (PUBLIC) VS QUẢN TRỊ VIÊN (ADMIN)

Theo yêu cầu nghiệp vụ, hệ thống phân tách nghiêm ngặt giữa giao diện người dùng công khai và giao diện quản trị:

### A. Đối với Khách thông thường (Public Visitors):
1. **Header:**
   - Điều hướng chỉ gồm: `Plugins`, `Giới thiệu`, `Hỗ trợ`.
   - **Tuyệt đối ẩn:** `Cổng Upload` và `CMS Admin`.
   - Nút kêu gọi hành động (CTA) góc phải: **`Nhóm Zalo ↗`** dẫn tới `https://zalo.me/g/nnukch714`.
2. **Footer:**
   - Cột Khám phá chỉ hiển thị: `Tất cả plugin`, `Về TT Plugins`.
   - **Tuyệt đối ẩn:** `Cổng Upload` và `CMS Quản trị`.
   - Chân trang có liên kết kín đáo: `🔒 Quản trị` ở dòng bản quyền.
3. **Trang `/portal`:**
   - Khách truy cập vào link `/portal` sẽ gặp **Màn hình Xác thực Quản trị viên (Admin Gate)** yêu cầu nhập mật khẩu. Khách không thể xem hoặc sử dụng form upload.

### B. Đối với Quản trị viên (Admin Mode):
1. **Mật khẩu quản trị hợp lệ (Admin Passwords):**
   - `admin@ttplugins2026`
   - `ttplugins@2026`
   - Hotline: `0365100994`
2. **Cơ chế lưu phiên:**
   - Khi đăng nhập thành công, phiên được lưu trong `localStorage.getItem('tt_admin_logged_in') === 'true'`.
   - Cả Header và Footer trên toàn bộ website tự động bật menu:
     - Header: Thêm link `Cổng Upload`, `CMS Admin`, nút `Cổng Upload ↗` và nút `Thoát` (Logout).
     - Footer: Thêm link `🛡️ Cổng Upload` và `CMS Quản trị ↗`.
     - Trang `/portal`: Mở khóa toàn bộ Form Upload RBZ, xem trước hình ảnh, tạo Markdown và thanh thông báo Admin.
   - Nút `Đăng xuất` trên Header/Footer/Portal sẽ xóa `localStorage` và khóa cổng ngay lập tức.

---

## ⚡ 3. QUY TRÌNH XUẤT BẢN PLUGIN SIÊU TỐC CHO AGENT (KHÔNG DÙNG GUI TRÌNH DUYỆT)

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

### Bước 2: Đồng bộ mã nguồn sang ổ vật lý `D:\tt-plugins`
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

## 4. CÁC CỔNG UPLOAD HỖ TRỢ KHÁC

1. **Cổng Web trực quan:** [https://tt-plugins.pages.dev/portal/](https://tt-plugins.pages.dev/portal/) (yêu cầu mật khẩu Admin, hỗ trợ kéo thả `.rbz`, live preview YouTube/ảnh, tự sinh slug và markdown).
2. **Local Upload Server (Port 4322):** `npm run upload-server` (nhận `POST /api/publish` từ form trực tiếp vào mã nguồn).
3. **Decap CMS:** [https://tt-plugins.pages.dev/admin/](https://tt-plugins.pages.dev/admin/) (hỗ trợ offline qua `local_backend: true`).

---

## 5. BÀI HỌC KINH NGHIỆM KHI DÙNG AGENT-DESKTOP TRÊN WINDOWS

Nếu trong tương lai bắt buộc phải điều khiển Chrome qua `agent-desktop`:
- **Quản lý cửa sổ:** Dùng `agent-desktop restore --app chrome` (không dùng focus-window).
- **Tránh lỗi UIA hidden state unknown:** Đối với radio button trong web, không click trực tiếp ref. Hãy gán giá trị vào ô search trước (`set-value`), sau đó `agent-desktop press tab` rồi `press space`.
- **Tránh lỗi offscreen:** Cuộn trang trước khi click (`agent-desktop press pagedown`), hoặc lấy tọa độ `get <REF> --property bounds` rồi dùng `mouse-click --xy X,Y --headed`.
- **Dọn dẹp:** Sau khi xong việc luôn chạy `agent-desktop session end <id>` và `session gc --ended`.
