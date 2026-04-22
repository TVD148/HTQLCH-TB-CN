
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anh_san_pham` (
  `ma_anh` int(11) NOT NULL AUTO_INCREMENT,
  `ma_san_pham` int(11) NOT NULL,
  `duong_dan_anh` varchar(255) NOT NULL,
  `la_anh_chinh` tinyint(1) NOT NULL DEFAULT 0,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ma_anh`),
  KEY `idx_san_pham` (`ma_san_pham`),
  CONSTRAINT `anh_san_pham_ibfk_1` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sach anh cua san pham';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `anh_san_pham` DISABLE KEYS */;
/*!40000 ALTER TABLE `anh_san_pham` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chi_tiet_don_hang` (
  `ma_chi_tiet` int(11) NOT NULL AUTO_INCREMENT,
  `ma_don_hang` int(11) NOT NULL,
  `ma_san_pham` int(11) NOT NULL,
  `ten_san_pham` varchar(200) NOT NULL,
  `anh_san_pham` varchar(255) DEFAULT NULL,
  `don_gia` decimal(15,2) NOT NULL,
  `so_luong` int(11) NOT NULL,
  `thanh_tien` decimal(15,2) NOT NULL,
  PRIMARY KEY (`ma_chi_tiet`),
  KEY `idx_don_hang` (`ma_don_hang`),
  KEY `idx_san_pham` (`ma_san_pham`),
  CONSTRAINT `chi_tiet_don_hang_ibfk_1` FOREIGN KEY (`ma_don_hang`) REFERENCES `don_hang` (`ma_don_hang`) ON DELETE CASCADE,
  CONSTRAINT `chi_tiet_don_hang_ibfk_2` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiet san pham trong don hang';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `chi_tiet_don_hang` DISABLE KEYS */;
INSERT INTO `chi_tiet_don_hang` VALUES (1,1,15,'ASUS Vivobook Pro 16X OLED','https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85',32990000.00,1,32990000.00),(2,2,111,'Laptop Gaming ASUS ROG Strix G15','https://placehold.co/600x400/1E293B/3B82F6?text=ASUS+ROG+Strix+G15',23990000.00,4,95960000.00),(3,2,112,'Laptop Gaming Acer Nitro 5','https://placehold.co/600x400/1E293B/3B82F6?text=Acer+Nitro+5',20500000.00,4,82000000.00),(4,2,113,'Laptop Dell Inspiron 15','https://placehold.co/600x400/1E293B/3B82F6?text=Dell+Inspiron+15',14200000.00,4,56800000.00),(5,2,114,'Laptop HP Pavilion 14','https://placehold.co/600x400/1E293B/3B82F6?text=HP+Pavilion+14',15900000.00,4,63600000.00),(14,11,112,'Laptop Gaming Acer Nitro 5','https://placehold.co/600x400/1E293B/3B82F6?text=Acer+Nitro+5',20500000.00,1,20500000.00);
/*!40000 ALTER TABLE `chi_tiet_don_hang` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chi_tiet_flash_sale` (
  `ma_chi_tiet` int(11) NOT NULL AUTO_INCREMENT,
  `ma_flash_sale` int(11) NOT NULL,
  `ma_san_pham` int(11) NOT NULL,
  `gia_flash` decimal(15,2) NOT NULL,
  `so_luong_gioi_han` int(11) DEFAULT NULL,
  `da_ban` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ma_chi_tiet`),
  UNIQUE KEY `uq_flash_sp` (`ma_flash_sale`,`ma_san_pham`),
  KEY `ma_san_pham` (`ma_san_pham`),
  CONSTRAINT `chi_tiet_flash_sale_ibfk_1` FOREIGN KEY (`ma_flash_sale`) REFERENCES `flash_sale` (`ma_flash_sale`) ON DELETE CASCADE,
  CONSTRAINT `chi_tiet_flash_sale_ibfk_2` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `chi_tiet_flash_sale` DISABLE KEYS */;
INSERT INTO `chi_tiet_flash_sale` VALUES (1,1,9,1791000.00,NULL,0),(2,1,47,3591000.00,NULL,0),(3,1,44,11241000.00,NULL,0),(4,1,46,2421000.00,NULL,0),(5,1,26,8091000.00,NULL,0),(6,1,42,40491000.00,NULL,0);
/*!40000 ALTER TABLE `chi_tiet_flash_sale` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chi_tiet_gio_hang` (
  `ma_chi_tiet` int(11) NOT NULL AUTO_INCREMENT,
  `ma_gio_hang` int(11) NOT NULL,
  `ma_san_pham` int(11) NOT NULL,
  `so_luong` int(11) NOT NULL DEFAULT 1,
  `don_gia` decimal(15,2) NOT NULL,
  `ngay_them` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ma_chi_tiet`),
  UNIQUE KEY `uq_gio_san_pham` (`ma_gio_hang`,`ma_san_pham`),
  KEY `ma_san_pham` (`ma_san_pham`),
  KEY `idx_gio_hang` (`ma_gio_hang`),
  CONSTRAINT `chi_tiet_gio_hang_ibfk_1` FOREIGN KEY (`ma_gio_hang`) REFERENCES `gio_hang` (`ma_gio_hang`) ON DELETE CASCADE,
  CONSTRAINT `chi_tiet_gio_hang_ibfk_2` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='San pham trong gio hang';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `chi_tiet_gio_hang` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_gio_hang` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `danh_gia` (
  `ma_danh_gia` int(11) NOT NULL AUTO_INCREMENT,
  `ma_nguoi_dung` int(11) NOT NULL,
  `ma_san_pham` int(11) NOT NULL,
  `ma_chi_tiet_dh` int(11) DEFAULT NULL,
  `so_sao` tinyint(1) NOT NULL CHECK (`so_sao` between 1 and 5),
  `binh_luan` text DEFAULT NULL,
  `phan_hoi_admin` text DEFAULT NULL,
  `ngay_phan_hoi` timestamp NULL DEFAULT NULL,
  `da_duyet` tinyint(1) NOT NULL DEFAULT 0,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ma_danh_gia`),
  UNIQUE KEY `uq_nguoi_sp_dh` (`ma_nguoi_dung`,`ma_san_pham`,`ma_chi_tiet_dh`),
  KEY `ma_chi_tiet_dh` (`ma_chi_tiet_dh`),
  KEY `idx_san_pham` (`ma_san_pham`),
  KEY `idx_da_duyet` (`da_duyet`),
  CONSTRAINT `danh_gia_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE,
  CONSTRAINT `danh_gia_ibfk_2` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`) ON DELETE CASCADE,
  CONSTRAINT `danh_gia_ibfk_3` FOREIGN KEY (`ma_chi_tiet_dh`) REFERENCES `chi_tiet_don_hang` (`ma_chi_tiet`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh gia va binh luan cua nguoi dung ve san pham';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
INSERT INTO `danh_gia` VALUES (1,3,15,1,5,'san pham tot','shop cam on\nnhe','2026-04-22 14:39:45',1,'2026-04-22 02:43:43');
/*!40000 ALTER TABLE `danh_gia` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `danh_muc` (
  `ma_danh_muc` int(11) NOT NULL AUTO_INCREMENT,
  `ten_danh_muc` varchar(100) NOT NULL,
  `duong_dan` varchar(120) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `ma_danh_muc_cha` int(11) DEFAULT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ma_danh_muc`),
  UNIQUE KEY `duong_dan` (`duong_dan`),
  KEY `idx_duong_dan` (`duong_dan`),
  KEY `idx_danh_muc_cha` (`ma_danh_muc_cha`),
  CONSTRAINT `danh_muc_ibfk_1` FOREIGN KEY (`ma_danh_muc_cha`) REFERENCES `danh_muc` (`ma_danh_muc`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bang danh muc san pham (co the co phan cap)';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `danh_muc` DISABLE KEYS */;
INSERT INTO `danh_muc` VALUES (1,'Laptop','laptop','M├íy t├¡nh x├ích tay c├íc loß║íi',NULL,NULL,1,1,'2026-04-20 04:00:40'),(2,'─Éiß╗çn thoß║íi','dien-thoai','─Éiß╗çn thoß║íi th├┤ng minh',NULL,NULL,1,2,'2026-04-20 04:00:40'),(4,'M├án h├¼nh','man-hinh','M├án h├¼nh m├íy t├¡nh c├íc loß║íi',NULL,NULL,1,4,'2026-04-20 04:00:40'),(5,'Phß╗Ñ kiß╗çn','phu-kien','Phß╗Ñ kiß╗çn c├┤ng nghß╗ç',NULL,NULL,1,5,'2026-04-20 04:00:40'),(13,'Laptop Gaming','laptop-gaming',NULL,NULL,NULL,1,0,'2026-04-22 03:03:29'),(14,'Laptop V─ân Ph├▓ng','laptop-van-phong',NULL,NULL,NULL,1,0,'2026-04-22 03:03:29');
/*!40000 ALTER TABLE `danh_muc` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dia_chi_nguoi_dung` (
  `ma_dia_chi` int(11) NOT NULL AUTO_INCREMENT,
  `ma_nguoi_dung` int(11) NOT NULL,
  `ten_nhan` varchar(100) NOT NULL DEFAULT 'Nh??',
  `dia_chi_day_du` text NOT NULL,
  `tinh_thanh` varchar(100) DEFAULT NULL,
  `quan_huyen` varchar(100) DEFAULT NULL,
  `lat` decimal(10,8) DEFAULT NULL,
  `lng` decimal(11,8) DEFAULT NULL,
  `la_mac_dinh` tinyint(1) NOT NULL DEFAULT 0,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ma_dia_chi`),
  KEY `idx_nguoi_dung` (`ma_nguoi_dung`),
  KEY `idx_mac_dinh` (`la_mac_dinh`),
  CONSTRAINT `dia_chi_nguoi_dung_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sach dia chi giao hang da luu cua nguoi dung';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `dia_chi_nguoi_dung` DISABLE KEYS */;
INSERT INTO `dia_chi_nguoi_dung` VALUES (1,3,'Nh├á','X├ú B├¼nh Mß╗╣, Th├ánh phß╗æ Hß╗ô Ch├¡ Minh, Viß╗çt Nam','Th├ánh phß╗æ Hß╗ô Ch├¡ Minh',NULL,10.98016650,106.61015960,0,'2026-04-22 02:23:57'),(2,3,'C╞í quan','─É╞░ß╗¥ng sß╗æ 123, Khu phß╗æ 35, Ph╞░ß╗¥ng Ph╞░ß╗¢c Long, Th├ánh phß╗æ Thß╗º ─Éß╗⌐c, Th├ánh phß╗æ Hß╗ô Ch├¡ Minh, 71210, Viß╗çt Nam','Th├ánh phß╗æ Thß╗º ─Éß╗⌐c','Ph╞░ß╗¥ng Ph╞░ß╗¢c Long',10.81673820,106.76581390,1,'2026-04-22 02:24:31');
/*!40000 ALTER TABLE `dia_chi_nguoi_dung` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `don_hang` (
  `ma_don_hang` int(11) NOT NULL AUTO_INCREMENT,
  `ma_nguoi_dung` int(11) NOT NULL,
  `ma_code` varchar(50) NOT NULL,
  `tam_tinh` decimal(15,2) NOT NULL,
  `so_tien_giam` decimal(15,2) NOT NULL DEFAULT 0.00,
  `phi_van_chuyen` decimal(15,2) NOT NULL DEFAULT 0.00,
  `tong_tien` decimal(15,2) NOT NULL,
  `ma_voucher` int(11) DEFAULT NULL,
  `diem_su_dung` int(11) NOT NULL DEFAULT 0,
  `diem_tich_duoc` int(11) NOT NULL DEFAULT 0,
  `trang_thai` enum('cho_xac_nhan','da_xac_nhan','dang_giao','da_giao','da_huy','hoan_tien') NOT NULL DEFAULT 'cho_xac_nhan',
  `phuong_thuc_tt` enum('tien_mat','chuyen_khoan','momo','diem_tich_luy') NOT NULL DEFAULT 'tien_mat',
  `trang_thai_tt` enum('chua_tt','da_tt','da_hoan_tien') NOT NULL DEFAULT 'chua_tt',
  `ten_nguoi_nhan` varchar(100) NOT NULL,
  `sdt_nguoi_nhan` varchar(20) NOT NULL,
  `dia_chi_giao_hang` text NOT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ma_voucher_ship` int(11) DEFAULT NULL COMMENT 'Voucher giß║úm ph├¡ vß║¡n chuyß╗ân',
  `so_tien_giam_ship` decimal(15,0) NOT NULL DEFAULT 0 COMMENT 'Sß╗æ tiß╗ün ─æ╞░ß╗úc giß║úm tß╗½ ph├¡ vß║¡n chuyß╗ân',
  PRIMARY KEY (`ma_don_hang`),
  UNIQUE KEY `ma_code` (`ma_code`),
  KEY `ma_voucher` (`ma_voucher`),
  KEY `idx_nguoi_dung` (`ma_nguoi_dung`),
  KEY `idx_ma_code` (`ma_code`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_ngay_tao` (`ngay_tao`),
  CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`),
  CONSTRAINT `don_hang_ibfk_2` FOREIGN KEY (`ma_voucher`) REFERENCES `ma_giam_gia` (`ma_voucher`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bang don hang cua khach hang';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `don_hang` DISABLE KEYS */;
