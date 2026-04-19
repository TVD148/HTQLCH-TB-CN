-- ============================================================
-- UPDATE SPECS & DESCRIPTIONS - Thong so ky thuat & Mo ta chi tiet
-- Database: htqlch_thietbi_cn
-- ============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
USE htqlch_thietbi_cn;

-- Xoa thong so cu neu co
TRUNCATE TABLE thong_so_ky_thuat;

-- ============================================================
-- CAP NHAT MO TA CHI TIET (mo_ta) CHO TUNG SAN PHAM
-- ============================================================

-- 1. ASUS ROG Strix G16
UPDATE san_pham SET mo_ta = N'<h2>ASUS ROG Strix G16 Gaming Laptop 2024 – Chiến Binh Không Khoan Nhượng</h2>
<p>ASUS ROG Strix G16 2024 là laptop gaming đỉnh cao được trang bị bộ vi xử lý Intel Core i9-14900HX thế hệ mới nhất với 24 nhân, 32 luồng, xung nhịp boost lên đến 5.8GHz – đảm bảo hiệu năng vượt trội trong mọi tình huống gaming và sáng tạo nội dung.</p>
<p>Card đồ họa NVIDIA GeForce RTX 4080 12GB với kiến trúc Ada Lovelace mang đến trải nghiệm chơi game 4K mượt mà, hỗ trợ DLSS 3.0 Frame Generation giúp tăng FPS gấp đôi mà không ảnh hưởng chất lượng hình ảnh. Màn hình QHD+ 240Hz với panel IPS-level cho màu sắc rực rỡ, độ phản hồi 3ms đảm bảo không bỏ lỡ bất kỳ khung hình nào.</p>
<p>Hệ thống tản nhiệt ROG Tri-Fan Technology với 3 quạt và 4 heatpipe đồng giữ nhiệt độ tối ưu ngay cả khi gaming kéo dài. ROG Armoury Crate cho phép tùy chỉnh hiệu năng, đèn RGB Aura Sync theo ý muốn.</p>
<ul>
  <li>✅ Hiệu năng gaming hàng đầu phân khúc với RTX 4080</li>
  <li>✅ Màn hình 240Hz QHD+ không xé hình với G-Sync</li>
  <li>✅ RAM DDR5 32GB băng thông cực cao</li>
  <li>✅ SSD NVMe 1TB tốc độ đọc 7.000 MB/s</li>
  <li>✅ Bàn phím per-key RGB với hành trình phím 1.8mm thoải mái</li>
</ul>' WHERE duong_dan = 'asus-rog-strix-g16-2024';

-- 2. MSI Titan GT77
UPDATE san_pham SET mo_ta = N'<h2>MSI Titan GT77 – Quái Vật Gaming 17.3" Màn Hình 4K</h2>
<p>MSI Titan GT77 là laptop gaming flagship không được trang bị giới hạn: CPU Intel Core i9-13980HX 24-nhân kết hợp GPU NVIDIA GeForce RTX 4090 16GB GDDR6X – cấu hình mạnh nhất từng có trên laptop. Đây là cỗ máy dành cho game thủ chuyên nghiệp và người làm nội dung đòi hiệu năng tuyệt đối.</p>
<p>Màn hình 17.3" 4K IPS 120Hz với độ bao phủ màu DCI-P3 100% cho trải nghiệm hình ảnh điện ảnh ngay trên laptop. RAM 64GB DDR5 dual-channel cho phép đa nhiệm không giới hạn – chạy cùng lúc game nặng, stream và ghi hình.</p>
<p>MSI Center Pro quản lý hiệu năng thông minh, hệ thống tản nhiệt Cooler Boost Titan với 2 quạt và 8 heatpipe đồng kiểm soát nhiệt độ hiệu quả. Bàn phím cơ Cherry MX Ultra Low Profile cho cảm giác gõ phím thực thụ.</p>
<ul>
  <li>✅ RTX 4090 16GB – GPU laptop mạnh nhất thế giới</li>
  <li>✅ Màn hình 4K 120Hz DCI-P3 100% chuẩn điện ảnh</li>
  <li>✅ 64GB DDR5 – đa nhiệm không giới hạn</li>
  <li>✅ Bàn phím cơ Cherry MX tích hợp sẵn</li>
  <li>✅ Thunderbolt 4, HDMI 2.1, Mini DisplayPort 1.4</li>
</ul>' WHERE duong_dan = 'msi-titan-gt77-gaming';

