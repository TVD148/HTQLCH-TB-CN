-- ============================================================
-- THEM NHIEU SAN PHAM HON - ~98 san pham moi
-- Phan bo deu cac danh muc va thuong hieu
-- ============================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
USE htqlch_thietbi_cn;

-- ============================================================
-- THEM THUONG HIEU MOI
-- ============================================================
INSERT IGNORE INTO thuong_hieu (ten_thuong_hieu, duong_dan, quoc_gia, trang_thai) VALUES
  ('Xiaomi',        'xiaomi',        N'Trung Quốc', 1),
  ('OPPO',          'oppo',          N'Trung Quốc', 1),
  ('OnePlus',       'oneplus',       N'Trung Quốc', 1),
  ('Acer',          'acer',          N'Đài Loan',   1),
  ('BenQ',          'benq',          N'Đài Loan',   1),
  ('AOC',           'aoc',           N'Trung Quốc', 1),
  ('TP-Link',       'tp-link',       N'Trung Quốc', 1),
  ('Corsair',       'corsair',       N'Mỹ',         1),
  ('SteelSeries',   'steelseries',   N'Đan Mạch',   1),
  ('Sony',          'sony',          N'Nhật Bản',   1),
  ('JBL',           'jbl',           N'Mỹ',         1),
  ('HyperX',        'hyperx',        N'Mỹ',         1),
  ('WD',            'wd',            N'Mỹ',         1),
  ('Seagate',       'seagate',       N'Mỹ',         1),
  ('G.Skill',       'gskill',        N'Đài Loan',   1),
  ('Crucial',       'crucial',       N'Mỹ',         1),
  ('Netgear',       'netgear',       N'Mỹ',         1),
  ('Vivo',          'vivo',          N'Trung Quốc', 1);

-- ============================================================
-- 1. LAPTOP (danh_muc=1) - them 4 san pham
-- ============================================================
INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta_ngan, mo_ta, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat, danh_gia_tb, luot_xem) VALUES

(N'Acer Swift Go 16 2024', 'acer-swift-go-16-2024',
 N'Intel Core Ultra 7 155H | Intel Arc Graphics | 16GB LPDDR5X | 512GB SSD | 16" 2.5K OLED 120Hz',
 N'<h2>Acer Swift Go 16 2024 – Mỏng Nhẹ, Màn OLED Chuẩn Sáng Tạo</h2><p>Acer Swift Go 16 2024 là laptop mỏng nhẹ cao cấp trang bị Intel Core Ultra 7 155H – vi xử lý thế hệ Meteor Lake đầu tiên với NPU tích hợp hỗ trợ các tác vụ AI. Màn hình OLED 16" 2.5K 120Hz với DCI-P3 100% TÜV Rheinland cho màu sắc sống động, bảo vệ mắt hiệu quả.</p><ul><li>✅ Intel Core Ultra 7 155H – kiến trúc hybrid 16 nhân thế hệ mới</li><li>✅ Màn OLED 2.5K 120Hz, DCI-P3 100%</li><li>✅ Trọng lượng chỉ 1.8kg, siêu mỏng 17mm</li><li>✅ Thunderbolt 4, USB4, HDMI 2.1</li></ul>',
 17990000, 15990000, 18, 1,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Acer'),
 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=375&fit=crop&q=85',
 1, 0, 4.4, 145),

(N'Samsung Galaxy Book4 Ultra', 'samsung-galaxy-book4-ultra',
 N'Intel Core Ultra 9 185H | RTX 4070 8GB | 32GB LPDDR5X | 1TB SSD | 16" AMOLED 2.8K 120Hz',
 N'<h2>Samsung Galaxy Book4 Ultra – Đỉnh Cao Hệ Sinh Thái Samsung</h2><p>Galaxy Book4 Ultra kết hợp hoàn hảo giữa phong cách mỏng nhẹ và sức mạnh của RTX 4070 8GB, lý tưởng cho content creator trong hệ sinh thái Samsung. Màn hình Dynamic AMOLED 2X 2.8K 120Hz với độ sáng 400 nits, HDR True Black 500 cho hình ảnh sắc nét rực rỡ.</p><ul><li>✅ AMOLED 2.8K 120Hz – màu sắc điện ảnh</li><li>✅ RTX 4070 8GB cho render và gaming</li><li>✅ Galaxy AI – tích hợp AI tạo sinh bản địa</li><li>✅ Kết nối sâu với Galaxy Phone, Buds, Watch</li></ul>',
 45990000, 42990000, 9, 1,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Samsung'),
 'https://images.unsplash.com/photo-1611186871525-c71db68aa29e?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 234),

(N'ASUS Vivobook Pro 16X OLED', 'asus-vivobook-pro-16x-oled',
 N'Intel Core i9-13980HX | RTX 4060 8GB | 32GB DDR5 | 1TB SSD | 16" OLED 4K 120Hz',
 N'<h2>ASUS Vivobook Pro 16X OLED – Sáng Tạo Không Giới Hạn</h2><p>Vivobook Pro 16X OLED được trang bị màn hình OLED 4K 120Hz với DCI-P3 100%, Pantone Validated – tiêu chuẩn màu sắc của ngành in ấn và thiết kế chuyên nghiệp. CPU Intel Core i9-13980HX 24-nhân cùng RTX 4060 đảm bảo render 3D, chỉnh video 4K nhanh chóng.</p><ul><li>✅ OLED 4K 120Hz – chuẩn Pantone Validated</li><li>✅ CPU i9-13980HX 24 nhân cho đa nhiệm nặng</li><li>✅ ASUS Dial – núm xoay sáng tạo độc quyền</li><li>✅ Cổng Thunderbolt 4, USB-C, HDMI 2.1</li></ul>',
 35990000, 32990000, 14, 1,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 189),

(N'HP Spectre x360 14 2024', 'hp-spectre-x360-14-2024',
 N'Intel Core Ultra 7 165H | Intel Arc | 32GB LPDDR5X | 2TB SSD | 14" 2.8K OLED 120Hz 2-in-1',
 N'<h2>HP Spectre x360 14 – 2-in-1 Cao Cấp Mỏng Nhất</h2><p>HP Spectre x360 14 là laptop 2-in-1 sang trọng nhất của HP với thiết kế gem-cut góc cạnh đặc trưng, vỏ nhôm nguyên khối được phủ lớp mạ titan cắt CNC. Màn OLED 2.8K 120Hz cảm ứng 10 điểm, hỗ trợ bút HP Tilt Pen. Gập 360° dùng như máy tính bảng hoặc chế độ studio.</p><ul><li>✅ 2-in-1 gập 360° – laptop, tablet, studio, tent</li><li>✅ OLED 2.8K 120Hz cảm ứng, kèm bút HP Tilt Pen</li><li>✅ Intel Core Ultra 7 165H + NPU AI</li><li>✅ Thiết kế gem-cut nhôm mạ titan sang trọng</li></ul>',
 37990000, 34990000, 11, 1,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='HP'),
 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 267);

-- ============================================================
-- 2. DIEN THOAI (danh_muc=2) - 10 san pham
-- ============================================================
INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta_ngan, mo_ta, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat, danh_gia_tb, luot_xem) VALUES

(N'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra',
 N'Snapdragon 8 Gen 3 | 12GB RAM | 256GB | 6.8" QHD+ 120Hz | Camera 200MP | S Pen tích hợp',
 N'<h2>Samsung Galaxy S24 Ultra – Siêu Phẩm Android 2024</h2><p>Galaxy S24 Ultra là flagship mạnh nhất của Samsung với Snapdragon 8 Gen 3 for Galaxy và camera 200MP Tetra² Pixel. S Pen tích hợp hỗ trợ Galaxy AI với các tính năng Note Assist, Transcript Assist dịch và tóm tắt ngay trên màn hình. Khung viền titan Grade 2 cứng cáp thanh lịch.</p><ul><li>✅ Camera 200MP, zoom quang học 5x, Space Zoom 100x</li><li>✅ S Pen tích hợp + Galaxy AI bản địa</li><li>✅ Màn Dynamic AMOLED 2X 6.8" QHD+ 120Hz</li><li>✅ Pin 5000mAh, sạc nhanh 45W, sạc không dây 15W</li></ul>',
 32990000, 29990000, 25, 2,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Samsung'),
 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=375&fit=crop&q=85',
 1, 1, 4.8, 521),

(N'Apple iPhone 15 Pro Max', 'apple-iphone-15-pro-max',
 N'Apple A17 Pro | 8GB RAM | 256GB | 6.7" Super Retina XDR ProMotion 120Hz | Camera 48MP | Khung Titan',
 N'<h2>Apple iPhone 15 Pro Max – Siêu Phẩm iOS Tiên Phong</h2><p>iPhone 15 Pro Max là smartphone mạnh nhất Apple với chip A17 Pro 3nm, GPU 6-core và khả năng ray tracing phần cứng. Lần đầu tiên có cổng USB 3 (USB-C) với tốc độ 10Gbps. Camera Tetraprism 5x zoom quang học cho ảnh và video chất lượng điện ảnh, hỗ trợ quay ProRes 4K 60fps lên iPhone trực tiếp.</p><ul><li>✅ Chip A17 Pro 3nm – mạnh nhất trên smartphone</li><li>✅ Camera 48MP, 5x optical zoom Tetraprism</li><li>✅ USB 3 tốc độ 10Gbps – kết nối ProRes trực tiếp</li><li>✅ Khung titan cấp 5 nhẹ và bền hơn thép</li></ul>',
 34990000, NULL, 20, 2,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Apple'),
 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=375&fit=crop&q=85',
 1, 1, 4.9, 612),

(N'Xiaomi 14 Ultra', 'xiaomi-14-ultra',
 N'Snapdragon 8 Gen 3 | 16GB RAM | 512GB | 6.73" LTPO AMOLED | Camera Leica 50MP x4',
 N'<h2>Xiaomi 14 Ultra – Camera Leica 4 Ống Kính Hàng Đầu</h2><p>Xiaomi 14 Ultra hợp tác với Leica cho hệ thống camera 4 ống kính đồng đều 50MP, gồm wide, ultrawide, telephoto 3.2x và telephoto 5x – khả năng chụp ảnh vượt trội mọi điều kiện ánh sáng. Màn LTPO AMOLED 6.73" 1-120Hz thích ứng thông minh, độ sáng đỉnh 3000 nits.</p><ul><li>✅ 4 camera Leica 50MP đồng đều – đa góc chụp tối ưu</li><li>✅ Snapdragon 8 Gen 3 + 16GB LPDDR5X</li><li>✅ Sạc siêu nhanh 90W + sạc không dây 80W</li><li>✅ IP68 chống nước sâu 2m/30 phút</li></ul>',
 26990000, 24990000, 15, 2,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Xiaomi'),
 'https://images.unsplash.com/photo-1574717024453-354056adc6ac?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 389),

(N'OPPO Find X7 Ultra', 'oppo-find-x7-ultra',
 N'Snapdragon 8 Gen 3 | 16GB RAM | 256GB | 6.82" LTPO AMOLED 120Hz | Camera Hasselblad 50MP',
 N'<h2>OPPO Find X7 Ultra – Đỉnh Cao Nhiếp Ảnh Di Động Hasselblad</h2><p>Find X7 Ultra hợp tác cùng Hasselblad mang đến hệ thống camera dual-periscope đầu tiên trên thế giới – hai ống kính zoom dài 3x và 6x cho khả năng zoom quang học vượt trội. FlashCharge 100W sạc đầy trong 26 phút, Air Glass 3 hiển thị thông tin AR đa năng.</p><ul><li>✅ Dual periscope camera – zoom 3x + 6x quang học</li><li>✅ Màu sắc Hasselblad Natural Colour Calibration</li><li>✅ Sạc 100W – đầy pin 4800mAh trong 26 phút</li><li>✅ ColorOS 14 – tối ưu AI Privacy và Battery AI</li></ul>',
 24990000, 22990000, 12, 2,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='OPPO'),
 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 298),

(N'OnePlus 12', 'oneplus-12',
 N'Snapdragon 8 Gen 3 | 12GB RAM | 256GB | 6.82" LTPO3 AMOLED 120Hz | Camera Hasselblad 50MP | Sạc 100W',
 N'<h2>OnePlus 12 – Nhanh Hơn, Mạnh Hơn, Sạc Điên Đảo</h2><p>OnePlus 12 là flagship giá hợp lý nhất mang Snapdragon 8 Gen 3, camera Hasselblad và sạc siêu nhanh SUPERVOOC 100W. Màn LTPO3 AMOLED 6.82" 1-120Hz với độ sáng 4500 nits, kính Ceramic Guard chống xước bền bỉ. Sạc đầy 5400mAh chỉ trong 28 phút.</p><ul><li>✅ Sạc 100W SUPERVOOC – đầy trong 28 phút</li><li>✅ Camera Hasselblad 50MP 3x Periscope</li><li>✅ Màn 4500 nits – sắc nét dưới ánh nắng trực tiếp</li><li>✅ OxygenOS 14 mượt mà, ít bloatware nhất</li></ul>',
 20990000, 18990000, 18, 2,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='OnePlus'),
 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 276),

(N'Samsung Galaxy S24+', 'samsung-galaxy-s24-plus',
 N'Snapdragon 8 Gen 3 | 12GB RAM | 256GB | 6.7" Dynamic AMOLED 2X 120Hz | Camera 50MP',
 N'<h2>Samsung Galaxy S24+ – Flagship Cân Bằng Hoàn Hảo</h2><p>Galaxy S24+ là lựa chọn lý tưởng giữa S24 và S24 Ultra: màn hình to 6.7" với pin 4900mAh, Snapdragon 8 Gen 3 for Galaxy, và Galaxy AI đầy đủ tính năng. Khung nhôm Armor Aluminum bền bỉ, kính Gorilla Glass Victus 2 trước và sau.</p><ul><li>✅ Galaxy AI: Circle to Search, Live Translate, Note Assist</li><li>✅ Camera 50MP + 10MP 3x + 12MP ultrawide</li><li>✅ Sạc nhanh 45W + sạc không dây 15W</li><li>✅ Bảo hành Samsung 7 năm OS update</li></ul>',
 27990000, 25990000, 22, 2,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Samsung'),
 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 312),

(N'Apple iPhone 15', 'apple-iphone-15',
 N'Apple A16 Bionic | 6GB RAM | 128GB | 6.1" Super Retina XDR 60Hz | Camera 48MP | USB-C',
 N'<h2>Apple iPhone 15 – iPhone Phổ Thông Thế Hệ Mới</h2><p>iPhone 15 lần đầu tiên dùng cổng USB-C, camera 48MP chính với pixel-binning 4-in-1, tính năng Action Mode quay video chống rung cực tốt. Dynamic Island thay cho notch truyền thống, chip A16 Bionic mạnh mẽ vượt trội mọi Android tầm trung.</p><ul><li>✅ Camera 48MP – chất lượng Pro trên phiên bản thường</li><li>✅ Dynamic Island – hiển thị thông báo sáng tạo</li><li>✅ USB-C – dùng chung dây sạc với MacBook, iPad</li><li>✅ Crash Detection và Emergency SOS qua vệ tinh</li></ul>',
 22990000, 20990000, 30, 2,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Apple'),
 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 445),