INSERT INTO `don_hang` VALUES (1,3,'DH-20260421-4958',32990000.00,0.00,0.00,32990000.00,NULL,0,329,'hoan_tien','','chua_tt','Nguyß╗àn V─ân An','0912345678','ada','','2026-04-21 14:50:17','2026-04-22 16:35:47',NULL,0),(2,3,'DH-20260422-3566',298360000.00,500000.00,0.00,297381000.00,1,479,2973,'da_giao','','chua_tt','Nguyß╗àn V─ân An','1314141451','1','','2026-04-22 03:16:05','2026-04-22 16:35:44',NULL,0),(11,3,'DH-22042026-002',20500000.00,0.00,0.00,20500000.00,NULL,0,205,'da_giao','','chua_tt','Nguyß╗àn V─ân An','131241451515','─É╞░ß╗¥ng sß╗æ 123, Khu phß╗æ 35, Ph╞░ß╗¥ng Ph╞░ß╗¢c Long, Th├ánh phß╗æ Thß╗º ─Éß╗⌐c, Th├ánh phß╗æ Hß╗ô Ch├¡ Minh, 71210, Viß╗çt Nam','ada','2026-04-22 16:30:03','2026-04-22 16:35:41',3,30000);
/*!40000 ALTER TABLE `don_hang` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `flash_sale` (
  `ma_flash_sale` int(11) NOT NULL AUTO_INCREMENT,
  `ten` varchar(200) NOT NULL DEFAULT 'Flash Sale',
  `thoi_gian_bat_dau` datetime NOT NULL,
  `thoi_gian_ket_thuc` datetime NOT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ma_flash_sale`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `flash_sale` DISABLE KEYS */;
INSERT INTO `flash_sale` VALUES (1,'Flash Sale Khai Truong','2026-04-22 07:26:48','2026-04-22 13:26:48',1,'2026-04-22 14:26:48');
/*!40000 ALTER TABLE `flash_sale` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gio_hang` (
  `ma_gio_hang` int(11) NOT NULL AUTO_INCREMENT,
  `ma_nguoi_dung` int(11) NOT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ma_gio_hang`),
  UNIQUE KEY `ma_nguoi_dung` (`ma_nguoi_dung`),
  KEY `idx_nguoi_dung` (`ma_nguoi_dung`),
  CONSTRAINT `gio_hang_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Gio hang cua tung nguoi dung';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `gio_hang` DISABLE KEYS */;
INSERT INTO `gio_hang` VALUES (1,1,'2026-04-20 04:00:40','2026-04-20 04:00:40'),(2,2,'2026-04-20 04:00:40','2026-04-20 04:00:40'),(3,3,'2026-04-20 04:00:40','2026-04-20 04:00:40'),(4,4,'2026-04-20 04:00:40','2026-04-20 04:00:40'),(5,5,'2026-04-20 04:00:40','2026-04-20 04:00:40');
/*!40000 ALTER TABLE `gio_hang` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lich_su_kho` (
  `ma_lich_su` int(11) NOT NULL AUTO_INCREMENT,
  `ma_san_pham` int(11) NOT NULL,
  `ma_nguoi_dung` int(11) DEFAULT NULL,
  `so_luong_bien_dong` int(11) NOT NULL,
  `ton_kho_truoc` int(11) NOT NULL,
  `ton_kho_sau` int(11) NOT NULL,
  `loai_giao_dich` enum('nhap','xuat','dieu_chinh','hoan_tra') NOT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ma_tham_chieu` varchar(100) DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ma_lich_su`),
  KEY `ma_nguoi_dung` (`ma_nguoi_dung`),
  KEY `idx_san_pham` (`ma_san_pham`),
  KEY `idx_loai` (`loai_giao_dich`),
  KEY `idx_ngay_tao` (`ngay_tao`),
  CONSTRAINT `lich_su_kho_ibfk_1` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`) ON DELETE CASCADE,
  CONSTRAINT `lich_su_kho_ibfk_2` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lich su bien dong ton kho san pham';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `lich_su_kho` DISABLE KEYS */;
INSERT INTO `lich_su_kho` VALUES (1,15,3,-1,14,13,'xuat','Xuß║Ñt theo ─æ╞ín h├áng DH-20260421-4958','DH-20260421-4958','2026-04-21 14:50:17'),(2,111,3,-4,50,46,'xuat','Xuß║Ñt theo ─æ╞ín h├áng DH-20260422-3566','DH-20260422-3566','2026-04-22 03:16:05'),(3,112,3,-4,50,46,'xuat','Xuß║Ñt theo ─æ╞ín h├áng DH-20260422-3566','DH-20260422-3566','2026-04-22 03:16:05'),(4,113,3,-4,50,46,'xuat','Xuß║Ñt theo ─æ╞ín h├áng DH-20260422-3566','DH-20260422-3566','2026-04-22 03:16:05'),(5,114,3,-4,50,46,'xuat','Xuß║Ñt theo ─æ╞ín h├áng DH-20260422-3566','DH-20260422-3566','2026-04-22 03:16:05'),(14,112,3,-1,46,45,'xuat','Xuß║Ñt theo ─æ╞ín h├áng DH-22042026-002','DH-22042026-002','2026-04-22 16:30:03');
/*!40000 ALTER TABLE `lich_su_kho` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lich_su_voucher` (
  `ma_lich_su` int(11) NOT NULL AUTO_INCREMENT,
  `ma_voucher` int(11) NOT NULL,
  `ma_nguoi_dung` int(11) NOT NULL,
  `ma_don_hang` int(11) DEFAULT NULL,
  `so_tien_giam` decimal(15,2) NOT NULL,
  `ngay_su_dung` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ma_lich_su`),
  KEY `idx_voucher` (`ma_voucher`),
  KEY `idx_nguoi_dung` (`ma_nguoi_dung`),
  CONSTRAINT `lich_su_voucher_ibfk_1` FOREIGN KEY (`ma_voucher`) REFERENCES `ma_giam_gia` (`ma_voucher`) ON DELETE CASCADE,
  CONSTRAINT `lich_su_voucher_ibfk_2` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lich su nguoi dung su dung ma giam gia';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `lich_su_voucher` DISABLE KEYS */;
INSERT INTO `lich_su_voucher` VALUES (1,1,3,2,500000.00,'2026-04-22 03:16:05'),(2,3,3,11,30000.00,'2026-04-22 16:30:03');
/*!40000 ALTER TABLE `lich_su_voucher` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ma_giam_gia` (
  `ma_voucher` int(11) NOT NULL AUTO_INCREMENT,
  `ma_code` varchar(50) NOT NULL,
  `ten_voucher` varchar(150) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `loai_giam` enum('percent','fixed_amount','freeship') NOT NULL DEFAULT 'fixed_amount',
  `gia_tri_giam` decimal(15,2) NOT NULL,
  `giam_toi_da` decimal(15,2) DEFAULT NULL COMMENT 'Giam toi da (cho loai percent)',
  `don_hang_toi_thieu` decimal(15,2) NOT NULL DEFAULT 0.00,
  `so_lan_toi_da` int(11) NOT NULL DEFAULT 1,
  `da_su_dung` int(11) NOT NULL DEFAULT 0,
  `gioi_han_moi_nguoi` int(11) NOT NULL DEFAULT 1,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `ngay_bat_dau` datetime NOT NULL DEFAULT current_timestamp(),
  `ngay_het_han` datetime NOT NULL DEFAULT '2099-12-31 23:59:59',
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  `loai_voucher` enum('product','shipping','promo_code') NOT NULL DEFAULT 'product' COMMENT 'product=giß║úm tiß╗ün SP, shipping=giß║úm ph├¡ ship, promo_code=m├ú sß╗▒ kiß╗çn',
  PRIMARY KEY (`ma_voucher`),
  UNIQUE KEY `ma_code` (`ma_code`),
  KEY `idx_ma_code` (`ma_code`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_het_han` (`ngay_het_han`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bang quan ly ma giam gia / voucher';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `ma_giam_gia` DISABLE KEYS */;