-- 3. Dell XPS 15 9530
UPDATE san_pham SET mo_ta = N'<h2>Dell XPS 15 9530 – Đỉnh Cao Thiết Kế & Hiệu Năng Sáng Tạo</h2>
<p>Dell XPS 15 9530 là laptop cao cấp hoàn hảo cho nhà thiết kế, nhiếp ảnh gia và những ai cần sức mạnh xử lý lẫn màn hình chất lượng studio. Thiết kế nhôm nguyên khối mỏng 18mm với trọng lượng chỉ 1.86kg – mỏng nhẹ vượt trội so với những laptop cùng cấu hình.</p>
<p>Điểm nhấn là màn hình OLED 15.6" 3.5K (3456×2160) 120Hz với delta E <1.5, độ bao phủ DCI-P3 100%, độ sáng 400 nits HDR400 – mọi chi tiết màu sắc hiện lên chuẩn xác đến từng pixel, lý tưởng cho công việc chỉnh màu. CPU Intel Core i7-13700H 14-nhân kết hợp RTX 4060 8GB xử lý mượt mà Premiere Pro, DaVinci Resolve, Adobe After Effects.</p>
<ul>
  <li>✅ Màn hình OLED 3.5K sRGB 100% chuẩn in ấn & thiết kế</li>
  <li>✅ Thiết kế nhôm cao cấp, mỏng nhẹ đẳng cấp</li>
  <li>✅ Thunderbolt 4 x2, USB-A, SD Full-size, HDMI 2.0</li>
  <li>✅ Webcam IR 720p nhận diện khuôn mặt Windows Hello</li>
  <li>✅ Loa stereo 6W Waves MaxxAudio Pro</li>
</ul>' WHERE duong_dan = 'dell-xps-15-9530';

-- 4. HP Envy 16 2024
UPDATE san_pham SET mo_ta = N'<h2>HP Envy 16 2024 – Sức Mạnh Sáng Tạo Trong Thiết Kế Thanh Lịch</h2>
<p>HP Envy 16 2024 là sự kết hợp hoàn hảo giữa hiệu năng mạnh mẽ và thiết kế sang trọng, hướng đến những người dùng chuyên nghiệp, content creator và nhà thiết kế. Bề mặt nhôm tự nhiên với màu Lunar Silver toát lên vẻ đẹp hiện đại.</p>
<p>Màn hình OLED 16" 2.5K (2560×1600) 120Hz với tỷ lệ 16:10 cho không gian làm việc rộng rãi hơn, màu sắc sống động với Delta E < 2 và HDR500 True Black. CPU Intel Core i7-13700H kết hợp NVIDIA RTX 4060 8GB đảm bảo xuất video 4K, render 3D nhanh chóng.</p>
<p>Pin 83Wh hỗ trợ sạc nhanh 140W qua USB-C, đủ năng lượng cho cả ngày làm việc. Webcam 5MP AI tự động điều chỉnh ánh sáng, khử nhiễu âm thanh cho cuộc họp chuyên nghiệp.</p>
<ul>
  <li>✅ Màn hình OLED 2.5K 120Hz 16:10 không viền</li>
  <li>✅ Bàn phím backlit với fingerprint reader tích hợp</li>
  <li>✅ Thunderbolt 4, USB-A, HDMI 2.1, MicroSD</li>
  <li>✅ Sạc nhanh 140W – đầy 50% chỉ trong 30 phút</li>
  <li>✅ HP AI Assistant và HP Sure View chống nhìn trộm</li>
</ul>' WHERE duong_dan = 'hp-envy-16-2024';

-- 5. Lenovo ThinkPad X1 Carbon Gen 11
UPDATE san_pham SET mo_ta = N'<h2>Lenovo ThinkPad X1 Carbon Gen 11 – Huyền Thoại Doanh Nhân</h2>
<p>ThinkPad X1 Carbon Gen 11 tiếp tục truyền thống 30 năm của dòng ThinkPad – laptop doanh nhân đáng tin cậy nhất thế giới. Nặng chỉ 1.12kg với độ mỏng 14.9mm, đây là laptop 14" nhẹ nhất trong phân khúc hiệu năng cao. Vỏ carbon fiber độc quyền vừa siêu nhẹ vừa đạt chuẩn quân sự MIL-STD-810H.</p>
<p>CPU Intel Core i7-1365U vEvo Platform cân bằng hoàn hảo hiệu năng và điện năng, RAM LPDDR5 32GB hàn liền tốc độ 6400MHz. Màn hình IPS 2.8K 90Hz Anti-glare cho khả năng hiển thị rõ nét trong mọi điều kiện ánh sáng. Pin 57Wh cho 15 giờ sử dụng thực tế.</p>
<ul>
  <li>✅ Chuẩn quân sự MIL-STD-810H – 12 bài kiểm tra độ bền</li>
  <li>✅ Bàn phím ThinkPad huyền thoại – thoải mái gõ cả ngày</li>
  <li>✅ TrackPoint đỏ biểu tượng cho điều hướng chính xác</li>
  <li>✅ 4G LTE/5G tùy chọn – kết nối mọi lúc mọi nơi</li>
  <li>✅ Thunderbolt 4 x2, USB-A x2, HDMI 2.0, MicroSD</li>