(N'Xiaomi 14', 'xiaomi-14',
 N'Snapdragon 8 Gen 3 | 12GB RAM | 256GB | 6.36" LTPO AMOLED 120Hz | Camera Leica 50MP',
 N'<h2>Xiaomi 14 – Compact Flagship Camera Leica</h2><p>Xiaomi 14 mang thiết kế nhỏ gọn 6.36" với hiệu năng flagship Snapdragon 8 Gen 3 và camera Leica cho những ai thích điện thoại vừa tay. Màn LTPO AMOLED 1-120Hz với độ sáng đỉnh 3000 nits cực rõ nét ngoài trời, IP68 chống nước bụi.</p><ul><li>✅ Compact 6.36" – nhỏ gọn nhất phân khúc flagship</li><li>✅ Camera Leica 50MP + 50MP ultrawide + 50MM 3.2x</li><li>✅ Sạc nhanh HyperCharge 90W</li><li>✅ HyperOS – hệ điều hành thế hệ mới của Xiaomi</li></ul>',
 19990000, 18490000, 20, 2,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Xiaomi'),
 'https://images.unsplash.com/photo-1574717024453-354056adc6ac?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 267),

(N'OPPO Reno 12 Pro', 'oppo-reno-12-pro',
 N'MediaTek Dimensity 9200+ | 12GB RAM | 256GB | 6.7" AMOLED 120Hz | Camera AI 50MP',
 N'<h2>OPPO Reno 12 Pro – Chụp Ảnh AI Thế Hệ Mới</h2><p>Reno 12 Pro mang AI Eraser 2.0 xóa vật thể hoàn hảo, AI Clear Face giữ khuôn mặt sắc nét trong đêm tối, và tính năng AI Best Face tổng hợp khuôn mặt đẹp nhất từ nhiều ảnh. Thiết kế vegan leather tinh tế, mỏng 7.4mm và nhẹ chỉ 180g.</p><ul><li>✅ AI Photography Suite – chụp ảnh thông minh</li><li>✅ Sạc siêu nhanh SUPERVOOC 80W</li><li>✅ Màn hình AMOLED 6.7" 120Hz, 950 nits</li><li>✅ ColorOS 14 với AI Writing, AI Summary</li></ul>',
 14990000, 13490000, 25, 2,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='OPPO'),
 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&h=375&fit=crop&q=85',
 1, 0, 4.4, 198),

(N'Samsung Galaxy A55 5G', 'samsung-galaxy-a55-5g',
 N'Exynos 1480 | 8GB RAM | 256GB | 6.6" Super AMOLED 120Hz | Camera 50MP OIS | IP67',
 N'<h2>Samsung Galaxy A55 5G – Tầm Trung Cao Cấp IP67</h2><p>Galaxy A55 5G mang thiết kế kim loại IP67 lần đầu tiên cho phân khúc A-series, màn Super AMOLED 120Hz sắc nét, camera OIS 50MP chụp ảnh ổn định. Exynos 1480 với 4 nhân AMD GPU cho hiệu năng đồ họa vượt trội phân khúc, đảm bảo 4 năm OS update.</p><ul><li>✅ IP67 – chống nước 1m/30 phút lần đầu cho Galaxy A</li><li>✅ OPhone 50MP OIS – ảnh không rung, đêm sắc nét</li><li>✅ AMD GPU – đồ họa gaming tốt nhất tầm trung</li><li>✅ 4 năm OS update + 5 năm bảo mật Samsung</li></ul>',
 9990000, 8990000, 40, 2,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Samsung'),
 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 356);

-- ============================================================
-- 3. PC & MAY TINH BAN (danh_muc=3) - 10 san pham
-- ============================================================
INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta_ngan, mo_ta, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat, danh_gia_tb, luot_xem) VALUES

(N'ASUS ROG Strix GT35 Gaming Desktop', 'asus-rog-strix-gt35',
 N'Intel Core i9-14900K | RTX 4090 24GB | 64GB DDR5 | 2TB NVMe | Windows 11',
 N'<h2>ASUS ROG Strix GT35 – PC Gaming Bất Khả Xâm Phạm</h2><p>ROG Strix GT35 là PC gaming flagship tích hợp Intel Core i9-14900K 24-nhân cùng RTX 4090 24GB – combo mạnh nhất dành cho gaming 4K/8K và stream. Vỏ case ROG với RGB Aura Sync, cửa sổ tempered glass và hệ thống tản nhiệt liquid cooling 360mm AIO.</p><ul><li>✅ RTX 4090 24GB – GPU mạnh nhất cho gaming và AI</li><li>✅ i9-14900K 24 nhân – xử lý đa nhiệm không giới hạn</li><li>✅ Liquid Cooling 360mm AIO tích hợp sẵn</li><li>✅ Thunderbolt 4, USB4, PCIe 5.0 M.2 slot</li></ul>',
 79990000, 74990000, 5, 3,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&h=375&fit=crop&q=85',
 1, 1, 4.8, 312),

(N'MSI MEG Aegis Ti5 14', 'msi-meg-aegis-ti5-14',
 N'Intel Core i9-14900K | RTX 4090 24GB | 64GB DDR5 | 4TB SSD | LED Cube Design',
 N'<h2>MSI MEG Aegis Ti5 14 – Siêu Máy Tính Hình Khối Tương Lai</h2><p>MEG Aegis Ti5 có thiết kế hình khối vuông độc đáo với màn hình phụ MSI Mystic Cube tích hợp hiển thị thông số hệ thống thời gian thực. Trang bị bộ đôi i9-14900K + RTX 4090 với hệ thống tản nhiệt hybrid air-liquid cooling độc quyền. AI tối ưu hiệu năng tự động theo workload.</p><ul><li>✅ Mystic Cube display hiển thị stats thời gian thực</li><li>✅ Hybrid cooling – kết hợp air và AIO liquid</li><li>✅ Wifi 7, Bluetooth 5.4, 10G Ethernet</li><li>✅ 4TB PCIe 5.0 RAID SSD</li></ul>',
 95990000, 89990000, 3, 3,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='MSI'),
 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=375&fit=crop&q=85',
 1, 1, 4.9, 278),

(N'Dell XPS Desktop 8960', 'dell-xps-desktop-8960',
 N'Intel Core i7-13700 | RTX 4070 12GB | 32GB DDR5 | 1TB NVMe | Thiết kế nhỏ gọn',
 N'<h2>Dell XPS Desktop 8960 – PC Cao Cấp Mỏng Nhỏ Tinh Tế</h2><p>Dell XPS Desktop 8960 gây ấn tượng với thiết kế tower nhỏ gọn bằng nhôm sang trọng, không ăn chỗ như PC gaming thông thường. CPU Intel Core i7-13700 16-nhân kết hợp RTX 4070 12GB cho trải nghiệm gaming 1440p/4K cao cấp. Nâng cấp RAM và SSD dễ dàng qua panel tháo nhanh.</p><ul><li>✅ Thiết kế nhôm sang trọng, nhỏ gọn hơn PC gaming thường</li><li>✅ RTX 4070 12GB cho gaming 1440p maxed settings</li><li>✅ Thunderbolt 4, USB-A, SD card, HDMI 2.1</li><li>✅ Intel VT-x hỗ trợ ảo hóa cho developer</li></ul>',
 38990000, 35990000, 10, 3,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Dell'),
 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 198),

(N'HP Omen 45L Desktop GT22', 'hp-omen-45l-desktop-gt22',
 N'Intel Core i9-14900K | RTX 4080 Super 16GB | 32GB DDR5 | 2TB NVMe | Omen Cryo Chamber',
 N'<h2>HP Omen 45L GT22 – Tản Nhiệt Vô Song Cryo Chamber</h2><p>Omen 45L GT22 nổi bật với công nghệ Cryo Chamber tản nhiệt dòng khí từ trên xuống độc quyền HP, giữ CPU và GPU luôn ở nhiệt độ tối ưu ngay cả khi overclocked. Hỗ trợ lên đến 128GB DDR5, PCIe 5.0 SSD và RTX 4080 Super cho gaming và render chuyên nghiệp.</p><ul><li>✅ Cryo Chamber cooling – tản nhiệt từ trên xuống độc quyền</li><li>✅ i9-14900K + RTX 4080 Super 16GB</li><li>✅ PCIe 5.0, DDR5 6400MHz, USB4 front panel</li><li>✅ Omen Gaming Hub quản lý hiệu năng thông minh</li></ul>',
 55990000, 52990000, 7, 3,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='HP'),
 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 234),

(N'Lenovo Legion Tower 7i Gen 9', 'lenovo-legion-tower-7i-gen9',
 N'Intel Core i9-14900KF | RTX 4080 16GB | 32GB DDR5 | 1TB SSD | 1000W PSU',
 N'<h2>Lenovo Legion Tower 7i Gen 9 – Hiệu Năng Đỉnh, Giá Hợp Lý</h2><p>Legion Tower 7i lựa chọn i9-14900KF không có iGPU nhưng giá tốt hơn, ghép với RTX 4080 16GB cho gaming 4K/1440p đỉnh cao. PSU 1000W Gold certified đủ điện cho tương lai nâng cấp GPU. Hệ thống quản lý cable bên trong gọn gàng, dễ bảo trì.</p><ul><li>✅ i9-14900KF + RTX 4080 16GB – combo best FPS/đồng</li><li>✅ PSU 1000W 80+ Gold cho nâng cấp lâu dài</li><li>✅ Legion AI Engine 2.0 tối ưu hiệu năng tự động</li><li>✅ Wifi 7, 2.5G Ethernet, USB4 front panel</li></ul>',
 48990000, 45990000, 9, 3,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Lenovo'),
 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 189),

(N'Acer Predator Orion 7000', 'acer-predator-orion-7000',
 N'Intel Core i9-13900K | RTX 4090 24GB | 64GB DDR5 | 2TB NVMe | Torc H3 Cooling',
 N'<h2>Acer Predator Orion 7000 – Máy Tính Gaming Flagship Acer</h2><p>Predator Orion 7000 là flagship PC gaming của Acer với cấu hình không khoan nhượng i9-13900K + RTX 4090, hệ thống tản nhiệt Torc H3 360mm AIO và 4 quạt case ARGB Dual Ring. Vỏ case tempered glass 3 mặt, đèn Predator RGB custom, hỗ trợ PCIe 5.0 SSD tốc độ tối đa.</p><ul><li>✅ RTX 4090 24GB + i9-13900K 24 nhân</li><li>✅ Torc H3 AIO 360mm chuyên biệt cho gaming</li><li>✅ 4x ARGB Dual Ring fan case tùy chỉnh đèn</li><li>✅ PCIe 5.0 SSD slot, DDR5 6800MHz support</li></ul>',
 79990000, 74990000, 4, 3,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Acer'),
 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&h=375&fit=crop&q=85',
 1, 1, 4.8, 267),

(N'ASUS ProArt Station PD5 Workstation', 'asus-proart-station-pd5',
 N'Intel Core i9-13900K | RTX 4080 16GB | 64GB ECC DDR5 | 2TB NVMe | Xác nhận ISV',
 N'<h2>ASUS ProArt Station PD5 – Workstation Chuyên Nghiệp Cho Sáng Tạo</h2><p>ProArt Station PD5 là workstation được chứng nhận ISV (Autodesk, Adobe, Siemens) đảm bảo ổn định tuyệt đối cho công việc CAD, 3D, VFX. RAM ECC DDR5 64GB chống lỗi bit đơn, giữ dữ liệu an toàn trong các dự án lớn. RTX 4080 hỗ trợ NVIDIA Quadro-class driver cho phần mềm chuyên nghiệp.</p><ul><li>✅ Chứng nhận ISV: Autodesk, Adobe, SolidWorks</li><li>✅ RAM ECC DDR5 chống lỗi – an toàn dữ liệu</li><li>✅ ProArt Creator Hub quản lý màu sắc</li><li>✅ 5x M.2 SSD slots, 2x PCIe 5.0 x16</li></ul>',
 65990000, 62990000, 5, 3,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 145),

(N'MSI Trident X2 14 Gaming PC', 'msi-trident-x2-14',
 N'Intel Core i7-14700F | RTX 4070 Ti 12GB | 32GB DDR5 | 1TB SSD | Mini-ITX Compact',
 N'<h2>MSI Trident X2 – PC Gaming Nhỏ Gọn Mạnh Mẽ</h2><p>Trident X2 là PC gaming mini-tower compact của MSI, nhỏ bằng hộp giày nhưng chứa i7-14700F 20-nhân và RTX 4070 Ti Super 16GB cho gaming 1440p/4K tối ưu. Silent Storm Cooling 3 với 3 ngăn tản nhiệt độc lập giữ nhiệt GPU, CPU và PSU tách biệt.</p><ul><li>✅ Mini-Tower compact – để bàn, mang đi dễ dàng</li><li>✅ Silent Storm Cooling 3 – 3 ngăn tản nhiệt tách biệt</li><li>✅ RTX 4070 Ti Super 16GB cho 4K gaming</li><li>✅ Wifi 7, Bluetooth 5.4, 2.5G LAN</li></ul>',
 42990000, 39990000, 8, 3,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='MSI'),
 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 178),

(N'Dell Precision 3690 Tower Workstation', 'dell-precision-3690-tower',
 N'Intel Xeon W3-2435 | NVIDIA RTX A4500 20GB | 64GB ECC DDR5 | 2TB NVMe',
 N'<h2>Dell Precision 3690 – Workstation Xeon Đẳng Cấp Doanh Nghiệp</h2><p>Precision 3690 dành cho kỹ sư CAD, nhà thiết kế 3D và nhà khoa học cần workstation CPU Xeon W với ECC memory và GPU Quadro chính hãng. RTX A4500 20GB là GPU workstation có driver chứng nhận cho SolidWorks, CATIA, Maya. Hỗ trợ 8 ổ cứng và 4 PCIe slot mở rộng linh hoạt.</p><ul><li>✅ Xeon W3-2435 8-nhân – hiệu năng single-thread tối ưu CAD</li><li>✅ RTX A4500 20GB Quadro – driver chứng nhận ISV</li><li>✅ ECC DDR5 64GB – ổn định tuyệt đối cho dự án lớn</li><li>✅ Chassis mở rộng: 8x HDD, 4x PCIe, 2x M.2</li></ul>',
 85990000, NULL, 3, 3,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Dell'),
 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 123),

(N'HP Z4 G5 Tower Workstation', 'hp-z4-g5-workstation',
 N'Intel Xeon W-2400 | NVIDIA RTX A5500 24GB | 128GB ECC DDR5 | 4TB NVMe',
 N'<h2>HP Z4 G5 – Workstation HP Cấp Enterprise Chứng Nhận ISV</h2><p>HP Z4 G5 là workstation biểu tưởng của HP dành cho các tác vụ simulation, rendering VFX, AI training quy mô vừa. Hỗ trợ Xeon W-2400 series với 56 luồng, RAM ECC up to 512GB, GPU RTX A5500 24GB với NVLINK ghép 2 GPU. HP Z Turbo Drive PCIe 5.0 đọc 14GB/s.</p><ul><li>✅ Hỗ trợ NVLINK – ghép 2 GPU A5500 thành 48GB VRAM</li><li>✅ PCIe 5.0 M.2 15GB/s – SSD nhanh nhất thế giới</li><li>✅ HP Z-certified: Autodesk, Siemens, PTC, Dassault</li><li>✅ Tool-free chassis nâng cấp không cần tua vít</li></ul>',
 115990000, NULL, 2, 3,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='HP'),
 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 89);

-- ============================================================
-- 4. MAN HINH (danh_muc=4) - 8 san pham moi
-- ============================================================
INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta_ngan, mo_ta, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat, danh_gia_tb, luot_xem) VALUES

(N'ASUS ROG Swift PG27UQR 4K 160Hz', 'asus-rog-swift-pg27uqr',
 N'27" 4K UHD | IPS 160Hz | 1ms GTG | HDR600 | G-Sync Ultimate | HDMI 2.1',
 N'<h2>ASUS ROG Swift PG27UQR – 4K Gaming Đỉnh Cao G-Sync Ultimate</h2><p>PG27UQR là màn gaming 4K 160Hz với chứng nhận G-Sync Ultimate – chuẩn cao nhất NVIDIA cho màn gaming. Panel Fast IPS 1ms GTG cho hình ảnh 4K cực sắc nét, HDR600 thực chiều với 576 vùng dimming cục bộ cho độ tương phản xuất sắc. DisplayHDR 600 chuẩn VESA.</p><ul><li>✅ G-Sync Ultimate – hỗ trợ HDR biến thiên và reflex latency</li><li>✅ 4K 160Hz + 1ms GTG – gaming đỉnh cao</li><li>✅ 576 zone local dimming – HDR thực chiều</li><li>✅ HDMI 2.1 x2 + DisplayPort 1.4 + USB Hub</li></ul>',
 24990000, 22990000, 15, 4,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 234),

