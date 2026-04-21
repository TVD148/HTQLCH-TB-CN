-- ============================================================
-- MIGRATION: Warranty system upgrade
-- Thêm: hinh_thuc, so_dien_thoai, lich_hen vào yeu_cau_bao_hanh
-- Thêm: thoi_gian_bao_hanh vào san_pham
-- ============================================================

SET NAMES utf8mb4;
USE htqlch_thietbi_cn;

-- 1. Thêm cột thoi_gian_bao_hanh vào bảng san_pham (nếu chưa có)
ALTER TABLE san_pham
  ADD COLUMN IF NOT EXISTS thoi_gian_bao_hanh INT NOT NULL DEFAULT 12
  COMMENT 'Số tháng bảo hành mặc định' AFTER ngay_cap_nhat;

-- 2. Thêm các cột mới vào bảng yeu_cau_bao_hanh (nếu chưa có)
ALTER TABLE yeu_cau_bao_hanh
  ADD COLUMN IF NOT EXISTS hinh_thuc ENUM('buu_dien','ship_ve','den_cua_hang')
    NOT NULL DEFAULT 'buu_dien'
    COMMENT 'Hình thức gửi bảo hành'
    AFTER mo_ta_su_co,

  ADD COLUMN IF NOT EXISTS so_dien_thoai VARCHAR(20) NULL
    COMMENT 'SĐT liên hệ của khách'
    AFTER hinh_thuc,

  ADD COLUMN IF NOT EXISTS lich_hen DATETIME NULL
    COMMENT 'Thời gian hẹn đến cửa hàng'
    AFTER so_dien_thoai;

-- 3. Cập nhật thời gian bảo hành mặc định cho từng sản phẩm
-- (laptop gaming: 24 tháng, laptop văn phòng: 12 tháng, phụ kiện: 12 tháng)
UPDATE san_pham SET thoi_gian_bao_hanh = 24
WHERE ma_danh_muc IN (
  SELECT ma_danh_muc FROM danh_muc WHERE duong_dan LIKE '%gaming%'
);

UPDATE san_pham SET thoi_gian_bao_hanh = 24
WHERE ten_san_pham LIKE '%MacBook%'
   OR ten_san_pham LIKE '%ThinkPad%'
   OR ten_san_pham LIKE '%XPS%';

-- 4. Xác nhận kết quả
SELECT
  'san_pham' AS bang,
  COUNT(*) AS so_san_pham,
  MIN(thoi_gian_bao_hanh) AS bh_min,
  MAX(thoi_gian_bao_hanh) AS bh_max
FROM san_pham;

SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'htqlch_thietbi_cn'
  AND TABLE_NAME = 'yeu_cau_bao_hanh'
ORDER BY ORDINAL_POSITION;