</ul>' WHERE duong_dan = 'lenovo-thinkpad-x1-carbon-gen11';

-- 6. Apple MacBook Pro 16 M3 Max
UPDATE san_pham SET mo_ta = N'<h2>Apple MacBook Pro 16" M3 Max – Đỉnh Cao Công Nghệ Apple Silicon</h2>
<p>MacBook Pro 16" M3 Max là laptop mạnh nhất Apple từng sản xuất, được trang bị chip M3 Max với 16-core CPU và 40-core GPU trên tiến trình 3nm – hiệu năng bứt phá mọi đối thủ trong khi tiêu thụ điện cực thấp. RAM Unified Memory 36GB tốc độ 400GB/s giúp xử lý tác vụ sáng tạo nội dung nặng như render video 8K, mô phỏng 3D phức tạp chỉ trong vài phút.</p>
<p>Màn hình Liquid Retina XDR 16.2" với độ phân giải 3456×2160 (254ppi), ProMotion 120Hz, độ sáng cực đại 1600 nits HDR – hiển thị HDR chuyên nghiệp chuẩn P3 với True Tone. Pin 100Wh cho 22 giờ phát video – dài nhất trong lịch sử MacBook.</p>
<ul>
  <li>✅ Chip M3 Max 3nm – hiệu năng CPU nhanh hơn 40% so với M1 Max</li>
  <li>✅ 40-core GPU – render Blender/Cinema 4D ngang card rời cao cấp</li>
  <li>✅ Màn hình XDR 1600 nits – chuẩn chỉnh màu HDR chuyên nghiệp</li>
  <li>✅ 3x Thunderbolt 4, HDMI 2.1, SD UHS-II, MagSafe 3</li>
  <li>✅ macOS Sonoma – tối ưu workflows cho Final Cut, Logic Pro</li>
</ul>' WHERE duong_dan = 'apple-macbook-pro-16-m3-max';

-- 7. Samsung Odyssey G7 32"
UPDATE san_pham SET mo_ta = N'<h2>Samsung Odyssey G7 32" – Màn Hình Gaming Cong Đỉnh Cao</h2>
<p>Samsung Odyssey G7 32" là màn hình gaming 4K curved đỉnh cao với công nghệ QLED Quantum Dot mang đến 125% sRGB và 95% DCI-P3, màu sắc sống động và sâu sắc hơn màn hình IPS thông thường. Độ cong 1000R – bán kính cong bằng tầm nhìn tự nhiên của mắt người – tạo cảm giác đắm chìm trong game.</p>
<p>Panel VA 32" 4K 144Hz với HDR600 (600 nits peak brightness) cho trải nghiệm hình ảnh điện ảnh. Thời gian phản hồi 1ms MPRT cùng G-Sync Compatible và FreeSync Premium Pro loại bỏ hoàn toàn hiện tượng xé hình. USB Hub tích hợp tiện lợi kết nối thiết bị ngoại vi.</p>
<ul>
  <li>✅ QLED 4K 144Hz – màu sắc sống động vượt trội</li>
  <li>✅ Độ cong 1000R – thoải mái mắt khi gaming kéo dài</li>
  <li>✅ HDR600 thực chiều – đen sâu, trắng sáng</li>
  <li>✅ G-Sync Compatible + FreeSync Premium Pro</li>
  <li>✅ USB Hub 2.0 x2, DisplayPort 1.4, HDMI 2.1</li>
</ul>' WHERE duong_dan = 'samsung-odyssey-g7-32-curved';

-- 8. LG UltraWide 34"
UPDATE san_pham SET mo_ta = N'<h2>LG UltraWide 34" IPS – Không Gian Làm Việc Vô Tận</h2>
<p>LG UltraWide 34" mang đến tỷ lệ 21:9 và độ phân giải UWQHD 3440×1440 – tương đương ghép 2 màn hình 24" Full HD cạnh nhau mà không có viền chia cắt. Lý tưởng cho lập trình viên, nhà thiết kế và video editor cần không gian làm việc rộng rãi.</p>
<p>Panel IPS Nano Color với sRGB 99% và DCI-P3 98% tái hiện màu sắc chính xác cho công việc đồ họa sáng tạo. USB-C 96W cho phép vừa truyền tín hiệu, sạc laptop và kết nối USB Hub chỉ với 1 dây. Tần số quét 144Hz với Age FreeSync Premium mượt mà cho cả gaming lẫn làm việc.</p>
<ul>
  <li>✅ 34" 21:9 UWQHD – đa nhiệm tối ưu không cần 2 màn hình</li>
  <li>✅ IPS sRGB 99% – màu chuẩn cho thiết kế in ấn</li>
  <li>✅ USB-C 96W – 1 dây cho tất cả: ảnh, điện, USB</li>
  <li>✅ HDR10, Picture-by-Picture và Picture-in-Picture</li>
  <li>✅ Ergonomic stand: nghiêng, xoay, điều chỉnh chiều cao</li>