(N'Dell Alienware AW3423DWF QD-OLED', 'dell-alienware-aw3423dwf',
 N'34" QD-OLED 3440x1440 | 165Hz | 0.1ms | 99.3% DCI-P3 | FreeSync Premium Pro',
 N'<h2>Dell Alienware AW3423DWF – Màn QD-OLED Siêu Cong Đỉnh Nhất</h2><p>AW3423DWF là màn gaming curved QD-OLED đầu tiên của Alienware với công nghệ Quantum Dot OLED cho độ tương phản vô cực (true black), màu QD sống động với DCI-P3 99.3%. 165Hz với pixel 0.1ms không có ghosting ngay cả màn cong. FreeSync Premium Pro không cần GPU NVIDIA.</p><ul><li>✅ QD-OLED – tương phản vô cực + màu Quantum Dot</li><li>✅ 0.1ms pixel response – gaming không ghosting</li><li>✅ FreeSync Premium Pro tương thích mọi GPU</li><li>✅ Alienware Command Center RGB tùy chỉnh</li></ul>',
 31990000, 28990000, 8, 4,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Dell'),
 'https://images.unsplash.com/photo-1623520795272-e34e03a8aa9a?w=500&h=375&fit=crop&q=85',
 1, 1, 4.8, 312),

(N'BenQ MOBIUZ EX3210U 4K 144Hz', 'benq-mobiuz-ex3210u',
 N'32" 4K UHD | IPS 144Hz | HDR600 | FreeSync Premium Pro | Eye-Care | Speaker 2.1',
 N'<h2>BenQ MOBIUZ EX3210U – Giải Trí Toàn Diện Gaming + Đa Phương Tiện</h2><p>EX3210U nổi bật với hệ thống loa 2.1 tích hợp treVolo 2W×2 + 5W woofer mang âm thanh vòm ngay màn hình – không cần loa ngoài. Panel IPS nano-IPS HDR600 4K 144Hz với Eye-Care BenQ chống mỏi mắt, lý tưởng cho cả ngày gaming dài và xem phim.</p><ul><li>✅ Loa 2.1 tích hợp treVolo – không cần loa ngoài</li><li>✅ 4K 144Hz HDR600 – gaming + đa phương tiện</li><li>✅ Eye-Care: anti-glare, flicker-free, B.I.+ ánh sáng thích ứng</li><li>✅ DisplayPort 1.4, HDMI 2.1, USB Hub</li></ul>',
 17990000, 15990000, 20, 4,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='BenQ'),
 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 189),

(N'AOC AGON AG274UX 4K 160Hz', 'aoc-agon-ag274ux',
 N'27" 4K | Fast IPS 160Hz | 1ms | HDR400 | G-Sync Compatible | USB-C 65W',
 N'<h2>AOC AGON AG274UX – 4K 160Hz Gía Hợp Lý Nhất</h2><p>AGON AG274UX mang đến 4K 160Hz với Fast IPS panel và G-Sync Compatible ở mức giá cạnh tranh nhất. USB-C 65W cho phép kết nối và sạc laptop chỉ một dây. Đế gaming với đèn RGB hai mặt, cần gạt KVM switch tích hợp chuyển đổi 2 PC bằng nút bấm.</p><ul><li>✅ 4K 160Hz Fast IPS – giá tốt nhất phân khúc</li><li>✅ USB-C 65W – dùng làm hub dock cho laptop</li><li>✅ KVM switch tích hợp – 1 bộ chuột bàn phím cho 2 PC</li><li>✅ G-Sync Compatible + FreeSync Premium</li></ul>',
 16990000, 14990000, 18, 4,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='AOC'),
 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&h=375&fit=crop&q=85',
 1, 0, 4.4, 156),

(N'LG UltraGear 27GR95QE OLED 240Hz', 'lg-ultragear-27gr95qe-oled',
 N'27" QHD OLED | 240Hz | 0.03ms | DCI-P3 98.5% | G-Sync Compatible | FreeSync',
 N'<h2>LG UltraGear 27GR95QE OLED – Tốc Độ OLED Vô Song</h2><p>27GR95QE là màn OLED gaming 240Hz đầu tiên với pixel response 0.03ms – nhanh gấp 33 lần IPS thông thường, hoàn toàn không ghosting. OLED cho độ tương phản vô cực, black thực sự đen tuyệt đối, HDR thực chiều. DCI-P3 98.5% cho màu sắc điện ảnh sống động.</p><ul><li>✅ OLED 240Hz 0.03ms – tốc độ không đối thủ</li><li>✅ True Black OLED – tương phản vô cực</li><li>✅ G-Sync Compatible + FreeSync Premium Pro</li><li>✅ Anti-Glare + Anti-Reflection coating</li></ul>',
 22990000, 19990000, 12, 4,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='LG'),
 'https://images.unsplash.com/photo-1623520795272-e34e03a8aa9a?w=500&h=375&fit=crop&q=85',
 1, 1, 4.8, 345),

(N'Samsung Odyssey Neo G9 57" Dual UHD', 'samsung-odyssey-neo-g9-57',
 N'57" Dual UHD 7680x2160 | VA Mini-LED 240Hz | HDR2000 | G-Sync | Cong 1000R',
 N'<h2>Samsung Odyssey Neo G9 57" – Màn Hình Khổng Lồ Như 2 Màn 32"</h2><p>Neo G9 57" là màn hình gaming lớn nhất, tương đương 2 màn 32" QHD ghép ngang mà không có viền. Mini-LED với 2392 vùng dimming cục bộ, HDR2000 độ sáng đỉnh 2000 nits, VA panel cho độ tương phản xuất sắc. Immersive gaming và đa nhiệm tối thượng.</p><ul><li>✅ 57" Dual UHD – rộng như 2 màn hình 32" không viền</li><li>✅ 2392 zone Mini-LED HDR2000 – hình ảnh điện ảnh</li><li>✅ 240Hz 1ms cong 1000R – gaming immersive</li><li>✅ USB Hub, DP 2.1, HDMI 2.1 x4</li></ul>',
 49990000, 44990000, 5, 4,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Samsung'),
 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 389),

(N'ASUS ProArt PA329CV 4K Professional', 'asus-proart-pa329cv',
 N'32" 4K UHD IPS | 100% sRGB | 98% DCI-P3 | Delta E <2 | Thunderbolt 4 | USB-C 96W | Calman Ready',
 N'<h2>ASUS ProArt PA329CV – Màn Chuyên Đồ Họa Chứng Nhận Calman</h2><p>ProArt PA329CV là màn hình thiết kế chuyên nghiệp 32" 4K với Thunderbolt 4 Hub tích hợp kết nối daisy-chain tới 2 màn nữa. Delta E < 2, sRGB 100%, DCI-P3 98% được hiệu chỉnh sẵn từ nhà máy, kèm chứng nhận màu cá nhân. Calman Ready hỗ trợ calibration phần mềm chuyên nghiệp.</p><ul><li>✅ Thunderbolt 4 daisy-chain – ghép 3 màn 1 dây</li><li>✅ Calman Ready – chuẩn hiệu chỉnh màu studio</li><li>✅ Delta E <2 factory-calibrated với chứng chỉ kèm theo</li><li>✅ USB-C 96W cấp nguồn laptop</li></ul>',
 38990000, 35990000, 8, 4,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 167),

(N'Dell UltraSharp U2723QE 4K USB-C', 'dell-ultrasharp-u2723qe',
 N'27" 4K IPS Black | 100% sRGB | 98% DCI-P3 | Delta E <2 | USB-C 90W | RJ45 LAN',
 N'<h2>Dell UltraSharp U2723QE – Màn Doanh Nhân USB-C Hub Toàn Diện</h2><p>UltraSharp U2723QE dùng panel IPS Black với độ tương phản 2000:1 – gấp đôi IPS thông thường, gần với VA. Cổng USB-C 90W cấp nguồn laptop cùng lúc truyền dữ liệu 10Gbps và đầu ra video. RJ45 Ethernet tích hợp biến màn thành dock hoàn chỉnh chỉ cần 1 dây USB-C.</p><ul><li>✅ IPS Black – 2000:1 contrast, màu đen sâu hơn IPS thường</li><li>✅ USB-C 90W + RJ45 + USB Hub – dock trong một màn</li><li>✅ Dell Display Manager 2.0 quản lý layout đa màn</li><li>✅ 3 năm bảo hành Dell Premium – hỗ trợ tận nhà</li></ul>',
 13990000, 12490000, 22, 4,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Dell'),
 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 231);

-- ============================================================
-- 5. PHU KIEN (danh_muc=5) - 9 san pham moi
-- ============================================================
INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta_ngan, mo_ta, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat, danh_gia_tb, luot_xem) VALUES

(N'Logitech G Pro X Superlight 2', 'logitech-g-pro-x-superlight-2',
 N'Cảm biến HERO 2 25600 DPI | 60g siêu nhẹ | Wireless 2.4GHz | Pin 95 giờ | PTFE',
 N'<h2>Logitech G Pro X Superlight 2 – Chuột Gaming Nhẹ Nhất Thế Giới</h2><p>G Pro X Superlight 2 giảm trọng lượng còn 60g – nhẹ nhất trong lịch sử Logitech, không ảnh hưởng độ bền. Cảm biến HERO 2 25600 DPI với độ chính xác pixel-perfect, không tăng tốc, không làm mịn. Kết nối LIGHTSPEED 2.4GHz độ trễ 1ms. Được các pro player CSGO, Valorant ưa thích nhất.</p><ul><li>✅ 60g – chuột gaming nhẹ nhất Logitech từ trước đến nay</li><li>✅ HERO 2 sensor 25600 DPI – chính xác pixel-perfect</li><li>✅ LIGHTSPEED wireless 1ms – không thua có dây</li><li>✅ Pin 95 giờ không cần lo sạc giữa chừng</li></ul>',
 3190000, 2890000, 35, 5,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Logitech'),
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',
 1, 1, 4.8, 412),

(N'Razer DeathAdder V3 Pro Wireless', 'razer-deathadder-v3-pro',
 N'Focus Pro 35K DPI | 63g | Ergonomic | HyperSpeed 2.4GHz | Pin 90 giờ',
 N'<h2>Razer DeathAdder V3 Pro – Ergonomic Flagship Không Dây</h2><p>DeathAdder V3 Pro kế thừa thiết kế ergonomic huyền thoại của dòng DeathAdder với trọng lượng chỉ 63g nhờ vỏ plastic rỗng Speedflex. Focus Pro 35K DPI hoạt động trên mọi bề mặt kể cả kính và vải. Kết nối HyperSpeed wireless lag 25% thấp hơn đối thủ.</p><ul><li>✅ Thiết kế ergonomic 30 năm hoàn thiện – thoải mái dài ngày</li><li>✅ Focus Pro 35K DPI – chính xác tuyệt đối mọi bề mặt</li><li>✅ Speedflex vỏ rỗng – nhẹ 63g không giảm độ bền</li><li>✅ HyperSpeed wireless – lag thấp nhất thị trường</li></ul>',
 2990000, 2690000, 28, 5,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Razer'),
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 312),

(N'Corsair K100 RGB Optical-Mechanical', 'corsair-k100-rgb',
 N'OPX Optical-Mech Switch | Per-key RGB | iCUE Wheel | Polycarbonate Frame | Macro',
 N'<h2>Corsair K100 RGB – Bàn Phím Gaming Flagship Của Corsair</h2><p>K100 RGB là bàn phím gaming đỉnh nhất của Corsair với switch Optical-Mech OPX actuate bằng ánh sáng – không có tiếp điểm cơ học, không mài mòn, 150 triệu lần nhấn. iCUE Multi-Function Wheel tùy chỉnh âm lượng, macro, zoom cho từng ứng dụng. Khung polycarbonate trong suốt cho RGB cực đẹp.</p><ul><li>✅ OPX Optical-Mech – 0.4mm actuate, không thể debounce</li><li>✅ iCUE Wheel – núm đa chức năng theo ứng dụng</li><li>✅ Khung polycarbonate trong – RGB xuyên thấu đẹp nhất</li><li>✅ 44-zone RAG backlit, 20MB onboard storage</li></ul>',
 4490000, 3990000, 20, 5,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Corsair'),
 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 234),

(N'SteelSeries Apex Pro TKL Wireless', 'steelseries-apex-pro-tkl-wireless',
 N'OmniPoint 2.0 Adjustable | TKL Layout | 2.4GHz + BT | OLED Display | RGB',
 N'<h2>SteelSeries Apex Pro TKL Wireless – Lực Nhấn Tùy Chỉnh Từng Phím</h2><p>Apex Pro TKL Wireless là bàn phím gaming duy nhất thế giới cho phép điều chỉnh lực nhấn từng phím riêng lẻ từ 0.2N đến 3.8N qua OmniPoint 2.0 magnetic switch. OLED Smart Display tích hợp hiển thị stats game, thông báo, GIF. Kết nối không dây 2.4GHz + Bluetooth.</p><ul><li>✅ OmniPoint 2.0 – chỉnh lực nhấn từng phím riêng lẻ</li><li>✅ OLED Smart Display – hiển thị stats game real-time</li><li>✅ 2.4GHz + Bluetooth multi-device</li><li>✅ TKL compact – phù hợp gaming và văn phòng</li></ul>',
 3990000, 3590000, 18, 5,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='SteelSeries'),
 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 289),

(N'HyperX Alloy Origins 65', 'hyperx-alloy-origins-65',
 N'HyperX Aqua Switch | 65% Layout | Per-key RGB | Aluminum Frame | 3 Layer Sound Dampening',
 N'<h2>HyperX Alloy Origins 65 – Compact 65% Đẳng Cấp Gaming</h2><p>Alloy Origins 65 chọn layout 65% giữ được phím mũi tên và Delete mà vẫn nhỏ gọn hơn TKL 30%. Khung nhôm máy bay nguyên khối chắn tiếng ồn tốt hơn, cảm giác gõ chắc chắn. Ba lớp foam chống tiếng ồn bên trong giảm âm thanh chạm đáy và lóc cóc.</p><ul><li>✅ 65% layout – nhỏ hơn TKL nhưng giữ phím mũi tên</li><li>✅ Khung nhôm nguyên khối máy bay</li><li>✅ 3 lớp foam insulation – gõ êm nhất phân khúc</li><li>✅ HyperX NGENUITY phần mềm RGB + macro</li></ul>',
 1790000, 1590000, 30, 5,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='HyperX'),
 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 198),

(N'Logitech G502 X Plus Wireless', 'logitech-g502-x-plus',
 N'HERO 25K DPI | LIGHTFORCE Hybrid Switch | 89g | LIGHTSPEED | LIGHTSYNC RGB',
 N'<h2>Logitech G502 X Plus – G502 Huyền Thoại Phiên Bản Không Dây</h2><p>G502 X Plus nâng cấp G502 huyền thoại thành phiên bản wireless với LIGHTSPEED và switch LIGHTFORCE mới – hybrid optical-mech không giảm cảm giác click so với cơ học. Trọng lượng 89g với profile nặng cầm thích hợp cho game FPS. RGB phát sáng qua logo và bánh xe cuộn độc đáo.</p><ul><li>✅ G502 huyền thoại + LIGHTSPEED wireless không độ trễ</li><li>✅ LIGHTFORCE switch – click cơ học + tốc độ quang học</li><li>✅ 13 nút có thể lập trình với G Hub</li><li>✅ Điều chỉnh trọng lượng với 5 cao su tháo ra</li></ul>',
 2590000, 2290000, 25, 5,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Logitech'),
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 267),

(N'Corsair Ironclaw RGB Wireless', 'corsair-ironclaw-rgb-wireless',
 N'18000 DPI | Slipstream 2.4GHz | Bluetooth | Ergonomic | Pin 16 giờ',
 N'<h2>Corsair Ironclaw RGB Wireless – Ergonomic Gaming Cho Tay To</h2><p>Ironclaw RGB được thiết kế cho tay to (cỡ L) với profile rộng và nút hông thoải mái. Kết nối 3-in-1: SLIPSTREAM 2.4GHz gaming, Bluetooth cho PC/mobile, hoặc USB có dây. iCUE software quản lý DPI, RGB và macro. Cảm biến PixArt PMW3391 18000 DPI chính xác.</p><ul><li>✅ Thiết kế Palm Grip cho tay to – thoải mái cả ngày</li><li>✅ 3-in-1: SLIPSTREAM + Bluetooth + USB</li><li>✅ iCUE RGB 16.8M màu đồng bộ hệ thống</li><li>✅ 6 nút có thể lập trình</li></ul>',
 1890000, 1690000, 22, 5,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Corsair'),
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',
 1, 0, 4.4, 178),

