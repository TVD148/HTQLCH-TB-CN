-- ============================================================
-- SCHEMA SQL - He thong Quan ly Cua hang Thiet bi Cong nghe
-- Database: htqlch_thietbi_cn
-- Ten bang & cot: Tieng Viet (khong dau)
-- Version: 2.0.0
-- ============================================================

SET NAMES utf8mb4;
SET sql_mode = '';

DROP DATABASE IF EXISTS htqlch_thietbi_cn;

CREATE DATABASE htqlch_thietbi_cn
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE htqlch_thietbi_cn;

-- ============================================================
-- 1. BANG NGUOI DUNG
-- ============================================================
CREATE TABLE nguoi_dung (
  ma_nguoi_dung       INT AUTO_INCREMENT PRIMARY KEY,
  ho_ten              VARCHAR(100)  NOT NULL,
  ten                 VARCHAR(50)   NULL COMMENT 'Ten (de sap xep A-Z)',
  ho                  VARCHAR(50)   NULL COMMENT 'Ho',
  email               VARCHAR(150)  NOT NULL UNIQUE,
  mat_khau_ma_hoa     VARCHAR(255)  NOT NULL,
  vai_tro             ENUM('admin','staff','user') NOT NULL DEFAULT 'user',
  so_dien_thoai       VARCHAR(20)   NULL,
  dia_chi             TEXT          NULL,
  anh_dai_dien        VARCHAR(255)  NULL,
  diem_tich_luy       INT           NOT NULL DEFAULT 0,
  trang_thai          TINYINT(1)    NOT NULL DEFAULT 1,
  ngay_xac_thuc_email TIMESTAMP     NULL,
  ngay_tao            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email    (email),
  INDEX idx_vai_tro  (vai_tro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Bang luu thong tin nguoi dung / khach hang';

-- ============================================================
-- 2. BANG DANH MUC SAN PHAM
-- ============================================================
CREATE TABLE danh_muc (
  ma_danh_muc     INT AUTO_INCREMENT PRIMARY KEY,
  ten_danh_muc    VARCHAR(100)  NOT NULL,
  duong_dan       VARCHAR(120)  NOT NULL UNIQUE,
  mo_ta           TEXT          NULL,
  hinh_anh        VARCHAR(255)  NULL,
  ma_danh_muc_cha INT           NULL,
  trang_thai      TINYINT(1)    NOT NULL DEFAULT 1,
  thu_tu          INT           NOT NULL DEFAULT 0,
  ngay_tao        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ma_danh_muc_cha) REFERENCES danh_muc(ma_danh_muc) ON DELETE SET NULL,
  INDEX idx_duong_dan      (duong_dan),
  INDEX idx_danh_muc_cha   (ma_danh_muc_cha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Bang danh muc san pham (co the co phan cap)';

-- ============================================================
-- 3. BANG THUONG HIEU (BRAND)
-- ============================================================
CREATE TABLE thuong_hieu (
  ma_thuong_hieu  INT AUTO_INCREMENT PRIMARY KEY,
  ten_thuong_hieu VARCHAR(100)  NOT NULL UNIQUE,
  duong_dan       VARCHAR(120)  NOT NULL UNIQUE,
  logo            VARCHAR(255)  NULL,
  quoc_gia        VARCHAR(50)   NULL,
  trang_thai      TINYINT(1)    NOT NULL DEFAULT 1,
  ngay_tao        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Bang thuong hieu san pham';

-- ============================================================
-- 4. BANG SAN PHAM
-- ============================================================
CREATE TABLE san_pham (
  ma_san_pham          INT AUTO_INCREMENT PRIMARY KEY,
  ten_san_pham         VARCHAR(200)    NOT NULL,
  duong_dan            VARCHAR(220)    NOT NULL UNIQUE,
  mo_ta                TEXT            NULL,
  mo_ta_ngan           TEXT            NULL,
  gia_goc              DECIMAL(15,2)   NOT NULL,
  gia_khuyen_mai       DECIMAL(15,2)   NULL,
  so_luong_ton         INT             NOT NULL DEFAULT 0,
  canh_bao_ton_toi_thieu INT           NOT NULL DEFAULT 5,
  ma_danh_muc          INT             NOT NULL,
  ma_thuong_hieu       INT             NOT NULL,
  anh_dai_dien         VARCHAR(255)    NULL,
  trang_thai           TINYINT(1)      NOT NULL DEFAULT 1,
  noi_bat              TINYINT(1)      NOT NULL DEFAULT 0,
  luot_xem             INT             NOT NULL DEFAULT 0,
  danh_gia_tb          DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
  ngay_tao             TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ma_danh_muc)    REFERENCES danh_muc(ma_danh_muc)       ON DELETE RESTRICT,
  FOREIGN KEY (ma_thuong_hieu) REFERENCES thuong_hieu(ma_thuong_hieu)  ON DELETE RESTRICT,
  INDEX idx_duong_dan   (duong_dan),
  INDEX idx_danh_muc    (ma_danh_muc),
  INDEX idx_thuong_hieu (ma_thuong_hieu),
  INDEX idx_trang_thai  (trang_thai),
  INDEX idx_noi_bat     (noi_bat),
  FULLTEXT INDEX ft_tim_kiem (ten_san_pham, mo_ta, mo_ta_ngan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Bang san pham chinh';

-- ============================================================
-- 5. BANG THONG SO KY THUAT SAN PHAM
-- ============================================================
CREATE TABLE thong_so_ky_thuat (
  ma_thong_so     INT AUTO_INCREMENT PRIMARY KEY,
  ma_san_pham     INT           NOT NULL,
  ten_thong_so    VARCHAR(100)  NOT NULL,
  gia_tri         VARCHAR(255)  NOT NULL,
  don_vi          VARCHAR(50)   NULL,
  thu_tu          INT           NOT NULL DEFAULT 0,
  FOREIGN KEY (ma_san_pham) REFERENCES san_pham(ma_san_pham) ON DELETE CASCADE,
  INDEX idx_san_pham (ma_san_pham)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Thong so ky thuat cua tung san pham';

-- ============================================================
-- 6. BANG ANH SAN PHAM
-- ============================================================
CREATE TABLE anh_san_pham (
  ma_anh          INT AUTO_INCREMENT PRIMARY KEY,
  ma_san_pham     INT           NOT NULL,
  duong_dan_anh   VARCHAR(255)  NOT NULL,
  la_anh_chinh    TINYINT(1)    NOT NULL DEFAULT 0,
  thu_tu          INT           NOT NULL DEFAULT 0,
  FOREIGN KEY (ma_san_pham) REFERENCES san_pham(ma_san_pham) ON DELETE CASCADE,
  INDEX idx_san_pham (ma_san_pham)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Danh sach anh cua san pham';

-- ============================================================
-- 7. BANG GIO HANG
-- ============================================================
CREATE TABLE gio_hang (
  ma_gio_hang     INT AUTO_INCREMENT PRIMARY KEY,
  ma_nguoi_dung   INT       NOT NULL UNIQUE,
  ngay_tao        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE CASCADE,
  INDEX idx_nguoi_dung (ma_nguoi_dung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Gio hang cua tung nguoi dung';

-- ============================================================
-- 8. BANG CHI TIET GIO HANG
-- ============================================================
CREATE TABLE chi_tiet_gio_hang (
  ma_chi_tiet     INT AUTO_INCREMENT PRIMARY KEY,
  ma_gio_hang     INT           NOT NULL,
  ma_san_pham     INT           NOT NULL,
  so_luong        INT           NOT NULL DEFAULT 1,
  don_gia         DECIMAL(15,2) NOT NULL,
  ngay_them       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ma_gio_hang) REFERENCES gio_hang(ma_gio_hang)   ON DELETE CASCADE,
  FOREIGN KEY (ma_san_pham) REFERENCES san_pham(ma_san_pham)   ON DELETE CASCADE,
  UNIQUE KEY uq_gio_san_pham (ma_gio_hang, ma_san_pham),
  INDEX idx_gio_hang (ma_gio_hang)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='San pham trong gio hang';

-- ============================================================
-- 9. BANG MA GIAM GIA (VOUCHER)
-- ============================================================
CREATE TABLE ma_giam_gia (
  ma_voucher          INT AUTO_INCREMENT PRIMARY KEY,
  ma_code             VARCHAR(50)   NOT NULL UNIQUE,
  ten_voucher         VARCHAR(150)  NOT NULL,
  mo_ta               TEXT          NULL,
  loai_giam           ENUM('percent','fixed_amount') NOT NULL,
  gia_tri_giam        DECIMAL(15,2) NOT NULL,
  giam_toi_da         DECIMAL(15,2) NULL    COMMENT 'Giam toi da (cho loai percent)',
  don_hang_toi_thieu  DECIMAL(15,2) NOT NULL DEFAULT 0,
  so_lan_toi_da       INT           NOT NULL DEFAULT 1,
  da_su_dung          INT           NOT NULL DEFAULT 0,
  gioi_han_moi_nguoi  INT           NOT NULL DEFAULT 1,
  trang_thai          TINYINT(1)    NOT NULL DEFAULT 1,
  ngay_bat_dau        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_het_han        DATETIME      NOT NULL DEFAULT '2099-12-31 23:59:59',
  ngay_tao            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ma_code    (ma_code),
  INDEX idx_trang_thai (trang_thai),
  INDEX idx_het_han    (ngay_het_han)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Bang quan ly ma giam gia / voucher';

-- ============================================================
-- 10. BANG LICH SU SU DUNG VOUCHER
-- ============================================================
CREATE TABLE lich_su_voucher (
  ma_lich_su      INT AUTO_INCREMENT PRIMARY KEY,
  ma_voucher      INT           NOT NULL,
  ma_nguoi_dung   INT           NOT NULL,
  ma_don_hang     INT           NULL,
  so_tien_giam    DECIMAL(15,2) NOT NULL,
  ngay_su_dung    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ma_voucher)    REFERENCES ma_giam_gia(ma_voucher)        ON DELETE CASCADE,
  FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung)      ON DELETE CASCADE,
  INDEX idx_voucher    (ma_voucher),
  INDEX idx_nguoi_dung (ma_nguoi_dung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Lich su nguoi dung su dung ma giam gia';

-- ============================================================
-- 11. BANG DON HANG
-- ============================================================
CREATE TABLE don_hang (
  ma_don_hang       INT AUTO_INCREMENT PRIMARY KEY,
  ma_nguoi_dung     INT           NOT NULL,
  ma_code           VARCHAR(50)   NOT NULL UNIQUE,
  tam_tinh          DECIMAL(15,2) NOT NULL,
  so_tien_giam      DECIMAL(15,2) NOT NULL DEFAULT 0,
  phi_van_chuyen    DECIMAL(15,2) NOT NULL DEFAULT 0,
  tong_tien         DECIMAL(15,2) NOT NULL,
  ma_voucher        INT           NULL,
  diem_su_dung      INT           NOT NULL DEFAULT 0,
  diem_tich_duoc    INT           NOT NULL DEFAULT 0,
  trang_thai        ENUM('cho_xac_nhan','da_xac_nhan','dang_giao','da_giao','da_huy','hoan_tien')
                    NOT NULL DEFAULT 'cho_xac_nhan',
  phuong_thuc_tt    ENUM('tien_mat','chuyen_khoan','momo','diem_tich_luy')
                    NOT NULL DEFAULT 'tien_mat',
  trang_thai_tt     ENUM('chua_tt','da_tt','da_hoan_tien') NOT NULL DEFAULT 'chua_tt',
  ten_nguoi_nhan    VARCHAR(100)  NOT NULL,
  sdt_nguoi_nhan    VARCHAR(20)   NOT NULL,
  dia_chi_giao_hang TEXT          NOT NULL,
  ghi_chu           TEXT          NULL,
  ngay_tao          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung)   ON DELETE RESTRICT,
  FOREIGN KEY (ma_voucher)    REFERENCES ma_giam_gia(ma_voucher)      ON DELETE SET NULL,
  INDEX idx_nguoi_dung (ma_nguoi_dung),
  INDEX idx_ma_code    (ma_code),
  INDEX idx_trang_thai (trang_thai),
  INDEX idx_ngay_tao   (ngay_tao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Bang don hang cua khach hang';

-- ============================================================
-- 12. BANG CHI TIET DON HANG
-- ============================================================
CREATE TABLE chi_tiet_don_hang (
  ma_chi_tiet     INT AUTO_INCREMENT PRIMARY KEY,
  ma_don_hang     INT           NOT NULL,
  ma_san_pham     INT           NOT NULL,
  ten_san_pham    VARCHAR(200)  NOT NULL,
  anh_san_pham    VARCHAR(255)  NULL,
  don_gia         DECIMAL(15,2) NOT NULL,
  so_luong        INT           NOT NULL,
  thanh_tien      DECIMAL(15,2) NOT NULL,
  FOREIGN KEY (ma_don_hang) REFERENCES don_hang(ma_don_hang)   ON DELETE CASCADE,
  FOREIGN KEY (ma_san_pham) REFERENCES san_pham(ma_san_pham)   ON DELETE RESTRICT,
  INDEX idx_don_hang  (ma_don_hang),
  INDEX idx_san_pham  (ma_san_pham)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Chi tiet san pham trong don hang';

-- ============================================================
-- 13. BANG DANH GIA SAN PHAM
-- ============================================================
CREATE TABLE danh_gia (
  ma_danh_gia         INT AUTO_INCREMENT PRIMARY KEY,
  ma_nguoi_dung       INT          NOT NULL,
  ma_san_pham         INT          NOT NULL,
  ma_chi_tiet_dh      INT          NULL,
  so_sao              TINYINT(1)   NOT NULL CHECK (so_sao BETWEEN 1 AND 5),
  binh_luan           TEXT         NULL,
  da_duyet            TINYINT(1)   NOT NULL DEFAULT 0,
  ngay_tao            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ma_nguoi_dung)  REFERENCES nguoi_dung(ma_nguoi_dung)        ON DELETE CASCADE,
  FOREIGN KEY (ma_san_pham)    REFERENCES san_pham(ma_san_pham)            ON DELETE CASCADE,
  FOREIGN KEY (ma_chi_tiet_dh) REFERENCES chi_tiet_don_hang(ma_chi_tiet)  ON DELETE SET NULL,
  UNIQUE KEY uq_nguoi_sp_dh (ma_nguoi_dung, ma_san_pham, ma_chi_tiet_dh),
  INDEX idx_san_pham (ma_san_pham),
  INDEX idx_da_duyet (da_duyet)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Danh gia va binh luan cua nguoi dung ve san pham';

-- ============================================================
-- 14. BANG SAN PHAM YEU THICH (WISHLIST)
-- ============================================================
CREATE TABLE yeu_thich (
  ma_yeu_thich    INT AUTO_INCREMENT PRIMARY KEY,
  ma_nguoi_dung   INT       NOT NULL,
  ma_san_pham     INT       NOT NULL,
  ngay_them       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE CASCADE,
  FOREIGN KEY (ma_san_pham)   REFERENCES san_pham(ma_san_pham)     ON DELETE CASCADE,
  UNIQUE KEY uq_nguoi_sp (ma_nguoi_dung, ma_san_pham),
  INDEX idx_nguoi_dung (ma_nguoi_dung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Danh sach san pham yeu thich cua nguoi dung';

-- ============================================================
-- 15. BANG YEU CAU BAO HANH
-- ============================================================
CREATE TABLE yeu_cau_bao_hanh (
  ma_bao_hanh         INT AUTO_INCREMENT PRIMARY KEY,
  ma_nguoi_dung       INT          NOT NULL,
  ma_chi_tiet_dh      INT          NOT NULL,
  so_serial           VARCHAR(100) NULL,
  mo_ta_su_co         TEXT         NOT NULL,
  trang_thai          ENUM('cho_xu_ly','dang_xu_ly','hoan_thanh','tu_choi')
                      NOT NULL DEFAULT 'cho_xu_ly',
  ma_nhan_vien_xu_ly  INT          NULL,
  ghi_chu_xu_ly       TEXT         NULL,
  ngay_tiep_nhan      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngay_hoan_thanh     DATETIME     NULL,
  FOREIGN KEY (ma_nguoi_dung)      REFERENCES nguoi_dung(ma_nguoi_dung)             ON DELETE RESTRICT,
  FOREIGN KEY (ma_chi_tiet_dh)     REFERENCES chi_tiet_don_hang(ma_chi_tiet)        ON DELETE RESTRICT,
  FOREIGN KEY (ma_nhan_vien_xu_ly) REFERENCES nguoi_dung(ma_nguoi_dung)             ON DELETE SET NULL,
  INDEX idx_nguoi_dung (ma_nguoi_dung),
  INDEX idx_trang_thai (trang_thai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Yeu cau bao hanh san pham cua khach hang';

-- ============================================================
-- 16. BANG LICH SU KHO HANG
-- ============================================================
CREATE TABLE lich_su_kho (
  ma_lich_su          INT AUTO_INCREMENT PRIMARY KEY,
  ma_san_pham         INT          NOT NULL,
  ma_nguoi_dung       INT          NULL,
  so_luong_bien_dong  INT          NOT NULL,
  ton_kho_truoc       INT          NOT NULL,
  ton_kho_sau         INT          NOT NULL,
  loai_giao_dich      ENUM('nhap','xuat','dieu_chinh','hoan_tra') NOT NULL,
  ghi_chu             TEXT         NULL,
  ma_tham_chieu       VARCHAR(100) NULL,
  ngay_tao            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ma_san_pham)   REFERENCES san_pham(ma_san_pham)     ON DELETE CASCADE,
  FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE SET NULL,
  INDEX idx_san_pham   (ma_san_pham),
  INDEX idx_loai       (loai_giao_dich),
  INDEX idx_ngay_tao   (ngay_tao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Lich su bien dong ton kho san pham';

-- ============================================================
-- 17. BANG THONG BAO
-- ============================================================
CREATE TABLE thong_bao (
  ma_thong_bao    INT AUTO_INCREMENT PRIMARY KEY,
  ma_nguoi_dung   INT          NOT NULL,
  tieu_de         VARCHAR(200) NOT NULL,
  noi_dung        TEXT         NOT NULL,
  loai            VARCHAR(50)  NULL COMMENT 'don_hang, bao_hanh, he_thong, khuyen_mai',
  da_doc          TINYINT(1)   NOT NULL DEFAULT 0,
  ma_tham_chieu   VARCHAR(50)  NULL,
  ngay_tao        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE CASCADE,
  INDEX idx_nguoi_dung (ma_nguoi_dung),
  INDEX idx_da_doc     (da_doc),
  INDEX idx_ngay_tao   (ngay_tao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Thong bao gui den nguoi dung';
