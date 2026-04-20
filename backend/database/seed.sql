-- ============================================================
-- SEED SQL - Du lieu mau cho htqlch_thietbi_cn
-- Charset: utf8mb4 | Du lieu hien thi: Tieng Viet co dau
-- Import: mysql -u root --execute="SOURCE path/to/seed.sql"
-- ============================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER SET utf8mb4;
SET character_set_connection = utf8mb4;

USE htqlch_thietbi_cn;

-- Tat kiem tra khoa ngoai de truncate
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- XOA DU LIEU CU
-- ============================================================
TRUNCATE TABLE thong_bao;
TRUNCATE TABLE lich_su_voucher;
TRUNCATE TABLE yeu_cau_bao_hanh;
TRUNCATE TABLE yeu_thich;
TRUNCATE TABLE danh_gia;
TRUNCATE TABLE chi_tiet_don_hang;
TRUNCATE TABLE don_hang;
TRUNCATE TABLE chi_tiet_gio_hang;
TRUNCATE TABLE gio_hang;
TRUNCATE TABLE lich_su_kho;
TRUNCATE TABLE thong_so_ky_thuat;
TRUNCATE TABLE anh_san_pham;
TRUNCATE TABLE san_pham;
TRUNCATE TABLE ma_giam_gia;
TRUNCATE TABLE danh_muc;
TRUNCATE TABLE thuong_hieu;
TRUNCATE TABLE nguoi_dung;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- NGUOI DUNG (password: 'password' - hash bcrypt)
-- ============================================================
INSERT INTO nguoi_dung
  (ho_ten, ten, ho, email, mat_khau_ma_hoa, vai_tro, so_dien_thoai, diem_tich_luy, trang_thai)
VALUES
  (N'Quản trị viên', N'Admin', N'Quản trị', 'admin@techstore.vn',
   '$2a$10$hQjljPowvrxVMN0Edol/pO807sopnQr5mKSAzLJKjwoTb0LTm8LWG', 'admin', '0901000001', 0, 1),
  (N'Nhân viên Kỹ thuật', N'Kỹ thuật', N'Nhân viên', 'staff@techstore.vn',
   '$2a$10$hQjljPowvrxVMN0Edol/pO807sopnQr5mKSAzLJKjwoTb0LTm8LWG', 'staff', '0901000002', 0, 1),
  (N'Nguyễn Văn An', N'An', N'Nguyễn', 'nguyenvan.an@example.com',
   '$2a$10$hQjljPowvrxVMN0Edol/pO807sopnQr5mKSAzLJKjwoTb0LTm8LWG', 'user', '0912345678', 150, 1),
  (N'Trần Thị Bình', N'Bình', N'Trần', 'tranthi.binh@example.com',
   '$2a$10$hQjljPowvrxVMN0Edol/pO807sopnQr5mKSAzLJKjwoTb0LTm8LWG', 'user', '0923456789', 80, 1),
  (N'Lê Văn Cường', N'Cường', N'Lê', 'levan.cuong@example.com',
   '$2a$10$hQjljPowvrxVMN0Edol/pO807sopnQr5mKSAzLJKjwoTb0LTm8LWG', 'user', '0934567890', 200, 1);

-- ============================================================
-- DANH MUC SAN PHAM
-- ============================================================
INSERT INTO danh_muc (ten_danh_muc, duong_dan, mo_ta, trang_thai, thu_tu) VALUES
  (N'Laptop',              'laptop',           N'Máy tính xách tay các loại',               1,  1),
  (N'Điện thoại',          'dien-thoai',       N'Điện thoại thông minh',                    1,  2),
  (N'PC & Máy tính bàn',   'pc-may-tinh-ban',  N'Máy tính để bàn và linh kiện',             1,  3),
  (N'Màn hình',            'man-hinh',         N'Màn hình máy tính các loại',               1,  4),
  (N'Phụ kiện',            'phu-kien',         N'Phụ kiện công nghệ',                       1,  5),
  (N'Thiết bị mạng',       'thiet-bi-mang',    N'Router, switch, modem',                    1,  6),
  (N'Laptop Gaming',       'laptop-gaming',    N'Laptop chuyên game hiệu năng cao',         1,  7),
  (N'Laptop Văn phòng',    'laptop-van-phong', N'Laptop mỏng nhẹ cho công việc văn phòng',  1,  8),
  (N'Laptop Đồ họa',       'laptop-do-hoa',    N'Laptop cho thiết kế đồ họa 3D',            1,  9),
  (N'Chuột & Bàn phím',    'chuot-ban-phim',   N'Chuột và bàn phím gaming / văn phòng',     1, 10),
  (N'Tai nghe',            'tai-nghe',         N'Tai nghe gaming và thông thường',           1, 11),
  (N'Ổ cứng & RAM',        'o-cung-ram',       N'SSD, HDD, RAM máy tính',                   1, 12);