INSERT INTO `ma_giam_gia` VALUES (1,'WELCOME10','Ch├áo mß╗½ng th├ánh vi├¬n mß╗¢i','Giß║úm 10% cho lß║ºn mua ─æß║ºu ti├¬n, tß╗æi ─æa 500.000─æ','percent',10.00,500000.00,1000000.00,100,1,1,1,'2024-01-01 00:00:00','2099-12-31 23:59:59','2026-04-20 11:00:40','product'),(2,'SALE20','Flash Sale 20%','Giß║úm 20% tß╗æi ─æa 2 triß╗çu cho ─æ╞ín tß╗½ 5 triß╗çu','percent',20.00,2000000.00,5000000.00,50,0,1,1,'2024-01-01 00:00:00','2099-12-31 23:59:59','2026-04-20 11:00:40','product'),(3,'FREESHIP','Miß╗àn ph├¡ vß║¡n chuyß╗ân','Giß║úm ph├¡ ship 50.000─æ cho mß╗ìi ─æ╞ín h├áng','fixed_amount',50000.00,NULL,0.00,200,1,3,1,'2024-01-01 00:00:00','2099-12-31 23:59:59','2026-04-20 11:00:40','shipping'),(4,'VIP500K','╞»u ─æ├úi VIP 500K','Giß║úm thß║│ng 500.000─æ cho ─æ╞ín h├áng tß╗½ 10 triß╗çu','fixed_amount',500000.00,NULL,10000000.00,30,0,1,1,'2024-01-01 00:00:00','2099-12-31 23:59:59','2026-04-20 11:00:40','product');
/*!40000 ALTER TABLE `ma_giam_gia` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nguoi_dung` (
  `ma_nguoi_dung` int(11) NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(100) NOT NULL,
  `ten` varchar(50) DEFAULT NULL COMMENT 'Ten (de sap xep A-Z)',
  `ho` varchar(50) DEFAULT NULL COMMENT 'Ho',
  `email` varchar(150) NOT NULL,
  `mat_khau_ma_hoa` varchar(255) NOT NULL,
  `vai_tro` enum('admin','staff','user') NOT NULL DEFAULT 'user',
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `dia_chi` text DEFAULT NULL,
  `anh_dai_dien` varchar(255) DEFAULT NULL,
  `diem_tich_luy` int(11) NOT NULL DEFAULT 0,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `ngay_xac_thuc_email` timestamp NULL DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ma_nguoi_dung`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_vai_tro` (`vai_tro`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bang luu thong tin nguoi dung / khach hang';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES (1,'trß║ºn v─ân ─æ├¼nh','Admin','Quß║ún trß╗ï','admin@techstore.vn','$2a$10$7pBdjMLqGHhzJAD/gi438.5KWsuMddeLuDNaMwYV15YvYRXRTDwqW','admin','0901000001',NULL,NULL,0,1,NULL,'2026-04-20 04:00:40','2026-04-22 15:55:49'),(2,'Nh├ón Vi├¬n',NULL,'Nh├ón vi├¬n','staff@techstore.vn','$2a$10$7pBdjMLqGHhzJAD/gi438.5KWsuMddeLuDNaMwYV15YvYRXRTDwqW','staff','0901000002',NULL,NULL,0,1,NULL,'2026-04-20 04:00:40','2026-04-22 16:30:18'),(3,'Nguyß╗àn V─ân An','An','Nguyß╗àn','nguyenvan.an@example.com','$2a$10$7pBdjMLqGHhzJAD/gi438.5KWsuMddeLuDNaMwYV15YvYRXRTDwqW','user','131241451515',NULL,NULL,6685,1,NULL,'2026-04-20 04:00:40','2026-04-22 16:35:46'),(4,'Trß║ºn Thß╗ï B├¼nh','B├¼nh','Trß║ºn','tranthi.binh@example.com','$2a$10$7pBdjMLqGHhzJAD/gi438.5KWsuMddeLuDNaMwYV15YvYRXRTDwqW','user','0923456789',NULL,NULL,80,1,NULL,'2026-04-20 04:00:40','2026-04-20 06:14:03'),(5,'L├¬ V─ân C╞░ß╗¥ng','C╞░ß╗¥ng','L├¬','levan.cuong@example.com','$2a$10$7pBdjMLqGHhzJAD/gi438.5KWsuMddeLuDNaMwYV15YvYRXRTDwqW','user','0934567890',NULL,NULL,200,1,NULL,'2026-04-20 04:00:40','2026-04-20 06:14:03');
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `san_pham` (
  `ma_san_pham` int(11) NOT NULL AUTO_INCREMENT,
  `ten_san_pham` varchar(200) NOT NULL,
  `duong_dan` varchar(220) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `mo_ta_ngan` text DEFAULT NULL,
  `gia_goc` decimal(15,2) NOT NULL,
  `gia_khuyen_mai` decimal(15,2) DEFAULT NULL,
  `so_luong_ton` int(11) NOT NULL DEFAULT 0,
  `canh_bao_ton_toi_thieu` int(11) NOT NULL DEFAULT 5,
  `ma_danh_muc` int(11) NOT NULL,
  `ma_thuong_hieu` int(11) NOT NULL,
  `anh_dai_dien` varchar(255) DEFAULT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `noi_bat` tinyint(1) NOT NULL DEFAULT 0,
  `luot_xem` int(11) NOT NULL DEFAULT 0,
  `danh_gia_tb` decimal(3,2) NOT NULL DEFAULT 0.00,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `thoi_gian_bao_hanh` int(11) NOT NULL DEFAULT 12 COMMENT 'Sß╗æ th├íng bß║úo h├ánh mß║╖c ─æß╗ïnh',
  `phi_van_chuyen` decimal(12,0) NOT NULL DEFAULT 30000 COMMENT 'Ph├¡ vß║¡n chuyß╗ân ri├¬ng cß╗ºa sß║ún phß║⌐m (VND)',
  PRIMARY KEY (`ma_san_pham`),
  UNIQUE KEY `duong_dan` (`duong_dan`),
  KEY `idx_duong_dan` (`duong_dan`),
  KEY `idx_danh_muc` (`ma_danh_muc`),
  KEY `idx_thuong_hieu` (`ma_thuong_hieu`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_noi_bat` (`noi_bat`),
  FULLTEXT KEY `ft_tim_kiem` (`ten_san_pham`,`mo_ta`,`mo_ta_ngan`),
  CONSTRAINT `san_pham_ibfk_1` FOREIGN KEY (`ma_danh_muc`) REFERENCES `danh_muc` (`ma_danh_muc`),
  CONSTRAINT `san_pham_ibfk_2` FOREIGN KEY (`ma_thuong_hieu`) REFERENCES `thuong_hieu` (`ma_thuong_hieu`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bang san pham chinh';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `san_pham` DISABLE KEYS */;