</ul>' WHERE duong_dan = 'lg-ultrawide-34-ips';

-- 9. Logitech MX Master 3S
UPDATE san_pham SET mo_ta = N'<h2>Logitech MX Master 3S – Chuột Flagship Cho Người Làm Chuyên Nghiệp</h2>
<p>Logitech MX Master 3S là chuột cao cấp nhất của Logitech, được thiết kế tối ưu cho hiệu suất làm việc hàng ngày. Nút bấm im lặng 90% – làm việc trong văn phòng hay coffee shop mà không làm phiền người xung quanh.</p>
<p>Cảm biến Darkfield 8000 DPI hoạt động trên mọi bề mặt kể cả kính. Bánh xe MagSpeed điện từ cho phép cuộn qua 1000 dòng chỉ trong 1 giây, chuyển đổi thông minh giữa cuộn nhấp và tự do. Kết nối đồng thời 3 thiết bị qua Bluetooth hoặc USB Logi Bolt, dễ dàng chuyển đổi bằng nút Easy-Switch. Pin sạc USB-C 70 ngày.</p>
<ul>
  <li>✅ Im lặng 90% – phù hợp môi trường văn phòng yên tĩnh</li>
  <li>✅ MagSpeed wheel – cuộn siêu nhanh 1000 dòng/giây</li>
  <li>✅ Kết nối 3 thiết bị, chuyển đổi tức thì</li>
  <li>✅ Ergonomic design – thoải mái khi dùng nhiều giờ</li>
  <li>✅ Tương thích Mac, Windows, Linux – cả Flow để copy qua thiết bị</li>
</ul>' WHERE duong_dan = 'logitech-mx-master-3s';

-- 10. Razer BlackWidow V4 Pro
UPDATE san_pham SET mo_ta = N'<h2>Razer BlackWidow V4 Pro – Bàn Phím Gaming Cơ Không Dây Đỉnh Cao</h2>
<p>Razer BlackWidow V4 Pro là bàn phím gaming cơ không dây cao cấp nhất của Razer, kết hợp switch cơ Razer Yellow V3 (clicky, tactile) với kết nối 2.4GHz Wireless HyperSpeed – độ trễ gần bằng 0, không khác gì có dây. Dành cho game thủ không chịu hi sinh hiệu năng để đổi lấy sự tiện lợi không dây.</p>
<p>Chroma RGB per-key đồng bộ với hơn 150 game qua Razer Synapse, tạo hiệu ứng ánh sáng đẹp mắt. Đế bàn phím nhôm anodized cứng cáp, đệm foam giảm tiếng ồn bàn phím. Multi-function roller và media keys tiện lợi điều khiển âm lượng mà không cần rời tay khỏi bàn phím.</p>
<ul>
  <li>✅ Switch Razer Yellow V3 Clicky – 80M lần nhấn bảo hành</li>
  <li>✅ 2.4GHz HyperSpeed Wireless – lag < 1ms như có dây</li>
  <li>✅ Per-key Chroma RGB 16.8 triệu màu</li>
  <li>✅ Đế nhôm cao cấp, foam giảm tiếng ồn bên trong</li>
  <li>✅ Pin 200 giờ (tắt RGB) / 36 giờ (bật RGB)</li>
</ul>' WHERE duong_dan = 'razer-blackwidow-v4-pro';

-- 11. Samsung 990 Pro SSD 2TB
UPDATE san_pham SET mo_ta = N'<h2>Samsung 990 Pro SSD 2TB NVMe – Tốc Độ Đọc Ghi Hàng Đầu Thế Giới</h2>
<p>Samsung 990 Pro là SSD NVMe PCIe 4.0 nhanh nhất của Samsung, với tốc độ đọc tuần tự 7.450 MB/s và ghi 6.900 MB/s – nhanh hơn 55% so với đời trước 980 Pro. Với dung lượng 2TB, đây là lựa chọn hoàn hảo để cài hệ điều hành, games nặng và kho lưu trữ nội dung sáng tạo.</p>
<p>Công nghệ Samsung V-NAND 3-bit MLC (TLC) thế hệ mới với controller Pascari tối ưu điện năng – chạy mát hơn, bền hơn, ít tốn điện hơn. TBW (Total Bytes Written) 1.200 TBW đảm bảo độ bền dài lâu. Dynamic Thermal Guard chống quá nhiệt, Samsung Magician Software quản lý sức khỏe SSD.</p>
<ul>
  <li>✅ PCIe 4.0 NVMe – tương thích PS5, PC thế hệ mới</li>
  <li>✅ 7.450/6.900 MB/s đọc/ghi – nhanh nhất phân khúc</li>
  <li>✅ 1.200 TBW – độ bền xuất sắc</li>
  <li>✅ Form factor M.2 2280 – lắp vừa mọi mainboard</li>
  <li>✅ Bảo hành Samsung 5 năm chính hãng</li>
