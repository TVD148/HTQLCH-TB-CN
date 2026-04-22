-- ================================================================
-- Migration: Voucher V2 + Shipping Fee per Product
-- Run: mysql -u root htqlch_thietbi_cn < migrate_voucher_v2.sql
-- ================================================================

-- 1. Thêm phí vận chuyển vào bảng sản phẩm
ALTER TABLE san_pham
  ADD COLUMN IF NOT EXISTS phi_van_chuyen DECIMAL(12,0) NOT NULL DEFAULT 30000
    COMMENT 'Phí vận chuyển riêng của sản phẩm (VND)';

-- 2. Thêm loại voucher vào bảng mã giảm giá
ALTER TABLE ma_giam_gia
  ADD COLUMN IF NOT EXISTS loai_voucher ENUM('product','shipping','promo_code') NOT NULL DEFAULT 'product'
    COMMENT 'product=giảm tiền SP, shipping=giảm phí ship, promo_code=mã sự kiện';

-- 3. Cập nhật voucher hiện có
UPDATE ma_giam_gia SET loai_voucher = 'shipping'
  WHERE loai_giam IN ('freeship');

UPDATE ma_giam_gia SET loai_voucher = 'product'
  WHERE loai_giam IN ('percent','fixed_amount') AND loai_voucher = 'product';

-- 4. Thêm cột shipping_voucher_id vào đơn hàng (lưu voucher ship riêng)
ALTER TABLE don_hang
  ADD COLUMN IF NOT EXISTS ma_voucher_ship INT NULL DEFAULT NULL
    COMMENT 'Voucher giảm phí vận chuyển';

-- 5. Thêm cột so_tien_giam_ship vào đơn hàng
ALTER TABLE don_hang
  ADD COLUMN IF NOT EXISTS so_tien_giam_ship DECIMAL(15,0) NOT NULL DEFAULT 0
    COMMENT 'Số tiền được giảm từ phí vận chuyển';
