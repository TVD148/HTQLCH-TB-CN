-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: htqlch_thietbi_cn
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

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

--
-- Table structure for table `anh_san_pham`
--

DROP TABLE IF EXISTS `anh_san_pham`;
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

--
-- Dumping data for table `anh_san_pham`
--

LOCK TABLES `anh_san_pham` WRITE;
/*!40000 ALTER TABLE `anh_san_pham` DISABLE KEYS */;
/*!40000 ALTER TABLE `anh_san_pham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_don_hang`
--

DROP TABLE IF EXISTS `chi_tiet_don_hang`;
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

--
-- Dumping data for table `chi_tiet_don_hang`
--

LOCK TABLES `chi_tiet_don_hang` WRITE;
/*!40000 ALTER TABLE `chi_tiet_don_hang` DISABLE KEYS */;
INSERT INTO `chi_tiet_don_hang` (`ma_chi_tiet`, `ma_don_hang`, `ma_san_pham`, `ten_san_pham`, `anh_san_pham`, `don_gia`, `so_luong`, `thanh_tien`) VALUES (1,1,15,'ASUS Vivobook Pro 16X OLED','https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85',32990000.00,1,32990000.00),(2,2,111,'Laptop Gaming ASUS ROG Strix G15','https://placehold.co/600x400/1E293B/3B82F6?text=ASUS+ROG+Strix+G15',23990000.00,4,95960000.00),(3,2,112,'Laptop Gaming Acer Nitro 5','https://placehold.co/600x400/1E293B/3B82F6?text=Acer+Nitro+5',20500000.00,4,82000000.00),(4,2,113,'Laptop Dell Inspiron 15','https://placehold.co/600x400/1E293B/3B82F6?text=Dell+Inspiron+15',14200000.00,4,56800000.00),(5,2,114,'Laptop HP Pavilion 14','https://placehold.co/600x400/1E293B/3B82F6?text=HP+Pavilion+14',15900000.00,4,63600000.00),(14,11,112,'Laptop Gaming Acer Nitro 5','https://placehold.co/600x400/1E293B/3B82F6?text=Acer+Nitro+5',20500000.00,1,20500000.00);
/*!40000 ALTER TABLE `chi_tiet_don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_flash_sale`
--

DROP TABLE IF EXISTS `chi_tiet_flash_sale`;
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

--
-- Dumping data for table `chi_tiet_flash_sale`
--

LOCK TABLES `chi_tiet_flash_sale` WRITE;
/*!40000 ALTER TABLE `chi_tiet_flash_sale` DISABLE KEYS */;
INSERT INTO `chi_tiet_flash_sale` (`ma_chi_tiet`, `ma_flash_sale`, `ma_san_pham`, `gia_flash`, `so_luong_gioi_han`, `da_ban`) VALUES (1,1,9,1791000.00,NULL,0),(2,1,47,3591000.00,NULL,0),(3,1,44,11241000.00,NULL,0),(4,1,46,2421000.00,NULL,0),(5,1,26,8091000.00,NULL,0),(6,1,42,40491000.00,NULL,0);
/*!40000 ALTER TABLE `chi_tiet_flash_sale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_gio_hang`
--

DROP TABLE IF EXISTS `chi_tiet_gio_hang`;
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

--
-- Dumping data for table `chi_tiet_gio_hang`
--

LOCK TABLES `chi_tiet_gio_hang` WRITE;
/*!40000 ALTER TABLE `chi_tiet_gio_hang` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_gio_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_gia`
--

DROP TABLE IF EXISTS `danh_gia`;
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

--
-- Dumping data for table `danh_gia`
--

LOCK TABLES `danh_gia` WRITE;
/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
INSERT INTO `danh_gia` (`ma_danh_gia`, `ma_nguoi_dung`, `ma_san_pham`, `ma_chi_tiet_dh`, `so_sao`, `binh_luan`, `phan_hoi_admin`, `ngay_phan_hoi`, `da_duyet`, `ngay_tao`) VALUES (1,3,15,1,5,'san pham tot','shop cam on\nnhe','2026-04-22 14:39:45',1,'2026-04-22 02:43:43');
/*!40000 ALTER TABLE `danh_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_muc`
--

DROP TABLE IF EXISTS `danh_muc`;
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

--
-- Dumping data for table `danh_muc`
--

LOCK TABLES `danh_muc` WRITE;
/*!40000 ALTER TABLE `danh_muc` DISABLE KEYS */;
INSERT INTO `danh_muc` (`ma_danh_muc`, `ten_danh_muc`, `duong_dan`, `mo_ta`, `hinh_anh`, `ma_danh_muc_cha`, `trang_thai`, `thu_tu`, `ngay_tao`) VALUES (1,'Laptop','laptop','M??y t??nh x??ch tay c??c lo???i',NULL,NULL,1,1,'2026-04-20 04:00:40'),(2,'??i???n tho???i','dien-thoai','??i???n tho???i th??ng minh',NULL,NULL,1,2,'2026-04-20 04:00:40'),(4,'M??n h??nh','man-hinh','M??n h??nh m??y t??nh c??c lo???i',NULL,NULL,1,4,'2026-04-20 04:00:40'),(5,'Ph??? ki???n','phu-kien','Ph??? ki???n c??ng ngh???',NULL,NULL,1,5,'2026-04-20 04:00:40'),(13,'Laptop Gaming','laptop-gaming',NULL,NULL,NULL,1,0,'2026-04-22 03:03:29'),(14,'Laptop V??n Ph??ng','laptop-van-phong',NULL,NULL,NULL,1,0,'2026-04-22 03:03:29');
/*!40000 ALTER TABLE `danh_muc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dia_chi_nguoi_dung`
--

DROP TABLE IF EXISTS `dia_chi_nguoi_dung`;
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

--
-- Dumping data for table `dia_chi_nguoi_dung`
--

LOCK TABLES `dia_chi_nguoi_dung` WRITE;
/*!40000 ALTER TABLE `dia_chi_nguoi_dung` DISABLE KEYS */;
INSERT INTO `dia_chi_nguoi_dung` (`ma_dia_chi`, `ma_nguoi_dung`, `ten_nhan`, `dia_chi_day_du`, `tinh_thanh`, `quan_huyen`, `lat`, `lng`, `la_mac_dinh`, `ngay_tao`) VALUES (1,3,'Nh??','X?? B??nh M???, Th??nh ph??? H??? Ch?? Minh, Vi???t Nam','Th??nh ph??? H??? Ch?? Minh',NULL,10.98016650,106.61015960,0,'2026-04-22 02:23:57'),(2,3,'C?? quan','???????ng s??? 123, Khu ph??? 35, Ph?????ng Ph?????c Long, Th??nh ph??? Th??? ?????c, Th??nh ph??? H??? Ch?? Minh, 71210, Vi???t Nam','Th??nh ph??? Th??? ?????c','Ph?????ng Ph?????c Long',10.81673820,106.76581390,1,'2026-04-22 02:24:31');
/*!40000 ALTER TABLE `dia_chi_nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_hang`
--

DROP TABLE IF EXISTS `don_hang`;
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
  `ma_voucher_ship` int(11) DEFAULT NULL COMMENT 'Voucher gi???m ph?? v???n chuy???n',
  `so_tien_giam_ship` decimal(15,0) NOT NULL DEFAULT 0 COMMENT 'S??? ti???n ???????c gi???m t??? ph?? v???n chuy???n',
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

--
-- Dumping data for table `don_hang`
--

LOCK TABLES `don_hang` WRITE;
/*!40000 ALTER TABLE `don_hang` DISABLE KEYS */;
INSERT INTO `don_hang` (`ma_don_hang`, `ma_nguoi_dung`, `ma_code`, `tam_tinh`, `so_tien_giam`, `phi_van_chuyen`, `tong_tien`, `ma_voucher`, `diem_su_dung`, `diem_tich_duoc`, `trang_thai`, `phuong_thuc_tt`, `trang_thai_tt`, `ten_nguoi_nhan`, `sdt_nguoi_nhan`, `dia_chi_giao_hang`, `ghi_chu`, `ngay_tao`, `ngay_cap_nhat`, `ma_voucher_ship`, `so_tien_giam_ship`) VALUES (1,3,'DH-20260421-4958',32990000.00,0.00,0.00,32990000.00,NULL,0,329,'hoan_tien','','chua_tt','Nguy???n V??n An','0912345678','ada','','2026-04-21 14:50:17','2026-04-22 16:35:47',NULL,0),(2,3,'DH-20260422-3566',298360000.00,500000.00,0.00,297381000.00,1,479,2973,'da_giao','','chua_tt','Nguy???n V??n An','1314141451','1','','2026-04-22 03:16:05','2026-04-22 16:35:44',NULL,0),(11,3,'DH-22042026-002',20500000.00,0.00,0.00,20500000.00,NULL,0,205,'da_giao','','chua_tt','Nguy???n V??n An','131241451515','???????ng s??? 123, Khu ph??? 35, Ph?????ng Ph?????c Long, Th??nh ph??? Th??? ?????c, Th??nh ph??? H??? Ch?? Minh, 71210, Vi???t Nam','ada','2026-04-22 16:30:03','2026-04-22 16:35:41',3,30000);
/*!40000 ALTER TABLE `don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flash_sale`
--

DROP TABLE IF EXISTS `flash_sale`;
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

--
-- Dumping data for table `flash_sale`
--

LOCK TABLES `flash_sale` WRITE;
/*!40000 ALTER TABLE `flash_sale` DISABLE KEYS */;
INSERT INTO `flash_sale` (`ma_flash_sale`, `ten`, `thoi_gian_bat_dau`, `thoi_gian_ket_thuc`, `trang_thai`, `ngay_tao`) VALUES (1,'Flash Sale Khai Truong','2026-04-22 07:26:48','2026-04-22 13:26:48',1,'2026-04-22 14:26:48');
/*!40000 ALTER TABLE `flash_sale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gio_hang`
--

DROP TABLE IF EXISTS `gio_hang`;
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

--
-- Dumping data for table `gio_hang`
--

LOCK TABLES `gio_hang` WRITE;
/*!40000 ALTER TABLE `gio_hang` DISABLE KEYS */;
INSERT INTO `gio_hang` (`ma_gio_hang`, `ma_nguoi_dung`, `ngay_tao`, `ngay_cap_nhat`) VALUES (1,1,'2026-04-20 04:00:40','2026-04-20 04:00:40'),(2,2,'2026-04-20 04:00:40','2026-04-20 04:00:40'),(3,3,'2026-04-20 04:00:40','2026-04-20 04:00:40'),(4,4,'2026-04-20 04:00:40','2026-04-20 04:00:40'),(5,5,'2026-04-20 04:00:40','2026-04-20 04:00:40');
/*!40000 ALTER TABLE `gio_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_kho`
--

DROP TABLE IF EXISTS `lich_su_kho`;
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

--
-- Dumping data for table `lich_su_kho`
--

LOCK TABLES `lich_su_kho` WRITE;
/*!40000 ALTER TABLE `lich_su_kho` DISABLE KEYS */;
INSERT INTO `lich_su_kho` (`ma_lich_su`, `ma_san_pham`, `ma_nguoi_dung`, `so_luong_bien_dong`, `ton_kho_truoc`, `ton_kho_sau`, `loai_giao_dich`, `ghi_chu`, `ma_tham_chieu`, `ngay_tao`) VALUES (1,15,3,-1,14,13,'xuat','Xu???t theo ????n h??ng DH-20260421-4958','DH-20260421-4958','2026-04-21 14:50:17'),(2,111,3,-4,50,46,'xuat','Xu???t theo ????n h??ng DH-20260422-3566','DH-20260422-3566','2026-04-22 03:16:05'),(3,112,3,-4,50,46,'xuat','Xu???t theo ????n h??ng DH-20260422-3566','DH-20260422-3566','2026-04-22 03:16:05'),(4,113,3,-4,50,46,'xuat','Xu???t theo ????n h??ng DH-20260422-3566','DH-20260422-3566','2026-04-22 03:16:05'),(5,114,3,-4,50,46,'xuat','Xu???t theo ????n h??ng DH-20260422-3566','DH-20260422-3566','2026-04-22 03:16:05'),(14,112,3,-1,46,45,'xuat','Xu???t theo ????n h??ng DH-22042026-002','DH-22042026-002','2026-04-22 16:30:03');
/*!40000 ALTER TABLE `lich_su_kho` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_voucher`
--

DROP TABLE IF EXISTS `lich_su_voucher`;
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

--
-- Dumping data for table `lich_su_voucher`
--

LOCK TABLES `lich_su_voucher` WRITE;
/*!40000 ALTER TABLE `lich_su_voucher` DISABLE KEYS */;
INSERT INTO `lich_su_voucher` (`ma_lich_su`, `ma_voucher`, `ma_nguoi_dung`, `ma_don_hang`, `so_tien_giam`, `ngay_su_dung`) VALUES (1,1,3,2,500000.00,'2026-04-22 03:16:05'),(2,3,3,11,30000.00,'2026-04-22 16:30:03');
/*!40000 ALTER TABLE `lich_su_voucher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ma_giam_gia`
--

DROP TABLE IF EXISTS `ma_giam_gia`;
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
  `loai_voucher` enum('product','shipping','promo_code') NOT NULL DEFAULT 'product' COMMENT 'product=gi???m ti???n SP, shipping=gi???m ph?? ship, promo_code=m?? s??? ki???n',
  PRIMARY KEY (`ma_voucher`),
  UNIQUE KEY `ma_code` (`ma_code`),
  KEY `idx_ma_code` (`ma_code`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_het_han` (`ngay_het_han`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bang quan ly ma giam gia / voucher';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ma_giam_gia`
--

LOCK TABLES `ma_giam_gia` WRITE;
/*!40000 ALTER TABLE `ma_giam_gia` DISABLE KEYS */;
INSERT INTO `ma_giam_gia` (`ma_voucher`, `ma_code`, `ten_voucher`, `mo_ta`, `loai_giam`, `gia_tri_giam`, `giam_toi_da`, `don_hang_toi_thieu`, `so_lan_toi_da`, `da_su_dung`, `gioi_han_moi_nguoi`, `trang_thai`, `ngay_bat_dau`, `ngay_het_han`, `ngay_tao`, `loai_voucher`) VALUES (1,'WELCOME10','Ch??o m???ng th??nh vi??n m???i','Gi???m 10% cho l???n mua ?????u ti??n, t???i ??a 500.000??','percent',10.00,500000.00,1000000.00,100,1,1,1,'2024-01-01 00:00:00','2099-12-31 23:59:59','2026-04-20 11:00:40','product'),(2,'SALE20','Flash Sale 20%','Gi???m 20% t???i ??a 2 tri???u cho ????n t??? 5 tri???u','percent',20.00,2000000.00,5000000.00,50,0,1,1,'2024-01-01 00:00:00','2099-12-31 23:59:59','2026-04-20 11:00:40','product'),(3,'FREESHIP','Mi???n ph?? v???n chuy???n','Gi???m ph?? ship 50.000?? cho m???i ????n h??ng','fixed_amount',50000.00,NULL,0.00,200,1,3,1,'2024-01-01 00:00:00','2099-12-31 23:59:59','2026-04-20 11:00:40','shipping'),(4,'VIP500K','??u ????i VIP 500K','Gi???m th???ng 500.000?? cho ????n h??ng t??? 10 tri???u','fixed_amount',500000.00,NULL,10000000.00,30,0,1,1,'2024-01-01 00:00:00','2099-12-31 23:59:59','2026-04-20 11:00:40','product');
/*!40000 ALTER TABLE `ma_giam_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
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

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` (`ma_nguoi_dung`, `ho_ten`, `ten`, `ho`, `email`, `mat_khau_ma_hoa`, `vai_tro`, `so_dien_thoai`, `dia_chi`, `anh_dai_dien`, `diem_tich_luy`, `trang_thai`, `ngay_xac_thuc_email`, `ngay_tao`, `ngay_cap_nhat`) VALUES (1,'tr???n v??n ????nh','Admin','Qu???n tr???','admin@techstore.vn','$2a$10$7pBdjMLqGHhzJAD/gi438.5KWsuMddeLuDNaMwYV15YvYRXRTDwqW','admin','0901000001',NULL,NULL,0,1,NULL,'2026-04-20 04:00:40','2026-04-22 15:55:49'),(2,'Nh??n Vi??n',NULL,'Nh??n vi??n','staff@techstore.vn','$2a$10$7pBdjMLqGHhzJAD/gi438.5KWsuMddeLuDNaMwYV15YvYRXRTDwqW','staff','0901000002',NULL,NULL,0,1,NULL,'2026-04-20 04:00:40','2026-04-22 16:30:18'),(3,'Nguy???n V??n An','An','Nguy???n','nguyenvan.an@example.com','$2a$10$7pBdjMLqGHhzJAD/gi438.5KWsuMddeLuDNaMwYV15YvYRXRTDwqW','user','131241451515',NULL,NULL,6685,1,NULL,'2026-04-20 04:00:40','2026-04-22 16:35:46'),(4,'Tr???n Th??? B??nh','B??nh','Tr???n','tranthi.binh@example.com','$2a$10$7pBdjMLqGHhzJAD/gi438.5KWsuMddeLuDNaMwYV15YvYRXRTDwqW','user','0923456789',NULL,NULL,80,1,NULL,'2026-04-20 04:00:40','2026-04-20 06:14:03'),(5,'L?? V??n C?????ng','C?????ng','L??','levan.cuong@example.com','$2a$10$7pBdjMLqGHhzJAD/gi438.5KWsuMddeLuDNaMwYV15YvYRXRTDwqW','user','0934567890',NULL,NULL,200,1,NULL,'2026-04-20 04:00:40','2026-04-20 06:14:03');
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `san_pham`
--

DROP TABLE IF EXISTS `san_pham`;
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
  `thoi_gian_bao_hanh` int(11) NOT NULL DEFAULT 12 COMMENT 'S??? th??ng b???o h??nh m???c ?????nh',
  `phi_van_chuyen` decimal(12,0) NOT NULL DEFAULT 30000 COMMENT 'Ph?? v???n chuy???n ri??ng c???a s???n ph???m (VND)',
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

--
-- Dumping data for table `san_pham`
--

LOCK TABLES `san_pham` WRITE;
/*!40000 ALTER TABLE `san_pham` DISABLE KEYS */;
INSERT INTO `san_pham` (`ma_san_pham`, `ten_san_pham`, `duong_dan`, `mo_ta`, `mo_ta_ngan`, `gia_goc`, `gia_khuyen_mai`, `so_luong_ton`, `canh_bao_ton_toi_thieu`, `ma_danh_muc`, `ma_thuong_hieu`, `anh_dai_dien`, `trang_thai`, `noi_bat`, `luot_xem`, `danh_gia_tb`, `ngay_tao`, `ngay_cap_nhat`, `thoi_gian_bao_hanh`, `phi_van_chuyen`) VALUES (1,'ASUS ROG Strix G16 Gaming Laptop 2024','asus-rog-strix-g16-2024','<h2>ASUS ROG Strix G16 Gaming Laptop 2024</h2><p>ASUS ROG Strix G16 2024 là laptop gaming đỉnh cao với CPU Intel Core i9-14900HX 24 nhân, xung boost 5.8GHz. GPU RTX 4080 12GB với kiến trúc Ada Lovelace, hỗ trợ DLSS 3.0 Frame Generation. Màn hình QHD+ 240Hz IPS, phản hồi 3ms, G-Sync, không xé hình. Hệ thống tản nhiệt ROG Tri-Fan Technology với 3 quạt và 4 heatpipe đồng.</p><ul><li>✅ RTX 4080 12GB - hiệu năng gaming hàng đầu</li><li>✅ Màn 240Hz QHD+ G-Sync không xé hình</li><li>✅ RAM DDR5 32GB băng thông cực cao</li><li>✅ SSD NVMe 1TB tốc độ đọc 7.000 MB/s</li><li>✅ Bàn phím per-key RGB hành trình 1.8mm</li></ul>','Intel i9-14900HX | RTX 4080 12GB | 32GB DDR5 | 1TB NVMe | 16\" 240Hz QHD+',45990000.00,42990000.00,15,5,1,1,'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85',1,1,354,4.80,'2026-04-20 04:00:40','2026-04-22 05:44:38',12,30000),(3,'Dell XPS 15 9530','dell-xps-15-9530','<h2>Dell XPS 15 9530 - Đỉnh Cao Thiết Kế và Hiệu Năng Sáng Tạo</h2><p>Dell XPS 15 9530 là laptop cao cấp hoàn hảo cho nhà thiết kế và nhiếp ảnh gia. Thiết kế nhôm nguyên khối mỏng 18mm, trọng lượng chỉ 1.86kg. Màn hình OLED 15.6\" 3.5K (3456x2160) 120Hz, delta E dưới 1.5, DCI-P3 100%, lý tưởng cho chỉnh màu chuyên nghiệp. CPU Intel Core i7-13700H 14 nhân kết hợp RTX 4060 8GB.</p><ul><li>✅ Màn OLED 3.5K DCI-P3 100% chuẩn in ấn và thiết kế</li><li>✅ Thiết kế nhôm cao cấp, mỏng nhẹ đẳng cấp</li><li>✅ Thunderbolt 4 x2, SD Full-size, HDMI 2.0</li><li>✅ Webcam IR 720p nhận diện khuôn mặt Windows Hello</li><li>✅ Loa stereo 6W Waves MaxxAudio Pro</li></ul>','Intel i7-13700H | RTX 4060 8GB | 16GB LPDDR5 | 15.6\" OLED 3.5K 120Hz',38990000.00,NULL,20,5,1,3,'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=375&fit=crop&q=85',1,0,303,4.60,'2026-04-20 04:00:40','2026-04-22 05:44:38',24,30000),(4,'HP Envy 16 Laptop 2024','hp-envy-16-2024','<h2>HP Envy 16 2024 - Sức Mạnh Sáng Tạo Trong Thiết Kế Thanh Lịch</h2><p>HP Envy 16 2024 kết hợp hoàn hảo giữa hiệu năng mạnh mẽ và thiết kế sang trọng, hướng đến người dùng chuyên nghiệp và content creator. Màn hình OLED 16\" 2.5K (2560x1600) 120Hz tỉ lệ 16:10, Delta E dưới 2, HDR500 True Black. CPU Intel Core i7-13700H kết hợp RTX 4060 8GB. Pin 83Wh hỗ trợ sạc nhanh 140W qua USB-C.</p><ul><li>✅ Màn OLED 2.5K 120Hz 16:10 không viền</li><li>✅ Bàn phím backlit với fingerprint reader tích hợp</li><li>✅ Thunderbolt 4, USB-A, HDMI 2.1, MicroSD</li><li>✅ Sạc nhanh 140W - đầy 50% chỉ trong 30 phút</li><li>✅ HP AI Assistant và HP Sure View chống nhìn trộm</li></ul>','Intel i7-13700H | RTX 4060 8GB | 32GB DDR5 | 16\" OLED 2.5K 120Hz',32990000.00,29990000.00,12,5,1,4,'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&h=375&fit=crop&q=85',1,1,198,4.70,'2026-04-20 04:00:40','2026-04-22 05:44:38',12,30000),(6,'Apple MacBook Pro 16 inch M3 Max','apple-macbook-pro-16-m3-max','<h2>Apple MacBook Pro 16\" M3 Max - Đỉnh Cao Công Nghệ Apple Silicon</h2><p>MacBook Pro 16\" M3 Max là laptop mạnh nhất Apple từng sản xuất. Chip M3 Max với 16-core CPU và 40-core GPU trên tiến trình 3nm. RAM Unified Memory 36GB tốc độ 400GB/s giúp xử lý render video 8K, mô phỏng 3D phức tạp chỉ trong vài phút. Màn hình Liquid Retina XDR 16.2\" với ProMotion 120Hz, độ sáng cực đại 1600 nits HDR. Pin 100Wh cho 22 giờ phát video.</p><ul><li>✅ Chip M3 Max 3nm - hiệu năng CPU nhanh hơn 40% so với M1 Max</li><li>✅ 40-core GPU - render Blender/Cinema 4D ngang card rời cao cấp</li><li>✅ Màn XDR 1600 nits chuẩn chỉnh màu HDR chuyên nghiệp</li><li>✅ 3x Thunderbolt 4, HDMI 2.1, SD UHS-II, MagSafe 3</li><li>✅ macOS Sonoma tối ưu workflows cho Final Cut, Logic Pro</li></ul>','Apple M3 Max 16-core CPU | 40-core GPU | 36GB RAM | 1TB SSD | 16.2\" Liquid Retina XDR 120Hz',89990000.00,NULL,7,5,1,6,'https://images.unsplash.com/photo-1611186871525-c71db68aa29e?w=500&h=375&fit=crop&q=85',1,1,419,4.90,'2026-04-20 04:00:40','2026-04-22 05:44:38',24,30000),(9,'Logitech MX Master 3S','logitech-mx-master-3s','<h2>Logitech MX Master 3S - Chuột Flagship Cho Người Làm Chuyên Nghiệp</h2><p>Logitech MX Master 3S là chuột cao cấp nhất của Logitech, tối ưu cho hiệu suất làm việc hàng ngày. Nút bấm im lặng 90%, làm việc trong văn phòng hay coffee shop mà không làm phiền người xung quanh. Cảm biến Darkfield 8000 DPI hoạt động trên mọi bề mặt kể cả kính. Bánh xe MagSpeed điện từ cho phép cuộn qua 1000 dòng chỉ trong 1 giây. Kết nối đồng thời 3 thiết bị qua Bluetooth hoặc USB Logi Bolt.</p><ul><li>✅ Im lặng 90% phù hợp môi trường văn phòng yên tĩnh</li><li>✅ MagSpeed wheel cuộn siêu nhanh 1000 dòng/giây</li><li>✅ Kết nối 3 thiết bị, chuyển đổi tức thì</li><li>✅ Ergonomic design thoải mái khi dùng nhiều giờ</li><li>✅ Tương thích Mac, Windows, Linux với Flow copy qua thiết bị</li></ul>','Im lặng 90% | 8000 DPI | Bluetooth & USB | Pin 70 ngày | Ergonomic',2290000.00,1990000.00,50,5,5,9,'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',1,1,273,4.60,'2026-04-20 04:00:40','2026-04-22 05:44:38',12,30000),(14,'Samsung Galaxy Book4 Ultra','samsung-galaxy-book4-ultra','<h2>Samsung Galaxy Book4 Ultra - Đỉnh Cao Hệ Sinh Thái Samsung</h2><p>Galaxy Book4 Ultra kết hợp hoàn hảo giữa phong cách mỏng nhẹ và sức mạnh của RTX 4070 8GB, lý tưởng cho content creator trong hệ sinh thái Samsung. Màn hình Dynamic AMOLED 2X 2.8K 120Hz với độ sáng 400 nits, HDR True Black 500 cho hình ảnh sắc nét rực rỡ. Intel Core Ultra 9 185H với NPU AI tích hợp. Galaxy AI hỗ trợ các tác vụ sáng tạo thông minh.</p><ul><li>✅ AMOLED 2.8K 120Hz màu sắc điện ảnh</li><li>✅ RTX 4070 8GB cho render và gaming</li><li>✅ Galaxy AI tích hợp AI tạo sinh bản địa</li><li>✅ Kết nối sâu với Galaxy Phone, Buds, Watch</li><li>✅ Thunderbolt 4, USB-C, HDMI 2.0, MicroSD</li></ul>','Intel Core Ultra 9 185H | RTX 4070 8GB | 32GB LPDDR5X | 1TB SSD | 16\" AMOLED 2.8K 120Hz',45990000.00,42990000.00,9,5,1,7,'https://images.unsplash.com/photo-1611186871525-c71db68aa29e?w=500&h=375&fit=crop&q=85',1,1,250,4.70,'2026-04-20 12:52:14','2026-04-22 05:44:38',12,30000),(15,'ASUS Vivobook Pro 16X OLED','asus-vivobook-pro-16x-oled','<h2>ASUS Vivobook Pro 16X OLED - Sáng Tạo Không Giới Hạn</h2><p>Vivobook Pro 16X OLED được trang bị màn hình OLED 4K 120Hz với DCI-P3 100%, Pantone Validated - tiêu chuẩn màu sắc của ngành in ấn và thiết kế chuyên nghiệp. CPU Intel Core i9-13980HX 24 nhân cùng RTX 4060 đảm bảo render 3D, chỉnh video 4K nhanh chóng. ASUS Dial - núm xoay sáng tạo độc quyền điều chỉnh tham số trong Premiere, Lightroom.</p><ul><li>✅ OLED 4K 120Hz chuẩn Pantone Validated</li><li>✅ CPU i9-13980HX 24 nhân cho đa nhiệm nặng</li><li>✅ ASUS Dial núm xoay sáng tạo độc quyền</li><li>✅ Cổng Thunderbolt 4, USB-C, HDMI 2.1</li><li>✅ RAM DDR5 32GB băng thông cực cao</li></ul>','Intel Core i9-13980HX | RTX 4060 8GB | 32GB DDR5 | 1TB SSD | 16\" OLED 4K 120Hz',35990000.00,32990000.00,13,5,1,1,'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=375&fit=crop&q=85',1,0,200,0.00,'2026-04-20 12:52:14','2026-04-22 05:44:38',12,30000),(17,'Samsung Galaxy S24 Ultra','samsung-galaxy-s24-ultra','<h2>Samsung Galaxy S24 Ultra - Siêu Phẩm Android 2024</h2><p>Galaxy S24 Ultra là flagship mạnh nhất của Samsung với Snapdragon 8 Gen 3 for Galaxy và camera 200MP Tetra Pixel. S Pen tích hợp hỗ trợ Galaxy AI với các tính năng Note Assist, Transcript Assist dịch và tóm tắt ngay trên màn hình. Khung viền titan Grade 2 cứng cáp thanh lịch. Màn Dynamic AMOLED 2X 6.8\" QHD+ 120Hz độ sáng 2600 nits.</p><ul><li>✅ Camera 200MP, zoom quang học 5x, Space Zoom 100x</li><li>✅ S Pen tích hợp + Galaxy AI bản địa</li><li>✅ Màn Dynamic AMOLED 2X 6.8\" QHD+ 120Hz</li><li>✅ Pin 5000mAh, sạc nhanh 45W, sạc không dây 15W</li><li>✅ IP68 chống nước sâu 2m/30 phút</li></ul>','Snapdragon 8 Gen 3 | 12GB RAM | 256GB | 6.8\" QHD+ 120Hz | Camera 200MP | S Pen tích hợp',32990000.00,29990000.00,25,5,2,7,'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=375&fit=crop&q=85',1,1,526,4.80,'2026-04-20 12:52:14','2026-04-22 05:46:40',12,30000),(18,'Apple iPhone 15 Pro Max','apple-iphone-15-pro-max','<h2>Apple iPhone 15 Pro Max - Siêu Phẩm iOS Tiên Phong</h2><p>iPhone 15 Pro Max là smartphone mạnh nhất Apple với chip A17 Pro 3nm, GPU 6-core và khả năng ray tracing phần cứng. Lần đầu tiên có cổng USB 3 (USB-C) tốc độ 10Gbps. Camera Tetraprism 5x zoom quang học cho ảnh và video chất lượng điện ảnh, hỗ trợ quay ProRes 4K 60fps. Khung titan cấp 5 nhẹ và bền hơn thép.</p><ul><li>✅ Chip A17 Pro 3nm mạnh nhất trên smartphone</li><li>✅ Camera 48MP, 5x optical zoom Tetraprism</li><li>✅ USB 3 tốc độ 10Gbps kết nối ProRes trực tiếp</li><li>✅ Khung titan cấp 5 nhẹ và bền hơn thép</li><li>✅ Action Button tùy chỉnh theo nhu cầu</li></ul>','Apple A17 Pro | 8GB RAM | 256GB | 6.7\" Super Retina XDR 120Hz | Camera 48MP | Khung Titan',34990000.00,NULL,20,5,2,6,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=375&fit=crop&q=85',1,1,614,4.90,'2026-04-20 12:52:14','2026-04-22 05:46:44',12,30000),(22,'Samsung Galaxy S24+','samsung-galaxy-s24-plus','<h2>Samsung Galaxy S24+ - Flagship Cân Bằng Hoàn Hảo</h2><p>Galaxy S24+ là lựa chọn lý tưởng giữa S24 và S24 Ultra: màn hình to 6.7\" với pin 4900mAh, Snapdragon 8 Gen 3 for Galaxy, và Galaxy AI đầy đủ tính năng. Khung nhôm Armor Aluminum bền bỉ, kính Gorilla Glass Victus 2 trước và sau. Bảo hành phần mềm 7 năm.</p><ul><li>✅ Galaxy AI: Circle to Search, Live Translate, Note Assist</li><li>✅ Camera 50MP + 10MP 3x + 12MP ultrawide</li><li>✅ Sạc nhanh 45W + sạc không dây 15W</li><li>✅ Bảo hành Samsung 7 năm OS update</li><li>✅ IP68 chống nước sâu 2m/30 phút</li></ul>','Snapdragon 8 Gen 3 | 12GB RAM | 256GB | 6.7\" Dynamic AMOLED 2X 120Hz | Camera 50MP',27990000.00,25990000.00,22,5,2,7,'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=375&fit=crop&q=85',1,0,315,4.70,'2026-04-20 12:52:14','2026-04-22 05:47:10',12,30000),(23,'Apple iPhone 15','apple-iphone-15','<h2>Apple iPhone 15 - iPhone Phổ Thông Thế Hệ Mới</h2><p>iPhone 15 lần đầu tiên dùng cổng USB-C, camera 48MP chính với pixel-binning 4-in-1, tính năng Action Mode quay video chống rung cực tốt. Dynamic Island thay cho notch truyền thống, chip A16 Bionic mạnh mẽ vượt trội mọi Android tầm trung. Crash Detection và Emergency SOS qua vệ tinh đảm bảo an toàn.</p><ul><li>✅ Camera 48MP chất lượng Pro trên phiên bản thường</li><li>✅ Dynamic Island hiển thị thông báo sáng tạo</li><li>✅ USB-C dùng chung dây sạc với MacBook, iPad</li><li>✅ Crash Detection và Emergency SOS qua vệ tinh</li><li>✅ Chip A16 Bionic mạnh nhất tầm trung</li></ul>','Apple A16 Bionic | 6GB RAM | 128GB | 6.1\" Super Retina XDR 60Hz | Camera 48MP | USB-C',22990000.00,20990000.00,30,5,2,6,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=375&fit=crop&q=85',1,0,447,4.70,'2026-04-20 12:52:14','2026-04-22 05:44:38',12,30000),(26,'Samsung Galaxy A55 5G','samsung-galaxy-a55-5g','<h2>Samsung Galaxy A55 5G - Tầm Trung Cao Cấp IP67</h2><p>Galaxy A55 5G mang thiết kế kim loại IP67 lần đầu tiên cho phân khúc A-series, màn Super AMOLED 120Hz sắc nét, camera OIS 50MP chụp ảnh ổn định. Exynos 1480 với 4 nhân AMD GPU cho hiệu năng đồ họa vượt trội phân khúc, đảm bảo 4 năm OS update và 5 năm bảo mật.</p><ul><li>✅ IP67 chống nước 1m/30 phút lần đầu cho Galaxy A</li><li>✅ Camera 50MP OIS ảnh không rung, đêm sắc nét</li><li>✅ AMD GPU đồ họa gaming tốt nhất tầm trung</li><li>✅ 4 năm OS update + 5 năm bảo mật Samsung</li><li>✅ Màn Super AMOLED 6.6\" 120Hz 1000 nits</li></ul>','Exynos 1480 | 8GB RAM | 256GB | 6.6\" Super AMOLED 120Hz | Camera 50MP OIS | IP67',9990000.00,8990000.00,40,5,2,7,'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=375&fit=crop&q=85',1,0,361,4.50,'2026-04-20 12:52:14','2026-04-22 05:45:38',12,30000),(37,'ASUS ROG Swift PG27UQR 4K 160Hz','asus-rog-swift-pg27uqr','<h2>ASUS ROG Swift PG27UQR - 4K Gaming Đỉnh Cao G-Sync Ultimate</h2><p>PG27UQR là màn gaming 4K 160Hz với chứng nhận G-Sync Ultimate - chuẩn cao nhất NVIDIA. Panel Fast IPS 1ms GTG cho hình ảnh 4K cực sắc nét, HDR600 thực chiếu với 576 vùng dimming cục bộ. DisplayHDR 600 chuẩn VESA. Thiết kế ROG Aura Sync RGB phía sau trang trí góc chơi game.</p><ul><li>✅ G-Sync Ultimate hỗ trợ HDR biến thiên và reflex latency</li><li>✅ 4K 160Hz + 1ms GTG gaming đỉnh cao</li><li>✅ 576 zone local dimming HDR thực chiếu</li><li>✅ HDMI 2.1 x2 + DisplayPort 1.4 + USB Hub</li><li>✅ ROG Aura Sync RGB trang trí setup</li></ul>','27\" 4K UHD | IPS 160Hz | 1ms GTG | HDR600 | G-Sync Ultimate | HDMI 2.1',24990000.00,22990000.00,15,5,4,1,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=375&fit=crop&q=85',1,1,238,4.70,'2026-04-20 12:52:14','2026-04-22 05:44:38',12,30000),(38,'Dell Alienware AW3423DWF QD-OLED','dell-alienware-aw3423dwf','<h2>Dell Alienware AW3423DWF - Màn QD-OLED Siêu Cong Đỉnh Nhất</h2><p>AW3423DWF là màn gaming curved QD-OLED đầu tiên của Alienware với công nghệ Quantum Dot OLED cho độ tương phản vô cực (true black), màu QD sống động với DCI-P3 99.3%. 165Hz với pixel 0.1ms không có ghosting ngay cả màn cong. FreeSync Premium Pro không cần GPU NVIDIA, tiết kiệm chi phí.</p><ul><li>✅ QD-OLED tương phản vô cực + màu Quantum Dot</li><li>✅ 0.1ms pixel response gaming không ghosting</li><li>✅ FreeSync Premium Pro tương thích mọi GPU</li><li>✅ Alienware Command Center RGB tùy chỉnh</li><li>✅ 34\" 21:9 ultrawide đa nhiệm tối ưu</li></ul>','34\" QD-OLED 3440x1440 | 165Hz | 0.1ms | 99.3% DCI-P3 | FreeSync Premium Pro',31990000.00,28990000.00,8,5,4,3,'https://images.unsplash.com/photo-1623520795272-e34e03a8aa9a?w=500&h=375&fit=crop&q=85',1,1,312,4.80,'2026-04-20 12:52:14','2026-04-22 05:44:38',12,30000),(42,'Samsung Odyssey Neo G9 57\" Dual UHD','samsung-odyssey-neo-g9-57','<h2>Samsung Odyssey Neo G9 57\" - Màn Hình Khổng Lồ Như 2 Màn 32\"</h2><p>Neo G9 57\" là màn hình gaming lớn nhất, tương đương 2 màn 32\" QHD ghép ngang mà không có viền chia cắt. Mini-LED với 2392 vùng dimming cục bộ, HDR2000 độ sáng đỉnh 2000 nits, VA panel cho độ tương phản xuất sắc. 240Hz 1ms cong 1000R cho gaming immersive và đa nhiệm tối thượng.</p><ul><li>✅ 57\" Dual UHD rộng như 2 màn hình 32\" không viền</li><li>✅ 2392 zone Mini-LED HDR2000 hình ảnh điện ảnh</li><li>✅ 240Hz 1ms cong 1000R gaming immersive</li><li>✅ USB Hub, DP 2.1, HDMI 2.1 x4</li><li>✅ Samsung Gaming Hub Smart TV tích hợp</li></ul>','57\" Dual UHD 7680x2160 | VA Mini-LED 240Hz | HDR2000 | G-Sync | Cong 1000R',49990000.00,44990000.00,5,5,4,7,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=375&fit=crop&q=85',1,1,389,4.70,'2026-04-20 12:52:14','2026-04-22 05:44:38',12,30000),(43,'ASUS ProArt PA329CV 4K Professional','asus-proart-pa329cv','<h2>ASUS ProArt PA329CV - Màn Chuyên Đồ Họa Chứng Nhận Calman</h2><p>ProArt PA329CV là màn hình thiết kế chuyên nghiệp 32\" 4K với Thunderbolt 4 Hub tích hợp kết nối daisy-chain tới 2 màn nữa. Delta E dưới 2, sRGB 100%, DCI-P3 98% được hiệu chỉnh sẵn từ nhà máy, kèm chứng nhận màu cá nhân. Calman Ready hỗ trợ calibration phần mềm chuyên nghiệp. USB-C 96W cấp nguồn laptop.</p><ul><li>✅ Thunderbolt 4 daisy-chain ghép 3 màn 1 dây</li><li>✅ Calman Ready chuẩn hiệu chỉnh màu studio</li><li>✅ Delta E dưới 2 factory-calibrated với chứng chỉ kèm theo</li><li>✅ USB-C 96W cấp nguồn laptop</li><li>✅ ProArt Palette phần mềm quản lý màu chuyên nghiệp</li></ul>','32\" 4K UHD IPS | 100% sRGB | 98% DCI-P3 | Delta E<2 | Thunderbolt 4 | USB-C 96W | Calman Ready',38990000.00,35990000.00,8,5,4,1,'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&h=375&fit=crop&q=85',1,0,167,4.60,'2026-04-20 12:52:14','2026-04-22 05:44:38',12,30000),(44,'Dell UltraSharp U2723QE 4K USB-C','dell-ultrasharp-u2723qe','<h2>Dell UltraSharp U2723QE - Màn Doanh Nhân USB-C Hub Toàn Diện</h2><p>UltraSharp U2723QE dùng panel IPS Black với độ tương phản 2000:1, gấp đôi IPS thông thường, gần với VA. Cổng USB-C 90W cấp nguồn laptop cùng lúc truyền dữ liệu 10Gbps và đầu ra video. RJ45 Ethernet tích hợp biến màn thành dock hoàn chỉnh chỉ cần 1 dây USB-C. Dell Display Manager 2.0 quản lý layout đa màn.</p><ul><li>✅ IPS Black 2000:1 contrast, màu đen sâu hơn IPS thường</li><li>✅ USB-C 90W + RJ45 + USB Hub dock trong một màn</li><li>✅ Dell Display Manager 2.0 quản lý layout đa màn</li><li>✅ 3 năm bảo hành Dell Premium hỗ trợ tận nhà</li><li>✅ 4K IPS sRGB 100%, DCI-P3 98%, Delta E dưới 2</li></ul>','27\" 4K IPS Black | 100% sRGB | 98% DCI-P3 | Delta E<2 | USB-C 90W | RJ45 LAN',13990000.00,12490000.00,22,5,4,3,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=375&fit=crop&q=85',1,0,241,4.70,'2026-04-20 12:52:14','2026-04-22 05:44:38',12,30000),(45,'Logitech G Pro X Superlight 2','logitech-g-pro-x-superlight-2','<h2>Logitech G Pro X Superlight 2 - Chuột Gaming Nhẹ Nhất Thế Giới</h2><p>G Pro X Superlight 2 giảm trọng lượng còn 60g nhẹ nhất trong lịch sử Logitech, không ảnh hưởng độ bền. Cảm biến HERO 2 25600 DPI với độ chính xác pixel-perfect, không tăng tốc, không làm mờn. Kết nối LIGHTSPEED 2.4GHz độ trễ 1ms. Được các pro player CSGO, Valorant ưa thích nhất. Pin 95 giờ không lo sạc giữa chừng.</p><ul><li>✅ 60g chuột gaming nhẹ nhất Logitech từ trước đến nay</li><li>✅ HERO 2 sensor 25600 DPI chính xác pixel-perfect</li><li>✅ LIGHTSPEED wireless 1ms không thua có dây</li><li>✅ Pin 95 giờ không cần lo sạc giữa chừng</li><li>✅ Thiết kế đối xứng phù hợp cả tay trái và phải</li></ul>','Cảm biến HERO 2 25600 DPI | 60g siêu nhẹ | Wireless 2.4GHz | Pin 95 giờ | PTFE',3190000.00,2890000.00,35,5,5,9,'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',1,1,414,4.80,'2026-04-20 12:52:14','2026-04-22 05:44:38',12,30000),(46,'Razer DeathAdder V3 Pro Wireless','razer-deathadder-v3-pro','<h2>Razer DeathAdder V3 Pro - Ergonomic Flagship Không Dây</h2><p>DeathAdder V3 Pro kế thừa thiết kế ergonomic huyền thoại của dòng DeathAdder với trọng lượng chỉ 63g nhờ vỏ plastic rỗng Speedflex. Focus Pro 35K DPI hoạt động trên mọi bề mặt kể cả kính và vải. Kết nối HyperSpeed wireless lag 25% thấp hơn đối thủ. Pin 90 giờ sử dụng liên tục không cần sạc.</p><ul><li>✅ Thiết kế ergonomic 30 năm hoàn thiện thoải mái dài ngày</li><li>✅ Focus Pro 35K DPI chính xác tuyệt đối mọi bề mặt</li><li>✅ Speedflex vỏ rỗng nhẹ 63g không giảm độ bền</li><li>✅ HyperSpeed wireless lag thấp nhất thị trường</li><li>✅ Razer Synapse 3 tùy chỉnh DPI, macro, lighting</li></ul>','Focus Pro 35K DPI | 63g | Ergonomic | HyperSpeed 2.4GHz | Pin 90 giờ',2990000.00,2690000.00,28,5,5,10,'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=375&fit=crop&q=85',1,0,312,4.70,'2026-04-20 12:52:14','2026-04-22 05:44:38',12,30000),(47,'Corsair K100 RGB Optical-Mechanical','corsair-k100-rgb','<h2>Corsair K100 RGB Optical-Mechanical - Bàn Phím Gaming Flagship Corsair</h2><p>K100 RGB là bàn phím gaming đỉnh nhất của Corsair với switch Optical-Mech OPX actuate bằng ánh sáng, không có tiếp điểm cơ học, không mài mòn, 150 triệu lần nhấn. iCUE Multi-Function Wheel tùy chỉnh âm lượng, macro, zoom cho từng ứng dụng. Khung polycarbonate trong suốt cho RGB cực đẹp. Per-key RGB 16.8 triệu màu.</p><ul><li>✅ OPX Optical-Mech 0.4mm actuate, không thể debounce</li><li>✅ iCUE Wheel núm đa chức năng theo ứng dụng</li><li>✅ Khung polycarbonate trong RGB xuyên thấu đẹp nhất</li><li>✅ 44-zone RGB backlit, 20MB onboard storage</li><li>✅ USB Pass-through tích hợp tiện kết nối thiết bị</li></ul>','OPX Optical-Mech Switch | Per-key RGB | iCUE Wheel | Polycarbonate Frame | Macro',4490000.00,3990000.00,20,5,5,19,'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=375&fit=crop&q=85',1,0,236,4.60,'2026-04-20 12:52:14','2026-04-22 05:47:04',12,30000),(111,'Laptop Gaming ASUS ROG Strix G15','laptop-gaming-asus-rog-strix-g15-111','<h2>Laptop Gaming ASUS ROG Strix G15 - Chiến Binh Gaming AMD Mạnh Mẽ</h2><p>ASUS ROG Strix G15 là laptop gaming trang bị AMD Ryzen 9 6900HX 8 nhân 16 luồng, xung boost 4.9GHz, kết hợp GPU NVIDIA GeForce RTX 3070 Ti 8GB. Màn hình IPS 15.6\" Full HD 300Hz siêu mượt cho gaming FPS. Hệ thống tản nhiệt ROG Intelligent Cooling với 2 quạt và 4 heatpipe đồng kiểm soát nhiệt độ hiệu quả.</p><ul><li>✅ AMD Ryzen 9 6900HX 8 nhân hiệu năng đa nhiệm cao</li><li>✅ RTX 3070 Ti 8GB gaming 1080p maxed settings</li><li>✅ Màn 300Hz IPS siêu mượt cho FPS game</li><li>✅ ROG Intelligent Cooling 4 heatpipe đồng</li><li>✅ Bàn phím per-key RGB Aura Sync</li></ul>','AMD Ryzen 9 6900HX | RTX 3070 Ti 8GB | 16GB DDR5 | 512GB NVMe | 15.6\" IPS 300Hz',25000000.00,23990000.00,46,5,13,1,'https://placehold.co/600x400/1E293B/3B82F6?text=ASUS+ROG+Strix+G15',1,0,27,0.00,'2026-04-22 03:03:29','2026-04-22 05:46:48',12,30000),(112,'Laptop Gaming Acer Nitro 5','laptop-gaming-acer-nitro-5-9866','<h2>Laptop Gaming Acer Nitro 5 - Hiệu Năng Gaming Giá Tốt Nhất</h2><p>Acer Nitro 5 là lựa chọn lý tưởng cho game thủ mới bắt đầu với ngân sách hợp lý. Trang bị Intel Core i5-12500H 12 nhân, GPU GTX 1650 4GB đủ chạy mượt các tựa game phổ biến ở 1080p. Màn hình IPS 15.6\" Full HD 144Hz không xé hình. Thiết kế góc cạnh phong cách gaming với logo Nitro nổi bật.</p><ul><li>✅ Intel Core i5-12500H 12 nhân hiệu quả</li><li>✅ GTX 1650 4GB gaming phổ thông 1080p</li><li>✅ Màn 144Hz IPS không xé hình mượt mà</li><li>✅ RAM DDR5 16GB nâng cấp dễ dàng</li><li>✅ Giá tốt nhất phân khúc gaming entry</li></ul>','Intel Core i5-12500H | GTX 1650 4GB | 16GB DDR5 | 512GB NVMe | 15.6\" IPS 144Hz',22000000.00,20500000.00,45,5,13,6,'https://placehold.co/600x400/1E293B/3B82F6?text=Acer+Nitro+5',1,0,11,0.00,'2026-04-22 03:03:29','2026-04-22 05:46:57',12,30000),(113,'Laptop Dell Inspiron 15','laptop-dell-inspiron-15-9869','<h2>Laptop Dell Inspiron 15 - Văn Phòng Toàn Diện Đáng Tin Cậy</h2><p>Dell Inspiron 15 là laptop văn phòng đa năng đáng tin cậy từ thương hiệu Dell 40 năm lịch sử. Trang bị Intel Core i5-1235U 12 nhân hiệu quả điện năng, màn hình Full HD chống chói phù hợp làm việc cả ngày. RAM 8GB DDR4 và SSD 256GB đủ dùng cho công việc văn phòng, học tập. Thiết kế mỏng nhẹ 1.75kg dễ mang theo.</p><ul><li>✅ Intel Core i5-1235U 12 nhân hiệu năng/điện năng tốt</li><li>✅ Màn Full HD chống chói bảo vệ mắt</li><li>✅ Thiết kế mỏng nhẹ 1.75kg dễ mang theo</li><li>✅ Bàn phím full-size thoải mái gõ cả ngày</li><li>✅ Dell warranty 1 năm onsite tại nhà</li></ul>','Intel Core i5-1235U | Intel Iris Xe | 8GB DDR4 | 256GB SSD | 15.6\" FHD IPS',15000000.00,14200000.00,46,5,14,6,'https://placehold.co/600x400/1E293B/3B82F6?text=Dell+Inspiron+15',1,0,4,0.00,'2026-04-22 03:03:29','2026-04-22 05:47:01',12,30000),(114,'Laptop HP Pavilion 14','laptop-hp-pavilion-14-9873','<h2>Laptop HP Pavilion 14 - Mỏng Nhẹ Phong Cách Cho Sinh Viên</h2><p>HP Pavilion 14 là laptop mỏng nhẹ phong cách dành cho sinh viên và người dùng văn phòng trẻ. Trang bị AMD Ryzen 5 7530U 6 nhân tiết kiệm điện, màn hình FHD IPS 14\" tỉ lệ 16:9 sắc nét. Pin 43Wh cho khoảng 8 giờ sử dụng thực tế. Thiết kế nắp máy nhôm sang trọng, trọng lượng chỉ 1.4kg dễ mang đến trường.</p><ul><li>✅ AMD Ryzen 5 7530U 6 nhân tiết kiệm điện</li><li>✅ Thiết kế nắp nhôm sang trọng, 1.4kg nhẹ nhất tầm giá</li><li>✅ Màn 14\" FHD IPS sắc nét không viền 3 cạnh</li><li>✅ Fingerprint sensor đăng nhập nhanh Windows Hello</li><li>✅ HP Fast Charge sạc 50% chỉ trong 45 phút</li></ul>','AMD Ryzen 5 7530U | AMD Radeon | 8GB DDR4 | 256GB SSD | 14\" FHD IPS',16500000.00,15900000.00,46,5,14,6,'https://placehold.co/600x400/1E293B/3B82F6?text=HP+Pavilion+14',1,0,0,0.00,'2026-04-22 03:03:29','2026-04-22 05:44:38',12,30000);
/*!40000 ALTER TABLE `san_pham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thong_bao`
--

DROP TABLE IF EXISTS `thong_bao`;
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

--
-- Dumping data for table `thong_bao`
--

LOCK TABLES `thong_bao` WRITE;
/*!40000 ALTER TABLE `thong_bao` DISABLE KEYS */;
INSERT INTO `thong_bao` (`ma_thong_bao`, `ma_nguoi_dung`, `tieu_de`, `noi_dung`, `loai`, `da_doc`, `ma_tham_chieu`, `ngay_tao`) VALUES (1,1,'????n h??ng ???? giao','????n h??ng #DH-123 c???a b???n ???? ???????c giao th??nh c??ng.','order',0,'123','2026-04-22 03:36:00'),(2,1,'Voucher m???i','B???n v???a nh???n ???????c voucher gi???m gi?? 10% t??? h??? th???ng.','voucher',0,'VOUCHER10','2026-04-22 03:36:00'),(3,1,'B???o h??nh duy???t','Y??u c???u b???o h??nh SP123 c???a b???n ???? ???????c duy???t.','warranty',0,'W-456','2026-04-22 03:36:00'),(4,3,'TechStore ???? tr??? l???i ????nh gi?? c???a b???n','Admin ???? ph???n h???i ????nh gi?? s???n ph???m \"ASUS Vivobook Pro 16X OLED\" c???a b???n. Nh???n ????? xem chi ti???t.','danh_gia',0,'1','2026-04-22 14:39:36'),(5,3,'TechStore ???? tr??? l???i ????nh gi?? c???a b???n','Admin ???? ph???n h???i ????nh gi?? s???n ph???m \"ASUS Vivobook Pro 16X OLED\" c???a b???n. Nh???n ????? xem chi ti???t.','danh_gia',0,'1','2026-04-22 14:39:45'),(6,3,'?????t h??ng th??nh c??ng! ????','????n h??ng #DH-22042026-002 ???? ???????c t???o. T???ng ti???n: 20.500.000??','don_hang',0,'DH-22042026-002','2026-04-22 16:30:03'),(7,3,'C???p nh???t ????n h??ng #DH-22042026-002','????n h??ng c???a b???n ???? ???????c x??c nh???n.','don_hang',0,'DH-22042026-002','2026-04-22 16:35:36'),(8,3,'C???p nh???t ????n h??ng #DH-22042026-002','????n h??ng c???a b???n ??ang ???????c v???n chuy???n.','don_hang',0,'DH-22042026-002','2026-04-22 16:35:39'),(9,3,'C???p nh???t ????n h??ng #DH-22042026-002','????n h??ng c???a b???n ???? giao th??nh c??ng.','don_hang',0,'DH-22042026-002','2026-04-22 16:35:41'),(10,3,'C???p nh???t ????n h??ng #DH-20260422-3566','????n h??ng c???a b???n ???? giao th??nh c??ng.','don_hang',0,'DH-20260422-3566','2026-04-22 16:35:44'),(11,3,'C???p nh???t ????n h??ng #DH-20260421-4958','????n h??ng c???a b???n ??ang ???????c v???n chuy???n.','don_hang',0,'DH-20260421-4958','2026-04-22 16:35:45'),(12,3,'C???p nh???t ????n h??ng #DH-20260421-4958','????n h??ng c???a b???n ???? giao th??nh c??ng.','don_hang',0,'DH-20260421-4958','2026-04-22 16:35:46');
/*!40000 ALTER TABLE `thong_bao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thong_so_ky_thuat`
--

DROP TABLE IF EXISTS `thong_so_ky_thuat`;
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
) ENGINE=InnoDB AUTO_INCREMENT=601 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thong so ky thuat cua tung san pham';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thong_so_ky_thuat`
--

LOCK TABLES `thong_so_ky_thuat` WRITE;
/*!40000 ALTER TABLE `thong_so_ky_thuat` DISABLE KEYS */;
INSERT INTO `thong_so_ky_thuat` (`ma_thong_so`, `ma_san_pham`, `ten_thong_so`, `gia_tri`, `don_vi`, `thu_tu`) VALUES (1,1,'CPU','Intel Core i9-14900HX (24 nh??n, 32 lu???ng, 2.2GHz ??? 5.8GHz)',NULL,1),(2,1,'GPU','NVIDIA GeForce RTX 4080 12GB GDDR6X',NULL,2),(3,1,'RAM','32GB DDR5 4800MHz (2 khe, t???i ??a 64GB)','GB',3),(4,1,'??? c???ng','1TB NVMe PCIe 4.0 SSD (+ 1 khe M.2 tr???ng)',NULL,4),(5,1,'M??n h??nh','16\" QHD+ (2560??1600) IPS 240Hz, 3ms, G-Sync',NULL,5),(6,1,'Pin','90Wh, s???c 240W','Wh',6),(7,1,'K???t n???i','Wi-Fi 6E, Bluetooth 5.3',NULL,7),(8,1,'C???ng k???t n???i','Thunderbolt 4, USB-A x3, HDMI 2.1, RJ45, 3.5mm',NULL,8),(9,1,'Tr???ng l?????ng','2.5','kg',9),(10,1,'H??? ??i???u h??nh','Windows 11 Home',NULL,10),(21,3,'CPU','Intel Core i7-13700H (14 nh??n, 20 lu???ng, t???i 5.0GHz)',NULL,1),(22,3,'GPU','NVIDIA GeForce RTX 4060 8GB GDDR6',NULL,2),(23,3,'RAM','16GB LPDDR5 6400MHz (h??n li???n)','GB',3),(24,3,'??? c???ng','512GB NVMe PCIe 4.0 SSD',NULL,4),(25,3,'M??n h??nh','15.6\" OLED 3.5K (3456??2160) 120Hz, 400 nits, 100% DCI-P3',NULL,5),(26,3,'Pin','86Wh, s???c nhanh 130W','Wh',6),(27,3,'K???t n???i','Wi-Fi 6E, Bluetooth 5.3',NULL,7),(28,3,'C???ng k???t n???i','Thunderbolt 4 x2, USB-A, HDMI 2.0, SD Full-size, 3.5mm',NULL,8),(29,3,'Webcam','720p IR, nh???n di???n khu??n m???t Windows Hello',NULL,9),(30,3,'Tr???ng l?????ng','1.86','kg',10),(31,4,'CPU','Intel Core i7-13700H (14 nh??n, 20 lu???ng, t???i 5.0GHz)',NULL,1),(32,4,'GPU','NVIDIA GeForce RTX 4060 8GB GDDR6',NULL,2),(33,4,'RAM','32GB DDR5 4800MHz (2 khe SO-DIMM)','GB',3),(34,4,'??? c???ng','1TB NVMe PCIe 4.0 SSD',NULL,4),(35,4,'M??n h??nh','16\" OLED 2.5K (2560??1600) 120Hz, 500 nits, HDR True Black 500',NULL,5),(36,4,'Pin','83Wh, s???c nhanh 140W USB-C','Wh',6),(37,4,'K???t n???i','Wi-Fi 6E, Bluetooth 5.3',NULL,7),(38,4,'C???ng k???t n???i','Thunderbolt 4, USB-A x2, HDMI 2.1, MicroSD, 3.5mm',NULL,8),(39,4,'Webcam','5MP AI with Temporal Noise Reduction',NULL,9),(40,4,'Tr???ng l?????ng','2.04','kg',10),(51,6,'Chip','Apple M3 Max (16-core CPU: 12P+4E, 40-core GPU)',NULL,1),(52,6,'RAM','36GB Unified Memory (400GB/s bandwidth)','GB',2),(53,6,'??? c???ng','1TB SSD NVMe (t???i 7.5GB/s)',NULL,3),(54,6,'M??n h??nh','16.2\" Liquid Retina XDR, 3456??2160 (254ppi), ProMotion 120Hz, 1600 nits',NULL,4),(55,6,'Pin','100Wh (~22 gi??? ph??t video), s???c 140W MagSafe 3','Wh',5),(56,6,'K???t n???i','Wi-Fi 6E, Bluetooth 5.3',NULL,6),(57,6,'C???ng k???t n???i','Thunderbolt 4 x3, HDMI 2.1, SD UHS-II, MagSafe 3, 3.5mm',NULL,7),(58,6,'Webcam','12MP Center Stage, t??? c??n ch???nh theo ng?????i d??ng',NULL,8),(59,6,'??m thanh','6 loa stereo Spatial Audio, h??? tr??? Dolby Atmos',NULL,9),(60,6,'Tr???ng l?????ng','2.14','kg',10),(81,9,'C???m bi???n','Darkfield High Precision',NULL,1),(82,9,'DPI','200 ??? 8000 (??i???u ch???nh ???????c)','DPI',2),(83,9,'N??t b???m','7 n??t l???p tr??nh ???????c',NULL,3),(84,9,'K???t n???i','Bluetooth Low Energy + USB Logi Bolt (2.4GHz)',NULL,4),(85,9,'S??? thi???t b??? k???t n???i','3 (Easy-Switch)',NULL,5),(86,9,'Pin','500mAh, ~70 ng??y (t???t ti???ng ???n)',NULL,6),(87,9,'S???c','USB-C, 1 ph??t s???c = 3 gi??? d??ng',NULL,7),(88,9,'Tr???ng l?????ng','141','g',8),(89,9,'T????ng th??ch','Windows, macOS, Linux, ChromeOS, iPadOS',NULL,9),(90,9,'M??u s???c','Space Grey / Pale Grey / Graphite',NULL,10),(411,14,'CPU','Intel Core Ultra 9 185H (16 nhân, 22 luồng, tối đa 5.1GHz)',NULL,1),(412,14,'GPU','NVIDIA GeForce RTX 4070 8GB GDDR6',NULL,2),(413,14,'RAM','32GB LPDDR5X 7467MHz (hàn liền)','GB',3),(414,14,'Ổ cứng','1TB NVMe PCIe 4.0 SSD',NULL,4),(415,14,'Màn hình','16\" Dynamic AMOLED 2X, 2880x1800, 120Hz, HDR True Black 500',NULL,5),(416,14,'Pin','76Wh, sạc nhanh 140W USB-C','Wh',6),(417,14,'Kết nối','Wi-Fi 6E, Bluetooth 5.3',NULL,7),(418,14,'Cổng kết nối','Thunderbolt 4 x2, USB-A x2, HDMI 2.0, MicroSD, 3.5mm',NULL,8),(419,14,'Trọng lượng','1.86','kg',9),(420,14,'Hệ điều hành','Windows 11 Home + Galaxy AI',NULL,10),(421,15,'CPU','Intel Core i9-13980HX (24 nhân, 32 luồng, tối đa 5.6GHz)',NULL,1),(422,15,'GPU','NVIDIA GeForce RTX 4060 8GB GDDR6',NULL,2),(423,15,'RAM','32GB DDR5 4800MHz (2 khe SO-DIMM)','GB',3),(424,15,'Ổ cứng','1TB NVMe PCIe 4.0 SSD',NULL,4),(425,15,'Màn hình','16\" OLED 4K (3840x2400) 120Hz, DCI-P3 100%, Pantone Validated',NULL,5),(426,15,'Pin','96Wh, sạc nhanh 150W','Wh',6),(427,15,'Kết nối','Wi-Fi 6E, Bluetooth 5.3',NULL,7),(428,15,'Cổng kết nối','Thunderbolt 4, USB-A x3, HDMI 2.1, MicroSD, 3.5mm',NULL,8),(429,15,'Tính năng đặc biệt','ASUS Dial - núm xoay sáng tạo độc quyền',NULL,9),(430,15,'Trọng lượng','2.4','kg',10),(431,17,'CPU','Snapdragon 8 Gen 3 for Galaxy (4nm, 3.39GHz)',NULL,1),(432,17,'RAM','12GB LPDDR5X','GB',2),(433,17,'Bộ nhớ','256GB UFS 4.0',NULL,3),(434,17,'Màn hình','6.8\" Dynamic AMOLED 2X, QHD+ 3088x1440, 120Hz, 2600 nits',NULL,4),(435,17,'Camera sau','200MP (f/1.7) + 10MP (3x) + 50MP (5x periscope) + 12MP ultrawide',NULL,5),(436,17,'Camera trước','12MP, 4K60fps',NULL,6),(437,17,'Pin','5000mAh, sạc 45W, sạc không dây 15W','mAh',7),(438,17,'Kết nối','5G, Wi-Fi 6E, Bluetooth 5.3, NFC, UWB',NULL,8),(439,17,'Bảo vệ','IP68, khung Titan Grade 2, Gorilla Glass Armor',NULL,9),(440,17,'Hệ điều hành','Android 14, One UI 6.1 + Galaxy AI',NULL,10),(441,18,'Chip','Apple A17 Pro (6-core CPU, 6-core GPU, 3nm)',NULL,1),(442,18,'RAM','8','GB',2),(443,18,'Bộ nhớ','256GB NVMe',NULL,3),(444,18,'Màn hình','6.7\" Super Retina XDR OLED, 2796x1290, ProMotion 120Hz, 2000 nits',NULL,4),(445,18,'Camera sau','48MP f/1.78 (main) + 12MP f/2.8 (5x periscope) + 12MP f/2.2 (ultrawide)',NULL,5),(446,18,'Camera trước','12MP TrueDepth, 4K',NULL,6),(447,18,'Pin','4422mAh, USB 3 10Gbps, MagSafe 15W','mAh',7),(448,18,'Kết nối','5G, Wi-Fi 6E, Bluetooth 5.3, NFC, UWB',NULL,8),(449,18,'Bảo vệ','Titanium Grade 5, Ceramic Shield, IP68 6m',NULL,9),(450,18,'Hệ điều hành','iOS 17',NULL,10),(451,22,'CPU','Snapdragon 8 Gen 3 for Galaxy (4nm, 3.39GHz)',NULL,1),(452,22,'RAM','12GB LPDDR5X','GB',2),(453,22,'Bộ nhớ','256GB UFS 4.0',NULL,3),(454,22,'Màn hình','6.7\" Dynamic AMOLED 2X, FHD+ 2340x1080, 120Hz, 2600 nits',NULL,4),(455,22,'Camera sau','50MP OIS (f/1.8) + 10MP 3x (f/2.4) + 12MP ultrawide (f/2.2)',NULL,5),(456,22,'Camera trước','12MP, 4K60fps',NULL,6),(457,22,'Pin','4900mAh, sạc 45W, sạc không dây 15W','mAh',7),(458,22,'Kết nối','5G, Wi-Fi 6E, Bluetooth 5.3, NFC, UWB',NULL,8),(459,22,'Bảo vệ','IP68, Armor Aluminum, Gorilla Glass Victus 2',NULL,9),(460,22,'Hệ điều hành','Android 14, One UI 6.1 + Galaxy AI, 7 năm update',NULL,10),(461,23,'Chip','Apple A16 Bionic (6-core CPU, 5-core GPU, 4nm)',NULL,1),(462,23,'RAM','6','GB',2),(463,23,'Bộ nhớ','128GB',NULL,3),(464,23,'Màn hình','6.1\" Super Retina XDR OLED, 2556x1179, 60Hz, 2000 nits, Dynamic Island',NULL,4),(465,23,'Camera sau','48MP f/1.6 (main) + 12MP f/2.4 (ultrawide)',NULL,5),(466,23,'Camera trước','12MP TrueDepth, 4K',NULL,6),(467,23,'Pin','3877mAh, USB-C 2.0, MagSafe 15W','mAh',7),(468,23,'Kết nối','5G, Wi-Fi 6, Bluetooth 5.3, NFC, UWB',NULL,8),(469,23,'Bảo vệ','Aluminum, Ceramic Shield, IP68 6m',NULL,9),(470,23,'Hệ điều hành','iOS 17',NULL,10),(471,26,'CPU','Exynos 1480 (4nm, 2.75GHz) - AMD RDNA GPU',NULL,1),(472,26,'RAM','8GB LPDDR4X','GB',2),(473,26,'Bộ nhớ','256GB UFS 2.2',NULL,3),(474,26,'Màn hình','6.6\" Super AMOLED, FHD+ 2340x1080, 120Hz, 1000 nits',NULL,4),(475,26,'Camera sau','50MP OIS (f/1.8) + 12MP ultrawide + 5MP macro',NULL,5),(476,26,'Camera trước','32MP, 4K',NULL,6),(477,26,'Pin','5000mAh, sạc 25W','mAh',7),(478,26,'Kết nối','5G, Wi-Fi 6, Bluetooth 5.3, NFC',NULL,8),(479,26,'Bảo vệ','IP67, Armor Aluminum, Gorilla Glass Victus+',NULL,9),(480,26,'Hệ điều hành','Android 14, One UI 6.1, 4 năm OS + 5 năm bảo mật',NULL,10),(481,37,'Kích thước','27','inch',1),(482,37,'Độ phân giải','3840x2160 (4K UHD)',NULL,2),(483,37,'Tần số quét','160','Hz',3),(484,37,'Thời gian phản hồi','1 (GtG)','ms',4),(485,37,'Tấm nền','Fast IPS',NULL,5),(486,37,'Độ sáng','350 cd/m² (600 nits HDR peak)',NULL,6),(487,37,'HDR','HDR600, DisplayHDR 600, 576 zone local dimming',NULL,7),(488,37,'Màu sắc','99% sRGB, 90% DCI-P3',NULL,8),(489,37,'Cổng kết nối','DisplayPort 1.4, HDMI 2.1 x2, USB-A 3.0 x2',NULL,9),(490,37,'Tương thích','G-Sync Ultimate, FreeSync Premium Pro',NULL,10),(491,38,'Kích thước','34','inch',1),(492,38,'Độ phân giải','3440x1440 (UWQHD 21:9)',NULL,2),(493,38,'Tần số quét','165','Hz',3),(494,38,'Thời gian phản hồi','0.1 (GtG)','ms',4),(495,38,'Tấm nền','QD-OLED (Quantum Dot OLED)',NULL,5),(496,38,'Độ sáng','1000 nits peak (HDR)',NULL,6),(497,38,'HDR','HDR True Black 400, DisplayHDR TrueBlack 400',NULL,7),(498,38,'Màu sắc','99.3% DCI-P3, 149% sRGB',NULL,8),(499,38,'Cổng kết nối','DisplayPort 1.4, HDMI 2.0 x2, USB-A 3.0 x4, USB-C',NULL,9),(500,38,'Tương thích','FreeSync Premium Pro, G-Sync Compatible',NULL,10),(501,42,'Kích thước','57','inch',1),(502,42,'Độ phân giải','7680x2160 (Dual UHD)',NULL,2),(503,42,'Tần số quét','240','Hz',3),(504,42,'Thời gian phản hồi','1 (GtG)','ms',4),(505,42,'Tấm nền','VA Mini-LED, cong 1000R',NULL,5),(506,42,'Độ sáng','2000 nits peak (HDR2000)','nits',6),(507,42,'HDR','HDR2000, 2392 zone local dimming',NULL,7),(508,42,'Màu sắc','125% sRGB, 95% DCI-P3',NULL,8),(509,42,'Cổng kết nối','DisplayPort 2.1, HDMI 2.1 x4, USB Hub, USB-C',NULL,9),(510,42,'Tương thích','G-Sync Compatible, FreeSync Premium Pro',NULL,10),(511,43,'Kích thước','32','inch',1),(512,43,'Độ phân giải','3840x2160 (4K UHD)',NULL,2),(513,43,'Tần số quét','60','Hz',3),(514,43,'Thời gian phản hồi','5 (GtG)','ms',4),(515,43,'Tấm nền','IPS',NULL,5),(516,43,'Độ sáng','400 nits',NULL,6),(517,43,'Màu sắc','100% sRGB, 98% DCI-P3, Delta E < 2',NULL,7),(518,43,'Hiệu chỉnh màu','Factory calibrated, Calman Ready, kèm chứng chỉ',NULL,8),(519,43,'Cổng kết nối','Thunderbolt 4 x2, USB-C 96W, USB-A 3.2 x4, HDMI 2.0',NULL,9),(520,43,'Tính năng đặc biệt','Daisy-chain 3 màn, USB Hub 8-in-1 tích hợp',NULL,10),(521,44,'Kích thước','27','inch',1),(522,44,'Độ phân giải','3840x2160 (4K UHD)',NULL,2),(523,44,'Tần số quét','60','Hz',3),(524,44,'Thời gian phản hồi','8 (GtG)','ms',4),(525,44,'Tấm nền','IPS Black (2000:1 contrast)',NULL,5),(526,44,'Độ sáng','400 nits',NULL,6),(527,44,'Màu sắc','100% sRGB, 98% DCI-P3, Delta E < 2',NULL,7),(528,44,'Cổng kết nối','USB-C 90W, RJ45, HDMI 2.0, DP 1.4, USB-A x4',NULL,8),(529,44,'Tính năng đặc biệt','IPS Black 2000:1, USB-C dock tích hợp Ethernet',NULL,9),(530,44,'Bảo hành','3 năm Dell Premium Panel Guarantee',NULL,10),(531,45,'Cảm biến','HERO 2 Optical',NULL,1),(532,45,'DPI','100 - 25600','DPI',2),(533,45,'Số nút bấm','5 nút lập trình được',NULL,3),(534,45,'Kết nối','LIGHTSPEED 2.4GHz Wireless',NULL,4),(535,45,'Độ trễ','<1','ms',5),(536,45,'Pin','~95 giờ',NULL,6),(537,45,'Trọng lượng','60','g',7),(538,45,'Tốc độ theo dõi','500 IPS, gia tốc 40G',NULL,8),(539,45,'Chân chuột','PTFE 100% nguyên chất',NULL,9),(540,45,'Tương thích','Windows, macOS - Logitech G Hub',NULL,10),(541,46,'Cảm biến','Focus Pro 30K Optical',NULL,1),(542,46,'DPI','100 - 30000','DPI',2),(543,46,'Số nút bấm','6 nút lập trình được',NULL,3),(544,46,'Kết nối','HyperSpeed 2.4GHz + Bluetooth',NULL,4),(545,46,'Độ trễ','<1 (HyperSpeed)','ms',5),(546,46,'Pin','~90 giờ (2.4GHz)','giờ',6),(547,46,'Trọng lượng','63','g',7),(548,46,'Tốc độ theo dõi','750 IPS, gia tốc 70G',NULL,8),(549,46,'Thiết kế','Ergonomic (tay phải), Speedflex vỏ rỗng',NULL,9),(550,46,'Tương thích','Windows, macOS - Razer Synapse 3',NULL,10),(551,47,'Switch','Corsair OPX Optical-Mechanical (Linear, 45g)',NULL,1),(552,47,'Tuổi thọ switch','150 triệu lần nhấn',NULL,2),(553,47,'Kết nối','USB 2.0 có dây (USB pass-through tích hợp)',NULL,3),(554,47,'Độ trễ actuate','0.4','mm',4),(555,47,'Đèn LED','Per-key RGB Chroma (16.8 triệu màu), 44 zone',NULL,5),(556,47,'Layout','Full-size (110 phím + iCUE Wheel)',NULL,6),(557,47,'Bộ nhớ onboard','20','MB',7),(558,47,'Vật liệu','Khung polycarbonate trong suốt + nẹp nhôm',NULL,8),(559,47,'Hành trình phím','4.0 (actuate 1.5)','mm',9),(560,47,'Tương thích','Windows - Corsair iCUE',NULL,10),(561,111,'CPU','AMD Ryzen 9 6900HX (8 nhân, 16 luồng, tối đa 4.9GHz)',NULL,1),(562,111,'GPU','NVIDIA GeForce RTX 3070 Ti 8GB GDDR6',NULL,2),(563,111,'RAM','16GB DDR5 4800MHz (2 khe SO-DIMM)','GB',3),(564,111,'Ổ cứng','512GB NVMe PCIe 4.0 SSD',NULL,4),(565,111,'Màn hình','15.6\" IPS Full HD (1920x1080) 300Hz, 3ms, sRGB 100%',NULL,5),(566,111,'Pin','90Wh, sạc 240W','Wh',6),(567,111,'Kết nối','Wi-Fi 6E, Bluetooth 5.2',NULL,7),(568,111,'Cổng kết nối','USB-A x3, USB-C, HDMI 2.0b, RJ45, 3.5mm',NULL,8),(569,111,'Trọng lượng','2.3','kg',9),(570,111,'Hệ điều hành','Windows 11 Home',NULL,10),(571,112,'CPU','Intel Core i5-12500H (12 nhân, 16 luồng, tối đa 4.5GHz)',NULL,1),(572,112,'GPU','NVIDIA GeForce GTX 1650 4GB GDDR6',NULL,2),(573,112,'RAM','16GB DDR5 4800MHz (2 khe SO-DIMM)','GB',3),(574,112,'Ổ cứng','512GB NVMe PCIe 4.0 SSD',NULL,4),(575,112,'Màn hình','15.6\" IPS Full HD (1920x1080) 144Hz, sRGB 45%',NULL,5),(576,112,'Pin','57Wh, sạc 135W','Wh',6),(577,112,'Kết nối','Wi-Fi 6, Bluetooth 5.1',NULL,7),(578,112,'Cổng kết nối','USB-A x3, USB-C, HDMI 2.1, RJ45, 3.5mm',NULL,8),(579,112,'Trọng lượng','2.2','kg',9),(580,112,'Hệ điều hành','Windows 11 Home',NULL,10),(581,113,'CPU','Intel Core i5-1235U (12 nhân, 12 luồng, tối đa 4.4GHz)',NULL,1),(582,113,'GPU','Intel Iris Xe Graphics (tích hợp)',NULL,2),(583,113,'RAM','8GB DDR4 3200MHz (1 khe trống nâng cấp)','GB',3),(584,113,'Ổ cứng','256GB NVMe PCIe 3.0 SSD',NULL,4),(585,113,'Màn hình','15.6\" IPS Full HD (1920x1080) 60Hz, chống chói',NULL,5),(586,113,'Pin','41Wh, sạc 65W','Wh',6),(587,113,'Kết nối','Wi-Fi 5, Bluetooth 5.1',NULL,7),(588,113,'Cổng kết nối','USB-A x2, USB-C, HDMI 1.4, SD Card, 3.5mm',NULL,8),(589,113,'Trọng lượng','1.75','kg',9),(590,113,'Hệ điều hành','Windows 11 Home',NULL,10),(591,114,'CPU','AMD Ryzen 5 7530U (6 nhân, 12 luồng, tối đa 4.5GHz)',NULL,1),(592,114,'GPU','AMD Radeon Graphics (tích hợp)',NULL,2),(593,114,'RAM','8GB DDR4 3200MHz (hàn liền + 1 khe mở rộng)','GB',3),(594,114,'Ổ cứng','256GB NVMe PCIe 3.0 SSD',NULL,4),(595,114,'Màn hình','14\" IPS Full HD (1920x1080) 60Hz, không viền 3 cạnh',NULL,5),(596,114,'Pin','43Wh, sạc nhanh 45W USB-C (HP Fast Charge)','Wh',6),(597,114,'Kết nối','Wi-Fi 6, Bluetooth 5.3',NULL,7),(598,114,'Cổng kết nối','USB-A x2, USB-C, HDMI 1.4b, 3.5mm',NULL,8),(599,114,'Trọng lượng','1.4','kg',9),(600,114,'Hệ điều hành','Windows 11 Home',NULL,10);
/*!40000 ALTER TABLE `thong_so_ky_thuat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thuong_hieu`
--

DROP TABLE IF EXISTS `thuong_hieu`;
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

--
-- Dumping data for table `thuong_hieu`
--

LOCK TABLES `thuong_hieu` WRITE;
/*!40000 ALTER TABLE `thuong_hieu` DISABLE KEYS */;
INSERT INTO `thuong_hieu` (`ma_thuong_hieu`, `ten_thuong_hieu`, `duong_dan`, `logo`, `quoc_gia`, `trang_thai`, `ngay_tao`) VALUES (1,'ASUS','asus',NULL,'????i Loan',1,'2026-04-20 04:00:40'),(2,'MSI','msi',NULL,'????i Loan',1,'2026-04-20 04:00:40'),(3,'Dell','dell',NULL,'M???',1,'2026-04-20 04:00:40'),(4,'HP','hp',NULL,'M???',1,'2026-04-20 04:00:40'),(6,'Apple','apple',NULL,'M???',1,'2026-04-20 04:00:40'),(7,'Samsung','samsung',NULL,'H??n Qu???c',1,'2026-04-20 04:00:40'),(9,'Logitech','logitech',NULL,'Th???y S??',1,'2026-04-20 04:00:40'),(10,'Razer','razer',NULL,'M???',1,'2026-04-20 04:00:40'),(19,'Corsair','corsair',NULL,'M???',1,'2026-04-20 12:52:14');
/*!40000 ALTER TABLE `thuong_hieu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voucher_nguoi_dung`
--

DROP TABLE IF EXISTS `voucher_nguoi_dung`;
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

--
-- Dumping data for table `voucher_nguoi_dung`
--

LOCK TABLES `voucher_nguoi_dung` WRITE;
/*!40000 ALTER TABLE `voucher_nguoi_dung` DISABLE KEYS */;
INSERT INTO `voucher_nguoi_dung` (`ma_id`, `ma_voucher`, `ma_nguoi_dung`, `da_su_dung`, `ngay_gui`, `ngay_su_dung`) VALUES (1,2,3,0,'2026-04-21 15:41:03',NULL),(2,4,3,0,'2026-04-21 15:41:19',NULL),(3,1,3,1,'2026-04-21 15:42:30','2026-04-22 03:16:05'),(4,3,3,1,'2026-04-22 03:08:38','2026-04-22 16:30:03'),(5,3,4,0,'2026-04-22 03:08:38',NULL),(6,3,5,0,'2026-04-22 03:08:38',NULL);
/*!40000 ALTER TABLE `voucher_nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yeu_cau_bao_hanh`
--

DROP TABLE IF EXISTS `yeu_cau_bao_hanh`;
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

--
-- Dumping data for table `yeu_cau_bao_hanh`
--

LOCK TABLES `yeu_cau_bao_hanh` WRITE;
/*!40000 ALTER TABLE `yeu_cau_bao_hanh` DISABLE KEYS */;
INSERT INTO `yeu_cau_bao_hanh` (`ma_bao_hanh`, `ma_nguoi_dung`, `ma_chi_tiet_dh`, `so_serial`, `mo_ta_su_co`, `hinh_thuc`, `so_dien_thoai`, `lich_hen`, `trang_thai`, `ma_nhan_vien_xu_ly`, `ghi_chu_xu_ly`, `ngay_tiep_nhan`, `ngay_hoan_thanh`) VALUES (1,3,1,NULL,'ad','den_cua_hang','0123456789','2026-04-22 21:52:00','cho_xu_ly',NULL,NULL,'2026-04-21 21:53:09',NULL);
/*!40000 ALTER TABLE `yeu_cau_bao_hanh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yeu_thich`
--

DROP TABLE IF EXISTS `yeu_thich`;
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

--
-- Dumping data for table `yeu_thich`
--

LOCK TABLES `yeu_thich` WRITE;
/*!40000 ALTER TABLE `yeu_thich` DISABLE KEYS */;
INSERT INTO `yeu_thich` (`ma_yeu_thich`, `ma_nguoi_dung`, `ma_san_pham`, `ngay_them`) VALUES (6,2,18,'2026-04-20 14:48:28'),(7,2,15,'2026-04-20 14:48:29'),(8,2,14,'2026-04-20 14:48:30'),(27,3,18,'2026-04-22 05:58:21'),(28,3,17,'2026-04-22 05:58:22'),(41,3,111,'2026-04-22 10:49:07'),(42,3,46,'2026-04-22 12:45:42');
/*!40000 ALTER TABLE `yeu_thich` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-22 13:01:23