</ul>' WHERE duong_dan = 'samsung-990-pro-ssd-2tb';

-- 12. Kingston Fury Beast DDR5 32GB
UPDATE san_pham SET mo_ta = N'<h2>Kingston Fury Beast DDR5 32GB – RAM Tốc Cao Cho Nền Tảng Thế Hệ Mới</h2>
<p>Kingston Fury Beast DDR5 Kit 32GB (2×16GB) là bộ RAM tốc độ cao được tối ưu cho nền tảng Intel 12/13/14th Gen và AMD Ryzen 7000 Series. Với tốc độ 6000MHz và hỗ trợ XMP 3.0 / EXPO, việc overclock lên tốc độ tối đa chỉ cần bật 1 switch trong BIOS.</p>
<p>DDR5 mang đến băng thông gấp đôi DDR4 với nguồn điện tích hợp trên module (on-die ECC) tăng độ ổn định. Heatspreader nhôm thấp (low-profile) tương thích với hầu hết tản nhiệt CPU lớn. Bộ kit 2×16GB chạy dual-channel tối đa hóa hiệu năng bộ nhớ trong game và ứng dụng đa nhân.</p>
<ul>
  <li>✅ DDR5 6000MHz – tốc độ lý tưởng cho Intel & AMD mới nhất</li>
  <li>✅ XMP 3.0 & EXPO – OC 1-click không cần chỉnh tay</li>
  <li>✅ Dual-channel 2×16GB – băng thông tối đa</li>
  <li>✅ On-die ECC – ổn định dữ liệu hơn DDR4</li>
  <li>✅ Bảo hành Kingston lifetime (vĩnh viễn)</li>
</ul>' WHERE duong_dan = 'kingston-fury-beast-ddr5-32gb';

-- ============================================================
-- THONG SO KY THUAT CHO TUNG SAN PHAM
-- ============================================================

-- 1. ASUS ROG Strix G16
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-g16-2024'), N'CPU', N'Intel Core i9-14900HX (24 nhân, 32 luồng, 2.2GHz – 5.8GHz)', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-g16-2024'), N'GPU', N'NVIDIA GeForce RTX 4080 12GB GDDR6X', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-g16-2024'), N'RAM', N'32GB DDR5 4800MHz (2 khe, tối đa 64GB)', 'GB', 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-g16-2024'), N'Ổ cứng', N'1TB NVMe PCIe 4.0 SSD (+ 1 khe M.2 trống)', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-g16-2024'), N'Màn hình', N'16" QHD+ (2560×1600) IPS 240Hz, 3ms, G-Sync', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-g16-2024'), N'Pin', N'90Wh, sạc 240W', 'Wh', 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-g16-2024'), N'Kết nối', N'Wi-Fi 6E, Bluetooth 5.3', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-g16-2024'), N'Cổng kết nối', N'Thunderbolt 4, USB-A x3, HDMI 2.1, RJ45, 3.5mm', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-g16-2024'), N'Trọng lượng', N'2.5', 'kg', 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-g16-2024'), N'Hệ điều hành', N'Windows 11 Home', NULL, 10);

-- 2. MSI Titan GT77
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='msi-titan-gt77-gaming'), N'CPU', N'Intel Core i9-13980HX (24 nhân, 32 luồng, tới 5.6GHz)', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='msi-titan-gt77-gaming'), N'GPU', N'NVIDIA GeForce RTX 4090 16GB GDDR6X', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='msi-titan-gt77-gaming'), N'RAM', N'64GB DDR5 4800MHz (4 khe, tối đa 128GB)', 'GB', 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='msi-titan-gt77-gaming'), N'Ổ cứng', N'2TB NVMe PCIe 4.0 SSD RAID 0 (2×1TB)', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='msi-titan-gt77-gaming'), N'Màn hình', N'17.3" 4K UHD (3840×2160) IPS 120Hz, DCI-P3 100%', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='msi-titan-gt77-gaming'), N'Pin', N'99.9Wh, sạc 330W', 'Wh', 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='msi-titan-gt77-gaming'), N'Kết nối', N'Wi-Fi 6E, Bluetooth 5.3', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='msi-titan-gt77-gaming'), N'Cổng kết nối', N'Thunderbolt 4, USB-A x5, HDMI 2.1, Mini-DP 1.4, RJ45', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='msi-titan-gt77-gaming'), N'Bàn phím', N'Cherry MX Ultra Low Profile (Tactile)', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='msi-titan-gt77-gaming'), N'Trọng lượng', N'3.3', 'kg', 10);

