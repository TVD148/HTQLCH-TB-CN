-- Migration: Tạo bảng địa chỉ nhiều địa chỉ cho người dùng
-- Run: mysql -u root htqlch_thietbi_cn < migrate_addresses.sql

CREATE TABLE IF NOT EXISTS dia_chi_nguoi_dung (
  ma_dia_chi     INT AUTO_INCREMENT PRIMARY KEY,
  ma_nguoi_dung  INT NOT NULL,
  ten_nhan       VARCHAR(100) NOT NULL DEFAULT 'Nhà',
  dia_chi_day_du TEXT NOT NULL,
  tinh_thanh     VARCHAR(100) NULL,
  quan_huyen     VARCHAR(100) NULL,
  lat            DECIMAL(10,8) NULL,
  lng            DECIMAL(11,8) NULL,
  la_mac_dinh    TINYINT(1) NOT NULL DEFAULT 0,
  ngay_tao       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE CASCADE,
  INDEX idx_nguoi_dung (ma_nguoi_dung),
  INDEX idx_mac_dinh   (la_mac_dinh)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Danh sach dia chi giao hang da luu cua nguoi dung';