(N'SteelSeries Prime Wireless Gaming Mouse', 'steelseries-prime-wireless',
 N'TrueMove Air 18000 DPI | 80g | 2.4GHz | Magnetic Charging | 100 giờ pin',
 N'<h2>SteelSeries Prime Wireless – Thiết Kế Pro FPS Symmetrical</h2><p>Prime Wireless có thiết kế symmetrical phù hợp cả tay trái và tay phải, được các pro player CS thiết kế cùng. Chuẩn FPS với trọng lượng 80g cân bằng, sạc từ tính không cần cắm dây, 100 giờ pin vượt trội. TrueMove Air 18000 DPI cảm biến chính hãng SteelSeries.</p><ul><li>✅ Symmetrical – dùng được cả 2 tay</li><li>✅ Magnetic charging dock – không cần tìm đầu sạc</li><li>✅ 100 giờ pin – dùng 1 tuần mới cần sạc</li><li>✅ Designed với pro player CS2</li></ul>',
 2290000, 1990000, 20, 5,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='SteelSeries'),
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 145),

(N'HyperX Pulsefire Haste 2 Wireless', 'hyperx-pulsefire-haste-2-wireless',
 N'Cảm biến HyperX 26K DPI | 61g | Honeycomb Shell | 2.4GHz | Bluetooth | 100 giờ',
 N'<h2>HyperX Pulsefire Haste 2 Wireless – Featherweight Honeycomb</h2><p>Pulsefire Haste 2 Wireless chỉ 61g với thiết kế vỏ honeycomb (tổ ong) độc đáo giảm trọng lượng tối đa. Cảm biến HyperX 26K DPI mới nhất với tốc độ tracking 650IPS, gia tốc 50G. Kết nối 2.4GHz + Bluetooth linh hoạt, 100 giờ pin.</p><ul><li>✅ Honeycomb 61g – nhẹ nhất HyperX từ trước đến nay</li><li>✅ HyperX 26K DPI sensor – chính xác tối đa</li><li>✅ 2.4GHz + Bluetooth + USB – 3 mode kết nối</li><li>✅ Giá tốt nhất phân khúc wireless gaming nhẹ</li></ul>',
 1290000, 1090000, 35, 5,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='HyperX'),
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 234);

-- ============================================================
-- 6. THIET BI MANG (danh_muc=6) - 8 san pham
-- ============================================================
INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta_ngan, mo_ta, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat, danh_gia_tb, luot_xem) VALUES

(N'ASUS ZenWiFi Pro ET12 WiFi 6E Mesh', 'asus-zenwifi-pro-et12',
 N'WiFi 6E Tri-band | 11000 Mbps | 3-pack | 6GHz | AiMesh | 2.5G WAN/LAN | Up to 830m²',
 N'<h2>ASUS ZenWiFi Pro ET12 – Mesh WiFi 6E Cho Nhà Lớn Văn Phòng</h2><p>ZenWiFi Pro ET12 là hệ thống mesh WiFi 6E cao cấp nhất của ASUS, hỗ trợ băng tần 6GHz mới hoàn toàn không nhiễu – tốc độ tối đa 11Gbps cho streaming 8K, gaming pro không lag. 3 node phủ sóng 830m². Cổng 2.5G WAN/LAN cho NAS và switch tốc độ cao. AiProtection Pro bảo mật mạng.</p><ul><li>✅ WiFi 6E 6GHz – không nhiễu, tốc độ đến 11Gbps</li><li>✅ 3 node phủ 830m² – biệt thự, văn phòng lớn</li><li>✅ 2.5G port WAN/LAN kết nối NAS tốc độ cao</li><li>✅ AiProtection Pro Trend Micro miễn phí lifetime</li></ul>',
 9990000, 8990000, 12, 6,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 234),

(N'TP-Link Deco XE75 WiFi 6E Mesh', 'tp-link-deco-xe75',
 N'WiFi 6E Tri-band | 5400 Mbps | 2-pack | 6GHz | HomeShield | 2.5G WAN | Tự động tối ưu',
 N'<h2>TP-Link Deco XE75 – WiFi 6E Gia Đình Dễ Cài Đặt</h2><p>Deco XE75 mang WiFi 6E 6GHz đến gia đình với giá thực tế hơn. App Deco thiết lập dễ dàng 5 phút, tự động tối ưu kênh và điều phối thiết bị. HomeShield bảo mật kid-friendly lọc nội dung không phù hợp. 2 node phủ 560m², thêm node nếu cần mở rộng.</p><ul><li>✅ WiFi 6E 6GHz cho thiết bị mới nhất</li><li>✅ Tự động mesh optimization – không cần cài tay</li><li>✅ HomeShield: kiểm soát thời gian online con cái</li><li>✅ App Deco – quản lý từ xa 24/7</li></ul>',
 5490000, 4990000, 20, 6,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='TP-Link'),
 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 189),

(N'Netgear Nighthawk AX12 WiFi 6', 'netgear-nighthawk-ax12',
 N'WiFi 6 12-stream | 10.8 Gbps | 8 anten | 2.5G + 5G WAN | Beamforming | 12 thiết bị',
 N'<h2>Netgear Nighthawk AX12 – Router 12-Stream Mạnh Nhất Cho Gia Đình</h2><p>Nighthawk AX12 là router WiFi 6 12-stream với CPU 1.8GHz quad-core và 256MB RAM – hiệu năng mạng cao cấp cho streaming 4K nhiều thiết bị đồng thời. 8 anten external với beamforming 4x4 MU-MIMO kết nối 12 thiết bị cùng lúc không giảm tốc. Cổng 2.5G Multi-Gig WAN/LAN.</p><ul><li>✅ 12-stream WiFi 6 – 12 thiết bị cùng tốc độ đầy đủ</li><li>✅ CPU quad-core 1.8GHz – xử lý không nghẽn</li><li>✅ 2.5G + 5G WAN port – kênh mạng siêu nhanh</li><li>✅ Armor Bitdefender bảo mật advanced</li></ul>',
 7990000, 6990000, 10, 6,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Netgear'),
 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 167),

(N'TP-Link Archer AXE300 WiFi 6E', 'tp-link-archer-axe300',
 N'WiFi 6E Tri-band | 10756 Mbps | 6GHz | 2.5G WAN | 8 anten | OneMesh',
 N'<h2>TP-Link Archer AXE300 – WiFi 6E Cho Toàn Nhà Giá Hợp Lý</h2><p>Archer AXE300 mang băng tần 6GHz mới với tốc độ lý thuyết 4804Mbps cho thiết bị WiFi 6E, kết hợp 2 băng tần cũ 2.4GHz và 5GHz. OneMesh tương thích kết hợp với extender TP-Link mở rộng vùng phủ. Cổng 2.5G WAN kết nối modem tốc độ cao.</p><ul><li>✅ WiFi 6E 6GHz tri-band tổng 10.7Gbps</li><li>✅ OneMesh – mở rộng mesh với extender TP-Link</li><li>✅ 8 anten high-gain beamforming</li><li>✅ Tethering 4G LTE backup khi mất internet</li></ul>',
 4490000, 3990000, 18, 6,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='TP-Link'),
 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=375&fit=crop&q=85',
 1, 0, 4.4, 145),

(N'ASUS RT-BE96U WiFi 7 Router', 'asus-rt-be96u-wifi7',
 N'WiFi 7 Tri-band | 19000 Mbps | 10G + 2.5G WAN | MLO | 12 anten | AiMesh',
 N'<h2>ASUS RT-BE96U – Router WiFi 7 Tiên Phong 19Gbps</h2><p>RT-BE96U là một trong những router WiFi 7 đầu tiên trên thị trường với công nghệ MLO (Multi-Link Operation) ghép nhiều băng tần song song giảm độ trễ xuống dưới 1ms. Tổng băng thông 19Gbps, cổng 10G WAN cho fiber tốc độ cao, hỗ trợ up to 802.11be 320MHz channel width.</p><ul><li>✅ WiFi 7 MLO – ghép băng tần giảm latency dưới 1ms</li><li>✅ 10G + 2.5G WAN – kết nối ISP fiber tốc độ cao</li><li>✅ 19Gbps tổng – không bao giờ nghẽn mạng</li><li>✅ AiMesh compatible – mở rộng mesh không giới hạn</li></ul>',
 12990000, 11490000, 7, 6,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=375&fit=crop&q=85',
 1, 1, 4.6, 312),

(N'Netgear Orbi RBK963S WiFi 6E Mesh', 'netgear-orbi-rbk963s',
 N'WiFi 6E Quad-band | 10.8Gbps | 3-pack | 10G WAN | Phủ 840m² | OLED Display',
 N'<h2>Netgear Orbi RBK963S – Mesh WiFi 6E Premium Cho Nhà Siêu Rộng</h2><p>Orbi RBK963S là hệ thống mesh premium nhất thị trường với router Quad-band – thêm 1 băng tần dedicated backhaul 6GHz giữa các node, loại bỏ hoàn toàn chia sẻ băng thông với client. Màn OLED tích hợp trên router hiển thị tốc độ thực và số thiết bị kết nối.</p><ul><li>✅ Quad-band – backhaul 6GHz dedicated, không chia với client</li><li>✅ OLED display tích hợp – xem stats không cần app</li><li>✅ 10G WAN port – full fiber FTTH 10Gbps</li><li>✅ 3 node phủ 840m² với tốc độ ổn định</li></ul>',
 18990000, 16990000, 5, 6,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Netgear'),
 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 145),

(N'TP-Link TL-SG108PE 8-Port Smart Switch', 'tp-link-tl-sg108pe',
 N'8-Port Gigabit | 4x PoE+ | Quản lý Web | VLAN | QoS | 64W PoE Budget',
 N'<h2>TP-Link TL-SG108PE – Switch Thông Minh Cho Mạng Doanh Nghiệp Nhỏ</h2><p>TL-SG108PE là easy smart switch 8 cổng Gigabit với 4 cổng PoE+ 64W – cấp nguồn cho IP camera, Access Point, VoIP phone không cần dây nguồn riêng. Quản lý qua web browser với VLAN, QoS, port-based bandwidth control cho mạng văn phòng chuyên nghiệp.</p><ul><li>✅ 4x PoE+ 64W tổng – cấp nguồn camera và AP không dây nguồn</li><li>✅ Web GUI quản lý VLAN, QoS chuyên nghiệp</li><li>✅ Vỏ kim loại rack-mountable</li><li>✅ Fanless – hoạt động im lặng trong văn phòng</li></ul>',
 1890000, 1690000, 25, 6,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='TP-Link'),
 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 178),

(N'ASUS ZenWiFi XD6S Dual-Pack', 'asus-zenwifi-xd6s',
 N'WiFi 6 AX5400 | 3 băng tần | 2-pack | Phủ 558m² | AiMesh | AiProtection | Link Aggregation',
 N'<h2>ASUS ZenWiFi XD6S – Mesh WiFi 6 Thiết Kế Tối Giản Đẹp Mắt</h2><p>ZenWiFi XD6S có thiết kế trụ đứng trắng tinh tế phù hợp mọi phong cách nội thất, không bị coi là "thiết bị mạng xấu xí". WiFi 6 AX5400 3 băng tần với AiMesh tự động tối ưu kết nối. Link Aggregation kết hợp 2 cổng LAN thành 2Gbps. AiProtection Pro miễn phí lifetime.</p><ul><li>✅ Thiết kế tối giản đẹp – phù hợp phòng khách</li><li>✅ AiMesh seamless roaming – chuyển node không ngắt kết nối</li><li>✅ Link Aggregation 2Gbps cho NAS</li><li>✅ AiProtection Pro Trend Micro miễn phí</li></ul>',
 3990000, 3590000, 22, 6,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 156);

-- ============================================================
-- 7. LAPTOP GAMING (danh_muc=7) - 8 san pham
-- ============================================================
INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta_ngan, mo_ta, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat, danh_gia_tb, luot_xem) VALUES

(N'ASUS ROG Zephyrus G14 2024', 'asus-rog-zephyrus-g14-2024',
 N'AMD Ryzen 9 8945HS | RTX 4070 8GB | 32GB DDR5 | 1TB | 14" OLED 3K 120Hz | AniMe Matrix',
 N'<h2>ASUS ROG Zephyrus G14 2024 – Gaming Laptop Nhỏ Gọn Nhất Hành Tinh</h2><p>Zephyrus G14 2024 là gaming laptop 14" mạnh nhất thế giới với Ryzen 9 8945HS APU mới và RTX 4070 8GB trong body chỉ 1.65kg. Màn OLED 3K 120Hz BOE panel mang màu sắc sống động sắc nét. AniMe Matrix LED trên nắp máy với độ phân giải cao hơn – tùy chỉnh animation, hiển thị đồng hồ, nhạc.</p><ul><li>✅ OLED 3K 120Hz – màn gaming nhỏ gọn đẹp nhất</li><li>✅ Ryzen 9 8945HS APU – AI processing tích hợp</li><li>✅ AniMe Matrix LED thế hệ mới – animation độ phân giải cao</li><li>✅ 1.65kg – gaming laptop mỏng nhẹ nhất phân khúc RTX 4070</li></ul>',
 36990000, 32990000, 12, 7,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85',
 1, 1, 4.8, 389),

(N'MSI Raider GE78 HX 2024', 'msi-raider-ge78-hx-2024',
 N'Intel Core i9-14900HX | RTX 4090 16GB | 32GB DDR5 | 2TB SSD | 17" QHD+ 240Hz Mini-LED',
 N'<h2>MSI Raider GE78 HX – Gaming Flagship 17" Mini-LED Đỉnh Cao</h2><p>Raider GE78 HX trang bị màn hình Mini-LED 17" QHD+ 240Hz với 1024 vùng dimming cục bộ – chất lượng hình ảnh gaming tốt nhất phân khúc laptop. i9-14900HX 24-nhân + RTX 4090 16GB cho gaming 4K laptop không cần nhượng bộ. CoolerBoost 5 với 2 quạt và 8 heatpipe giữ mát ổn định.</p><ul><li>✅ Mini-LED QHD+ 240Hz 1024 zone – display gaming laptop đỉnh</li><li>✅ RTX 4090 16GB – gaming 4K trên laptop</li><li>✅ CoolerBoost 5 – hệ thống tản nhiệt 8 heatpipe</li><li>✅ Thunderbolt 4, USB4, HDMI 2.1, RJ45 2.5G</li></ul>',
 62990000, 57990000, 5, 7,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='MSI'),
 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=375&fit=crop&q=85',
 1, 1, 4.8, 312),

(N'Lenovo Legion Pro 7i Gen 9', 'lenovo-legion-pro-7i-gen9',
 N'Intel Core i9-14900HX | RTX 4080 12GB | 32GB DDR5 | 1TB SSD | 16" IPS 240Hz | LA Cooling',
 N'<h2>Lenovo Legion Pro 7i Gen 9 – Hiệu Năng/Giá Đỉnh Phân Khúc Gaming</h2><p>Legion Pro 7i Gen 9 được giới review đánh giá là laptop gaming cho hiệu năng tốt nhất trên mỗi VND với i9-14900HX và RTX 4080 12GB cùng hệ thống tản nhiệt Legion AI Engine 2.0 tối ưu tự động. Legion Cold Front 5.0 cooling với buồng hơi lớn nhất phân khúc.</p><ul><li>✅ Tỷ lệ hiệu năng/giá tốt nhất gaming laptop 2024</li><li>✅ Legion AI Engine 2.0 tự động tối ưu</li><li>✅ Cold Front 5.0 – buồng hơi lớn nhất</li><li>✅ Spectrum 6 RGB keyboard per-key</li></ul>',
 52990000, 48990000, 8, 7,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Lenovo'),
 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 312),