-- 3. Dell XPS 15 9530
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='dell-xps-15-9530'), N'CPU', N'Intel Core i7-13700H (14 nhân, 20 luồng, tới 5.0GHz)', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='dell-xps-15-9530'), N'GPU', N'NVIDIA GeForce RTX 4060 8GB GDDR6', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='dell-xps-15-9530'), N'RAM', N'16GB LPDDR5 6400MHz (hàn liền)', 'GB', 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='dell-xps-15-9530'), N'Ổ cứng', N'512GB NVMe PCIe 4.0 SSD', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='dell-xps-15-9530'), N'Màn hình', N'15.6" OLED 3.5K (3456×2160) 120Hz, 400 nits, 100% DCI-P3', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='dell-xps-15-9530'), N'Pin', N'86Wh, sạc nhanh 130W', 'Wh', 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='dell-xps-15-9530'), N'Kết nối', N'Wi-Fi 6E, Bluetooth 5.3', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='dell-xps-15-9530'), N'Cổng kết nối', N'Thunderbolt 4 x2, USB-A, HDMI 2.0, SD Full-size, 3.5mm', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='dell-xps-15-9530'), N'Webcam', N'720p IR, nhận diện khuôn mặt Windows Hello', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='dell-xps-15-9530'), N'Trọng lượng', N'1.86', 'kg', 10);

-- 4. HP Envy 16 2024
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='hp-envy-16-2024'), N'CPU', N'Intel Core i7-13700H (14 nhân, 20 luồng, tới 5.0GHz)', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='hp-envy-16-2024'), N'GPU', N'NVIDIA GeForce RTX 4060 8GB GDDR6', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='hp-envy-16-2024'), N'RAM', N'32GB DDR5 4800MHz (2 khe SO-DIMM)', 'GB', 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='hp-envy-16-2024'), N'Ổ cứng', N'1TB NVMe PCIe 4.0 SSD', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='hp-envy-16-2024'), N'Màn hình', N'16" OLED 2.5K (2560×1600) 120Hz, 500 nits, HDR True Black 500', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='hp-envy-16-2024'), N'Pin', N'83Wh, sạc nhanh 140W USB-C', 'Wh', 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='hp-envy-16-2024'), N'Kết nối', N'Wi-Fi 6E, Bluetooth 5.3', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='hp-envy-16-2024'), N'Cổng kết nối', N'Thunderbolt 4, USB-A x2, HDMI 2.1, MicroSD, 3.5mm', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='hp-envy-16-2024'), N'Webcam', N'5MP AI with Temporal Noise Reduction', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='hp-envy-16-2024'), N'Trọng lượng', N'2.04', 'kg', 10);

-- 5. Lenovo ThinkPad X1 Carbon Gen 11
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lenovo-thinkpad-x1-carbon-gen11'), N'CPU', N'Intel Core i7-1365U vPro (10 nhân, 12 luồng, tới 5.2GHz)', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lenovo-thinkpad-x1-carbon-gen11'), N'GPU', N'Intel Iris Xe Graphics (tích hợp)', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lenovo-thinkpad-x1-carbon-gen11'), N'RAM', N'32GB LPDDR5 6400MHz (hàn liền)', 'GB', 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lenovo-thinkpad-x1-carbon-gen11'), N'Ổ cứng', N'1TB NVMe PCIe 4.0 SSD', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lenovo-thinkpad-x1-carbon-gen11'), N'Màn hình', N'14" IPS 2.8K (2880×1800) 90Hz, Anti-glare, 400 nits', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lenovo-thinkpad-x1-carbon-gen11'), N'Pin', N'57Wh (~15 giờ), sạc nhanh 65W', 'Wh', 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lenovo-thinkpad-x1-carbon-gen11'), N'Kết nối', N'Wi-Fi 6E, Bluetooth 5.3, 4G LTE tùy chọn', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lenovo-thinkpad-x1-carbon-gen11'), N'Cổng kết nối', N'Thunderbolt 4 x2, USB-A x2, HDMI 2.0, MicroSD, 3.5mm', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lenovo-thinkpad-x1-carbon-gen11'), N'Bảo mật', N'Fingerprint, IR camera, TPM 2.0, MIL-STD-810H', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lenovo-thinkpad-x1-carbon-gen11'), N'Trọng lượng', N'1.12', 'kg', 10);

