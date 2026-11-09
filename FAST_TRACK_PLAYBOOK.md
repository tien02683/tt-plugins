# ⚡ FAST-TRACK PLAYBOOK: CẨM NANG TỐC ĐỘ DÀNH CHO AI AGENT

> **Dành cho:** Bất kỳ AI Agent nào (Antigravity, Claude, GPT, Codex...) nhận nhiệm vụ cập nhật hoặc xuất bản plugin lên hệ thống TT Plugins.  
> **Thời gian thực hiện chuẩn:** **Dưới 30 giây** (thay vì mất 10-15 phút thao tác GUI thủ công).

---

## 🎯 1. THÔNG TIN PRODUCTION ĐÃ TRIỂN KHAI

Hệ thống đã được thiết lập hoàn chỉnh, hoạt động 100% miễn phí và tự động:
- 🌐 **Live Website:** [https://tt-plugins.pages.dev](https://tt-plugins.pages.dev)
- 🚀 **Cổng Upload Portal (Đã cài Admin Gate):** [https://tt-plugins.pages.dev/portal/](https://tt-plugins.pages.dev/portal/)
- 📦 **GitHub Repository:** [https://github.com/tien02683/tt-plugins](https://github.com/tien02683/tt-plugins) (Branch: `main`)
- ☁️ **Cloudflare Pages:** Project `tt-plugins` đã liên kết trực tiếp với GitHub qua GitHub App.
- 💬 **Nhóm Zalo hỗ trợ:** [https://zalo.me/g/nnukch714](https://zalo.me/g/nnukch714)
- 📺 **Kênh YouTube:** [https://www.youtube.com/@minhtien4163](https://www.youtube.com/@minhtien4163)
- 📞 **Hotline Admin:** `0365 100 994`

---

## 🛡️ 2. CHÍNH SÁCH BẢO VỆ GIAO DIỆN & PHÂN QUYỀN ADMIN

- **Khách công khai (Public):**
  - Header: Chỉ hiện `Plugins`, `Giới thiệu`, `Hỗ trợ` + Nút `Nhóm Zalo ↗`.
  - Footer: Chỉ hiện `Tất cả plugin`, `Về TT Plugins` + Kênh hỗ trợ. Ẩn hoàn toàn `Cổng Upload` và `CMS Quản trị`.
  - `/portal`: Màn hình Đăng Nhập Quản Trị Viên (Admin Gate) khóa toàn bộ form.
- **Admin đăng nhập:**
  - Nhập một trong các mật khẩu: `admin@ttplugins2026`, `ttplugins@2026`, hoặc hotline `0365100994`.
  - Mở khóa form upload, Decap CMS, markdown generator, và hiển thị menu quản trị trên Header/Footer.

---

## 🚫 3. TẠI SAO LẦN ĐẦU BỊ CHẬM? (BÀI HỌC KINH NGHIỆM)

Lần đầu triển khai mất nhiều thời gian do 2 nguyên nhân cốt lõi:

1. **Rào cản ổ đĩa mạng ảo RaiDrive (`X:`):**
   - `X:` là mount WebDAV/Google Drive. Các lệnh Git (`git init`, `git add`, `git commit`) bị lock file (`HEAD.lock`, `index.lock`) và treo tiến trình vĩnh viễn.
   - **Giải pháp:** Không chạy Git trực tiếp trên `X:`. Mọi thao tác Git phải thực thi trên thư mục vật lý cục bộ **`D:\tt-plugins`**, sau đó đồng bộ qua lại.

2. **Rào cản Accessibility Tree của Chromium khi điều khiển Desktop GUI:**
   - Các thẻ `<input type="radio">` trên giao diện Cloudflare không trả về trạng thái `IsHidden` chuẩn cho UI Automation, gây lỗi `visible: live hidden state unavailable, status: unknown` khi gọi lệnh `agent-desktop click` / `check`.
   - Các nút dưới đáy như `Save and Deploy` bị `offscreen` nếu không cuộn trang.
   - Phải mất nhiều bước xử lý focus và tọa độ chuột vật lý.

---

## ⚡ 4. QUY TRÌNH SIÊU TỐC: XUẤT BẢN PLUGIN TRONG 3 BƯỚC (ZERO-GUI)

> **QUY TẮC SỐ 1:** **KHÔNG BAO GIỜ** cần mở trình duyệt hay điều khiển giao diện Cloudflare Dashboard nữa!  
> Vì Cloudflare Pages đã kết nối Git Webhook: **Mỗi commit lên `main` sẽ tự động kích hoạt Cloudflare build và deploy toàn cầu trong 45 giây.**

### Bước 1: Xuất bản Plugin mới bằng CLI (Chỉ 1 lệnh)
Mở terminal và chạy lệnh xuất bản (hỗ trợ cả đường dẫn tương đối hoặc tuyệt đối):
```bash
node scripts/agent-publish.mjs \
  --title "TT Tool Name" \
  --slug "tt-tool-name" \
  --category "Modeling" \
  --version "1.0.0" \
  --summary "Mô tả tính năng plugin trong 1 câu ngắn gọn." \
  --price "free" \
  --rbz "D:\builds\TT_Tool_v1.0.0.rbz" \
  --cover "D:\assets\cover.png" \
  --body "## Giới thiệu tính năng\n\n1. Chi tiết tính năng 1\n2. Chi tiết tính năng 2"
```

### Bước 2: Đồng bộ mã nguồn sang ổ vật lý `D:\tt-plugins`
```powershell
robocopy "X:\TT-Plugins-Website-Starter\tt-plugins" "D:\tt-plugins" /E /XD .git node_modules /XF .git* /NDL /NFL /NJH /NJS
```

### Bước 3: Đẩy commit lên GitHub (Cloudflare tự động Deploy)
```powershell
git -C D:\tt-plugins add .
git -C D:\tt-plugins commit -m "Publish plugin tt-tool-name v1.0.0"
git -C D:\tt-plugins push origin main
```

**Xong!** Website tại `https://tt-plugins.pages.dev` sẽ tự động cập nhật sản phẩm mới ngay lập tức.

---

## 🛠️ 5. SPEEDRUN TIPS CHO AGENT DESKTOP (KHI BẮT BUỘC THAO TÁC TRÌNH DUYỆT)

Nếu gặp tình huống bắt buộc phải điều khiển giao diện web bằng `agent-desktop`:

1. **Khôi phục cửa sổ bị thu nhỏ:**
   ```powershell
   agent-desktop restore --app chrome
   ```
   *(Tuyệt đối không gọi `focus-window` bằng phản xạ vì sẽ cướp tiêu điểm của người dùng).*

2. **Cách chọn Radio Button mà không bị lỗi `status: unknown`:**
   - Không click trực tiếp vào ref của radio button.
   - Hãy nhập text vào ô Search trước đó:
     ```powershell
     agent-desktop set-value '@<search_ref>' "tt-plugins"
     ```
   - Sau đó nhấn phím để di chuyển tiêu điểm và chọn:
     ```powershell
     agent-desktop focus-window --app chrome
     agent-desktop press tab
     agent-desktop press space
     ```

3. **Cách nhấn nút bị khuất bên dưới màn hình (`offscreen`):**
   - Cuộn trang xuống trước:
     ```powershell
     agent-desktop press pagedown
     ```
   - Lấy tọa độ thực tế và click chuột:
     ```powershell
     $btn = agent-desktop get '@<button_ref>' --property bounds | ConvertFrom-Json
     agent-desktop mouse-click --xy "$($btn.data.x + 20),$($btn.data.y + 10)" --headed
     ```