(N'Acer Predator Helios 16 2024', 'acer-predator-helios-16-2024',
 N'Intel Core i9-14900HX | RTX 4070 Ti 12GB | 32GB DDR5 | 1TB SSD | 16" Mini-LED 240Hz',
 N'<h2>Acer Predator Helios 16 2024 – Mini-LED Gaming Giá Tốt</h2><p>Predator Helios 16 2024 là laptop gaming đầu tiên của Acer dùng panel Mini-LED ở phân khúc mid-high với 512 vùng dimming, HDR1000. RTX 4070 Ti Super 12GB là GPU mới nhất cho gaming 1440p tối đa hoặc 4K high settings. PredatorSense quản lý hiệu năng và RGB.</p><ul><li>✅ Mini-LED 240Hz 512 zone – display gaming đẹp nhất Acer</li><li>✅ RTX 4070 Ti Super 12GB – GPU mới nhất Acer 2024</li><li>✅ MUX Switch + Advanced Optimus – tự động GPU rời/tích hợp</li><li>✅ Thunderbolt 4, USB-A x3, HDMI 2.1</li></ul>',
 45990000, 42990000, 10, 7,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Acer'),
 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 256),

(N'HP Omen 16 2024 Gaming', 'hp-omen-16-2024-gaming',
 N'Intel Core i7-14700HX | RTX 4070 8GB | 16GB DDR5 | 512GB SSD | 16.1" IPS 165Hz',
 N'<h2>HP Omen 16 2024 – Gaming Phổ Thông Hiệu Năng Cao</h2><p>Omen 16 2024 là điểm entry cho gaming laptop HP với thiết kế tối giản sang trọng, không quá cầu kỳ như Omen Transcend. i7-14700HX 20-nhân + RTX 4070 đảm bảo 1080p/1440p gaming mượt mà. Omen Gaming Hub AI Performance tự tối ưu hiệu năng theo game đang chạy.</p><ul><li>✅ Gaming mạnh giá hợp lý với RTX 4070</li><li>✅ Omen Gaming Hub AI tự tối ưu từng game</li><li>✅ Tempest Cooling – 2 quạt + 5 heatpipe</li><li>✅ Thunderbolt 4, USB-A x3, HDMI 2.1</li></ul>',
 31990000, 28990000, 15, 7,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='HP'),
 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 234),

(N'Dell Alienware m18 R2', 'dell-alienware-m18-r2',
 N'Intel Core i9-14900HX | RTX 4090 16GB | 64GB DDR5 | 2TB SSD | 18" QHD+ 165Hz | Cherry MX',
 N'<h2>Dell Alienware m18 R2 – Quái Vật 18" Với Bàn Phím Cơ</h2><p>Alienware m18 R2 là laptop gaming 18" với tất cả cấu hình mạnh nhất và tính năng cao cấp nhất: bàn phím cơ Cherry MX LP tích hợp, màn QHD+ 165Hz, i9-14900HX + RTX 4090 16GB. Pin 99Wh (lớn nhất laptop gaming) và sạc 240W kép. Alienware Command Center quản lý đầy đủ.</p><ul><li>✅ Bàn phím cơ Cherry MX LP tích hợp trên laptop</li><li>✅ 18" QHD+ 165Hz – màn gaming laptop lớn nhất</li><li>✅ Pin 99Wh dual-charger 240W</li><li>✅ Cherry MX LP + per-key AlienFX RGB</li></ul>',
 72990000, 67990000, 4, 7,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Dell'),
 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 198),

(N'ASUS ROG Flow X16 2024 Gaming', 'asus-rog-flow-x16-2024',
 N'AMD Ryzen 9 8945HS | RTX 4070 8GB | 32GB DDR5 | 1TB SSD | 16" QHD+ 240Hz 2-in-1',
 N'<h2>ASUS ROG Flow X16 2024 – Gaming 2-in-1 Gập 360° Mạnh Nhất</h2><p>ROG Flow X16 là laptop gaming 2-in-1 gập 360° úp màn xuống làm tablet – unique trong phân khúc gaming. Màn QHD+ 240Hz nebula HDR, Ryzen 9 8945HS và RTX 4070 cho gaming đỉnh trong body mỏng nhẹ. ROG XG Mobile external GPU box tùy chọn nâng cấp GPU không cần thay laptop.</p><ul><li>✅ Gaming 2-in-1 gập 360° – tablet + laptop gaming</li><li>✅ ROG XG Mobile eGPU support – docking GPU ngoài</li><li>✅ QHD+ 240Hz Nebula HDR display</li><li>✅ Cảm ứng màn 10 điểm, kèm stylus</li></ul>',
 48990000, 44990000, 7, 7,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 234),

(N'MSI Stealth 16 AI Studio 2024', 'msi-stealth-16-ai-studio',
 N'Intel Core Ultra 9 185H | RTX 4070 8GB | 32GB DDR5 | 1TB SSD | 16" OLED 4K 60Hz | 1.99kg',
 N'<h2>MSI Stealth 16 AI Studio – Gaming + Sáng Tạo Siêu Mỏng</h2><p>Stealth 16 AI Studio chạm đến cái không thể: RTX 4070 trong body 1.99kg chỉ dày 19mm. Chip Intel Core Ultra 9 185H với NPU Meteor Lake hỗ trợ AI inference bản địa. Màn OLED 4K 60Hz với DCI-P3 100% – chuẩn sáng tạo nội dung. AI Performance giải trí gaming mạnh và make content chất lượng studio.</p><ul><li>✅ 1.99kg + 19mm – gaming laptop siêu mỏng RTX 4070</li><li>✅ OLED 4K DCI-P3 100% – chuẩn studio creator</li><li>✅ Intel NPU Core Ultra – AI bản địa</li><li>✅ Thunderbolt 4, USB4, HDMI 2.1</li></ul>',
 39990000, 36990000, 8, 7,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='MSI'),
 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 267);

-- ============================================================
-- 8. LAPTOP VAN PHONG (danh_muc=8) - 8 san pham
-- ============================================================
INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta_ngan, mo_ta, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat, danh_gia_tb, luot_xem) VALUES

(N'Dell Latitude 7450 Business Laptop', 'dell-latitude-7450',
 N'Intel Core Ultra 7 165U | 16GB LPDDR5X | 512GB SSD | 14" FHD+ 1920x1200 | vPro | 1.17kg',
 N'<h2>Dell Latitude 7450 – Business Laptop AI vPro Nhẹ Nhất Dell</h2><p>Latitude 7450 là laptop doanh nhân đỉnh cao của Dell với Intel Core Ultra 7 vPro và NPU AI để tăng tốc tác vụ hội nghị, phân tích dữ liệu. Nặng chỉ 1.17kg, mỏng 16.58mm với nhôm carbon fiber. Dell Optimizer AI tự học thói quen dùng máy tối ưu hiệu suất và pin cá nhân hóa.</p><ul><li>✅ Intel vPro – bảo mật và quản lý từ xa cấp doanh nghiệp</li><li>✅ 1.17kg – nhẹ nhất dòng Latitude 14"</li><li>✅ Dell Optimizer AI học thói quen dùng máy</li><li>✅ MIL-STD-810H, Thunderbolt 4 x2, USB-A x2</li></ul>',
 30990000, 28990000, 12, 8,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Dell'),
 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 189),

(N'HP EliteBook 840 G11', 'hp-elitebook-840-g11',
 N'Intel Core Ultra 7 165U | 32GB LPDDR5X | 1TB SSD | 14" WUXGA IPS Sure View | HP Wolf Security',
 N'<h2>HP EliteBook 840 G11 – Bảo Mật Tối Đa Cho Doanh Nghiệp</h2><p>EliteBook 840 G11 là laptop doanh nhân bảo mật toàn diện nhất của HP với Sure View Reflect chống nhìn trộm kích hoạt bằng nút bấm, HP Wolf Security on-chip với Endpoint Security Controller riêng biệt. Intel Core Ultra với AI Assist cải thiện chất lượng cuộc họp video tự động.</p><ul><li>✅ HP Sure View – màn chống nhìn trộm kích hoạt 1 phím</li><li>✅ HP Wolf Security – Endpoint Security Controller riêng</li><li>✅ Intel Core Ultra 7 + HP AI Assist</li><li>✅ MIL-STD-810H 19 bài test, LTE 4G tùy chọn</li></ul>',
 28990000, 26990000, 15, 8,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='HP'),
 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 167),

(N'Lenovo ThinkPad E16 Gen 2 AMD', 'lenovo-thinkpad-e16-gen2-amd',
 N'AMD Ryzen 7 8845HS | 16GB DDR5 | 512GB SSD | 16" WUXGA IPS | Phù hợp SMB | Giá học sinh',
 N'<h2>Lenovo ThinkPad E16 Gen 2 – ThinkPad Giá Tốt Cho SMB</h2><p>ThinkPad E16 Gen 2 mang di sản ThinkPad (bàn phím tuyệt vời + độ bền) đến phân khúc giá mềm hơn với AMD Ryzen 7 8845HS APU mạnh mẽ. Màn 16" WUXGA 300 nits cho không gian làm việc rộng, pin 57Wh cho khoảng 10 giờ thực tế. Lý tưởng cho sinh viên và doanh nghiệp nhỏ.</p><ul><li>✅ Bàn phím ThinkPad nổi tiếng gõ thoải mái</li><li>✅ Ryzen 7 8845HS – đa nhiệm văn phòng mạnh mẽ</li><li>✅ Màn 16" WUXGA rộng – ít phải cuộn trang</li><li>✅ Giá tốt nhất trong dòng ThinkPad</li></ul>',
 19990000, 18490000, 20, 8,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Lenovo'),
 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=375&fit=crop&q=85',
 1, 0, 4.4, 234),

(N'ASUS ExpertBook B9 OLED Business', 'asus-expertbook-b9-oled',
 N'Intel Core Ultra 7 165U | 32GB LPDDR5X | 1TB SSD | 14" OLED 2.8K 120Hz | 0.99kg | MIL-STD',
 N'<h2>ASUS ExpertBook B9 OLED – Laptop Business Nhẹ Nhất Thế Giới</h2><p>ExpertBook B9 OLED phá kỷ lục laptop business dưới 1kg với chỉ 990g. Vật liệu CFRP (carbon fiber reinforced polymer) độc quyền ASUS vừa nhẹ vừa đạt chuẩn MIL-STD-810H 12 bài kiểm tra. Màn OLED 2.8K 120Hz ASUS Lumina OLED với OLED Care bảo vệ mắt trong môi trường văn phòng.</p><ul><li>✅ 990g – laptop business nhẹ nhất thế giới dưới 1kg</li><li>✅ OLED 2.8K 120Hz – làm việc trên màn đẹp nhất</li><li>✅ CFRP carbon fiber + MIL-STD-810H 12 bài</li><li>✅ NumberPad 2.0 số ẩn trên touchpad</li></ul>',
 34990000, 32990000, 10, 8,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 278),

(N'Acer TravelMate P6 TMP614', 'acer-travelmate-p6-tmp614',
 N'Intel Core Ultra 7 165U | 16GB LPDDR5 | 512GB SSD | 14" WQXGA IPS | LTE | 1.1kg',
 N'<h2>Acer TravelMate P6 – Business Mỏng Nhẹ Kết Nối 4G LTE</h2><p>TravelMate P6 là laptop business của Acer hướng đến người hay di chuyển với module 4G LTE/5G tích hợp kết nối mọi lúc. Nặng 1.1kg với vỏ nhôm-magiê, màn WQXGA (2560x1600) 16:10 rộng hơn. Project VeroShield bảo vệ khoảng riêng tư và Acer Purified.Voice khử tiếng ồn họp video.</p><ul><li>✅ 4G LTE/5G tích hợp – kết nối mọi lúc không cần wifi</li><li>✅ 14" WQXGA 16:10 – màn rộng năng suất cao</li><li>✅ 1.1kg nhôm-magiê bền và nhẹ</li><li>✅ Purified.Voice AI – khử tiếng ồn họp video</li></ul>',
 22990000, 20990000, 14, 8,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Acer'),
 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=375&fit=crop&q=85',
 1, 0, 4.4, 145),

(N'Samsung Galaxy Book4 Pro 14', 'samsung-galaxy-book4-pro-14',
 N'Intel Core Ultra 7 155H | 16GB LPDDR5X | 512GB SSD | 14" Dynamic AMOLED 2X 2.8K 120Hz | 1.23kg',
 N'<h2>Samsung Galaxy Book4 Pro 14 – Siêu Mỏng AMOLED Cho Doanh Nhân</h2><p>Galaxy Book4 Pro 14 kết hợp màn Dynamic AMOLED 2X 2.8K 120Hz sắc nét trong body chỉ 11.5mm và 1.23kg. Galaxy AI đầy đủ: Chat Assist, Browsing Assist dịch và tóm tắt web, Transcript Assist ghi biên bản cuộc họp tự động. Kết nối seamless với Galaxy Phone và Tab.</p><ul><li>✅ AMOLED 2.8K 120Hz – màn business đẹp nhất</li><li>✅ Galaxy AI toàn diện – trợ lý văn phòng thông minh</li><li>✅ 11.5mm mỏng nhất Galaxy Book</li><li>✅ Quick Share + Phone Link với Galaxy Phone siền liền</li></ul>',
 28990000, 26990000, 12, 8,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Samsung'),
 'https://images.unsplash.com/photo-1611186871525-c71db68aa29e?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 198),

(N'HP Dragonfly G4 Business', 'hp-dragonfly-g4',
 N'Intel Core i7-1365U vPro | 32GB LPDDR5 | 1TB SSD | 13.5" 3K2K OLED Sure View | 960g',
 N'<h2>HP Dragonfly G4 – Business Flagship Nhẹ Nhất HP</h2><p>HP Dragonfly G4 là laptop business cao cấp nhất HP với màn OLED 3K2K (3000×2000) tỷ lệ 3:2 và Sure View Reflect chống nhìn trộm. 960g – nhẹ nhất trong lịch sử HP dành cho business. HP AI Noise Cancellation và World Facing Camera phát hiện người đứng sau tự tắt màn.</p><ul><li>✅ 960g – nhẹ nhất lịch sử HP business</li><li>✅ OLED 3K2K 3:2 + Sure View chống nhìn trộm</li><li>✅ World Facing Camera – phát hiện người đứng sau</li><li>✅ HP Wolf Security + Intel vPro cấp enterprise</li></ul>',
 42990000, 39990000, 7, 8,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='HP'),
 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 189),

(N'Lenovo IdeaPad Slim 5 Pro 16', 'lenovo-ideapad-slim5-pro-16',
 N'AMD Ryzen 7 8845HS | 16GB LPDDR5X | 512GB SSD | 16" 2.5K IPS 120Hz | 1.79kg | Giá tốt',
 N'<h2>Lenovo IdeaPad Slim 5 Pro 16 – Đa Năng Giá Vừa Sức</h2><p>IdeaPad Slim 5 Pro 16 mang màn 2.5K 16" rộng rãi với Ryzen 7 8845HS APU mạnh cho cả văn phòng lẫn sáng tạo nhẹ. Thiết kế nhôm nhẹ 1.79kg với sạc USB-C 65W tiện lợi mang đi. Lý tưởng cho học sinh, sinh viên và nhân viên văn phòng cần laptop toàn diện giá phải chăng.</p><ul><li>✅ 2.5K 16" 120Hz – màn rộng nhất phân khúc giá</li><li>✅ Ryzen 7 8845HS – APU mới nhất AMD cho SMB</li><li>✅ Sạc USB-C 65W – dùng chung sạc phone, iPad</li><li>✅ Giá tốt nhất cho cấu hình 2.5K + Ryzen 7</li></ul>',
 17990000, 15990000, 22, 8,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Lenovo'),
 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=375&fit=crop&q=85',
 1, 0, 4.4, 312);

-- ============================================================
-- 9. LAPTOP DO HOA (danh_muc=9) - 6 san pham
-- ============================================================
INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta_ngan, mo_ta, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat, danh_gia_tb, luot_xem) VALUES

(N'Apple MacBook Pro 14 M3 Pro', 'apple-macbook-pro-14-m3-pro',
 N'Apple M3 Pro 12-core CPU | 18-core GPU | 18GB RAM | 1TB SSD | 14.2" Liquid Retina XDR 120Hz',
 N'<h2>Apple MacBook Pro 14" M3 Pro – Đỉnh Cao Nhỏ Gọn Cho Sáng Tạo</h2><p>MacBook Pro 14" M3 Pro mang hiệu năng GPU 18-core và 18GB Unified Memory trong body 1.55kg mỏng nhỏ. Màn Liquid Retina XDR 3024×1964 ProMotion 120Hz với 1600 nits HDR – chuẩn chỉnh màu điện ảnh ngay trên laptop. Final Cut Pro, Logic Pro, Xcode tối ưu bản địa cho M3 Pro.</p><ul><li>✅ M3 Pro 12-core CPU +18-core GPU – nhỏ nhưng cực mạnh</li><li>✅ 18GB Unified Memory 150GB/s bandwidth</li><li>✅ XDR 1600 nits Liquid Retina chuẩn điện ảnh</li><li>✅ 22 giờ pin – không cần sạc cả ngày</li></ul>',
 55990000, 52990000, 8, 9,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Apple'),
 'https://images.unsplash.com/photo-1611186871525-c71db68aa29e?w=500&h=375&fit=crop&q=85',
 1, 1, 4.9, 456),