-- 6. Apple MacBook Pro 16 M3 Max
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-macbook-pro-16-m3-max'), N'Chip', N'Apple M3 Max (16-core CPU: 12P+4E, 40-core GPU)', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-macbook-pro-16-m3-max'), N'RAM', N'36GB Unified Memory (400GB/s bandwidth)', 'GB', 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-macbook-pro-16-m3-max'), N'Ổ cứng', N'1TB SSD NVMe (tới 7.5GB/s)', NULL, 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-macbook-pro-16-m3-max'), N'Màn hình', N'16.2" Liquid Retina XDR, 3456×2160 (254ppi), ProMotion 120Hz, 1600 nits', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-macbook-pro-16-m3-max'), N'Pin', N'100Wh (~22 giờ phát video), sạc 140W MagSafe 3', 'Wh', 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-macbook-pro-16-m3-max'), N'Kết nối', N'Wi-Fi 6E, Bluetooth 5.3', NULL, 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-macbook-pro-16-m3-max'), N'Cổng kết nối', N'Thunderbolt 4 x3, HDMI 2.1, SD UHS-II, MagSafe 3, 3.5mm', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-macbook-pro-16-m3-max'), N'Webcam', N'12MP Center Stage, tự căn chỉnh theo người dùng', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-macbook-pro-16-m3-max'), N'Âm thanh', N'6 loa stereo Spatial Audio, hỗ trợ Dolby Atmos', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-macbook-pro-16-m3-max'), N'Trọng lượng', N'2.14', 'kg', 10);

-- 7. Samsung Odyssey G7 32"
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-odyssey-g7-32-curved'), N'Kích thước màn hình', N'32', 'inch', 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-odyssey-g7-32-curved'), N'Độ phân giải', N'3840×2160 (4K UHD)', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-odyssey-g7-32-curved'), N'Tần số quét', N'144', 'Hz', 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-odyssey-g7-32-curved'), N'Thời gian phản hồi', N'1 (MPRT)', 'ms', 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-odyssey-g7-32-curved'), N'Tấm nền', N'VA QLED Quantum Dot', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-odyssey-g7-32-curved'), N'Độ cong', N'1000R', NULL, 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-odyssey-g7-32-curved'), N'HDR', N'HDR600 (DisplayHDR 600)', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-odyssey-g7-32-curved'), N'Màu sắc', N'125% sRGB, 95% DCI-P3', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-odyssey-g7-32-curved'), N'Cổng kết nối', N'DisplayPort 1.4, HDMI 2.1 x2, USB-A 2.0 x2', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-odyssey-g7-32-curved'), N'Tương thích', N'G-Sync Compatible, FreeSync Premium Pro', NULL, 10);

-- 8. LG UltraWide 34"
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lg-ultrawide-34-ips'), N'Kích thước màn hình', N'34', 'inch', 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lg-ultrawide-34-ips'), N'Độ phân giải', N'3440×1440 (UWQHD 21:9)', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lg-ultrawide-34-ips'), N'Tần số quét', N'144', 'Hz', 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lg-ultrawide-34-ips'), N'Thời gian phản hồi', N'1 (GtG)', 'ms', 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lg-ultrawide-34-ips'), N'Tấm nền', N'IPS Nano Color', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lg-ultrawide-34-ips'), N'Độ sáng', N'300 (550 HDR peak)', 'nits', 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lg-ultrawide-34-ips'), N'Màu sắc', N'sRGB 99%, DCI-P3 98%', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lg-ultrawide-34-ips'), N'HDR', N'HDR10', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lg-ultrawide-34-ips'), N'Cổng kết nối', N'USB-C 96W, DisplayPort 1.4, HDMI 2.0 x2, USB-A 3.0 x2', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='lg-ultrawide-34-ips'), N'Tương thích', N'AMD FreeSync Premium, VESA 100×100', NULL, 10);

-- 9. Logitech MX Master 3S
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='logitech-mx-master-3s'), N'Cảm biến', N'Darkfield High Precision', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='logitech-mx-master-3s'), N'DPI', N'200 – 8000 (điều chỉnh được)', 'DPI', 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='logitech-mx-master-3s'), N'Nút bấm', N'7 nút lập trình được', NULL, 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='logitech-mx-master-3s'), N'Kết nối', N'Bluetooth Low Energy + USB Logi Bolt (2.4GHz)', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='logitech-mx-master-3s'), N'Số thiết bị kết nối', N'3 (Easy-Switch)', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='logitech-mx-master-3s'), N'Pin', N'500mAh, ~70 ngày (tắt tiếng ồn)', NULL, 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='logitech-mx-master-3s'), N'Sạc', N'USB-C, 1 phút sạc = 3 giờ dùng', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='logitech-mx-master-3s'), N'Trọng lượng', N'141', 'g', 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='logitech-mx-master-3s'), N'Tương thích', N'Windows, macOS, Linux, ChromeOS, iPadOS', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='logitech-mx-master-3s'), N'Màu sắc', N'Space Grey / Pale Grey / Graphite', NULL, 10);

