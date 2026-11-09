# HƯỚNG DẪN DÀNH CHO CÁC AI AGENT: HỆ THỐNG WEBSITE TT PLUGINS & CỔNG UPLOAD

> **Dành cho:** Antigravity, Claude Code, Maki, Codex, GPT, hoặc bất kỳ Autonomous Agent nào làm việc trong thư mục `tt-plugins`.
> **Tài liệu gốc tại:** `../AGENTS.md`. Xem tài liệu này để biết cách dùng 4 Cổng Upload (`/portal`, `scripts/upload-server.mjs`, `scripts/agent-publish.mjs`, `/admin`).

---

## TÓM TẮT LỆNH NHANH CHO AGENT

### 1. Xuất bản 1 Plugin mới bằng CLI:
```bash
node scripts/agent-publish.mjs \
  --title "TT My Tool" \
  --slug "tt-my-tool" \
  --category "Modeling" \
  --version "1.0.0" \
  --summary "Mô tả ngắn của plugin" \
  --price "free" \
  --rbz "path/to/plugin.rbz"
```

### 2. Khởi chạy Cổng Upload Server Cục Bộ (Port 4322):
```bash
npm run upload-server
# Nhận API POST tại http://localhost:4322/api/publish
```

### 3. Xem trước Giao diện Cổng Upload Web:
Truy cập `http://localhost:4321/portal` khi chạy `npm run dev`.

### 4. Vị trí lưu trữ dữ liệu chuẩn:
- **Nội dung sản phẩm Markdown:** `src/content/plugins/<slug>.md`
- **Ảnh đại diện & Gallery:** `public/images/<slug>/`
- **File cài đặt SketchUp:** `public/uploads/<file>.rbz` hoặc link GitHub Releases.