(N'Dell Precision 5690 Mobile Workstation', 'dell-precision-5690',
 N'Intel Core Ultra 9 185H | NVIDIA RTX A2000 12GB | 64GB DDR5 | 1TB SSD | 16" OLED 3.2K 120Hz',
 N'<h2>Dell Precision 5690 – Workstation Di Động Mỏng Nhất Thế Giới</h2><p>Precision 5690 là mobile workstation đẹp nhất và mỏng nhất thế giới với thiết kế tương tự XPS 15 nhưng dùng GPU Quadro RTX A2000 chứng nhận ISV cho SolidWorks, CATIA, Maya. Màn OLED 3.2K 120Hz và Thunderbolt 4 x2 hoàn chỉnh cho creative professional.</p><ul><li>✅ RTX A2000 12GB Quadro – driver ISV chứng nhận</li><li>✅ OLED 3.2K 120Hz DCI-P3 100%</li><li>✅ ISV certified: Autodesk, Siemens, Ansys</li><li>✅ Mỏng nhẹ như XPS – workstation không cồng kềnh</li></ul>',
 62990000, 58990000, 5, 9,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Dell'),
 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 189),

(N'HP ZBook Studio G10 Mobile Workstation', 'hp-zbook-studio-g10',
 N'Intel Core i9-13900H | NVIDIA RTX A2000 12GB | 64GB DDR5 | 2TB SSD | 16" DreamColor 4K OLED',
 N'<h2>HP ZBook Studio G10 – DreamColor 4K OLED Chuẩn Hollywood</h2><p>ZBook Studio G10 được trang bị màn DreamColor 4K OLED độc quyền HP – được Pixar, DreamWorks dùng để xem hình ảnh final trước khi xuất xưởng. Hỗ trợ Dolby Vision và HDR10 thực chiều. RTX A2000 12GB Quadro cho Maya, Houdini, DaVinci Resolve 4K mượt mà.</p><ul><li>✅ DreamColor 4K OLED – chuẩn màn xem phim Hollywood</li><li>✅ Dolby Vision + HDR True Black 600</li><li>✅ HP Z-certified: Autodesk, Adobe, Avid</li><li>✅ HP Wolf Security tích hợp sẵn</li></ul>',
 68990000, 62990000, 4, 9,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='HP'),
 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 156),

(N'ASUS ProArt Studiobook 16 OLED', 'asus-proart-studiobook-16-oled',
 N'Intel Core i9-13980HX | NVIDIA RTX 4070 8GB | 64GB DDR5 | 2TB SSD | 16" OLED 4K 120Hz | ASUS Dial',
 N'<h2>ASUS ProArt Studiobook 16 OLED – Sáng Tạo Toàn Diện Với ASUS Dial</h2><p>ProArt Studiobook 16 OLED được thiết kế cùng Adobe, Blackmagic, Autodesk với màn OLED 4K Pantone Validated và ASUS Dial – núm xoay analog điều chỉnh tham số trong Premiere, Lightroom, Blender chính xác như tay chuyên nghiệp. DisplayHDR TrueBlack 600 cho HDR editing chuẩn xác.</p><ul><li>✅ ASUS Dial – núm analog cho editing chuyên nghiệp</li><li>✅ OLED 4K Pantone Validated + HDR True Black 600</li><li>✅ Certified Adobe, Blackmagic, Autodesk</li><li>✅ OLED Touch 10-điểm với bút stylus tùy chọn</li></ul>',
 52990000, 49990000, 6, 9,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85',
 1, 1, 4.8, 312),

(N'Lenovo ThinkPad P16 Gen 2 AMD', 'lenovo-thinkpad-p16-gen2',
 N'AMD Ryzen 9 PRO 7945HX | NVIDIA RTX A2000 12GB | 64GB ECC DDR5 | 1TB SSD | 16" IPS 2.5K',
 N'<h2>Lenovo ThinkPad P16 Gen 2 – Mobile Workstation AMD Ryzen PRO</h2><p>ThinkPad P16 Gen 2 chọn AMD Ryzen 9 PRO 7945HX thay Intel để tối ưu hiệu năng multi-thread cho simulation và rendering. RAM ECC DDR5 64GB chống lỗi bit đơn. GPU Quadro RTX A2000 chứng nhận ISV. Keyboard MIL-STD ThinkPad thoải mái cho engineer làm việc dài ngày.</p><ul><li>✅ Ryzen 9 PRO 7945HX 16-nhân đa luồng cao</li><li>✅ ECC DDR5 – bảo vệ dữ liệu kỹ thuật/khoa học</li><li>✅ Quadro RTX A2000 12GB ISV Certified</li><li>✅ ThinkPad keyboard huyền thoại + TrackPoint</li></ul>',
 48990000, 45990000, 5, 9,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Lenovo'),
 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 178),

(N'MSI CreatorPro X16 HX Studio', 'msi-creatorpro-x16-hx-studio',
 N'Intel Core i9-14900HX | NVIDIA RTX A2000 12GB | 64GB DDR5 | 2TB SSD | 16" Mini-LED QHD+ 165Hz',
 N'<h2>MSI CreatorPro X16 HX Studio – Workstation Với Mini-LED Gamut</h2><p>CreatorPro X16 kết hợp hiệu năng workstation (RTX A2000 Quadro ISV) với màn Mini-LED QHD+ 165Hz đẹp nhất trong phân khúc mobile workstation. DCI-P3 100%, AdobeRGB 100% và Delta E < 2 factory-calibrated. MSI Center Creator Mode tối ưu hiệu năng cho từng loại tác vụ sáng tạo.</p><ul><li>✅ Mini-LED QHD+ DCI-P3 100% – maker màn workstation đẹp nhất</li><li>✅ RTX A2000 12GB Quadro certified ISV</li><li>✅ MSI Creator Mode – tối ưu render, video, 3D riêng biệt</li><li>✅ Thunderbolt 4, USB4, SD card reader, HDMI 2.1</li></ul>',
 45990000, 42990000, 7, 9,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='MSI'),
 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 156);

-- ============================================================
-- 10. CHUOT & BAN PHIM (danh_muc=10) - 9 san pham moi
-- ============================================================
INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta_ngan, mo_ta, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat, danh_gia_tb, luot_xem) VALUES

(N'Logitech G Pro X Keyboard Wireless', 'logitech-g-pro-x-kb-wireless',
 N'Logitech GX Switch tùy chọn | TKL | LIGHTSPEED 2.4GHz | Bluetooth | Per-key RGB | 40 giờ',
 N'<h2>Logitech G Pro X TKL Wireless – Bàn Phím Pro Player Không Dây</h2><p>G Pro X TKL Wireless được thiết kế cùng các pro player Esports, TKL layout compact cho không gian kê chuột rộng hơn. LIGHTSPEED wireless 1ms không thua có dây, Bluetooth cho văn phòng im lặng. Chọn màu switch GX Brown/Blue/Red theo sở thích. Per-key Chroma RGB.</p><ul><li>✅ Designed with pro Esports players</li><li>✅ Chọn switch GX Brown/Blue/Red – mua kèm đổi dễ</li><li>✅ LIGHTSPEED 1ms không thua có dây</li><li>✅ TKL compact – kê chuột rộng khi gaming</li></ul>',
 3290000, 2990000, 20, 10,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Logitech'),
 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 289),

(N'Corsair K95 RGB Platinum XT', 'corsair-k95-rgb-platinum-xt',
 N'Cherry MX Speedsilver | Full-size | Per-key RGB | 6 Macro Keys | USB Pass-through | Wrist Rest',
 N'<h2>Corsair K95 RGB Platinum XT – Flagship Full-Size Với Macro Keys</h2><p>K95 RGB Platinum XT là bàn phím gaming đầy đủ nhất Corsair với 6 phím macro riêng biệt cực tiện cho MMO, MOBA. Cherry MX Speed Silver với actuate chỉ 1.2mm cho phản xạ gaming cực nhanh. Kèm wrist rest cao su memory foam. iCUE tích hợp Elgato Stream Deck cho streamer.</p><ul><li>✅ 6 phím macro riêng – MMO, MOBA, streaming</li><li>✅ Cherry MX Speed Silver 1.2mm – phản xạ cực nhanh</li><li>✅ Kèm wrist rest memory foam cao cấp</li><li>✅ iCUE + Elgato Stream Deck integration</li></ul>',
 4290000, 3890000, 15, 10,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Corsair'),
 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 198),

(N'SteelSeries Apex Pro Gen 3 Wireless', 'steelseries-apex-pro-gen3-wireless',
 N'OmniPoint 3.0 Adjustable | 2.4GHz + BT | HyperMagnet Switch | OLED | Full-size',
 N'<h2>SteelSeries Apex Pro Gen 3 – Lực Nhấn Siêu Nhanh 0.1mm</h2><p>Apex Pro Gen 3 nâng HyperMagnet switch lên tốc độ actuate chỉ 0.1mm – cực nhạy cho phản xạ gaming tốt nhất. Raptor Mode kích hoạt khi nhấn đúng timing cho lợi thế cạnh tranh. OLED Smart Display thế hệ mới, 2.4GHz wireless không lag.</p><ul><li>✅ OmniPoint 3.0 – actuate 0.1mm nhanh nhất thị trường</li><li>✅ Raptor Mode – timing-based advantage</li><li>✅ OLED Smart Display + 2.4GHz</li><li>✅ Tùy chỉnh lực nhấn từng phím qua SteelSeries GG</li></ul>',
 4590000, 4190000, 12, 10,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='SteelSeries'),
 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 234),

(N'HyperX Alloy Origins Core TKL', 'hyperx-alloy-origins-core-tkl',
 N'HyperX Red Linear | TKL Layout | Per-key RGB | Aluminum Frame | Detachable USB-C',
 N'<h2>HyperX Alloy Origins Core TKL – Cơ Entry Khung Nhôm Tốt Nhất</h2><p>Alloy Origins Core là bàn phím gaming cơ khung nhôm giá tốt nhất phân khúc entry-mid. HyperX Red switch linear mượt mà lý tưởng cho gaming FPS. Cáp USB-C tháo được, du lịch tiện lợi. Per-key RGB với chip xử lý onboard không cần driver chạy.</p><ul><li>✅ Khung nhôm cứng cáp tại mức giá entry</li><li>✅ USB-C detachable – dễ mang theo</li><li>✅ HyperX Red linear – gõ mượt, không click</li><li>✅ Onboard RGB – không cần phần mềm</li></ul>',
 1490000, 1290000, 35, 10,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='HyperX'),
 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 345),

(N'Razer Viper V3 Pro Wireless', 'razer-viper-v3-pro',
 N'Razer Focus Pro 35K DPI | Symmetrical | 54g | HyperSpeed Pro 2.4GHz | Bluetooth | 95 giờ',
 N'<h2>Razer Viper V3 Pro – Chuột Siêu Nhẹ 54g Pro Wireless</h2><p>Viper V3 Pro là chuột nhẹ nhất Razer chỉ 54g với HyperSpeed Pro wireless cải tiến – tốc độ 4× nhanh hơn Bluetooth thông thường. Focus Pro 35K DPI với Smart Tracking tự căn chỉnh theo bề mặt. Không có RGB để giảm trọng lượng và tăng pin 95 giờ.</p><ul><li>✅ 54g nhẹ nhất Razer – mệt mỏi tay tối thiểu</li><li>✅ Không RGB – tối ưu pin 95 giờ</li><li>✅ HyperSpeed Pro 4x nhanh hơn Bluetooth thường</li><li>✅ Symmetrical – thuận tay trái/phải</li></ul>',
 3490000, 3190000, 22, 10,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Razer'),
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',
 1, 1, 4.8, 312),

(N'Logitech G915 TKL Wireless Keyboard', 'logitech-g915-tkl-wireless',
 N'GL Switch (Tactile/Clicky/Linear) | TKL | LIGHTSPEED | Bluetooth | RGB | 40 giờ | Low-profile',
 N'<h2>Logitech G915 TKL – Low-Profile Cơ Gaming Mỏng Nhất</h2><p>G915 TKL là bàn phím gaming cơ không dây mỏng nhất thị trường với GL switch low-profile actuate chỉ 1.5mm – vừa nhanh vừa thoải mái gõ. LIGHTSPEED wireless + Bluetooth. Nhôm premium lướt mát. Lý tưởng cho người muốn bàn phím cơ gaming mà không cồng kềnh.</p><ul><li>✅ Low-profile GL switch – mỏng nhất, thoải mái cổ tay</li><li>✅ LIGHTSPEED 1ms + Bluetooth dual-mode</li><li>✅ Nhôm premium brushed mỏng 22mm</li><li>✅ Tactile/Clicky/Linear tùy chọn</li></ul>',
 3890000, 3490000, 18, 10,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Logitech'),
 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 234),

(N'Corsair Scimitar Elite Wireless MMO Mouse', 'corsair-scimitar-elite-wireless',
 N'18000 DPI | 17 lập trình | Slipstream 2.4GHz + BT | Slide Adjust Side Key | RGB',
 N'<h2>Corsair Scimitar Elite Wireless – 17 Nút Cho MMO/MOBA Không Dây</h2><p>Scimitar Elite là chuột gaming MMO/MOBA không dây với 17 nút có thể lập trình – lý tưởng cho MMORPG, MOBA cần nhiều binding kỹ năng. Hệ thống Key Slider trượt điều chỉnh vị trí 17 nút side về phía sau-trước 8mm theo kích thước ngón cái. SLIPSTREAM wireless không lag.</p><ul><li>✅ 17 nút lập trình – tối ưu MMO/MOBA</li><li>✅ Key Slider điều chỉnh vị trí nút side 8mm</li><li>✅ SLIPSTREAM wireless + Bluetooth</li><li>✅ iCUE tạo macro phức tạp không giới hạn</li></ul>',
 2290000, 1990000, 20, 10,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Corsair'),
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',
 1, 0, 4.4, 167),

(N'SteelSeries Aerox 5 Wireless', 'steelseries-aerox-5-wireless',
 N'TrueMove Air 18K DPI | Honeycomb | 82g | 2.4GHz + BT | IP54 | 9 nút | 80 giờ',
 N'<h2>SteelSeries Aerox 5 Wireless – Honeycomb Nhẹ IP54 Chống Nước</h2><p>Aerox 5 Wireless độc đáo có IP54 chống bụi nước ngay trên chuột honeycomb nhẹ – yên tâm dùng dù đổ nước hay môi trường ẩm. 9 nút lập trình cho MOBA cần nhiều binding, 82g nhẹ cho di chuyển chuột dài ngày. 2.4GHz + Bluetooth dual mode.</p><ul><li>✅ IP54 waterproof – honeycomb chống nước đầu tiên</li><li>✅ 82g honeycomb nhẹ với 9 nút lập trình</li><li>✅ 2.4GHz + Bluetooth</li><li>✅ 80 giờ pin – gần 2 tuần không sạc</li></ul>',
 2090000, 1890000, 25, 10,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='SteelSeries'),
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 198),

(N'HyperX Clutch Gladiate Wired Controller', 'hyperx-clutch-gladiate-wired',
 N'Tay cầm PC/Xbox | Trigger Lock | 3.5mm audio | Braided Cable | Remappable 4 nút',
 N'<h2>HyperX Clutch Gladiate – Tay Cầm Gaming PC/Xbox Cao Cấp</h2><p>Clutch Gladiate là tay cầm gaming có dây cho PC và Xbox với Trigger Locks khóa trigger về hành trình ngắn cho FPS. 4 nút phụ tùy chỉnh trên mặt sau cầm tay thêm binding cho Fortnite, Apex. Jack 3.5mm stereo kết nối tai nghe trực tiếp. Dây bện không rối.</p><ul><li>✅ Trigger Locks – hành trình ngắn cho FPS nhanh hơn</li><li>✅ 4 nút phụ lập trình phía sau tay cầm</li><li>✅ Jack 3.5mm cho tai nghe</li><li>✅ Tương thích PC + Xbox One/Series X|S</li></ul>',
 890000, 790000, 40, 10,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='HyperX'),
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',
 1, 0, 4.4, 178);

