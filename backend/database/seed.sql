-- ============================================================
-- SEED DATA - Du lieu mau
-- Chay sau schema.sql
-- ============================================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

USE htqlch_thietbi_cn;

-- ============================================================
-- USERS (password: 'Admin@123' -> bcrypt hash)
-- ============================================================
INSERT INTO users (name, email, password_hash, role, phone, address, loyalty_points) VALUES
('Quáº£n trá»‹ viÃªn', 'admin@techstore.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '0901234567', 'TP. Há»“ ChÃ­ Minh', 0),
('NhÃ¢n viÃªn A', 'staff@techstore.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', '0902345678', 'TP. Há»“ ChÃ­ Minh', 0),
('Nguyá»…n VÄƒn An', 'user@techstore.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '0903456789', '123 LÃ½ ThÆ°á»ng Kiá»‡t, Q.10, TP.HCM', 150),
('Tráº§n Thá»‹ BÃ¬nh', 'binh@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '0904567890', '456 Nguyá»…n TrÃ£i, Q.5, TP.HCM', 80),
('LÃª VÄƒn CÆ°á»ng', 'cuong@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '0905678901', '789 VÃµ VÄƒn Táº§n, Q.3, TP.HCM', 200);

-- Note: password hash trÃªn lÃ  bcrypt cá»§a 'password' (dÃ¹ng cho test)
-- Trong production, dÃ¹ng: Admin@123 cho admin, Ä‘á»•i hash tÆ°Æ¡ng á»©ng

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, description, image_url, parent_id, sort_order) VALUES
-- Danh muc cha
('Laptop', 'laptop', 'MÃ¡y tÃ­nh xÃ¡ch tay cÃ¡c loáº¡i', '/uploads/categories/laptop.jpg', NULL, 1),
('Äiá»‡n thoáº¡i', 'dien-thoai', 'Äiá»‡n thoáº¡i thÃ´ng minh', '/uploads/categories/phone.jpg', NULL, 2),
('PC & MÃ¡y tÃ­nh bÃ n', 'pc-may-tinh-ban', 'MÃ¡y tÃ­nh Ä‘á»ƒ bÃ n vÃ  linh kiá»‡n', '/uploads/categories/pc.jpg', NULL, 3),
('MÃ n hÃ¬nh', 'man-hinh', 'MÃ n hÃ¬nh mÃ¡y tÃ­nh cÃ¡c loáº¡i', '/uploads/categories/monitor.jpg', NULL, 4),
('Phá»¥ kiá»‡n', 'phu-kien', 'Phá»¥ kiá»‡n cÃ´ng nghá»‡', '/uploads/categories/accessories.jpg', NULL, 5),
('Thiáº¿t bá»‹ máº¡ng', 'thiet-bi-mang', 'Router, switch, modem', '/uploads/categories/network.jpg', NULL, 6),
-- Danh muc con Laptop
('Laptop Gaming', 'laptop-gaming', 'Laptop chuyÃªn game hiá»‡u nÄƒng cao', '/uploads/categories/laptop-gaming.jpg', 1, 1),
('Laptop VÄƒn phÃ²ng', 'laptop-van-phong', 'Laptop má»ng nháº¹ cho cÃ´ng viá»‡c', '/uploads/categories/laptop-office.jpg', 1, 2),
('Laptop Äá»“ há»a', 'laptop-do-hoa', 'Laptop cho thiáº¿t káº¿ Ä‘á»“ há»a', '/uploads/categories/laptop-graphic.jpg', 1, 3),
-- Danh muc con Phu kien
('Chuá»™t & BÃ n phÃ­m', 'chuot-ban-phim', 'Chuá»™t vÃ  bÃ n phÃ­m gaming/vÄƒn phÃ²ng', NULL, 5, 1),
('Tai nghe', 'tai-nghe', 'Tai nghe gaming vÃ  thÃ´ng thÆ°á»ng', NULL, 5, 2),
('á»” cá»©ng & RAM', 'o-cung-ram', 'SSD, HDD, RAM mÃ¡y tÃ­nh', NULL, 5, 3);

-- ============================================================
-- BRANDS
-- ============================================================
INSERT INTO brands (name, slug, logo_url, country) VALUES
('ASUS', 'asus', '/uploads/brands/asus.png', 'ÄÃ i Loan'),
('MSI', 'msi', '/uploads/brands/msi.png', 'ÄÃ i Loan'),
('Dell', 'dell', '/uploads/brands/dell.png', 'Má»¹'),
('HP', 'hp', '/uploads/brands/hp.png', 'Má»¹'),
('Lenovo', 'lenovo', '/uploads/brands/lenovo.png', 'Trung Quá»‘c'),
('Apple', 'apple', '/uploads/brands/apple.png', 'Má»¹'),
('Samsung', 'samsung', '/uploads/brands/samsung.png', 'HÃ n Quá»‘c'),
('LG', 'lg', '/uploads/brands/lg.png', 'HÃ n Quá»‘c'),
('Logitech', 'logitech', '/uploads/brands/logitech.png', 'Thá»¥y SÄ©'),
('Razer', 'razer', '/uploads/brands/razer.png', 'Má»¹'),
('Acer', 'acer', '/uploads/brands/acer.png', 'ÄÃ i Loan'),
('Gigabyte', 'gigabyte', '/uploads/brands/gigabyte.png', 'ÄÃ i Loan'),
('Kingston', 'kingston', '/uploads/brands/kingston.png', 'Má»¹');

-- ============================================================
-- PRODUCTS
-- ============================================================
INSERT INTO products (name, slug, description, short_desc, price, sale_price, stock_quantity, min_stock_alert, category_id, brand_id, thumbnail, is_active, is_featured) VALUES
-- Laptop Gaming
('ASUS ROG Strix G16 Gaming Laptop 2024', 'asus-rog-strix-g16-2024',
 'Laptop gaming cao cáº¥p ASUS ROG Strix G16 trang bá»‹ Intel Core i9-14900HX, RTX 4080 12GB, mÃ n hÃ¬nh 16" QHD+ 240Hz. Hiá»‡u nÄƒng vÆ°á»£t trá»™i vá»›i há»‡ thá»‘ng táº£n nhiá»‡t Tri-Fan ROG. BÃ n phÃ­m cÆ¡ ROG tÃ­ch há»£p RGB per-key Aura Sync.',
 'Intel i9-14900HX | RTX 4080 12GB | 32GB DDR5 | 1TB NVMe | 16" 240Hz QHD+',
 45990000, 42990000, 15, 3, 7, 1, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85', 1, 1),

('MSI Titan GT77 Gaming', 'msi-titan-gt77',
 'MSI Titan GT77 HX - laptop gaming Ä‘á»‰nh cao vá»›i Core i9, RTX 4090, mÃ n hÃ¬nh 17.3" 4K 120Hz.',
 'Intel i9-13980HX | RTX 4090 | 64GB RAM | 17.3" 4K',
 69990000, NULL, 8, 2, 7, 2, '/uploads/products/msi-titan-gt77.jpg', 1, 1),

('Dell XPS 15 9530', 'dell-xps-15-9530',
 'Dell XPS 15 thiáº¿t káº¿ siÃªu má»ng, mÃ n hÃ¬nh OLED 3.5K 120Hz, chip Intel Core i7 tháº¿ há»‡ 13.',
 'Intel i7-13700H | RTX 4060 | 16GB | 15.6" OLED 3.5K',
 38990000, 35990000, 20, 5, 7, 3, '/uploads/products/dell-xps-15.jpg', 1, 1),

('HP Envy 16 Laptop 2024', 'hp-envy-16-2024',
 'HP Envy 16 vá»›i Core i7 tháº¿ há»‡ 13, mÃ n hÃ¬nh 2.5K 120Hz, pin 6 tiáº¿ng, thiáº¿t káº¿ sang trá»ng.',
 'Intel i7-13700H | 16GB RAM | 16" 2.5K 120Hz',
 28990000, 26990000, 25, 5, 8, 4, '/uploads/products/hp-envy-16.jpg', 1, 0),

('Lenovo ThinkPad X1 Carbon Gen 11', 'lenovo-thinkpad-x1-carbon-gen11',
 'ThinkPad X1 Carbon - laptop doanh nhÃ¢n siÃªu nháº¹ chá»‰ 1.12kg, Core i7, báº£o máº­t vÃ¢n tay + khuÃ´n máº·t.',
 'Intel i7-1365U | 16GB | 14" IPS | Chá»‰ 1.12kg',
 32990000, NULL, 18, 5, 8, 5, '/uploads/products/thinkpad-x1.jpg', 1, 0),

('Apple MacBook Pro 16" M3 Max', 'macbook-pro-16-m3-max',
 'MacBook Pro 16" chip M3 Max, hiá»‡u nÄƒng Ä‘á»‰nh cao cho láº­p trÃ¬nh vÃ  Ä‘á»“ há»a. Pin lÃªn Ä‘áº¿n 22 giá».',
 'Apple M3 Max | 36GB RAM | 16" Liquid Retina XDR',
 89990000, NULL, 10, 2, 9, 6, '/uploads/products/macbook-pro-m3.jpg', 1, 1),

-- Man hinh
('Samsung Odyssey G7 32" Curved', 'samsung-odyssey-g7-32',
 'MÃ n hÃ¬nh cong gaming 32" 4K 144Hz, HDR600, cÃ´ng nghá»‡ QLED siÃªu sáº¯c nÃ©t.',
 '32" 4K QLED | 144Hz | Cong 1000R | HDR600',
 15990000, 13990000, 30, 5, 4, 7, '/uploads/products/odyssey-g7.jpg', 1, 1),

('LG UltraWide 34" IPS', 'lg-ultrawide-34-ips',
 'MÃ n hÃ¬nh UltraWide 34" 21:9, IPS 144Hz, sRGB 99%, lÃ½ tÆ°á»Ÿng cho Ä‘á»“ há»a vÃ  lÃ m viá»‡c Ä‘a nhiá»‡m.',
 '34" UltraWide 21:9 | IPS 144Hz | sRGB 99%',
 9990000, 8990000, 22, 5, 4, 8, '/uploads/products/lg-ultrawide.jpg', 1, 0),

-- Phu kien
('Logitech G Pro X Superlight 2', 'logitech-g-pro-x-superlight-2',
 'Chuá»™t gaming khÃ´ng dÃ¢y siÃªu nháº¹ 60g, cáº£m biáº¿n HERO 2 25K DPI, pin 95 giá».',
 'KhÃ´ng dÃ¢y | 60g | HERO 2 25K DPI | 95h pin',
 2890000, 2590000, 50, 10, 10, 9, '/uploads/products/gpro-superlight2.jpg', 1, 1),

('Razer BlackWidow V4 Pro', 'razer-blackwidow-v4-pro',
 'BÃ n phÃ­m cÆ¡ gaming Razer vá»›i switch Green V3, RGB Chroma, káº¿t ná»‘i khÃ´ng dÃ¢y vÃ  cÃ³ dÃ¢y.',
 'Razer Green V3 | RGB Chroma | Wireless | Full-size',
 4290000, NULL, 35, 8, 10, 10, '/uploads/products/blackwidow-v4.jpg', 1, 0),

('Samsung 990 Pro SSD 2TB NVMe', 'samsung-990-pro-2tb-nvme',
 'SSD NVMe PCIe 4.0 tá»‘c Ä‘á»™ Ä‘á»c 7,450 MB/s, báº£o hÃ nh 5 nÄƒm, lÃ½ tÆ°á»Ÿng cho gaming vÃ  content creation.',
 'NVMe PCIe 4.0 | 7,450 MB/s | 2TB | BH 5 nÄƒm',
 2490000, 2190000, 60, 10, 12, 7, '/uploads/products/samsung-990pro.jpg', 1, 1),

('Kingston Fury Beast DDR5 32GB Kit', 'kingston-fury-beast-ddr5-32gb',
 'RAM DDR5 32GB (2x16GB) tá»‘c Ä‘á»™ 6000MHz, táº£n nhiá»‡t tháº¥p, XMP 3.0, tÆ°Æ¡ng thÃ­ch Intel 12/13/14th gen.',
 'DDR5 6000MHz | 32GB Kit | XMP 3.0 | Táº£n nhiá»‡t tháº¥p',
 1890000, NULL, 45, 10, 12, 13, '/uploads/products/kingston-fury-ddr5.jpg', 1, 0);

-- ============================================================
-- PRODUCT SPECS
-- ============================================================
INSERT INTO product_specs (product_id, spec_name, spec_value, unit, sort_order) VALUES
-- ASUS ROG Strix G16 (id=1)
(1, 'CPU', 'Intel Core i9-14900HX', NULL, 1),
(1, 'GPU', 'NVIDIA GeForce RTX 4080 12GB GDDR6', NULL, 2),
(1, 'RAM', '32GB DDR5 4800MHz', NULL, 3),
(1, 'á»” cá»©ng', '1TB NVMe PCIe 4.0 SSD', NULL, 4),
(1, 'MÃ n hÃ¬nh', '16" QHD+ 240Hz IPS Anti-glare', NULL, 5),
(1, 'Pin', '90Wh, sáº¡c 240W', NULL, 6),
(1, 'Trá»ng lÆ°á»£ng', '2.5', 'kg', 7),
(1, 'Há»‡ Ä‘iá»u hÃ nh', 'Windows 11 Home', NULL, 8),
-- MSI Titan GT77 (id=2)
(2, 'CPU', 'Intel Core i9-13980HX', NULL, 1),
(2, 'GPU', 'NVIDIA GeForce RTX 4090 16GB GDDR6', NULL, 2),
(2, 'RAM', '64GB DDR5 4800MHz', NULL, 3),
(2, 'á»” cá»©ng', '2x 2TB NVMe PCIe 4.0', NULL, 4),
(2, 'MÃ n hÃ¬nh', '17.3" 4K UHD 120Hz IPS-Level', NULL, 5),
(2, 'Pin', '99.9Wh, sáº¡c 330W', NULL, 6),
(2, 'Trá»ng lÆ°á»£ng', '3.1', 'kg', 7),
-- Dell XPS 15 (id=3)
(3, 'CPU', 'Intel Core i7-13700H', NULL, 1),
(3, 'GPU', 'NVIDIA RTX 4060 8GB GDDR6', NULL, 2),
(3, 'RAM', '16GB LPDDR5 5200MHz', NULL, 3),
(3, 'á»” cá»©ng', '512GB NVMe PCIe 4.0', NULL, 4),
(3, 'MÃ n hÃ¬nh', '15.6" OLED 3.5K 120Hz', NULL, 5),
(3, 'Trá»ng lÆ°á»£ng', '1.86', 'kg', 6),
-- MacBook Pro M3 Max (id=6)
(6, 'CPU', 'Apple M3 Max (16-core CPU)', NULL, 1),
(6, 'GPU', 'Apple M3 Max (40-core GPU)', NULL, 2),
(6, 'RAM', '36GB Unified Memory', NULL, 3),
(6, 'á»” cá»©ng', '1TB SSD', NULL, 4),
(6, 'MÃ n hÃ¬nh', '16.2" Liquid Retina XDR 120Hz', NULL, 5),
(6, 'Pin', '100Wh, lÃªn Ä‘áº¿n 22 giá»', NULL, 6),
(6, 'Trá»ng lÆ°á»£ng', '2.14', 'kg', 7),
-- Logitech GPro Superlight 2 (id=9)
(9, 'Cáº£m biáº¿n', 'HERO 2 25K', NULL, 1),
(9, 'DPI', '25,600 DPI tá»‘i Ä‘a', NULL, 2),
(9, 'Trá»ng lÆ°á»£ng', '60', 'gram', 3),
(9, 'Pin', '95 giá»', NULL, 4),
(9, 'Káº¿t ná»‘i', 'LIGHTSPEED Wireless + USB-C', NULL, 5),
(9, 'HÃ£ng', 'Logitech', NULL, 6);

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85', 1, 1),
(1, 'https://images.unsplash.com/photo-1593640408182-31c228a9c6e9?w=500&h=375&fit=crop&q=85', 0, 2),
(1, 'https://images.unsplash.com/photo-1560762484-813fc97650a0?w=500&h=375&fit=crop&q=85', 0, 3),
(2, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=375&fit=crop&q=85', 1, 1),
(2, 'https://images.unsplash.com/photo-1593640408182-31c228a9c6e9?w=500&h=375&fit=crop&q=85', 0, 2),
(3, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=375&fit=crop&q=85', 1, 1),
(3, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=375&fit=crop&q=85', 0, 2),
(6, 'https://images.unsplash.com/photo-1611186871525-c71db68aa29e?w=500&h=375&fit=crop&q=85', 1, 1),
(7, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=375&fit=crop&q=85', 1, 1),
(9, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85', 1, 1),
(11, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=375&fit=crop&q=85', 1, 1);

-- ============================================================
-- VOUCHERS
-- ============================================================
INSERT INTO vouchers (code, name, description, discount_type, discount_value, max_discount_amount, min_order_value, max_uses, max_uses_per_user, start_date, expired_at) VALUES
('WELCOME10', 'ChÃ o má»«ng khÃ¡ch má»›i', 'Giáº£m 10% cho Ä‘Æ¡n hÃ ng Ä‘áº§u tiÃªn', 'percent', 10.00, 500000.00, 1000000.00, 100, 1, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR)),
('TECH200K', 'Giáº£m 200K Ä‘Æ¡n tá»« 5 triá»‡u', 'Voucher giáº£m tháº³ng 200.000Ä‘', 'fixed_amount', 200000.00, NULL, 5000000.00, 50, 1, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH)),
('SALE15', 'Flash Sale 15%', 'Giáº£m 15%, tá»‘i Ä‘a 1 triá»‡u', 'percent', 15.00, 1000000.00, 2000000.00, 200, 2, NOW(), DATE_ADD(NOW(), INTERVAL 3 MONTH)),
('VIP500K', 'VIP - Giáº£m 500K', 'DÃ nh riÃªng KH VIP', 'fixed_amount', 500000.00, NULL, 10000000.00, 20, 1, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH)),
('FREESHIP', 'Miá»…n phÃ­ váº­n chuyá»ƒn', 'Ãp dá»¥ng cho má»i Ä‘Æ¡n hÃ ng', 'fixed_amount', 30000.00, NULL, 0.00, 500, 3, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR));

-- ============================================================
-- SAMPLE ORDERS
-- ============================================================
INSERT INTO orders (user_id, order_code, subtotal, discount_amount, shipping_fee, total_amount, voucher_id, loyalty_points_earned, status, payment_method, payment_status, receiver_name, receiver_phone, shipping_address, created_at) VALUES
(3, 'ORD-20260415-0001', 42990000, 0, 0, 42990000, NULL, 430, 'delivered', 'cod', 'paid', 'Nguyá»…n VÄƒn An', '0903456789', '123 LÃ½ ThÆ°á»ng Kiá»‡t, Q.10, TP.HCM', '2026-04-15 10:30:00'),
(3, 'ORD-20260416-0002', 2890000, 289000, 0, 2601000, 1, 26, 'confirmed', 'bank_transfer', 'paid', 'Nguyá»…n VÄƒn An', '0903456789', '123 LÃ½ ThÆ°á»ng Kiá»‡t, Q.10, TP.HCM', '2026-04-16 14:00:00'),
(4, 'ORD-20260416-0003', 15990000, 200000, 0, 15790000, 2, 158, 'shipping', 'cod', 'unpaid', 'Tráº§n Thá»‹ BÃ¬nh', '0904567890', '456 Nguyá»…n TrÃ£i, Q.5, TP.HCM', '2026-04-16 16:00:00');

INSERT INTO order_items (order_id, product_id, product_name, product_thumbnail, unit_price, quantity, subtotal) VALUES
(1, 1, 'ASUS ROG Strix G16 Gaming Laptop 2024', '/uploads/products/asus-rog-g16.jpg', 42990000, 1, 42990000),
(2, 9, 'Logitech G Pro X Superlight 2', '/uploads/products/gpro-superlight2.jpg', 2890000, 1, 2890000),
(3, 7, 'Samsung Odyssey G7 32" Curved', '/uploads/products/odyssey-g7.jpg', 15990000, 1, 15990000);

-- ============================================================
-- SAMPLE REVIEWS
-- ============================================================
INSERT INTO reviews (user_id, product_id, order_item_id, rating, comment, is_approved) VALUES
(3, 1, 1, 5, 'Laptop cá»±c máº¡nh, cháº¡y game 4K mÆ°á»£t mÃ , táº£n nhiá»‡t tá»‘t. Ráº¥t hÃ i lÃ²ng!', 1),
(4, 7, 3, 4, 'MÃ n hÃ¬nh Ä‘áº¹p, mÃ u sáº¯c chuáº©n. Giao hÃ ng nhanh chá»‰ 2 ngÃ y.', 1);

-- Cáº­p nháº­t avg_rating
UPDATE products SET avg_rating = 5.0 WHERE id = 1;
UPDATE products SET avg_rating = 4.0 WHERE id = 7;

-- ============================================================
-- SAMPLE VOUCHER USAGES
-- ============================================================
INSERT INTO voucher_usages (voucher_id, user_id, order_id, discount_applied) VALUES
(1, 3, 2, 289000);

-- Cáº­p nháº­t used_count
UPDATE vouchers SET used_count = 1 WHERE id = 1;

-- ============================================================
-- SAMPLE INVENTORY LOGS
-- ============================================================
INSERT INTO inventory_logs (product_id, user_id, quantity_change, stock_before, stock_after, type, note, reference_code) VALUES
(1, 1, 15, 0, 15, 'import', 'Nháº­p hÃ ng ban Ä‘áº§u', 'IMP-001'),
(1, NULL, -1, 15, 14, 'export', 'Xuáº¥t theo Ä‘Æ¡n ORD-20260415-0001', 'ORD-20260415-0001'),
(9, 1, 50, 0, 50, 'import', 'Nháº­p hÃ ng ban Ä‘áº§u', 'IMP-002'),
(9, NULL, -1, 50, 49, 'export', 'Xuáº¥t theo Ä‘Æ¡n ORD-20260416-0002', 'ORD-20260416-0002');

-- ============================================================  
-- SAMPLE WISHLISTS
-- ============================================================
INSERT INTO wishlists (user_id, product_id) VALUES
(3, 2), (3, 6), (4, 1), (5, 6), (5, 7);

-- ============================================================
-- SAMPLE NOTIFICATIONS
-- ============================================================
INSERT INTO notifications (user_id, title, content, type, ref_id) VALUES
(3, 'ÄÆ¡n hÃ ng Ä‘Ã£ Ä‘Æ°á»£c giao!', 'ÄÆ¡n hÃ ng #ORD-20260415-0001 Ä‘Ã£ Ä‘Æ°á»£c giao thÃ nh cÃ´ng. HÃ£y Ä‘Ã¡nh giÃ¡ sáº£n pháº©m nhÃ©!', 'order', 'ORD-20260415-0001'),
(3, 'ÄÆ¡n hÃ ng Ä‘Ã£ xÃ¡c nháº­n', 'ÄÆ¡n hÃ ng #ORD-20260416-0002 Ä‘Ã£ Ä‘Æ°á»£c xÃ¡c nháº­n vÃ  Ä‘ang chuáº©n bá»‹ giao.', 'order', 'ORD-20260416-0002'),
(4, 'ÄÆ¡n hÃ ng Ä‘ang giao', 'ÄÆ¡n hÃ ng #ORD-20260416-0003 Ä‘ang Ä‘Æ°á»£c váº­n chuyá»ƒn Ä‘áº¿n báº¡n.', 'order', 'ORD-20260416-0003'),
(3, 'ChÃ o má»«ng Ä‘áº¿n TechStore!', 'Cáº£m Æ¡n báº¡n Ä‘Ã£ Ä‘Äƒng kÃ½. DÃ¹ng mÃ£ WELCOME10 Ä‘á»ƒ Ä‘Æ°á»£c giáº£m 10% Ä‘Æ¡n Ä‘áº§u tiÃªn!', 'system', NULL);

SELECT 'Seed data inserted successfully!' as status;

