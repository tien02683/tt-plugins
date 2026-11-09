---
title: "TT PDF to SU 3.0 (Chuyển Đổi PDF Vector Sang SketchUp CAD)"
slug: "tt-pdf-importer"
category: "CAD"
summary: "Nhập trực tiếp bản vẽ kỹ thuật định dạng PDF sang đối tượng hình học CAD vector trong SketchUp: Giữ nguyên nét vẽ sắc nét, đường cong Bezier, nhận diện text Tiếng Việt, tự động hiệu chuẩn tỉ lệ và xuất hàng loạt Scene."
version: "3.0.0"
compatibility:
  - "SketchUp 2021"
  - "SketchUp 2022"
  - "SketchUp 2023"
  - "SketchUp 2024"
  - "SketchUp 2026"
  - "SketchUp 2027"
price_type: "paid"
price_label: "Bản Pro · Dùng thử 15 ngày"
featured_image: "/images/tt-pdf-importer/slide_01_intro.png"
gallery:
  - "/images/tt-pdf-importer/slide_01_intro.png"
  - "/images/tt-pdf-importer/slide_02_vector_curves.png"
  - "/images/tt-pdf-importer/slide_03_scale_layers.png"
  - "/images/tt-pdf-importer/slide_04_vietnamese_text.png"
  - "/images/tt-pdf-importer/slide_05_cad_options.png"
  - "/images/tt-pdf-importer/slide_06_batch_export.png"
download_url: ""
video_url: ""
video_title: "Hướng dẫn chuyển đổi bản vẽ PDF kỹ thuật sang 3D SketchUp với TT PDF to SU"
plugin_file: ""
release_url: ""
published: true
featured: true
updated_at: 2026-11-09
tags:
  - PDF to CAD
  - PDF to SketchUp
  - Vector Importer
  - Nhập bản vẽ PDF
  - Hershey Text
  - TCVN3 Unicode
  - Flatten Z
  - Export Scene 8K
  - Ruby 3.4 & Pure C++
---

## Giới thiệu TT PDF to SU 3.0 (PDF Vector Importer)

Trong thực tế công việc thiết kế kiến trúc, quy hoạch và kết cấu, rất nhiều hồ sơ bản vẽ chỉ được bàn giao dưới định dạng file **PDF**. Trước đây, kiến trúc sư buộc phải chèn ảnh PDF mờ vỡ hạt vào SketchUp để can lại từng nét thủ công rất tốn thời gian, hoặc chuyển qua các phần mềm trung gian khiến đường nét bị gãy khúc và lỗi font chữ.

**TT PDF to SU 3.0** là giải pháp đột phá giúp bạn **trích xuất trực tiếp toàn bộ dữ liệu vector hình học nhị phân** từ file PDF vào SketchUp. Từng đường bao tường, tim trục, cửa sổ, thiết bị công nghiệp và nhãn văn bản tiếng Việt đều được tái tạo chuẩn xác $100\%$ dưới dạng nét CAD và mặt phẳng 3D sắc nét.

---

## 6 Điểm Nổi Bật Vượt Trội Của TT PDF to SU 3.0

1. **Bóc Tách Vector Thuần Túy 100% (Không Vỡ Hạt Raster):**  
   Đọc trực tiếp cây toán tử đồ họa PDF (`moveto`, `lineto`, `curveto`, `closepath`). Khử sạch toàn bộ nét rác ngoài khung và nội suy mượt mà đường cong Bezier cubic 3 điểm thành đa giác CAD chính xác đến $0.001\text{ mm}$.

2. **Giao Diện Xem Trước Trực Quan & Chọn Từng Trang:**  
   Hộp thoại xem trước hiện đại cho phép xem toàn bộ các trang PDF, phóng to thu nhỏ kiểm tra chi tiết, chọn trang cần nhập hoặc nhập toàn bộ tập hồ sơ với khoảng cách dàn trang $100\text{ mm}$ tự động.

3. **Tự Động Cân Chỉnh Tỉ Lệ Bản Vẽ & Khổ Giấy (Auto Scale):**  
   Nhận diện chuẩn xác các khổ giấy tiêu chuẩn **A0, A1, A2, A3, A4** và hỗ trợ mọi tỉ lệ bản vẽ kiến trúc thông dụng: **1:20, 1:50, 1:100, 1:200**, tự động chuyển đổi sang đơn vị milimet chuẩn trong SketchUp.

4. **Bảo Toàn Văn Bản & Bảng Mã Tiếng Việt (Hershey Vector Text):**  
   Tự động nhận diện và bóc tách ma trận vị trí (`Tm`), font chữ và chuỗi ký tự. Hỗ trợ giải mã bảng mã tiếng Việt **TCVN3 (.VNTime), VNI, Unicode** sang nét vẽ Vector hoặc khối 3D Text mà không bao giờ bị lỗi phông hay mất dấu.

5. **Bộ Giải Mã AutoCAD DWG/DXF Tích Hợp Chuyên Sâu:**  
   Bổ trợ tính năng nhập bản vẽ AutoCAD độc lập: Tự động chiếu phẳng độ cao (**True Flatten Z** về mặt $Z=0$), hàn liền mặt đồng phẳng (**Coplanar Face Merge**) và phân tách thư mục Tag Folder khoa học.

6. **Batch Export SU — Xuất Toàn Bộ Scene Hàng Loạt Siêu Tốc:**  
   Công cụ xuất hàng loạt tích hợp sẵn: Chỉ 1 cú click để render toàn bộ các Scene trong file mô hình sang ảnh siêu nét **2K, 4K, 8K UHD**, file in ấn **A3/A1 300 DPI** hoặc vector CAD DWG 2D đồng bộ.

---

## Hướng Dẫn Cài Đặt & Sử Dụng

### 1. Cài đặt file .RBZ trên SketchUp
- Mở SketchUp (tương thích từ bản **2021 đến 2027 Pro**).
- Vào menu **Extensions** > **Extension Manager** (Trình Quản Lý Tiện Ích Mở Rộng).
- Nhấp chọn **Install Extension**, trỏ đến file `pdf_vector_importer.rbz` để hoàn tất cài đặt.

### 2. Các bước nhập bản vẽ PDF vào không gian 3D
- Bước 1: Nhấp vào biểu tượng **Import PDF Vector...** trên thanh công cụ `PDF to SU Tools` hoặc menu `Plugins > PDF to SU`.
- Bước 2: Chọn tỉ lệ bản vẽ (ví dụ: *1:100* cho mặt bằng kiến trúc) và khổ giấy gốc.
- Bước 3: Bấm **Chọn file PDF**, hộp thoại xem trước sẽ hiển thị bản vẽ sắc nét.
- Bước 4: Bấm **Nhập file**, toàn bộ đối tượng vector và text sẽ được sinh ra chuẩn xác trong SketchUp chỉ sau vài giây.