-- ============================================================
-- 11. TAI NGHE (danh_muc=11) - 10 san pham
-- ============================================================
INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta_ngan, mo_ta, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat, danh_gia_tb, luot_xem) VALUES

(N'Sony WH-1000XM5 Wireless ANC', 'sony-wh-1000xm5',
 N'ANC hàng đầu thế giới | 30 giờ | Speak-to-Chat | Multipoint | LDAC | Hi-Res Audio',
 N'<h2>Sony WH-1000XM5 – Chống Ồn Số 1 Thế Giới 5 Năm Liên Tiếp</h2><p>WH-1000XM5 tiếp tục dẫn đầu về chống ồn chủ động với 8 micro và 2 chip chuyên dụng V1 + HD Noise Cancelling. Speak-to-Chat tự nhận ra khi bạn nói chuyện để giảm ANC tức thì. LDAC codec cho chất lượng âm thanh Hi-Res Wireless. Tai nghe audiophile di động không đối thủ.</p><ul><li>✅ ANC tốt nhất thị trường – 8 micro, 2 chip V1</li><li>✅ Speak-to-Chat – tự nhận giọng nói giảm ANC</li><li>✅ LDAC Hi-Res Wireless 990kbps</li><li>✅ Multipoint 2 thiết bị cùng lúc</li></ul>',
 8990000, 7990000, 20, 11,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Sony'),
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=375&fit=crop&q=85',
 1, 1, 4.9, 512),

(N'Razer BlackShark V2 Pro 2023', 'razer-blackshark-v2-pro-2023',
 N'Razer Triforce Titanium 50mm | HyperClear SuperWide Mic | 2.4GHz | 70 giờ | THX Spatial',
 N'<h2>Razer BlackShark V2 Pro 2023 – Tai Nghe Gaming Được Pro Esports Tin Dùng</h2><p>BlackShark V2 Pro 2023 là tai nghe gaming không dây được đội tuyển esports chuyên nghiệp sử dụng nhiều nhất. Triforce Titanium driver 50mm cho âm thanh phân tách ba dải (treble/mid/bass) riêng biệt. HyperClear SuperWide cardioid mic lọc tiếng ồn cực tốt. THX Spatial Audio cho âm thanh 3D theo phương hướng chính xác.</p><ul><li>✅ Triforce 50mm driver – bass/mid/treble riêng biệt</li><li>✅ HyperClear SuperWide mic – vocal rõ nhất phân khúc</li><li>✅ THX Spatial Audio – nghe footstep cực chuẩn</li><li>✅ 70 giờ pin – dài nhất gaming wireless</li></ul>',
 4490000, 3990000, 18, 11,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Razer'),
 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 356),

(N'SteelSeries Arctis Nova Pro Wireless', 'steelseries-arctis-nova-pro-wireless',
 N'Hi-Fi Driver | Active Noise Cancellation | 2.4GHz + BT | Dual Battery Hot-Swap | ClearCast',
 N'<h2>SteelSeries Arctis Nova Pro Wireless – Tai Nghe Gaming Hi-Fi Đỉnh</h2><p>Arctis Nova Pro Wireless là tai nghe gaming duy nhất có ANC chủ động + dual battery hot-swap không bao giờ hết pin. Hi-Fi grade driver 40mm + neodymium magnet cho chất lượng âm thanh nghe nhạc thực sự, không phẫu chỉnh cho game. ClearCast bidirectional mic được giải thưởng. GameDAC Gen 2 tích hợp.</p><ul><li>✅ Dual battery hot-swap – không bao giờ hết pin</li><li>✅ ANC grade cao cho tai nghe gaming</li><li>✅ Hi-Fi driver – nghe nhạc và gaming như nhau</li><li>✅ GameDAC Gen 2 tích hợp – DAC 24-bit 96kHz</li></ul>',
 6490000, 5990000, 12, 11,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='SteelSeries'),
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=375&fit=crop&q=85',
 1, 0, 4.8, 289),

(N'HyperX Cloud III Wireless Gaming', 'hyperx-cloud-iii-wireless',
 N'53mm driver góc nghiêng | 2.4GHz | 120 giờ | Beam-forming Mic | Spatial Audio | USB-C',
 N'<h2>HyperX Cloud III Wireless – 120 Giờ Pin Gaming Dài Nhất</h2><p>Cloud III Wireless phá kỷ lục pin gaming wireless với 120 giờ – hơn 2 tuần không cần sạc. Driver 53mm góc nghiêng 10° tối ưu vị trí cho soundstage rộng hơn. Vật liệu memory foam 3 tầng cho đệm tai thoải mái nhất gaming. DTS Headphone:X Spatial Audio.</p><ul><li>✅ 120 giờ pin – kỷ lục gaming wireless</li><li>✅ 53mm driver góc nghiêng 10° – soundstage rộng</li><li>✅ Memory foam 3 tầng – đeo lâu không mỏi</li><li>✅ USB-C sạc, DTS Spatial Audio</li></ul>',
 3290000, 2990000, 22, 11,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='HyperX'),
 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=375&fit=crop&q=85',
 1, 0, 4.7, 312),

(N'Logitech G733 Lightspeed Wireless', 'logitech-g733-lightspeed',
 N'Pro-G 40mm driver | LIGHTSPEED 2.4GHz | 29 giờ | Colorful Design | Blue VO!CE Mic | RGB',
 N'<h2>Logitech G733 – Gaming Wireless Phong Cách Màu Sắc</h2><p>G733 nổi bật với 5 màu sắc trẻ trung (trắng, đen, xanh, tím, đỏ) phù hợp gaming aesthetic cá nhân. LIGHTSPEED 2.4GHz wireless chuẩn esports, Blue VO!CE mic với equalizer realtime. Thiết kế headband đàn thun không cần điều chỉnh tự co giãn với đầu. Front-facing RGB mặt trước.</p><ul><li>✅ 5 màu sắc cá nhân – thể hiện phong cách gaming</li><li>✅ Headband đàn thun – tự vừa mọi đầu</li><li>✅ Blue VO!CE mic equalizer realtime</li><li>✅ Front-facing RGB – đẹp khi stream</li></ul>',
 3590000, 3290000, 16, 11,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Logitech'),
 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 234),

(N'JBL Quantum 910 Wireless ANC', 'jbl-quantum-910-wireless',
 N'JBL 50mm driver | Active ANC | JBL QuantumSURROUND | 2.4GHz + BT | 34 giờ | 3D Audio',
 N'<h2>JBL Quantum 910 Wireless – Surround Sound Gaming Tốt Nhất JBL</h2><p>Quantum 910 là flagship gaming wireless JBL với JBL QuantumSURROUND Engine phân tích audio và tạo không gian âm thanh 3D chính xác hơn Dolby Atmos cho game. ANC chủ động giảm tiếng ồn phòng ngủ. 2.4GHz + Bluetooth cho PC gaming và mobile/console.</p><ul><li>✅ JBL QuantumSURROUND – 3D gaming audio chuẩn xác</li><li>✅ ANC chủ động – yên tĩnh tuyệt đối khi gaming</li><li>✅ 2.4GHz cho PC + Bluetooth cho console/mobile</li><li>✅ Head-tracking – âm thanh theo chuyển động đầu</li></ul>',
 3090000, 2790000, 18, 11,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='JBL'),
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 198),

(N'Sony WF-1000XM5 True Wireless', 'sony-wf-1000xm5-tws',
 N'ANC tốt nhất TWS | LDAC | Multipoint | 36 giờ tổng | IPX4 | Speak-to-Chat | 8.4mm driver',
 N'<h2>Sony WF-1000XM5 – True Wireless ANC Số 1 Thế Giới</h2><p>WF-1000XM5 là earphone true wireless có ANC tốt nhất thị trường với chip V2 mới nhỏ hơn 25% so với XM4. Driver 8.4mm tuy nhỏ hơn nhưng LDAC 990kbps Hi-Res Wireless cho chất lượng âm thanh không kém. Speak-to-Chat, multipoint 2 thiết bị, IPX4.</p><ul><li>✅ ANC số 1 true wireless – yên tĩnh tuyệt đối</li><li>✅ LDAC Hi-Res Wireless 990kbps</li><li>✅ Speak-to-Chat – nhận giọng nói tự tắt ANC</li><li>✅ 36 giờ tổng (8h earbuds + 28h case)</li></ul>',
 6490000, 5990000, 15, 11,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Sony'),
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=375&fit=crop&q=85',
 1, 1, 4.8, 389),

(N'ASUS ROG Delta S Wireless', 'asus-rog-delta-s-wireless',
 N'AI Beamforming Mic | 4-driver ESS Quad DAC | 2.4GHz + BT + 3.5+USB | 25 giờ | RGB',
 N'<h2>ASUS ROG Delta S Wireless – 4 Driver Quad DAC Chất Lượng Hi-Fi</h2><p>ROG Delta S Wireless là tai nghe gaming duy nhất dùng ESS Quad DAC 4 driver (2 cho tai) với chip ESS chip giống audiophile headphone đắt tiền. AI Beamforming Mic 3 chiều lọc tiếng ồn xung quanh giữ giọng nói sạch. Kết nối 4-way: 2.4GHz, Bluetooth, USB, 3.5mm.</p><ul><li>✅ ESS Quad DAC 4 driver – chất lượng Hi-Fi audiophile</li><li>✅ AI Beamforming Mic 3-chiều</li><li>✅ 4-way connectivity: 2.4GHz + BT + USB + 3.5mm</li><li>✅ ROG Armoury Crate EQ + spatial audio</li></ul>',
 3590000, 3290000, 14, 11,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='ASUS'),
 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 198),

(N'Samsung Galaxy Buds3 Pro', 'samsung-galaxy-buds3-pro',
 N'360 Audio | ANC nâng cao | LSAAC Codec | IPX7 | Galaxy AI | Blade Antenna Design',
 N'<h2>Samsung Galaxy Buds3 Pro – True Wireless Flagship Galaxy AI</h2><p>Galaxy Buds3 Pro có thiết kế Blade antenna mới lạ với stick thoải mái hơn hình elip cũ. Galaxy AI tích hợp dịch trực tiếp cuộc trò chuyện qua tai nghe, nhận dạng ngữ cảnh tắt/bật ANC tự động. LSAAC codec độc quyền Samsung Hi-Fi, 360 Audio spatial cùng Galaxy Phone.</p><ul><li>✅ Galaxy AI: dịch live qua tai nghe, ANC thông minh</li><li>✅ LSAAC Hi-Fi codec độc quyền</li><li>✅ IPX7 chống nước cả dưới nước</li><li>✅ 360 Audio với head-tracking trên Galaxy Phone</li></ul>',
 4990000, 4490000, 18, 11,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Samsung'),
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 267),

(N'Razer Kaira Pro HyperSpeed Wireless', 'razer-kaira-pro-hyperspeed',
 N'50mm driver | HyperSpeed 2.4GHz | Bluetooth | 40 giờ | Triforce Titanium | Xbox + PlayStation',
 N'<h2>Razer Kaira Pro – Gaming Wireless Đa Nền Tảng Xbox + PS</h2><p>Kaira Pro HyperSpeed là tai nghe gaming không dây đa nền tảng: HyperSpeed 2.4GHz cho PC và Xbox, Bluetooth cho PS5 và mobile. Triforce Titanium 50mm driver 3-tầng cho âm thanh gaming 3D rõ ràng. Tương thích Razer Audio app trên iOS và Android cho EQ custom.</p><ul><li>✅ Đa nền tảng: PC + Xbox (2.4GHz) + PS5 + Mobile (BT)</li><li>✅ Triforce 50mm 3-tầng driver</li><li>✅ 40 giờ pin không lag với HyperSpeed</li><li>✅ Razer Audio app EQ trên phone</li></ul>',
 2790000, 2490000, 20, 11,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Razer'),
 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 189);

-- ============================================================
-- 12. O CUNG & RAM (danh_muc=12) - 8 san pham moi
-- ============================================================
INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta_ngan, mo_ta, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat, danh_gia_tb, luot_xem) VALUES

(N'WD Black SN850X 2TB NVMe SSD', 'wd-black-sn850x-2tb',
 N'NVMe PCIe 4.0 | 7300/6600 MB/s | 2TB | Game Mode 2.0 | PS5 Compatible | 5 năm bảo hành',
 N'<h2>WD Black SN850X 2TB – SSD Gaming Tối Ưu Cho PC Và PS5</h2><p>WD Black SN850X là SSD Gen 4 tối ưu đặc biệt cho gaming với Game Mode 2.0 tự động nhận dạng game và tối ưu cache + foreground access để giảm load time. Tốc độ 7300MB/s đọc đáp ứng PS5 Extended Storage và PC gaming cao cấp. WD Black Dashboard health monitoring.</p><ul><li>✅ Game Mode 2.0 – tối ưu cache riêng cho gaming</li><li>✅ 7300/6600 MB/s – top tier Gen 4</li><li>✅ PS5 Extended Storage chứng nhận chính thức</li><li>✅ Bảo hành 5 năm WD</li></ul>',
 4590000, 4290000, 30, 12,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='WD'),
 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 312),

(N'Seagate FireCuda 530 2TB NVMe', 'seagate-firecuda-530-2tb',
 N'NVMe PCIe 4.0 | 7300/6900 MB/s | 2TB | 1275 TBW | PS5 Compatible | Rescue Recovery 3 năm',
 N'<h2>Seagate FireCuda 530 – NVMe Bền Bỉ Nhất Với 1275 TBW</h2><p>FireCuda 530 có TBW 1275TB – bền nhất trong phân khúc SSD Gen 4, hơn 50% so với đối thủ. Tốc độ đọc 7300MB/s tương đương Samsung 990 Pro nhưng TBW vượt trội. Seagate Rescue Data Recovery bảo vệ dữ liệu 3 năm – nếu SSD hỏng, Seagate phục hồi dữ liệu miễn phí.</p><ul><li>✅ 1275 TBW – bền bỉ nhất phân khúc SSD Gen 4</li><li>✅ Seagate Rescue Data Recovery 3 năm</li><li>✅ 7300/6900 MB/s – hiệu năng đỉnh</li><li>✅ Heatsink tùy chọn cắm trực tiếp</li></ul>',
 4190000, 3890000, 25, 12,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Seagate'),
 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 234),

(N'Corsair MP600 Pro XT 2TB Hydro X', 'corsair-mp600-pro-xt-2tb',
 N'NVMe PCIe 4.0 | 7100/6800 MB/s | 2TB | Kèm Heatsink đồng | 1400 TBW',
 N'<h2>Corsair MP600 Pro XT – SSD Gen 4 Kèm Heatsink Đồng Sang</h2><p>MP600 Pro XT kèm heatsink đồng nguyên khối ngay trong hộp – giảm nhiệt độ SSD 20°C so với không heatsink, giữ hiệu năng ổn định khi đọc ghi liên tục. TBW 1400TB vượt trội. iCUE monitoring tích hợp hiển thị nhiệt độ SSD realtime trong phần mềm Corsair.</p><ul><li>✅ Heatsink đồng kèm hộp – nhiệt độ giảm 20°C</li><li>✅ 1400 TBW – bền nhất Corsair</li><li>✅ iCUE health monitoring realtime</li><li>✅ 7100/6800 MB/s Gen 4</li></ul>',
 3890000, 3590000, 20, 12,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Corsair'),
 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 178),