-- 10. Razer BlackWidow V4 Pro
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='razer-blackwidow-v4-pro'), N'Switch', N'Razer Yellow V3 (Clicky, Tactile, 45g actuation)', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='razer-blackwidow-v4-pro'), N'Tuổi thọ switch', N'80 triệu lần nhấn', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='razer-blackwidow-v4-pro'), N'Kết nối', N'2.4GHz HyperSpeed Wireless + USB + Bluetooth', NULL, 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='razer-blackwidow-v4-pro'), N'Độ trễ wireless', N'< 1', 'ms', 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='razer-blackwidow-v4-pro'), N'Pin', N'~200 giờ (không RGB), 36 giờ (có RGB)', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='razer-blackwidow-v4-pro'), N'Đèn LED', N'Per-key RGB Chroma (16.8 triệu màu)', NULL, 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='razer-blackwidow-v4-pro'), N'Layout', N'Full-size (104 phím + media keys + roller)', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='razer-blackwidow-v4-pro'), N'Vật liệu', N'Đế nhôm anodized, foam giảm tiếng ồn', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='razer-blackwidow-v4-pro'), N'Hành trình phím', N'4.0 (actuation 2.0)', 'mm', 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='razer-blackwidow-v4-pro'), N'Tương thích', N'Windows, macOS (Razer Synapse 3)', NULL, 10);

-- 11. Samsung 990 Pro SSD 2TB
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-990-pro-ssd-2tb'), N'Dung lượng', N'2', 'TB', 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-990-pro-ssd-2tb'), N'Giao tiếp', N'NVMe PCIe 4.0 x4', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-990-pro-ssd-2tb'), N'Form factor', N'M.2 2280', NULL, 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-990-pro-ssd-2tb'), N'Tốc độ đọc tuần tự', N'7450', 'MB/s', 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-990-pro-ssd-2tb'), N'Tốc độ ghi tuần tự', N'6900', 'MB/s', 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-990-pro-ssd-2tb'), N'IOPS đọc ngẫu nhiên', N'1.400.000', 'IOPS', 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-990-pro-ssd-2tb'), N'IOPS ghi ngẫu nhiên', N'1.550.000', 'IOPS', 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-990-pro-ssd-2tb'), N'Loại NAND', N'Samsung V-NAND 3-bit MLC (TLC)', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-990-pro-ssd-2tb'), N'Độ bền (TBW)', N'1200', 'TBW', 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-990-pro-ssd-2tb'), N'Bảo hành', N'5 năm', NULL, 10);

-- 12. Kingston Fury Beast DDR5 32GB
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='kingston-fury-beast-ddr5-32gb'), N'Dung lượng', N'32GB (2×16GB kit)', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='kingston-fury-beast-ddr5-32gb'), N'Loại RAM', N'DDR5', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='kingston-fury-beast-ddr5-32gb'), N'Tốc độ', N'6000', 'MHz', 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='kingston-fury-beast-ddr5-32gb'), N'Latency', N'CL40-40-40', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='kingston-fury-beast-ddr5-32gb'), N'Điện áp', N'1.35', 'V', 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='kingston-fury-beast-ddr5-32gb'), N'OC Profile', N'XMP 3.0 & EXPO', NULL, 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='kingston-fury-beast-ddr5-32gb'), N'Tương thích', N'Intel 12/13/14th Gen & AMD Ryzen 7000 Series', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='kingston-fury-beast-ddr5-32gb'), N'Tản nhiệt', N'Heatspreader nhôm low-profile', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='kingston-fury-beast-ddr5-32gb'), N'Tính năng', N'On-Die ECC, ổn định dữ liệu', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='kingston-fury-beast-ddr5-32gb'), N'Bảo hành', N'Lifetime (Vĩnh viễn)', NULL, 10);

-- Xac nhan ket qua
SELECT
  sp.ten_san_pham,
  COUNT(ts.ma_thong_so) AS so_thong_so,
  IF(sp.mo_ta IS NOT NULL AND sp.mo_ta != '', 'Có mô tả ✅', 'Thiếu mô tả ❌') AS mo_ta
FROM san_pham sp
LEFT JOIN thong_so_ky_thuat ts ON sp.ma_san_pham = ts.ma_san_pham
GROUP BY sp.ma_san_pham, sp.ten_san_pham, sp.mo_ta
ORDER BY sp.ma_san_pham;