-- ============================================================
-- THUONG HIEU
-- ============================================================
INSERT INTO thuong_hieu (ten_thuong_hieu, duong_dan, quoc_gia, trang_thai) VALUES
  ('ASUS',     'asus',     N'Đài Loan',    1),
  ('MSI',      'msi',      N'Đài Loan',    1),
  ('Dell',     'dell',     N'Mỹ',          1),
  ('HP',       'hp',       N'Mỹ',          1),
  ('Lenovo',   'lenovo',   N'Trung Quốc',  1),
  ('Apple',    'apple',    N'Mỹ',          1),
  ('Samsung',  'samsung',  N'Hàn Quốc',    1),
  ('LG',       'lg',       N'Hàn Quốc',    1),
  ('Logitech', 'logitech', N'Thụy Sĩ',     1),
  ('Razer',    'razer',    N'Mỹ',          1),
  ('Kingston', 'kingston', N'Mỹ',          1);

-- ============================================================
-- SAN PHAM
-- ============================================================
INSERT INTO san_pham
  (ten_san_pham, duong_dan, mo_ta_ngan, gia_goc, gia_khuyen_mai,
   so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, trang_thai, noi_bat)
VALUES
  (N'ASUS ROG Strix G16 Gaming Laptop 2024',
   'asus-rog-strix-g16-2024',
   N'Intel i9-14900HX | RTX 4080 12GB | 32GB DDR5 | 1TB NVMe | 16" 240Hz QHD+',
   45990000, 42990000, 15, 1, 1,
   'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85',
   1, 1),

  (N'MSI Titan GT77 Gaming',
   'msi-titan-gt77-gaming',
   N'Intel i9-13980HX | RTX 4090 16GB | 64GB DDR5 | 17.3" 4K 120Hz',
   79990000, 74990000, 8, 1, 2,
   'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=375&fit=crop&q=85',
   1, 1),

  (N'Dell XPS 15 9530',
   'dell-xps-15-9530',
   N'Intel i7-13700H | RTX 4060 8GB | 16GB LPDDR5 | 15.6" OLED 3.5K 120Hz',
   38990000, NULL, 20, 1, 3,
   'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=375&fit=crop&q=85',
   1, 0),

  (N'HP Envy 16 Laptop 2024',
   'hp-envy-16-2024',
   N'Intel i7-13700H | RTX 4060 8GB | 32GB DDR5 | 16" OLED 2.5K 120Hz',
   32990000, 29990000, 12, 1, 4,
   'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&h=375&fit=crop&q=85',
   1, 1),

  (N'Lenovo ThinkPad X1 Carbon Gen 11',
   'lenovo-thinkpad-x1-carbon-gen11',
   N'Intel Core i7-1365U EVO | 32GB LPDDR5 | 14" IPS 2.8K | Chỉ 1.12kg',
   34990000, 31990000, 10, 1, 5,
   'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=375&fit=crop&q=85',
   1, 0),

  (N'Apple MacBook Pro 16 inch M3 Max',
   'apple-macbook-pro-16-m3-max',
   N'Apple M3 Max 16-core CPU | 40-core GPU | 36GB RAM | 1TB SSD | 16.2" Liquid Retina XDR 120Hz',
   89990000, NULL, 7, 1, 6,
   'https://images.unsplash.com/photo-1611186871525-c71db68aa29e?w=500&h=375&fit=crop&q=85',
   1, 1),

  (N'Samsung Odyssey G7 32" Curved',
   'samsung-odyssey-g7-32-curved',
   N'32" 4K QLED | 144Hz | 1ms | Cong 1000R | HDR600 | DisplayPort 1.4',
   14990000, 12990000, 25, 4, 7,
   'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=375&fit=crop&q=85',
   1, 1),

  (N'LG UltraWide 34" IPS',
   'lg-ultrawide-34-ips',
   N'34" 3440x1440 UWQHD | IPS 144Hz | sRGB 99% | USB-C 96W | HDR10',
   12490000, 10990000, 18, 4, 8,
   'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&h=375&fit=crop&q=85',
   1, 0),

  (N'Logitech MX Master 3S',
   'logitech-mx-master-3s',
   N'Im lặng 90% | 8000 DPI | Bluetooth & USB | Pin 70 ngày | Ergonomic',
   2290000, 1990000, 50, 5, 9,
   'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',
   1, 1),

  (N'Razer BlackWidow V4 Pro',
   'razer-blackwidow-v4-pro',
   N'Razer Yellow V3 Clicky | RGB Chroma | Wireless 2.4GHz | Full-size',
   4990000, 4490000, 30, 10, 10,
   'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=375&fit=crop&q=85',
   1, 0),

  (N'Samsung 990 Pro SSD 2TB NVMe',
   'samsung-990-pro-ssd-2tb',
   N'NVMe PCIe 4.0 | 7.450 MB/s Read | 2TB | Bảo hành 5 năm',
   3890000, 3490000, 40, 12, 7,
   'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=375&fit=crop&q=85',
   1, 1),

  (N'Kingston Fury Beast DDR5 32GB Kit',
   'kingston-fury-beast-ddr5-32gb',
   N'DDR5 6000MHz | 32GB (2x16GB) | XMP 3.0 | Intel 12/13/14th & AMD Ryzen 7000',
   3290000, NULL, 35, 12, 11,
   'https://images.unsplash.com/photo-1562408590-e32931084e23?w=500&h=375&fit=crop&q=85',
   1, 0);