(N'Crucial P5 Plus 2TB NVMe SSD', 'crucial-p5-plus-2tb',
 N'NVMe PCIe 4.0 | 6600/5000 MB/s | 2TB | Kèm Heatsink | Micron NAND | 5 năm',
 N'<h2>Crucial P5 Plus 2TB – Gen 4 Giá Hợp Lý Nhất Từ Micron</h2><p>P5 Plus của Crucial (thương hiệu Micron) dùng NAND chính hãng Micron – cùng nhà sản xuất chip flash cho cả Crucial và nhiều SSD cao cấp khác. Giá cạnh tranh nhất phân khúc Gen 4 2TB với tốc độ 6600MB/s đọc đủ cho mọi tác vụ. Bảo hành 5 năm từ Crucial.</p><ul><li>✅ Micron NAND bản địa – đáng tin cậy nhất</li><li>✅ Gen 4 giá tốt nhất phân khúc</li><li>✅ 5 năm bảo hành Crucial</li><li>✅ Kèm heatsink nhôm nhỏ gọn</li></ul>',
 3490000, 3190000, 35, 12,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Crucial'),
 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 189),

(N'G.Skill Trident Z5 RGB DDR5 32GB 6400MHz', 'gskill-trident-z5-rgb-ddr5-32gb',
 N'DDR5 6400MHz | 32GB (2×16GB) | CL32 | XMP 3.0 | RGB | Heatspreader nhôm cao cấp',
 N'<h2>G.Skill Trident Z5 RGB – RAM DDR5 Cao Cấp Nhất Cho Overclock</h2><p>Trident Z5 RGB là dòng RAM flagship của G.Skill với tốc độ 6400MHz và CL32 – timing tốt nhất trong phân khúc 6400MHz. Heatspreader nhôm 5 vùng với dải phát sáng RGB Trident Z ở giữa đồng bộ iCUE/AURA/RGB Fusion. Được cộng đồng overclock ưa chuộng nhất.</p><ul><li>✅ DDR5 6400MHz CL32 – timing tốt nhất phân khúc</li><li>✅ RGB 5 vùng Trident Z đặc trưng đẹp</li><li>✅ XMP 3.0 + EXPO – OC 1-click</li><li>✅ Thương hiệu OC huyền thoại G.Skill</li></ul>',
 4190000, 3890000, 22, 12,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='G.Skill'),
 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=500&h=375&fit=crop&q=85',
 1, 1, 4.7, 267),

(N'Corsair Vengeance DDR5 32GB 6000MHz RGB', 'corsair-vengeance-ddr5-32gb',
 N'DDR5 6000MHz | 32GB (2×16GB) | CL36 | XMP 3.0 | iCUE RGB | Tương thích Intel + AMD',
 N'<h2>Corsair Vengeance DDR5 RGB – DDR5 6000MHz Lý Tưởng Overclock</h2><p>Vengeance DDR5 6000MHz là sweet spot tốc độ/timing cho Intel 13/14th Gen và AMD Ryzen 7000 – đây là điểm OC hiệu quả nhất trên majority mainboard cao cấp. iCUE RGB đồng bộ với toàn bộ ecosystem Corsair. Tản nhiệt aluminum heatspreader mỏng cho tương thích tốt cooler lớn.</p><ul><li>✅ 6000MHz CL36 – sweet spot OC cho Intel/AMD</li><li>✅ iCUE RGB đồng bộ ecosystem Corsair</li><li>✅ Heatspreader mỏng – tương thích cooler lớn</li><li>✅ XMP 3.0 + EXPO auto detection</li></ul>',
 3690000, 3390000, 28, 12,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Corsair'),
 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=500&h=375&fit=crop&q=85',
 1, 0, 4.6, 198),

(N'WD Blue 4TB HDD Desktop', 'wd-blue-4tb-hdd',
 N'4TB | 5400 RPM | 256MB Cache | SATA 6Gb/s | 3.5" | SMR | Bảo hành 2 năm | Giá tốt nhất/GB',
 N'<h2>WD Blue 4TB – Ổ Cứng Cơ Giá Rẻ Nhất/GB Dung Lượng Lớn</h2><p>WD Blue 4TB là lựa chọn tốt nhất khi cần dung lượng lưu trữ lớn giá phải chăng – backup dữ liệu, lưu trữ game, kho phim chất lượng cao. 256MB cache giảm fragmentation. Phù hợp lắp vào NAS, PC thứ 2, external enclosure. WD Western Digital branding đáng tin cậy 40 năm.</p><ul><li>✅ Giá/GB tốt nhất – kinh tế nhất cho lưu trữ lớn</li><li>✅ 256MB cache giảm phân mảnh</li><li>✅ Phù hợp NAS, PC secondary, media storage</li><li>✅ 40 năm Western Digital brand tin cậy</li></ul>',
 2490000, 2290000, 40, 12,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='WD'),
 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=375&fit=crop&q=85',
 1, 0, 4.4, 156),

(N'Seagate Barracuda Pro 8TB HDD', 'seagate-barracuda-pro-8tb',
 N'8TB | 7200 RPM | 256MB Cache | SATA 6Gb/s | 3.5" | 5 năm bảo hành | Rescue 3 năm',
 N'<h2>Seagate Barracuda Pro 8TB – HDD 7200RPM Lớn Nhất Cho Workstation</h2><p>Barracuda Pro 8TB là HDD desktop dung lượng lớn nhất với tốc độ xoay 7200RPM cao nhất phân khúc consumer – đọc ghi nhanh hơn 5400RPM, phù hợp chỉnh video 4K, raid array, workstation. 5 năm bảo hành và Seagate Rescue Data Recovery 3 năm miễn phí.</p><ul><li>✅ 8TB lớn nhất + 7200RPM nhanh nhất consumer HDD</li><li>✅ 5 năm bảo hành – lâu nhất phân khúc</li><li>✅ Seagate Rescue 3 năm phục hồi dữ liệu</li><li>✅ Phù hợp RAID, workstation, NAS hiệu năng cao</li></ul>',
 4990000, NULL, 20, 12,
 (SELECT ma_thuong_hieu FROM thuong_hieu WHERE ten_thuong_hieu='Seagate'),
 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=375&fit=crop&q=85',
 1, 0, 4.5, 189);

-- ============================================================
-- THEM THONG SO KY THUAT CHO CAC SAN PHAM MOI (chon loc 1 so loai)
-- ============================================================

-- Smartphones specs (chon dai dien)
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-galaxy-s24-ultra'), N'CPU', N'Snapdragon 8 Gen 3 for Galaxy (4nm)', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-galaxy-s24-ultra'), N'RAM', N'12', 'GB', 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-galaxy-s24-ultra'), N'Bộ nhớ trong', N'256GB (UFS 4.0)', NULL, 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-galaxy-s24-ultra'), N'Màn hình', N'6.8" Dynamic AMOLED 2X, QHD+ 3088x1440, 120Hz Adaptive, 2600 nits', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-galaxy-s24-ultra'), N'Camera sau', N'200MP (wide) + 50MP (5x periscope) + 10MP (3x) + 12MP (ultrawide)', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-galaxy-s24-ultra'), N'Camera trước', N'12MP', NULL, 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-galaxy-s24-ultra'), N'Pin', N'5000mAh, sạc 45W, không dây 15W, ngược 4.5W', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-galaxy-s24-ultra'), N'Kết nối', N'5G, WiFi 7, Bluetooth 5.3, NFC, USB-C 3.2', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-galaxy-s24-ultra'), N'Chống nước', N'IP68 (2m/30 phút)', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='samsung-galaxy-s24-ultra'), N'Kích thước', N'162.3 x 79 x 8.6mm, 232g, khung Titanium', NULL, 10);

INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-iphone-15-pro-max'), N'CPU', N'Apple A17 Pro (3nm) – 6-core, GPU 6-core', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-iphone-15-pro-max'), N'RAM', N'8', 'GB', 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-iphone-15-pro-max'), N'Bộ nhớ trong', N'256GB (tùy chọn 512GB, 1TB)', NULL, 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-iphone-15-pro-max'), N'Màn hình', N'6.7" Super Retina XDR OLED, 2796x1290, ProMotion 1-120Hz, 2000 nits', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-iphone-15-pro-max'), N'Camera sau', N'48MP main (f/1.78) + 12MP ultrawide + 12MP 5x periscope Tetraprism', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-iphone-15-pro-max'), N'Camera trước', N'12MP TrueDepth, EIS', NULL, 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-iphone-15-pro-max'), N'Pin', N'4422mAh, MagSafe 15W, sạc nhanh 27W', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-iphone-15-pro-max'), N'Kết nối', N'5G, WiFi 6E, Bluetooth 5.3, NFC, USB-C (USB 3) 10Gbps', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-iphone-15-pro-max'), N'Chống nước', N'IP68 (6m/30 phút)', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='apple-iphone-15-pro-max'), N'Kích thước', N'159.9 x 76.7 x 8.25mm, 221g, khung Titanium Grade 5', NULL, 10);

-- PC Desktop specs
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-gt35'), N'CPU', N'Intel Core i9-14900K (24 nhân, tới 6.0GHz)', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-gt35'), N'GPU', N'NVIDIA GeForce RTX 4090 24GB GDDR6X', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-gt35'), N'RAM', N'64GB DDR5 6000MHz (4 khe, tối đa 128GB)', 'GB', 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-gt35'), N'Ổ cứng', N'2TB NVMe PCIe 4.0 + 2TB HDD', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-gt35'), N'Tản nhiệt', N'360mm AIO Liquid Cooling, 3×120mm fan', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-gt35'), N'Nguồn', N'1000W 80+ Gold Certified', 'W', 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-gt35'), N'Kết nối', N'WiFi 6E, Bluetooth 5.3, 2.5G Ethernet', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-gt35'), N'Cổng', N'Thunderbolt 4, USB4, USB-A x6, HDMI 2.1, DP 1.4', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-gt35'), N'Hệ điều hành', N'Windows 11 Home', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-strix-gt35'), N'Kích thước', N'217 x 514 x 478mm, 22kg', NULL, 10);

-- Monitor specs (dai dien)
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-swift-pg27uqr'), N'Kích thước', N'27', 'inch', 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-swift-pg27uqr'), N'Độ phân giải', N'3840×2160 (4K UHD)', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-swift-pg27uqr'), N'Tần số quét', N'160', 'Hz', 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-swift-pg27uqr'), N'Tấm nền', N'Fast IPS', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-swift-pg27uqr'), N'Thời gian phản hồi', N'1 (GTG)', 'ms', 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-swift-pg27uqr'), N'HDR', N'HDR600, 576 local dimming zones', NULL, 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-swift-pg27uqr'), N'Màu sắc', N'DCI-P3 90%, sRGB 130%', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-swift-pg27uqr'), N'Tương thích', N'G-Sync Ultimate', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-swift-pg27uqr'), N'Cổng kết nối', N'HDMI 2.1 x2, DisplayPort 1.4, USB Hub 3.0 x3', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-rog-swift-pg27uqr'), N'Tính năng', N'G-Sync Ultimate, Aim Point, Shadow Boost, ROG Strix lighting', NULL, 10);

-- Tai nghe specs (dai dien)
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='sony-wh-1000xm5'), N'Loại', N'Over-ear, đóng kín', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='sony-wh-1000xm5'), N'Driver', N'30mm, dome Carbon Fiber Composite', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='sony-wh-1000xm5'), N'Đáp ứng tần số', N'4Hz – 40kHz (LDAC)', NULL, 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='sony-wh-1000xm5'), N'Codec', N'LDAC, AAC, SBC (Hi-Res Audio Wireless)', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='sony-wh-1000xm5'), N'ANC', N'8 micro, 2 chip V1 + HD Noise Cancelling Processor QN1', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='sony-wh-1000xm5'), N'Kết nối', N'Bluetooth 5.2, NFC, 3.5mm jack', NULL, 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='sony-wh-1000xm5'), N'Pin', N'30 giờ (ANC on), 40 giờ (ANC off), sạc USB-C', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='sony-wh-1000xm5'), N'Thiết bị kết nối đồng thời', N'2 (Multipoint)', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='sony-wh-1000xm5'), N'Trọng lượng', N'250', 'g', 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='sony-wh-1000xm5'), N'Tính năng', N'Speak-to-Chat, DSEE Extreme, Adaptive Sound Control', NULL, 10);

-- SSD specs (dai dien)
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='wd-black-sn850x-2tb'), N'Dung lượng', N'2', 'TB', 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='wd-black-sn850x-2tb'), N'Giao tiếp', N'NVMe PCIe Gen4 x4', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='wd-black-sn850x-2tb'), N'Form factor', N'M.2 2280', NULL, 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='wd-black-sn850x-2tb'), N'Tốc độ đọc tuần tự', N'7300', 'MB/s', 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='wd-black-sn850x-2tb'), N'Tốc độ ghi tuần tự', N'6600', 'MB/s', 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='wd-black-sn850x-2tb'), N'IOPS đọc ngẫu nhiên', N'1.200.000', 'IOPS', 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='wd-black-sn850x-2tb'), N'IOPS ghi ngẫu nhiên', N'1.100.000', 'IOPS', 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='wd-black-sn850x-2tb'), N'Tính năng đặc biệt', N'Game Mode 2.0, PS5 Compatible', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='wd-black-sn850x-2tb'), N'Độ bền TBW', N'1200', 'TBW', 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='wd-black-sn850x-2tb'), N'Bảo hành', N'5 năm', NULL, 10);

-- RAM specs (dai dien)
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='gskill-trident-z5-rgb-ddr5-32gb'), N'Dung lượng', N'32GB (2×16GB kit)', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='gskill-trident-z5-rgb-ddr5-32gb'), N'Loại RAM', N'DDR5', NULL, 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='gskill-trident-z5-rgb-ddr5-32gb'), N'Tốc độ', N'6400', 'MHz', 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='gskill-trident-z5-rgb-ddr5-32gb'), N'Latency', N'CL32-39-39-102', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='gskill-trident-z5-rgb-ddr5-32gb'), N'Điện áp', N'1.4', 'V', 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='gskill-trident-z5-rgb-ddr5-32gb'), N'OC Profile', N'Intel XMP 3.0', NULL, 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='gskill-trident-z5-rgb-ddr5-32gb'), N'Tương thích', N'Intel 12/13/14th Gen (LGA1700/LGA1851)', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='gskill-trident-z5-rgb-ddr5-32gb'), N'Tản nhiệt', N'Aluminum heatspreader 5-zone với RGB dải giữa', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='gskill-trident-z5-rgb-ddr5-32gb'), N'Tính năng', N'On-Die ECC, Power Management IC tích hợp', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='gskill-trident-z5-rgb-ddr5-32gb'), N'Bảo hành', N'Lifetime (Vĩnh viễn)', NULL, 10);

-- Network gear specs
INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-zenwifi-pro-et12'), N'Chuẩn WiFi', N'WiFi 6E (802.11ax) Tri-band', NULL, 1),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-zenwifi-pro-et12'), N'Tốc độ tối đa', N'11000 (4×2400+2×1148)', 'Mbps', 2),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-zenwifi-pro-et12'), N'Băng tần', N'2.4GHz + 5GHz + 6GHz', NULL, 3),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-zenwifi-pro-et12'), N'Anten', N'12 anten nội (4T4R mỗi băng)', NULL, 4),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-zenwifi-pro-et12'), N'CPU', N'Quad-core 2.2GHz', NULL, 5),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-zenwifi-pro-et12'), N'Cổng', N'2.5G WAN x1, 2.5G LAN x2, USB 3.0 x1', NULL, 6),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-zenwifi-pro-et12'), N'Phủ sóng', N'830m² với 3 node', NULL, 7),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-zenwifi-pro-et12'), N'Số thiết bị', N'Lên tới 100+ thiết bị', NULL, 8),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-zenwifi-pro-et12'), N'Tính năng', N'AiMesh, AiProtection Pro, OFDMA, MU-MIMO', NULL, 9),
  ((SELECT ma_san_pham FROM san_pham WHERE duong_dan='asus-zenwifi-pro-et12'), N'Bảo mật', N'AiProtection Pro (Trend Micro) miễn phí', NULL, 10);

-- ============================================================
-- XAC NHAN KET QUA
-- ============================================================
SELECT dm.ten_danh_muc,
       COUNT(sp.ma_san_pham) AS so_san_pham
FROM danh_muc dm
LEFT JOIN san_pham sp ON dm.ma_danh_muc = sp.ma_danh_muc AND sp.trang_thai = 1
GROUP BY dm.ma_danh_muc, dm.ten_danh_muc
ORDER BY dm.thu_tu;

SELECT COUNT(*) AS tong_san_pham FROM san_pham;
SELECT COUNT(*) AS tong_thuong_hieu FROM thuong_hieu;