INSERT INTO `san_pham` VALUES (1,'ASUS ROG Strix G16 Gaming Laptop 2024','asus-rog-strix-g16-2024','<h2>ASUS ROG Strix G16 Gaming Laptop 2024 ΓÇô Chiß║┐n Binh Kh├┤ng Khoan Nh╞░ß╗úng</h2>\n<p>ASUS ROG Strix G16 2024 l├á laptop gaming ─æß╗ënh cao ─æ╞░ß╗úc trang bß╗ï bß╗Ö vi xß╗¡ l├╜ Intel Core i9-14900HX thß║┐ hß╗ç mß╗¢i nhß║Ñt vß╗¢i 24 nh├ón, 32 luß╗ông, xung nhß╗ïp boost l├¬n ─æß║┐n 5.8GHz ΓÇô ─æß║úm bß║úo hiß╗çu n─âng v╞░ß╗út trß╗Öi trong mß╗ìi t├¼nh huß╗æng gaming v├á s├íng tß║ío nß╗Öi dung.</p>\n<p>Card ─æß╗ô hß╗ìa NVIDIA GeForce RTX 4080 12GB vß╗¢i kiß║┐n tr├║c Ada Lovelace mang ─æß║┐n trß║úi nghiß╗çm ch╞íi game 4K m╞░ß╗út m├á, hß╗ù trß╗ú DLSS 3.0 Frame Generation gi├║p t─âng FPS gß║Ñp ─æ├┤i m├á kh├┤ng ß║únh h╞░ß╗ƒng chß║Ñt l╞░ß╗úng h├¼nh ß║únh. M├án h├¼nh QHD+ 240Hz vß╗¢i panel IPS-level cho m├áu sß║»c rß╗▒c rß╗í, ─æß╗Ö phß║ún hß╗ôi 3ms ─æß║úm bß║úo kh├┤ng bß╗Å lß╗í bß║Ñt kß╗│ khung h├¼nh n├áo.</p>\n<p>Hß╗ç thß╗æng tß║ún nhiß╗çt ROG Tri-Fan Technology vß╗¢i 3 quß║ít v├á 4 heatpipe ─æß╗ông giß╗» nhiß╗çt ─æß╗Ö tß╗æi ╞░u ngay cß║ú khi gaming k├⌐o d├ái. ROG Armoury Crate cho ph├⌐p t├╣y chß╗ënh hiß╗çu n─âng, ─æ├¿n RGB Aura Sync theo ├╜ muß╗æn.</p>\n<ul>\n  <li>Γ£à Hiß╗çu n─âng gaming h├áng ─æß║ºu ph├ón kh├║c vß╗¢i RTX 4080</li>\n  <li>Γ£à M├án h├¼nh 240Hz QHD+ kh├┤ng x├⌐ h├¼nh vß╗¢i G-Sync</li>\n  <li>Γ£à RAM DDR5 32GB b─âng th├┤ng cß╗▒c cao</li>\n  <li>Γ£à SSD NVMe 1TB tß╗æc ─æß╗Ö ─æß╗ìc 7.000 MB/s</li>\n  <li>Γ£à B├án ph├¡m per-key RGB vß╗¢i h├ánh tr├¼nh ph├¡m 1.8mm thoß║úi m├íi</li>\n</ul>','Intel i9-14900HX | RTX 4080 12GB | 32GB DDR5 | 1TB NVMe | 16\" 240Hz QHD+',45990000.00,42990000.00,15,5,1,1,'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85',1,1,354,4.80,'2026-04-20 04:00:40','2026-04-20 12:52:13',12,30000),(3,'Dell XPS 15 9530','dell-xps-15-9530','<h2>Dell XPS 15 9530 ΓÇô ─Éß╗ënh Cao Thiß║┐t Kß║┐ & Hiß╗çu N─âng S├íng Tß║ío</h2>\n<p>Dell XPS 15 9530 l├á laptop cao cß║Ñp ho├án hß║úo cho nh├á thiß║┐t kß║┐, nhiß║┐p ß║únh gia v├á nhß╗»ng ai cß║ºn sß╗⌐c mß║ính xß╗¡ l├╜ lß║½n m├án h├¼nh chß║Ñt l╞░ß╗úng studio. Thiß║┐t kß║┐ nh├┤m nguy├¬n khß╗æi mß╗Ång 18mm vß╗¢i trß╗ìng l╞░ß╗úng chß╗ë 1.86kg ΓÇô mß╗Ång nhß║╣ v╞░ß╗út trß╗Öi so vß╗¢i nhß╗»ng laptop c├╣ng cß║Ñu h├¼nh.</p>\n<p>─Éiß╗âm nhß║Ñn l├á m├án h├¼nh OLED 15.6\" 3.5K (3456├ù2160) 120Hz vß╗¢i delta E <1.5, ─æß╗Ö bao phß╗º DCI-P3 100%, ─æß╗Ö s├íng 400 nits HDR400 ΓÇô mß╗ìi chi tiß║┐t m├áu sß║»c hiß╗çn l├¬n chuß║⌐n x├íc ─æß║┐n tß╗½ng pixel, l├╜ t╞░ß╗ƒng cho c├┤ng viß╗çc chß╗ënh m├áu. CPU Intel Core i7-13700H 14-nh├ón kß║┐t hß╗úp RTX 4060 8GB xß╗¡ l├╜ m╞░ß╗út m├á Premiere Pro, DaVinci Resolve, Adobe After Effects.</p>\n<ul>\n  <li>Γ£à M├án h├¼nh OLED 3.5K sRGB 100% chuß║⌐n in ß║Ñn & thiß║┐t kß║┐</li>\n  <li>Γ£à Thiß║┐t kß║┐ nh├┤m cao cß║Ñp, mß╗Ång nhß║╣ ─æß║│ng cß║Ñp</li>\n  <li>Γ£à Thunderbolt 4 x2, USB-A, SD Full-size, HDMI 2.0</li>\n  <li>Γ£à Webcam IR 720p nhß║¡n diß╗çn khu├┤n mß║╖t Windows Hello</li>\n  <li>Γ£à Loa stereo 6W Waves MaxxAudio Pro</li>\n</ul>','Intel i7-13700H | RTX 4060 8GB | 16GB LPDDR5 | 15.6\" OLED 3.5K 120Hz',38990000.00,NULL,20,5,1,3,'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=375&fit=crop&q=85',1,0,303,4.60,'2026-04-20 04:00:40','2026-04-21 14:44:59',24,30000),(4,'HP Envy 16 Laptop 2024','hp-envy-16-2024','<h2>HP Envy 16 2024 ΓÇô Sß╗⌐c Mß║ính S├íng Tß║ío Trong Thiß║┐t Kß║┐ Thanh Lß╗ïch</h2>\n<p>HP Envy 16 2024 l├á sß╗▒ kß║┐t hß╗úp ho├án hß║úo giß╗»a hiß╗çu n─âng mß║ính mß║╜ v├á thiß║┐t kß║┐ sang trß╗ìng, h╞░ß╗¢ng ─æß║┐n nhß╗»ng ng╞░ß╗¥i d├╣ng chuy├¬n nghiß╗çp, content creator v├á nh├á thiß║┐t kß║┐. Bß╗ü mß║╖t nh├┤m tß╗▒ nhi├¬n vß╗¢i m├áu Lunar Silver to├ít l├¬n vß║╗ ─æß║╣p hiß╗çn ─æß║íi.</p>\n<p>M├án h├¼nh OLED 16\" 2.5K (2560├ù1600) 120Hz vß╗¢i tß╗╖ lß╗ç 16:10 cho kh├┤ng gian l├ám viß╗çc rß╗Öng r├úi h╞ín, m├áu sß║»c sß╗æng ─æß╗Öng vß╗¢i Delta E < 2 v├á HDR500 True Black. CPU Intel Core i7-13700H kß║┐t hß╗úp NVIDIA RTX 4060 8GB ─æß║úm bß║úo xuß║Ñt video 4K, render 3D nhanh ch├│ng.</p>\n<p>Pin 83Wh hß╗ù trß╗ú sß║íc nhanh 140W qua USB-C, ─æß╗º n─âng l╞░ß╗úng cho cß║ú ng├áy l├ám viß╗çc. Webcam 5MP AI tß╗▒ ─æß╗Öng ─æiß╗üu chß╗ënh ├ính s├íng, khß╗¡ nhiß╗àu ├óm thanh cho cuß╗Öc hß╗ìp chuy├¬n nghiß╗çp.</p>\n<ul>\n  <li>Γ£à M├án h├¼nh OLED 2.5K 120Hz 16:10 kh├┤ng viß╗ün</li>\n  <li>Γ£à B├án ph├¡m backlit vß╗¢i fingerprint reader t├¡ch hß╗úp</li>\n  <li>Γ£à Thunderbolt 4, USB-A, HDMI 2.1, MicroSD</li>\n  <li>Γ£à Sß║íc nhanh 140W ΓÇô ─æß║ºy 50% chß╗ë trong 30 ph├║t</li>\n  <li>Γ£à HP AI Assistant v├á HP Sure View chß╗æng nh├¼n trß╗Öm</li>\n</ul>','Intel i7-13700H | RTX 4060 8GB | 32GB DDR5 | 16\" OLED 2.5K 120Hz',32990000.00,29990000.00,12,5,1,4,'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&h=375&fit=crop&q=85',1,1,198,4.70,'2026-04-20 04:00:40','2026-04-20 12:52:13',12,30000),(6,'Apple MacBook Pro 16 inch M3 Max','apple-macbook-pro-16-m3-max','<h2>Apple MacBook Pro 16\" M3 Max ΓÇô ─Éß╗ënh Cao C├┤ng Nghß╗ç Apple Silicon</h2>\n<p>MacBook Pro 16\" M3 Max l├á laptop mß║ính nhß║Ñt Apple tß╗½ng sß║ún xuß║Ñt, ─æ╞░ß╗úc trang bß╗ï chip M3 Max vß╗¢i 16-core CPU v├á 40-core GPU tr├¬n tiß║┐n tr├¼nh 3nm ΓÇô hiß╗çu n─âng bß╗⌐t ph├í mß╗ìi ─æß╗æi thß╗º trong khi ti├¬u thß╗Ñ ─æiß╗çn cß╗▒c thß║Ñp. RAM Unified Memory 36GB tß╗æc ─æß╗Ö 400GB/s gi├║p xß╗¡ l├╜ t├íc vß╗Ñ s├íng tß║ío nß╗Öi dung nß║╖ng nh╞░ render video 8K, m├┤ phß╗Ång 3D phß╗⌐c tß║íp chß╗ë trong v├ái ph├║t.</p>\n<p>M├án h├¼nh Liquid Retina XDR 16.2\" vß╗¢i ─æß╗Ö ph├ón giß║úi 3456├ù2160 (254ppi), ProMotion 120Hz, ─æß╗Ö s├íng cß╗▒c ─æß║íi 1600 nits HDR ΓÇô hiß╗ân thß╗ï HDR chuy├¬n nghiß╗çp chuß║⌐n P3 vß╗¢i True Tone. Pin 100Wh cho 22 giß╗¥ ph├ít video ΓÇô d├ái nhß║Ñt trong lß╗ïch sß╗¡ MacBook.</p>\n<ul>\n  <li>Γ£à Chip M3 Max 3nm ΓÇô hiß╗çu n─âng CPU nhanh h╞ín 40% so vß╗¢i M1 Max</li>\n  <li>Γ£à 40-core GPU ΓÇô render Blender/Cinema 4D ngang card rß╗¥i cao cß║Ñp</li>\n  <li>Γ£à M├án h├¼nh XDR 1600 nits ΓÇô chuß║⌐n chß╗ënh m├áu HDR chuy├¬n nghiß╗çp</li>\n  <li>Γ£à 3x Thunderbolt 4, HDMI 2.1, SD UHS-II, MagSafe 3</li>\n  <li>Γ£à macOS Sonoma ΓÇô tß╗æi ╞░u workflows cho Final Cut, Logic Pro</li>\n</ul>','Apple M3 Max 16-core CPU | 40-core GPU | 36GB RAM | 1TB SSD | 16.2\" Liquid Retina XDR 120Hz',89990000.00,NULL,7,5,1,6,'https://images.unsplash.com/photo-1611186871525-c71db68aa29e?w=500&h=375&fit=crop&q=85',1,1,419,4.90,'2026-04-20 04:00:40','2026-04-21 14:44:59',24,30000),(9,'Logitech MX Master 3S','logitech-mx-master-3s','<h2>Logitech MX Master 3S ΓÇô Chuß╗Öt Flagship Cho Ng╞░ß╗¥i L├ám Chuy├¬n Nghiß╗çp</h2>\n<p>Logitech MX Master 3S l├á chuß╗Öt cao cß║Ñp nhß║Ñt cß╗ºa Logitech, ─æ╞░ß╗úc thiß║┐t kß║┐ tß╗æi ╞░u cho hiß╗çu suß║Ñt l├ám viß╗çc h├áng ng├áy. N├║t bß║Ñm im lß║╖ng 90% ΓÇô l├ám viß╗çc trong v─ân ph├▓ng hay coffee shop m├á kh├┤ng l├ám phiß╗ün ng╞░ß╗¥i xung quanh.</p>\n<p>Cß║úm biß║┐n Darkfield 8000 DPI hoß║ít ─æß╗Öng tr├¬n mß╗ìi bß╗ü mß║╖t kß╗â cß║ú k├¡nh. B├ính xe MagSpeed ─æiß╗çn tß╗½ cho ph├⌐p cuß╗Ön qua 1000 d├▓ng chß╗ë trong 1 gi├óy, chuyß╗ân ─æß╗òi th├┤ng minh giß╗»a cuß╗Ön nhß║Ñp v├á tß╗▒ do. Kß║┐t nß╗æi ─æß╗ông thß╗¥i 3 thiß║┐t bß╗ï qua Bluetooth hoß║╖c USB Logi Bolt, dß╗à d├áng chuyß╗ân ─æß╗òi bß║▒ng n├║t Easy-Switch. Pin sß║íc USB-C 70 ng├áy.</p>\n<ul>\n  <li>Γ£à Im lß║╖ng 90% ΓÇô ph├╣ hß╗úp m├┤i tr╞░ß╗¥ng v─ân ph├▓ng y├¬n t─⌐nh</li>\n  <li>Γ£à MagSpeed wheel ΓÇô cuß╗Ön si├¬u nhanh 1000 d├▓ng/gi├óy</li>\n  <li>Γ£à Kß║┐t nß╗æi 3 thiß║┐t bß╗ï, chuyß╗ân ─æß╗òi tß╗⌐c th├¼</li>\n  <li>Γ£à Ergonomic design ΓÇô thoß║úi m├íi khi d├╣ng nhiß╗üu giß╗¥</li>\n  <li>Γ£à T╞░╞íng th├¡ch Mac, Windows, Linux ΓÇô cß║ú Flow ─æß╗â copy qua thiß║┐t bß╗ï</li>\n</ul>','Im lß║╖ng 90% | 8000 DPI | Bluetooth & USB | Pin 70 ng├áy | Ergonomic',2290000.00,1990000.00,50,5,5,9,'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',1,1,273,4.60,'2026-04-20 04:00:40','2026-04-22 10:52:39',12,30000),(14,'Samsung Galaxy Book4 Ultra','samsung-galaxy-book4-ultra','<h2>Samsung Galaxy Book4 Ultra ΓÇô ─Éß╗ënh Cao Hß╗ç Sinh Th├íi Samsung</h2><p>Galaxy Book4 Ultra kß║┐t hß╗úp ho├án hß║úo giß╗»a phong c├ích mß╗Ång nhß║╣ v├á sß╗⌐c mß║ính cß╗ºa RTX 4070 8GB, l├╜ t╞░ß╗ƒng cho content creator trong hß╗ç sinh th├íi Samsung. M├án h├¼nh Dynamic AMOLED 2X 2.8K 120Hz vß╗¢i ─æß╗Ö s├íng 400 nits, HDR True Black 500 cho h├¼nh ß║únh sß║»c n├⌐t rß╗▒c rß╗í.</p><ul><li>Γ£à AMOLED 2.8K 120Hz ΓÇô m├áu sß║»c ─æiß╗çn ß║únh</li><li>Γ£à RTX 4070 8GB cho render v├á gaming</li><li>Γ£à Galaxy AI ΓÇô t├¡ch hß╗úp AI tß║ío sinh bß║ún ─æß╗ïa</li><li>Γ£à Kß║┐t nß╗æi s├óu vß╗¢i Galaxy Phone, Buds, Watch</li></ul>','Intel Core Ultra 9 185H | RTX 4070 8GB | 32GB LPDDR5X | 1TB SSD | 16\" AMOLED 2.8K 120Hz',45990000.00,42990000.00,9,5,1,7,'https://images.unsplash.com/photo-1611186871525-c71db68aa29e?w=500&h=375&fit=crop&q=85',1,1,250,4.70,'2026-04-20 12:52:14','2026-04-22 10:52:25',12,30000),(15,'ASUS Vivobook Pro 16X OLED','asus-vivobook-pro-16x-oled','<h2>ASUS Vivobook Pro 16X OLED ΓÇô S├íng Tß║ío Kh├┤ng Giß╗¢i Hß║ín</h2><p>Vivobook Pro 16X OLED ─æ╞░ß╗úc trang bß╗ï m├án h├¼nh OLED 4K 120Hz vß╗¢i DCI-P3 100%, Pantone Validated ΓÇô ti├¬u chuß║⌐n m├áu sß║»c cß╗ºa ng├ánh in ß║Ñn v├á thiß║┐t kß║┐ chuy├¬n nghiß╗çp. CPU Intel Core i9-13980HX 24-nh├ón c├╣ng RTX 4060 ─æß║úm bß║úo render 3D, chß╗ënh video 4K nhanh ch├│ng.</p><ul><li>Γ£à OLED 4K 120Hz ΓÇô chuß║⌐n Pantone Validated</li><li>Γ£à CPU i9-13980HX 24 nh├ón cho ─æa nhiß╗çm nß║╖ng</li><li>Γ£à ASUS Dial ΓÇô n├║m xoay s├íng tß║ío ─æß╗Öc quyß╗ün</li><li>Γ£à Cß╗òng Thunderbolt 4, USB-C, HDMI 2.1</li></ul>','Intel Core i9-13980HX | RTX 4060 8GB | 32GB DDR5 | 1TB SSD | 16\" OLED 4K 120Hz',35990000.00,32990000.00,13,5,1,1,'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85',1,0,200,0.00,'2026-04-20 12:52:14','2026-04-22 14:39:50',12,30000),(17,'Samsung Galaxy S24 Ultra','samsung-galaxy-s24-ultra','<h2>Samsung Galaxy S24 Ultra ΓÇô Si├¬u Phß║⌐m Android 2024</h2><p>Galaxy S24 Ultra l├á flagship mß║ính nhß║Ñt cß╗ºa Samsung vß╗¢i Snapdragon 8 Gen 3 for Galaxy v├á camera 200MP Tetra┬▓ Pixel. S Pen t├¡ch hß╗úp hß╗ù trß╗ú Galaxy AI vß╗¢i c├íc t├¡nh n─âng Note Assist, Transcript Assist dß╗ïch v├á t├│m tß║»t ngay tr├¬n m├án h├¼nh. Khung viß╗ün titan Grade 2 cß╗⌐ng c├íp thanh lß╗ïch.</p><ul><li>Γ£à Camera 200MP, zoom quang hß╗ìc 5x, Space Zoom 100x</li><li>Γ£à S Pen t├¡ch hß╗úp + Galaxy AI bß║ún ─æß╗ïa</li><li>Γ£à M├án Dynamic AMOLED 2X 6.8\" QHD+ 120Hz</li><li>Γ£à Pin 5000mAh, sß║íc nhanh 45W, sß║íc kh├┤ng d├óy 15W</li></ul>','Snapdragon 8 Gen 3 | 12GB RAM | 256GB | 6.8\" QHD+ 120Hz | Camera 200MP | S Pen t├¡ch hß╗úp',32990000.00,29990000.00,25,5,2,7,'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=375&fit=crop&q=85',1,1,523,4.80,'2026-04-20 12:52:14','2026-04-20 13:18:57',12,30000),(18,'Apple iPhone 15 Pro Max','apple-iphone-15-pro-max','<h2>Apple iPhone 15 Pro Max ΓÇô Si├¬u Phß║⌐m iOS Ti├¬n Phong</h2><p>iPhone 15 Pro Max l├á smartphone mß║ính nhß║Ñt Apple vß╗¢i chip A17 Pro 3nm, GPU 6-core v├á khß║ú n─âng ray tracing phß║ºn cß╗⌐ng. Lß║ºn ─æß║ºu ti├¬n c├│ cß╗òng USB 3 (USB-C) vß╗¢i tß╗æc ─æß╗Ö 10Gbps. Camera Tetraprism 5x zoom quang hß╗ìc cho ß║únh v├á video chß║Ñt l╞░ß╗úng ─æiß╗çn ß║únh, hß╗ù trß╗ú quay ProRes 4K 60fps l├¬n iPhone trß╗▒c tiß║┐p.</p><ul><li>Γ£à Chip A17 Pro 3nm ΓÇô mß║ính nhß║Ñt tr├¬n smartphone</li><li>Γ£à Camera 48MP, 5x optical zoom Tetraprism</li><li>Γ£à USB 3 tß╗æc ─æß╗Ö 10Gbps ΓÇô kß║┐t nß╗æi ProRes trß╗▒c tiß║┐p</li><li>Γ£à Khung titan cß║Ñp 5 nhß║╣ v├á bß╗ün h╞ín th├⌐p</li></ul>','Apple A17 Pro | 8GB RAM | 256GB | 6.7\" Super Retina XDR ProMotion 120Hz | Camera 48MP | Khung Titan',34990000.00,NULL,20,5,2,6,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=375&fit=crop&q=85',1,1,612,4.90,'2026-04-20 12:52:14','2026-04-20 12:52:14',12,30000),(22,'Samsung Galaxy S24+','samsung-galaxy-s24-plus','<h2>Samsung Galaxy S24+ ΓÇô Flagship C├ón Bß║▒ng Ho├án Hß║úo</h2><p>Galaxy S24+ l├á lß╗▒a chß╗ìn l├╜ t╞░ß╗ƒng giß╗»a S24 v├á S24 Ultra: m├án h├¼nh to 6.7\" vß╗¢i pin 4900mAh, Snapdragon 8 Gen 3 for Galaxy, v├á Galaxy AI ─æß║ºy ─æß╗º t├¡nh n─âng. Khung nh├┤m Armor Aluminum bß╗ün bß╗ë, k├¡nh Gorilla Glass Victus 2 tr╞░ß╗¢c v├á sau.</p><ul><li>Γ£à Galaxy AI: Circle to Search, Live Translate, Note Assist</li><li>Γ£à Camera 50MP + 10MP 3x + 12MP ultrawide</li><li>Γ£à Sß║íc nhanh 45W + sß║íc kh├┤ng d├óy 15W</li><li>Γ£à Bß║úo h├ánh Samsung 7 n─âm OS update</li></ul>','Snapdragon 8 Gen 3 | 12GB RAM | 256GB | 6.7\" Dynamic AMOLED 2X 120Hz | Camera 50MP',27990000.00,25990000.00,22,5,2,7,'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=375&fit=crop&q=85',1,0,312,4.70,'2026-04-20 12:52:14','2026-04-20 12:52:14',12,30000),(23,'Apple iPhone 15','apple-iphone-15','<h2>Apple iPhone 15 ΓÇô iPhone Phß╗ò Th├┤ng Thß║┐ Hß╗ç Mß╗¢i</h2><p>iPhone 15 lß║ºn ─æß║ºu ti├¬n d├╣ng cß╗òng USB-C, camera 48MP ch├¡nh vß╗¢i pixel-binning 4-in-1, t├¡nh n─âng Action Mode quay video chß╗æng rung cß╗▒c tß╗æt. Dynamic Island thay cho notch truyß╗ün thß╗æng, chip A16 Bionic mß║ính mß║╜ v╞░ß╗út trß╗Öi mß╗ìi Android tß║ºm trung.</p><ul><li>Γ£à Camera 48MP ΓÇô chß║Ñt l╞░ß╗úng Pro tr├¬n phi├¬n bß║ún th╞░ß╗¥ng</li><li>Γ£à Dynamic Island ΓÇô hiß╗ân thß╗ï th├┤ng b├ío s├íng tß║ío</li><li>Γ£à USB-C ΓÇô d├╣ng chung d├óy sß║íc vß╗¢i MacBook, iPad</li><li>Γ£à Crash Detection v├á Emergency SOS qua vß╗ç tinh</li></ul>','Apple A16 Bionic | 6GB RAM | 128GB | 6.1\" Super Retina XDR 60Hz | Camera 48MP | USB-C',22990000.00,20990000.00,30,5,2,6,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=375&fit=crop&q=85',1,0,445,4.70,'2026-04-20 12:52:14','2026-04-20 12:52:14',12,30000),(26,'Samsung Galaxy A55 5G','samsung-galaxy-a55-5g','<h2>Samsung Galaxy A55 5G ΓÇô Tß║ºm Trung Cao Cß║Ñp IP67</h2><p>Galaxy A55 5G mang thiß║┐t kß║┐ kim loß║íi IP67 lß║ºn ─æß║ºu ti├¬n cho ph├ón kh├║c A-series, m├án Super AMOLED 120Hz sß║»c n├⌐t, camera OIS 50MP chß╗Ñp ß║únh ß╗òn ─æß╗ïnh. Exynos 1480 vß╗¢i 4 nh├ón AMD GPU cho hiß╗çu n─âng ─æß╗ô hß╗ìa v╞░ß╗út trß╗Öi ph├ón kh├║c, ─æß║úm bß║úo 4 n─âm OS update.</p><ul><li>Γ£à IP67 ΓÇô chß╗æng n╞░ß╗¢c 1m/30 ph├║t lß║ºn ─æß║ºu cho Galaxy A</li><li>Γ£à OPhone 50MP OIS ΓÇô ß║únh kh├┤ng rung, ─æ├¬m sß║»c n├⌐t</li><li>Γ£à AMD GPU ΓÇô ─æß╗ô hß╗ìa gaming tß╗æt nhß║Ñt tß║ºm trung</li><li>Γ£à 4 n─âm OS update + 5 n─âm bß║úo mß║¡t Samsung</li></ul>','Exynos 1480 | 8GB RAM | 256GB | 6.6\" Super AMOLED 120Hz | Camera 50MP OIS | IP67',9990000.00,8990000.00,40,5,2,7,'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=375&fit=crop&q=85',1,0,356,4.50,'2026-04-20 12:52:14','2026-04-20 12:52:14',12,30000),(37,'ASUS ROG Swift PG27UQR 4K 160Hz','asus-rog-swift-pg27uqr','<h2>ASUS ROG Swift PG27UQR ΓÇô 4K Gaming ─Éß╗ënh Cao G-Sync Ultimate</h2><p>PG27UQR l├á m├án gaming 4K 160Hz vß╗¢i chß╗⌐ng nhß║¡n G-Sync Ultimate ΓÇô chuß║⌐n cao nhß║Ñt NVIDIA cho m├án gaming. Panel Fast IPS 1ms GTG cho h├¼nh ß║únh 4K cß╗▒c sß║»c n├⌐t, HDR600 thß╗▒c chiß╗üu vß╗¢i 576 v├╣ng dimming cß╗Ñc bß╗Ö cho ─æß╗Ö t╞░╞íng phß║ún xuß║Ñt sß║»c. DisplayHDR 600 chuß║⌐n VESA.</p><ul><li>Γ£à G-Sync Ultimate ΓÇô hß╗ù trß╗ú HDR biß║┐n thi├¬n v├á reflex latency</li><li>Γ£à 4K 160Hz + 1ms GTG ΓÇô gaming ─æß╗ënh cao</li><li>Γ£à 576 zone local dimming ΓÇô HDR thß╗▒c chiß╗üu</li><li>Γ£à HDMI 2.1 x2 + DisplayPort 1.4 + USB Hub</li></ul>','27\" 4K UHD | IPS 160Hz | 1ms GTG | HDR600 | G-Sync Ultimate | HDMI 2.1',24990000.00,22990000.00,15,5,4,1,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=375&fit=crop&q=85',1,1,238,4.70,'2026-04-20 12:52:14','2026-04-22 10:52:13',12,30000),(38,'Dell Alienware AW3423DWF QD-OLED','dell-alienware-aw3423dwf','<h2>Dell Alienware AW3423DWF ΓÇô M├án QD-OLED Si├¬u Cong ─Éß╗ënh Nhß║Ñt</h2><p>AW3423DWF l├á m├án gaming curved QD-OLED ─æß║ºu ti├¬n cß╗ºa Alienware vß╗¢i c├┤ng nghß╗ç Quantum Dot OLED cho ─æß╗Ö t╞░╞íng phß║ún v├┤ cß╗▒c (true black), m├áu QD sß╗æng ─æß╗Öng vß╗¢i DCI-P3 99.3%. 165Hz vß╗¢i pixel 0.1ms kh├┤ng c├│ ghosting ngay cß║ú m├án cong. FreeSync Premium Pro kh├┤ng cß║ºn GPU NVIDIA.</p><ul><li>Γ£à QD-OLED ΓÇô t╞░╞íng phß║ún v├┤ cß╗▒c + m├áu Quantum Dot</li><li>Γ£à 0.1ms pixel response ΓÇô gaming kh├┤ng ghosting</li><li>Γ£à FreeSync Premium Pro t╞░╞íng th├¡ch mß╗ìi GPU</li><li>Γ£à Alienware Command Center RGB t├╣y chß╗ënh</li></ul>','34\" QD-OLED 3440x1440 | 165Hz | 0.1ms | 99.3% DCI-P3 | FreeSync Premium Pro',31990000.00,28990000.00,8,5,4,3,'https://images.unsplash.com/photo-1623520795272-e34e03a8aa9a?w=500&h=375&fit=crop&q=85',1,1,312,4.80,'2026-04-20 12:52:14','2026-04-20 12:52:14',12,30000),(42,'Samsung Odyssey Neo G9 57\" Dual UHD','samsung-odyssey-neo-g9-57','<h2>Samsung Odyssey Neo G9 57\" ΓÇô M├án H├¼nh Khß╗òng Lß╗ô Nh╞░ 2 M├án 32\"</h2><p>Neo G9 57\" l├á m├án h├¼nh gaming lß╗¢n nhß║Ñt, t╞░╞íng ─æ╞░╞íng 2 m├án 32\" QHD gh├⌐p ngang m├á kh├┤ng c├│ viß╗ün. Mini-LED vß╗¢i 2392 v├╣ng dimming cß╗Ñc bß╗Ö, HDR2000 ─æß╗Ö s├íng ─æß╗ënh 2000 nits, VA panel cho ─æß╗Ö t╞░╞íng phß║ún xuß║Ñt sß║»c. Immersive gaming v├á ─æa nhiß╗çm tß╗æi th╞░ß╗úng.</p><ul><li>Γ£à 57\" Dual UHD ΓÇô rß╗Öng nh╞░ 2 m├án h├¼nh 32\" kh├┤ng viß╗ün</li><li>Γ£à 2392 zone Mini-LED HDR2000 ΓÇô h├¼nh ß║únh ─æiß╗çn ß║únh</li><li>Γ£à 240Hz 1ms cong 1000R ΓÇô gaming immersive</li><li>Γ£à USB Hub, DP 2.1, HDMI 2.1 x4</li></ul>','57\" Dual UHD 7680x2160 | VA Mini-LED 240Hz | HDR2000 | G-Sync | Cong 1000R',49990000.00,44990000.00,5,5,4,7,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=375&fit=crop&q=85',1,1,389,4.70,'2026-04-20 12:52:14','2026-04-20 12:52:14',12,30000),(43,'ASUS ProArt PA329CV 4K Professional','asus-proart-pa329cv','<h2>ASUS ProArt PA329CV ΓÇô M├án Chuy├¬n ─Éß╗ô Hß╗ìa Chß╗⌐ng Nhß║¡n Calman</h2><p>ProArt PA329CV l├á m├án h├¼nh thiß║┐t kß║┐ chuy├¬n nghiß╗çp 32\" 4K vß╗¢i Thunderbolt 4 Hub t├¡ch hß╗úp kß║┐t nß╗æi daisy-chain tß╗¢i 2 m├án nß╗»a. Delta E < 2, sRGB 100%, DCI-P3 98% ─æ╞░ß╗úc hiß╗çu chß╗ënh sß║╡n tß╗½ nh├á m├íy, k├¿m chß╗⌐ng nhß║¡n m├áu c├í nh├ón. Calman Ready hß╗ù trß╗ú calibration phß║ºn mß╗üm chuy├¬n nghiß╗çp.</p><ul><li>Γ£à Thunderbolt 4 daisy-chain ΓÇô gh├⌐p 3 m├án 1 d├óy</li><li>Γ£à Calman Ready ΓÇô chuß║⌐n hiß╗çu chß╗ënh m├áu studio</li><li>Γ£à Delta E <2 factory-calibrated vß╗¢i chß╗⌐ng chß╗ë k├¿m theo</li><li>Γ£à USB-C 96W cß║Ñp nguß╗ôn laptop</li></ul>','32\" 4K UHD IPS | 100% sRGB | 98% DCI-P3 | Delta E <2 | Thunderbolt 4 | USB-C 96W | Calman Ready',38990000.00,35990000.00,8,5,4,1,'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&h=375&fit=crop&q=85',1,0,167,4.60,'2026-04-20 12:52:14','2026-04-20 12:52:14',12,30000),(44,'Dell UltraSharp U2723QE 4K USB-C','dell-ultrasharp-u2723qe','<h2>Dell UltraSharp U2723QE ΓÇô M├án Doanh Nh├ón USB-C Hub To├án Diß╗çn</h2><p>UltraSharp U2723QE d├╣ng panel IPS Black vß╗¢i ─æß╗Ö t╞░╞íng phß║ún 2000:1 ΓÇô gß║Ñp ─æ├┤i IPS th├┤ng th╞░ß╗¥ng, gß║ºn vß╗¢i VA. Cß╗òng USB-C 90W cß║Ñp nguß╗ôn laptop c├╣ng l├║c truyß╗ün dß╗» liß╗çu 10Gbps v├á ─æß║ºu ra video. RJ45 Ethernet t├¡ch hß╗úp biß║┐n m├án th├ánh dock ho├án chß╗ënh chß╗ë cß║ºn 1 d├óy USB-C.</p><ul><li>Γ£à IPS Black ΓÇô 2000:1 contrast, m├áu ─æen s├óu h╞ín IPS th╞░ß╗¥ng</li><li>Γ£à USB-C 90W + RJ45 + USB Hub ΓÇô dock trong mß╗Öt m├án</li><li>Γ£à Dell Display Manager 2.0 quß║ún l├╜ layout ─æa m├án</li><li>Γ£à 3 n─âm bß║úo h├ánh Dell Premium ΓÇô hß╗ù trß╗ú tß║¡n nh├á</li></ul>','27\" 4K IPS Black | 100% sRGB | 98% DCI-P3 | Delta E <2 | USB-C 90W | RJ45 LAN',13990000.00,12490000.00,22,5,4,3,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=375&fit=crop&q=85',1,0,241,4.70,'2026-04-20 12:52:14','2026-04-22 10:52:41',12,30000),(45,'Logitech G Pro X Superlight 2','logitech-g-pro-x-superlight-2','<h2>Logitech G Pro X Superlight 2 ΓÇô Chuß╗Öt Gaming Nhß║╣ Nhß║Ñt Thß║┐ Giß╗¢i</h2><p>G Pro X Superlight 2 giß║úm trß╗ìng l╞░ß╗úng c├▓n 60g ΓÇô nhß║╣ nhß║Ñt trong lß╗ïch sß╗¡ Logitech, kh├┤ng ß║únh h╞░ß╗ƒng ─æß╗Ö bß╗ün. Cß║úm biß║┐n HERO 2 25600 DPI vß╗¢i ─æß╗Ö ch├¡nh x├íc pixel-perfect, kh├┤ng t─âng tß╗æc, kh├┤ng l├ám mß╗ïn. Kß║┐t nß╗æi LIGHTSPEED 2.4GHz ─æß╗Ö trß╗à 1ms. ─É╞░ß╗úc c├íc pro player CSGO, Valorant ╞░a th├¡ch nhß║Ñt.</p><ul><li>Γ£à 60g ΓÇô chuß╗Öt gaming nhß║╣ nhß║Ñt Logitech tß╗½ tr╞░ß╗¢c ─æß║┐n nay</li><li>Γ£à HERO 2 sensor 25600 DPI ΓÇô ch├¡nh x├íc pixel-perfect</li><li>Γ£à LIGHTSPEED wireless 1ms ΓÇô kh├┤ng thua c├│ d├óy</li><li>Γ£à Pin 95 giß╗¥ kh├┤ng cß║ºn lo sß║íc giß╗»a chß╗½ng</li></ul>','Cß║úm biß║┐n HERO 2 25600 DPI | 60g si├¬u nhß║╣ | Wireless 2.4GHz | Pin 95 giß╗¥ | PTFE',3190000.00,2890000.00,35,5,5,9,'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',1,1,414,4.80,'2026-04-20 12:52:14','2026-04-22 02:56:29',12,30000),(46,'Razer DeathAdder V3 Pro Wireless','razer-deathadder-v3-pro','<h2>Razer DeathAdder V3 Pro ΓÇô Ergonomic Flagship Kh├┤ng D├óy</h2><p>DeathAdder V3 Pro kß║┐ thß╗½a thiß║┐t kß║┐ ergonomic huyß╗ün thoß║íi cß╗ºa d├▓ng DeathAdder vß╗¢i trß╗ìng l╞░ß╗úng chß╗ë 63g nhß╗¥ vß╗Å plastic rß╗ùng Speedflex. Focus Pro 35K DPI hoß║ít ─æß╗Öng tr├¬n mß╗ìi bß╗ü mß║╖t kß╗â cß║ú k├¡nh v├á vß║úi. Kß║┐t nß╗æi HyperSpeed wireless lag 25% thß║Ñp h╞ín ─æß╗æi thß╗º.</p><ul><li>Γ£à Thiß║┐t kß║┐ ergonomic 30 n─âm ho├án thiß╗çn ΓÇô thoß║úi m├íi d├ái ng├áy</li><li>Γ£à Focus Pro 35K DPI ΓÇô ch├¡nh x├íc tuyß╗çt ─æß╗æi mß╗ìi bß╗ü mß║╖t</li><li>Γ£à Speedflex vß╗Å rß╗ùng ΓÇô nhß║╣ 63g kh├┤ng giß║úm ─æß╗Ö bß╗ün</li><li>Γ£à HyperSpeed wireless ΓÇô lag thß║Ñp nhß║Ñt thß╗ï tr╞░ß╗¥ng</li></ul>','Focus Pro 35K DPI | 63g | Ergonomic | HyperSpeed 2.4GHz | Pin 90 giß╗¥',2990000.00,2690000.00,28,5,5,10,'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',1,0,312,4.70,'2026-04-20 12:52:14','2026-04-20 12:52:14',12,30000),(47,'Corsair K100 RGB Optical-Mechanical','corsair-k100-rgb','<h2>Corsair K100 RGB ΓÇô B├án Ph├¡m Gaming Flagship Cß╗ºa Corsair</h2><p>K100 RGB l├á b├án ph├¡m gaming ─æß╗ënh nhß║Ñt cß╗ºa Corsair vß╗¢i switch Optical-Mech OPX actuate bß║▒ng ├ính s├íng ΓÇô kh├┤ng c├│ tiß║┐p ─æiß╗âm c╞í hß╗ìc, kh├┤ng m├ái m├▓n, 150 triß╗çu lß║ºn nhß║Ñn. iCUE Multi-Function Wheel t├╣y chß╗ënh ├óm l╞░ß╗úng, macro, zoom cho tß╗½ng ß╗⌐ng dß╗Ñng. Khung polycarbonate trong suß╗æt cho RGB cß╗▒c ─æß║╣p.</p><ul><li>Γ£à OPX Optical-Mech ΓÇô 0.4mm actuate, kh├┤ng thß╗â debounce</li><li>Γ£à iCUE Wheel ΓÇô n├║m ─æa chß╗⌐c n─âng theo ß╗⌐ng dß╗Ñng</li><li>Γ£à Khung polycarbonate trong ΓÇô RGB xuy├¬n thß║Ñu ─æß║╣p nhß║Ñt</li><li>Γ£à 44-zone RAG backlit, 20MB onboard storage</li></ul>','OPX Optical-Mech Switch | Per-key RGB | iCUE Wheel | Polycarbonate Frame | Macro',4490000.00,3990000.00,20,5,5,19,'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=375&fit=crop&q=85',1,0,234,4.60,'2026-04-20 12:52:14','2026-04-20 12:52:14',12,30000),(111,'Laptop Gaming ASUS ROG Strix G15','laptop-gaming-asus-rog-strix-g15-111','<h2>Sß╗⌐c mß║ính tuyß╗çt ─æß╗ënh</h2><p>─É╞░ß╗úc trang bß╗ï vi xß╗¡ l├╜ mß║ính mß║╜ v├á card ─æß╗ô hß╗ìa RTX, ASUS ROG Strix G15 mang ─æß║┐n trß║úi nghiß╗çm ch╞íi game m╞░ß╗út m├á nhß║Ñt.</p>','RTX 3050 | 144Hz | 8GB RAM',25000000.00,23990000.00,46,5,13,1,'https://placehold.co/600x400/1E293B/3B82F6?text=ASUS+ROG+Strix+G15',1,0,25,0.00,'2026-04-22 03:03:29','2026-04-22 11:30:11',12,30000),(112,'Laptop Gaming Acer Nitro 5','laptop-gaming-acer-nitro-5-9866','<h2>Thiß║┐t kß║┐ hß║ºm hß╗æ, tß║ún nhiß╗çt m├ít mß║╗</h2><p>Acer Nitro 5 phi├¬n bß║ún mß╗¢i nhß║Ñt vß╗¢i hß╗ç thß╗æng tß║ún nhiß╗çt k├⌐p v├á c├┤ng nghß╗ç CoolBoost.</p>','GTX 1650 | 144Hz | 8GB RAM',22000000.00,20500000.00,45,5,13,6,'https://placehold.co/600x400/1E293B/3B82F6?text=Acer+Nitro+5',1,0,9,0.00,'2026-04-22 03:03:29','2026-04-22 16:30:03',12,30000),(113,'Laptop Dell Inspiron 15','laptop-dell-inspiron-15-9869','<h2>Mß╗Ång nhß║╣, thanh lß╗ïch</h2><p>Dell Inspiron 15 l├á sß╗▒ lß╗▒a chß╗ìn ho├án hß║úo cho sinh vi├¬n v├á d├ón v─ân ph├▓ng vß╗¢i thiß║┐t kß║┐ ─æß║╣p mß║»t v├á hiß╗çu n─âng ß╗òn ─æß╗ïnh.</p>','Core i5 | 8GB RAM | 512GB SSD',15000000.00,14200000.00,46,5,14,6,'https://placehold.co/600x400/1E293B/3B82F6?text=Dell+Inspiron+15',1,0,2,0.00,'2026-04-22 03:03:29','2026-04-22 08:28:03',12,30000),(114,'Laptop HP Pavilion 14','laptop-hp-pavilion-14-9873','<h2>Hiß╗çu suß║Ñt cao cho c├┤ng viß╗çc</h2><p>M├án h├¼nh sß║»c n├⌐t, thß╗¥i l╞░ß╗úng pin l├óu d├ái gi├║p bß║ín l├ám viß╗çc hiß╗çu quß║ú cß║ú ng├áy d├ái.</p>','Ryzen 5 | 8GB RAM | 256GB SSD',16500000.00,15900000.00,46,5,14,6,'https://placehold.co/600x400/1E293B/3B82F6?text=HP+Pavilion+14',1,0,0,0.00,'2026-04-22 03:03:29','2026-04-22 03:16:05',12,30000);
/*!40000 ALTER TABLE `san_pham` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thong_bao` (
  `ma_thong_bao` int(11) NOT NULL AUTO_INCREMENT,
  `ma_nguoi_dung` int(11) NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `loai` varchar(50) DEFAULT 'system',
  `da_doc` tinyint(1) DEFAULT 0,
  `ma_tham_chieu` varchar(50) DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ma_thong_bao`),
  KEY `ma_nguoi_dung` (`ma_nguoi_dung`),
  CONSTRAINT `thong_bao_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `thong_bao` DISABLE KEYS */;
INSERT INTO `thong_bao` VALUES (1,1,'─É╞ín h├áng ─æ├ú giao','─É╞ín h├áng #DH-123 cß╗ºa bß║ín ─æ├ú ─æ╞░ß╗úc giao th├ánh c├┤ng.','order',0,'123','2026-04-22 03:36:00'),(2,1,'Voucher mß╗¢i','Bß║ín vß╗½a nhß║¡n ─æ╞░ß╗úc voucher giß║úm gi├í 10% tß╗½ hß╗ç thß╗æng.','voucher',0,'VOUCHER10','2026-04-22 03:36:00'),(3,1,'Bß║úo h├ánh duyß╗çt','Y├¬u cß║ºu bß║úo h├ánh SP123 cß╗ºa bß║ín ─æ├ú ─æ╞░ß╗úc duyß╗çt.','warranty',0,'W-456','2026-04-22 03:36:00'),(4,3,'TechStore ─æ├ú trß║ú lß╗¥i ─æ├ính gi├í cß╗ºa bß║ín','Admin ─æ├ú phß║ún hß╗ôi ─æ├ính gi├í sß║ún phß║⌐m \"ASUS Vivobook Pro 16X OLED\" cß╗ºa bß║ín. Nhß║Ñn ─æß╗â xem chi tiß║┐t.','danh_gia',0,'1','2026-04-22 14:39:36'),(5,3,'TechStore ─æ├ú trß║ú lß╗¥i ─æ├ính gi├í cß╗ºa bß║ín','Admin ─æ├ú phß║ún hß╗ôi ─æ├ính gi├í sß║ún phß║⌐m \"ASUS Vivobook Pro 16X OLED\" cß╗ºa bß║ín. Nhß║Ñn ─æß╗â xem chi tiß║┐t.','danh_gia',0,'1','2026-04-22 14:39:45'),(6,3,'─Éß║╖t h├áng th├ánh c├┤ng! ≡ƒÄë','─É╞ín h├áng #DH-22042026-002 ─æ├ú ─æ╞░ß╗úc tß║ío. Tß╗òng tiß╗ün: 20.500.000─æ','don_hang',0,'DH-22042026-002','2026-04-22 16:30:03'),(7,3,'Cß║¡p nhß║¡t ─æ╞ín h├áng #DH-22042026-002','─É╞ín h├áng cß╗ºa bß║ín ─æ├ú ─æ╞░ß╗úc x├íc nhß║¡n.','don_hang',0,'DH-22042026-002','2026-04-22 16:35:36'),(8,3,'Cß║¡p nhß║¡t ─æ╞ín h├áng #DH-22042026-002','─É╞ín h├áng cß╗ºa bß║ín ─æang ─æ╞░ß╗úc vß║¡n chuyß╗ân.','don_hang',0,'DH-22042026-002','2026-04-22 16:35:39'),(9,3,'Cß║¡p nhß║¡t ─æ╞ín h├áng #DH-22042026-002','─É╞ín h├áng cß╗ºa bß║ín ─æ├ú giao th├ánh c├┤ng.','don_hang',0,'DH-22042026-002','2026-04-22 16:35:41'),(10,3,'Cß║¡p nhß║¡t ─æ╞ín h├áng #DH-20260422-3566','─É╞ín h├áng cß╗ºa bß║ín ─æ├ú giao th├ánh c├┤ng.','don_hang',0,'DH-20260422-3566','2026-04-22 16:35:44'),(11,3,'Cß║¡p nhß║¡t ─æ╞ín h├áng #DH-20260421-4958','─É╞ín h├áng cß╗ºa bß║ín ─æang ─æ╞░ß╗úc vß║¡n chuyß╗ân.','don_hang',0,'DH-20260421-4958','2026-04-22 16:35:45'),(12,3,'Cß║¡p nhß║¡t ─æ╞ín h├áng #DH-20260421-4958','─É╞ín h├áng cß╗ºa bß║ín ─æ├ú giao th├ánh c├┤ng.','don_hang',0,'DH-20260421-4958','2026-04-22 16:35:46');
/*!40000 ALTER TABLE `thong_bao` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thong_so_ky_thuat` (
  `ma_thong_so` int(11) NOT NULL AUTO_INCREMENT,
  `ma_san_pham` int(11) NOT NULL,
  `ten_thong_so` varchar(100) NOT NULL,
  `gia_tri` varchar(255) NOT NULL,
  `don_vi` varchar(50) DEFAULT NULL,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ma_thong_so`),
  KEY `idx_san_pham` (`ma_san_pham`),
  CONSTRAINT `thong_so_ky_thuat_ibfk_1` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=221 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thong so ky thuat cua tung san pham';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `thong_so_ky_thuat` DISABLE KEYS */;
INSERT INTO `thong_so_ky_thuat` VALUES (1,1,'CPU','Intel Core i9-14900HX (24 nh├ón, 32 luß╗ông, 2.2GHz ΓÇô 5.8GHz)',NULL,1),(2,1,'GPU','NVIDIA GeForce RTX 4080 12GB GDDR6X',NULL,2),(3,1,'RAM','32GB DDR5 4800MHz (2 khe, tß╗æi ─æa 64GB)','GB',3),(4,1,'ß╗ö cß╗⌐ng','1TB NVMe PCIe 4.0 SSD (+ 1 khe M.2 trß╗æng)',NULL,4),(5,1,'M├án h├¼nh','16\" QHD+ (2560├ù1600) IPS 240Hz, 3ms, G-Sync',NULL,5),(6,1,'Pin','90Wh, sß║íc 240W','Wh',6),(7,1,'Kß║┐t nß╗æi','Wi-Fi 6E, Bluetooth 5.3',NULL,7),(8,1,'Cß╗òng kß║┐t nß╗æi','Thunderbolt 4, USB-A x3, HDMI 2.1, RJ45, 3.5mm',NULL,8),(9,1,'Trß╗ìng l╞░ß╗úng','2.5','kg',9),(10,1,'Hß╗ç ─æiß╗üu h├ánh','Windows 11 Home',NULL,10),(21,3,'CPU','Intel Core i7-13700H (14 nh├ón, 20 luß╗ông, tß╗¢i 5.0GHz)',NULL,1),(22,3,'GPU','NVIDIA GeForce RTX 4060 8GB GDDR6',NULL,2),(23,3,'RAM','16GB LPDDR5 6400MHz (h├án liß╗ün)','GB',3),(24,3,'ß╗ö cß╗⌐ng','512GB NVMe PCIe 4.0 SSD',NULL,4),(25,3,'M├án h├¼nh','15.6\" OLED 3.5K (3456├ù2160) 120Hz, 400 nits, 100% DCI-P3',NULL,5),(26,3,'Pin','86Wh, sß║íc nhanh 130W','Wh',6),(27,3,'Kß║┐t nß╗æi','Wi-Fi 6E, Bluetooth 5.3',NULL,7),(28,3,'Cß╗òng kß║┐t nß╗æi','Thunderbolt 4 x2, USB-A, HDMI 2.0, SD Full-size, 3.5mm',NULL,8),(29,3,'Webcam','720p IR, nhß║¡n diß╗çn khu├┤n mß║╖t Windows Hello',NULL,9),(30,3,'Trß╗ìng l╞░ß╗úng','1.86','kg',10),(31,4,'CPU','Intel Core i7-13700H (14 nh├ón, 20 luß╗ông, tß╗¢i 5.0GHz)',NULL,1),(32,4,'GPU','NVIDIA GeForce RTX 4060 8GB GDDR6',NULL,2),(33,4,'RAM','32GB DDR5 4800MHz (2 khe SO-DIMM)','GB',3),(34,4,'ß╗ö cß╗⌐ng','1TB NVMe PCIe 4.0 SSD',NULL,4),(35,4,'M├án h├¼nh','16\" OLED 2.5K (2560├ù1600) 120Hz, 500 nits, HDR True Black 500',NULL,5),(36,4,'Pin','83Wh, sß║íc nhanh 140W USB-C','Wh',6),(37,4,'Kß║┐t nß╗æi','Wi-Fi 6E, Bluetooth 5.3',NULL,7),(38,4,'Cß╗òng kß║┐t nß╗æi','Thunderbolt 4, USB-A x2, HDMI 2.1, MicroSD, 3.5mm',NULL,8),(39,4,'Webcam','5MP AI with Temporal Noise Reduction',NULL,9),(40,4,'Trß╗ìng l╞░ß╗úng','2.04','kg',10),(51,6,'Chip','Apple M3 Max (16-core CPU: 12P+4E, 40-core GPU)',NULL,1),(52,6,'RAM','36GB Unified Memory (400GB/s bandwidth)','GB',2),(53,6,'ß╗ö cß╗⌐ng','1TB SSD NVMe (tß╗¢i 7.5GB/s)',NULL,3),(54,6,'M├án h├¼nh','16.2\" Liquid Retina XDR, 3456├ù2160 (254ppi), ProMotion 120Hz, 1600 nits',NULL,4),(55,6,'Pin','100Wh (~22 giß╗¥ ph├ít video), sß║íc 140W MagSafe 3','Wh',5),(56,6,'Kß║┐t nß╗æi','Wi-Fi 6E, Bluetooth 5.3',NULL,6),(57,6,'Cß╗òng kß║┐t nß╗æi','Thunderbolt 4 x3, HDMI 2.1, SD UHS-II, MagSafe 3, 3.5mm',NULL,7),(58,6,'Webcam','12MP Center Stage, tß╗▒ c─ân chß╗ënh theo ng╞░ß╗¥i d├╣ng',NULL,8),(59,6,'├ém thanh','6 loa stereo Spatial Audio, hß╗ù trß╗ú Dolby Atmos',NULL,9),(60,6,'Trß╗ìng l╞░ß╗úng','2.14','kg',10),(81,9,'Cß║úm biß║┐n','Darkfield High Precision',NULL,1),(82,9,'DPI','200 ΓÇô 8000 (─æiß╗üu chß╗ënh ─æ╞░ß╗úc)','DPI',2),(83,9,'N├║t bß║Ñm','7 n├║t lß║¡p tr├¼nh ─æ╞░ß╗úc',NULL,3),(84,9,'Kß║┐t nß╗æi','Bluetooth Low Energy + USB Logi Bolt (2.4GHz)',NULL,4),(85,9,'Sß╗æ thiß║┐t bß╗ï kß║┐t nß╗æi','3 (Easy-Switch)',NULL,5),(86,9,'Pin','500mAh, ~70 ng├áy (tß║»t tiß║┐ng ß╗ôn)',NULL,6),(87,9,'Sß║íc','USB-C, 1 ph├║t sß║íc = 3 giß╗¥ d├╣ng',NULL,7),(88,9,'Trß╗ìng l╞░ß╗úng','141','g',8),(89,9,'T╞░╞íng th├¡ch','Windows, macOS, Linux, ChromeOS, iPadOS',NULL,9),(90,9,'M├áu sß║»c','Space Grey / Pale Grey / Graphite',NULL,10),(121,17,'CPU','Snapdragon 8 Gen 3 for Galaxy (4nm)',NULL,1),(122,17,'RAM','12','GB',2),(123,17,'Bß╗Ö nhß╗¢ trong','256GB (UFS 4.0)',NULL,3),(124,17,'M├án h├¼nh','6.8\" Dynamic AMOLED 2X, QHD+ 3088x1440, 120Hz Adaptive, 2600 nits',NULL,4),(125,17,'Camera sau','200MP (wide) + 50MP (5x periscope) + 10MP (3x) + 12MP (ultrawide)',NULL,5),(126,17,'Camera tr╞░ß╗¢c','12MP',NULL,6),(127,17,'Pin','5000mAh, sß║íc 45W, kh├┤ng d├óy 15W, ng╞░ß╗úc 4.5W',NULL,7),(128,17,'Kß║┐t nß╗æi','5G, WiFi 7, Bluetooth 5.3, NFC, USB-C 3.2',NULL,8),(129,17,'Chß╗æng n╞░ß╗¢c','IP68 (2m/30 ph├║t)',NULL,9),(130,17,'K├¡ch th╞░ß╗¢c','162.3 x 79 x 8.6mm, 232g, khung Titanium',NULL,10),(131,18,'CPU','Apple A17 Pro (3nm) ΓÇô 6-core, GPU 6-core',NULL,1),(132,18,'RAM','8','GB',2),(133,18,'Bß╗Ö nhß╗¢ trong','256GB (t├╣y chß╗ìn 512GB, 1TB)',NULL,3),(134,18,'M├án h├¼nh','6.7\" Super Retina XDR OLED, 2796x1290, ProMotion 1-120Hz, 2000 nits',NULL,4),(135,18,'Camera sau','48MP main (f/1.78) + 12MP ultrawide + 12MP 5x periscope Tetraprism',NULL,5),(136,18,'Camera tr╞░ß╗¢c','12MP TrueDepth, EIS',NULL,6),(137,18,'Pin','4422mAh, MagSafe 15W, sß║íc nhanh 27W',NULL,7),(138,18,'Kß║┐t nß╗æi','5G, WiFi 6E, Bluetooth 5.3, NFC, USB-C (USB 3) 10Gbps',NULL,8),(139,18,'Chß╗æng n╞░ß╗¢c','IP68 (6m/30 ph├║t)',NULL,9),(140,18,'K├¡ch th╞░ß╗¢c','159.9 x 76.7 x 8.25mm, 221g, khung Titanium Grade 5',NULL,10),(151,37,'K├¡ch th╞░ß╗¢c','27','inch',1),(152,37,'─Éß╗Ö ph├ón giß║úi','3840├ù2160 (4K UHD)',NULL,2),(153,37,'Tß║ºn sß╗æ qu├⌐t','160','Hz',3),(154,37,'Tß║Ñm nß╗ün','Fast IPS',NULL,4),(155,37,'Thß╗¥i gian phß║ún hß╗ôi','1 (GTG)','ms',5),(156,37,'HDR','HDR600, 576 local dimming zones',NULL,6),(157,37,'M├áu sß║»c','DCI-P3 90%, sRGB 130%',NULL,7),(158,37,'T╞░╞íng th├¡ch','G-Sync Ultimate',NULL,8),(159,37,'Cß╗òng kß║┐t nß╗æi','HDMI 2.1 x2, DisplayPort 1.4, USB Hub 3.0 x3',NULL,9),(160,37,'T├¡nh n─âng','G-Sync Ultimate, Aim Point, Shadow Boost, ROG Strix lighting',NULL,10),(205,112,'CPU','Intel Core i5-11400H',NULL,0),(206,112,'RAM','8GB DDR4',NULL,1),(207,112,'GPU','NVIDIA GTX 1650',NULL,2),(208,112,'M├án h├¼nh','15.6\" FHD 144Hz',NULL,3),(209,113,'CPU','Intel Core i5-1135G7',NULL,0),(210,113,'RAM','8GB DDR4',NULL,1),(211,113,'ß╗ö cß╗⌐ng','512GB SSD NVMe',NULL,2),(212,113,'M├án h├¼nh','15.6\" FHD',NULL,3),(213,114,'CPU','AMD Ryzen 5 5500U',NULL,0),(214,114,'RAM','8GB DDR4',NULL,1),(215,114,'ß╗ö cß╗⌐ng','256GB SSD NVMe',NULL,2),(216,114,'M├án h├¼nh','14\" FHD IPS',NULL,3),(217,111,'CPU','AMD Ryzen 7 4800H',NULL,0),(218,111,'RAM','8GB DDR4',NULL,1),(219,111,'GPU','NVIDIA RTX 3050',NULL,2),(220,111,'M├án h├¼nh','15.6\" FHD 144Hz',NULL,3);
/*!40000 ALTER TABLE `thong_so_ky_thuat` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thuong_hieu` (
  `ma_thuong_hieu` int(11) NOT NULL AUTO_INCREMENT,
  `ten_thuong_hieu` varchar(100) NOT NULL,
  `duong_dan` varchar(120) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `quoc_gia` varchar(50) DEFAULT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ma_thuong_hieu`),
  UNIQUE KEY `ten_thuong_hieu` (`ten_thuong_hieu`),
  UNIQUE KEY `duong_dan` (`duong_dan`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bang thuong hieu san pham';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `thuong_hieu` DISABLE KEYS */;
INSERT INTO `thuong_hieu` VALUES (1,'ASUS','asus',NULL,'─É├ái Loan',1,'2026-04-20 04:00:40'),(2,'MSI','msi',NULL,'─É├ái Loan',1,'2026-04-20 04:00:40'),(3,'Dell','dell',NULL,'Mß╗╣',1,'2026-04-20 04:00:40'),(4,'HP','hp',NULL,'Mß╗╣',1,'2026-04-20 04:00:40'),(6,'Apple','apple',NULL,'Mß╗╣',1,'2026-04-20 04:00:40'),(7,'Samsung','samsung',NULL,'H├án Quß╗æc',1,'2026-04-20 04:00:40'),(9,'Logitech','logitech',NULL,'Thß╗Ñy S─⌐',1,'2026-04-20 04:00:40'),(10,'Razer','razer',NULL,'Mß╗╣',1,'2026-04-20 04:00:40'),(19,'Corsair','corsair',NULL,'Mß╗╣',1,'2026-04-20 12:52:14');
/*!40000 ALTER TABLE `thuong_hieu` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voucher_nguoi_dung` (
  `ma_id` int(11) NOT NULL AUTO_INCREMENT,
  `ma_voucher` int(11) NOT NULL,
  `ma_nguoi_dung` int(11) NOT NULL,
  `da_su_dung` tinyint(1) NOT NULL DEFAULT 0,
  `ngay_gui` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_su_dung` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ma_id`),
  UNIQUE KEY `uq_vc_user` (`ma_voucher`,`ma_nguoi_dung`),
  KEY `idx_nguoi_dung` (`ma_nguoi_dung`),
  KEY `idx_voucher` (`ma_voucher`),
  CONSTRAINT `voucher_nguoi_dung_ibfk_1` FOREIGN KEY (`ma_voucher`) REFERENCES `ma_giam_gia` (`ma_voucher`) ON DELETE CASCADE,
  CONSTRAINT `voucher_nguoi_dung_ibfk_2` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Voucher da duoc cap phat cho nguoi dung cu the';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `voucher_nguoi_dung` DISABLE KEYS */;
INSERT INTO `voucher_nguoi_dung` VALUES (1,2,3,0,'2026-04-21 15:41:03',NULL),(2,4,3,0,'2026-04-21 15:41:19',NULL),(3,1,3,1,'2026-04-21 15:42:30','2026-04-22 03:16:05'),(4,3,3,1,'2026-04-22 03:08:38','2026-04-22 16:30:03'),(5,3,4,0,'2026-04-22 03:08:38',NULL),(6,3,5,0,'2026-04-22 03:08:38',NULL);
/*!40000 ALTER TABLE `voucher_nguoi_dung` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `yeu_cau_bao_hanh` (
  `ma_bao_hanh` int(11) NOT NULL AUTO_INCREMENT,
  `ma_nguoi_dung` int(11) NOT NULL,
  `ma_chi_tiet_dh` int(11) NOT NULL,
  `so_serial` varchar(100) DEFAULT NULL,
  `mo_ta_su_co` text NOT NULL,
  `hinh_thuc` enum('buu_dien','ship_ve','den_cua_hang') NOT NULL DEFAULT 'buu_dien' COMMENT 'Hinh thuc gui bao hanh',
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `lich_hen` datetime DEFAULT NULL,
  `trang_thai` enum('cho_xu_ly','dang_xu_ly','hoan_thanh','tu_choi') NOT NULL DEFAULT 'cho_xu_ly',
  `ma_nhan_vien_xu_ly` int(11) DEFAULT NULL,
  `ghi_chu_xu_ly` text DEFAULT NULL,
  `ngay_tiep_nhan` datetime NOT NULL DEFAULT current_timestamp(),
  `ngay_hoan_thanh` datetime DEFAULT NULL,
  PRIMARY KEY (`ma_bao_hanh`),
  KEY `ma_chi_tiet_dh` (`ma_chi_tiet_dh`),
  KEY `ma_nhan_vien_xu_ly` (`ma_nhan_vien_xu_ly`),
  KEY `idx_nguoi_dung` (`ma_nguoi_dung`),
  KEY `idx_trang_thai` (`trang_thai`),
  CONSTRAINT `yeu_cau_bao_hanh_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`),
  CONSTRAINT `yeu_cau_bao_hanh_ibfk_2` FOREIGN KEY (`ma_chi_tiet_dh`) REFERENCES `chi_tiet_don_hang` (`ma_chi_tiet`),
  CONSTRAINT `yeu_cau_bao_hanh_ibfk_3` FOREIGN KEY (`ma_nhan_vien_xu_ly`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Yeu cau bao hanh san pham cua khach hang';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `yeu_cau_bao_hanh` DISABLE KEYS */;
INSERT INTO `yeu_cau_bao_hanh` VALUES (1,3,1,NULL,'ad','den_cua_hang','0123456789','2026-04-22 21:52:00','cho_xu_ly',NULL,NULL,'2026-04-21 21:53:09',NULL);
/*!40000 ALTER TABLE `yeu_cau_bao_hanh` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `yeu_thich` (
  `ma_yeu_thich` int(11) NOT NULL AUTO_INCREMENT,
  `ma_nguoi_dung` int(11) NOT NULL,
  `ma_san_pham` int(11) NOT NULL,
  `ngay_them` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ma_yeu_thich`),
  UNIQUE KEY `uq_nguoi_sp` (`ma_nguoi_dung`,`ma_san_pham`),
  KEY `ma_san_pham` (`ma_san_pham`),
  KEY `idx_nguoi_dung` (`ma_nguoi_dung`),
  CONSTRAINT `yeu_thich_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`) ON DELETE CASCADE,
  CONSTRAINT `yeu_thich_ibfk_2` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sach san pham yeu thich cua nguoi dung';
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `yeu_thich` DISABLE KEYS */;
INSERT INTO `yeu_thich` VALUES (6,2,18,'2026-04-20 14:48:28'),(7,2,15,'2026-04-20 14:48:29'),(8,2,14,'2026-04-20 14:48:30'),(27,3,18,'2026-04-22 05:58:21'),(28,3,17,'2026-04-22 05:58:22'),(41,3,111,'2026-04-22 10:49:07'),(42,3,46,'2026-04-22 12:45:42');
/*!40000 ALTER TABLE `yeu_thich` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