-- ============================================================
-- MA GIAM GIA (VOUCHER)
-- ============================================================
INSERT INTO ma_giam_gia
  (ma_code, ten_voucher, mo_ta, loai_giam, gia_tri_giam, giam_toi_da,
   don_hang_toi_thieu, so_lan_toi_da, gioi_han_moi_nguoi, trang_thai,
   ngay_bat_dau, ngay_het_han)
VALUES
  ('WELCOME10',
   N'Chào mừng thành viên mới',
   N'Giảm 10% cho lần mua đầu tiên, tối đa 500.000đ',
   'percent', 10.00, 500000, 1000000, 100, 1, 1,
   '2024-01-01 00:00:00', '2099-12-31 23:59:59'),

  ('SALE20',
   N'Flash Sale 20%',
   N'Giảm 20% tối đa 2 triệu cho đơn từ 5 triệu',
   'percent', 20.00, 2000000, 5000000, 50, 1, 1,
   '2024-01-01 00:00:00', '2099-12-31 23:59:59'),

  ('FREESHIP',
   N'Miễn phí vận chuyển',
   N'Giảm phí ship 50.000đ cho mọi đơn hàng',
   'fixed_amount', 50000, NULL, 0, 200, 3, 1,
   '2024-01-01 00:00:00', '2099-12-31 23:59:59'),

  ('VIP500K',
   N'Ưu đãi VIP 500K',
   N'Giảm thẳng 500.000đ cho đơn hàng từ 10 triệu',
   'fixed_amount', 500000, NULL, 10000000, 30, 1, 1,
   '2024-01-01 00:00:00', '2099-12-31 23:59:59');

-- ============================================================
-- TAO GIO HANG CHO TUNG USER
-- ============================================================
INSERT INTO gio_hang (ma_nguoi_dung) VALUES (1),(2),(3),(4),(5);

-- ============================================================
-- CAP NHAT THONG KE SAN PHAM
-- ============================================================
UPDATE san_pham SET danh_gia_tb=4.8, luot_xem=342 WHERE duong_dan='asus-rog-strix-g16-2024';
UPDATE san_pham SET danh_gia_tb=4.9, luot_xem=215 WHERE duong_dan='msi-titan-gt77-gaming';
UPDATE san_pham SET danh_gia_tb=4.6, luot_xem=289 WHERE duong_dan='dell-xps-15-9530';
UPDATE san_pham SET danh_gia_tb=4.7, luot_xem=198 WHERE duong_dan='hp-envy-16-2024';
UPDATE san_pham SET danh_gia_tb=4.8, luot_xem=156 WHERE duong_dan='lenovo-thinkpad-x1-carbon-gen11';
UPDATE san_pham SET danh_gia_tb=4.9, luot_xem=412 WHERE duong_dan='apple-macbook-pro-16-m3-max';
UPDATE san_pham SET danh_gia_tb=4.7, luot_xem=178 WHERE duong_dan='samsung-odyssey-g7-32-curved';
UPDATE san_pham SET danh_gia_tb=4.5, luot_xem=134 WHERE duong_dan='lg-ultrawide-34-ips';
UPDATE san_pham SET danh_gia_tb=4.6, luot_xem=267 WHERE duong_dan='logitech-mx-master-3s';
UPDATE san_pham SET danh_gia_tb=4.4, luot_xem=89  WHERE duong_dan='razer-blackwidow-v4-pro';
UPDATE san_pham SET danh_gia_tb=4.8, luot_xem=301 WHERE duong_dan='samsung-990-pro-ssd-2tb';
UPDATE san_pham SET danh_gia_tb=4.5, luot_xem=112 WHERE duong_dan='kingston-fury-beast-ddr5-32gb';

SELECT CONCAT('✅ Import hoan thanh! ', COUNT(*), ' san pham da duoc them.') AS ket_qua FROM san_pham;
