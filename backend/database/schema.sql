-- ============================================================
-- SCHEMA SQL - He thong Quan ly Cua hang Thiet bi Cong nghe
-- Database: htqlch_thietbi_cn
-- Author: HTTT01 Team
-- Version: 1.0.0
-- Compatible: MySQL 8+, MariaDB 10.4+
-- ============================================================

SET sql_mode = '';
SET GLOBAL sql_mode = '';

CREATE DATABASE IF NOT EXISTS htqlch_thietbi_cn
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE htqlch_thietbi_cn;

-- ============================================================
-- 1. BANG NGUOI DUNG (USERS)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('admin','staff','user') NOT NULL DEFAULT 'user',
  phone         VARCHAR(20)   NULL,
  address       TEXT          NULL,
  avatar_url    VARCHAR(255)  NULL,
  loyalty_points INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  email_verified_at TIMESTAMP NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. BANG DANH MUC (CATEGORIES)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  slug        VARCHAR(120)  NOT NULL UNIQUE,
  description TEXT          NULL,
  image_url   VARCHAR(255)  NULL,
  parent_id   INT           NULL,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order  INT           NOT NULL DEFAULT 0,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug      (slug),
  INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. BANG THUONG HIEU (BRANDS)
-- ============================================================
CREATE TABLE IF NOT EXISTS brands (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100)  NOT NULL UNIQUE,
  slug      VARCHAR(120)  NOT NULL UNIQUE,
  logo_url  VARCHAR(255)  NULL,
  country   VARCHAR(50)   NULL,
  is_active TINYINT(1)   NOT NULL DEFAULT 1,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. BANG SAN PHAM (PRODUCTS)
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(200)     NOT NULL,
  slug            VARCHAR(220)     NOT NULL UNIQUE,
  description     TEXT             NULL,
  short_desc      TEXT             NULL,
  price           DECIMAL(15,2)    NOT NULL,
  sale_price      DECIMAL(15,2)    NULL,
  stock_quantity  INT              NOT NULL DEFAULT 0,
  min_stock_alert INT              NOT NULL DEFAULT 5,
  category_id     INT              NOT NULL,
  brand_id        INT              NOT NULL,
  thumbnail       VARCHAR(255)     NULL,
  is_active       TINYINT(1)      NOT NULL DEFAULT 1,
  is_featured     TINYINT(1)      NOT NULL DEFAULT 0,
  view_count      INT              NOT NULL DEFAULT 0,
  avg_rating      DECIMAL(3,2)     NOT NULL DEFAULT 0.00,
  created_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (brand_id)    REFERENCES brands(id)     ON DELETE RESTRICT,
  INDEX idx_slug        (slug),
  INDEX idx_category_id (category_id),
  INDEX idx_brand_id    (brand_id),
  INDEX idx_is_active   (is_active),
  INDEX idx_is_featured (is_featured),
  FULLTEXT INDEX ft_name_desc (name, description, short_desc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. BANG THONG SO KY THUAT SAN PHAM (PRODUCT_SPECS)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_specs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT           NOT NULL,
  spec_name  VARCHAR(100)  NOT NULL,
  spec_value VARCHAR(255)  NOT NULL,
  unit       VARCHAR(50)   NULL,
  sort_order INT           NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. BANG ANH SAN PHAM (PRODUCT_IMAGES)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT           NOT NULL,
  image_url  VARCHAR(255)  NOT NULL,
  is_primary TINYINT(1)   NOT NULL DEFAULT 0,
  sort_order INT           NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. BANG GIO HANG (CARTS)
-- ============================================================
CREATE TABLE IF NOT EXISTS carts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT       NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. BANG SAN PHAM TRONG GIO HANG (CART_ITEMS)
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  cart_id    INT           NOT NULL,
  product_id INT           NOT NULL,
  quantity   INT           NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  added_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_cart_product (cart_id, product_id),
  INDEX idx_cart_id (cart_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. BANG VOUCHER / MA GIAM GIA (VOUCHERS)
-- ============================================================
CREATE TABLE IF NOT EXISTS vouchers (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  code                VARCHAR(50)   NOT NULL UNIQUE,
  name                VARCHAR(150)  NOT NULL,
  description         TEXT          NULL,
  discount_type       ENUM('percent','fixed_amount') NOT NULL,
  discount_value      DECIMAL(15,2) NOT NULL,
  max_discount_amount DECIMAL(15,2) NULL COMMENT 'Giam toi da (cho loai percent)',
  min_order_value     DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Gia tri don toi thieu',
  max_uses            INT           NOT NULL DEFAULT 1,
  used_count          INT           NOT NULL DEFAULT 0,
  max_uses_per_user   INT           NOT NULL DEFAULT 1,
  is_active           TINYINT(1)   NOT NULL DEFAULT 1,
  start_date          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expired_at          DATETIME      NOT NULL DEFAULT '2099-12-31 23:59:59',
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_code       (code),
  INDEX idx_is_active  (is_active),
  INDEX idx_expired_at (expired_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. BANG LICH SU SU DUNG VOUCHER (VOUCHER_USAGES)
-- ============================================================
CREATE TABLE IF NOT EXISTS voucher_usages (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  voucher_id       INT           NOT NULL,
  user_id          INT           NOT NULL,
  order_id         INT           NULL,
  discount_applied DECIMAL(15,2) NOT NULL,
  used_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  INDEX idx_voucher_id (voucher_id),
  INDEX idx_user_id    (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. BANG DON HANG (ORDERS)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  user_id              INT           NOT NULL,
  order_code           VARCHAR(50)   NOT NULL UNIQUE,
  subtotal             DECIMAL(15,2) NOT NULL,
  discount_amount      DECIMAL(15,2) NOT NULL DEFAULT 0,
  shipping_fee         DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_amount         DECIMAL(15,2) NOT NULL,
  voucher_id           INT           NULL,
  loyalty_points_used  INT           NOT NULL DEFAULT 0,
  loyalty_points_earned INT          NOT NULL DEFAULT 0,
  status               ENUM('pending','confirmed','shipping','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  payment_method       ENUM('cod','bank_transfer','momo','loyalty_points') NOT NULL DEFAULT 'cod',
  payment_status       ENUM('unpaid','paid','refunded') NOT NULL DEFAULT 'unpaid',
  receiver_name        VARCHAR(100)  NOT NULL,
  receiver_phone       VARCHAR(20)   NOT NULL,
  shipping_address     TEXT          NOT NULL,
  note                 TEXT          NULL,
  created_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE RESTRICT,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE SET NULL,
  INDEX idx_user_id    (user_id),
  INDEX idx_order_code (order_code),
  INDEX idx_status     (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. BANG CHI TIET DON HANG (ORDER_ITEMS)
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  order_id          INT           NOT NULL,
  product_id        INT           NOT NULL,
  product_name      VARCHAR(200)  NOT NULL,
  product_thumbnail VARCHAR(255)  NULL,
  unit_price        DECIMAL(15,2) NOT NULL,
  quantity          INT           NOT NULL,
  subtotal          DECIMAL(15,2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order_id   (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. BANG DANH GIA SAN PHAM (REVIEWS)
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT          NOT NULL,
  product_id    INT          NOT NULL,
  order_item_id INT          NULL,
  rating        TINYINT(1)  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT         NULL,
  is_approved   TINYINT(1)  NOT NULL DEFAULT 0,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)       REFERENCES users(id)        ON DELETE CASCADE,
  FOREIGN KEY (product_id)    REFERENCES products(id)     ON DELETE CASCADE,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id)  ON DELETE SET NULL,
  UNIQUE KEY uq_user_product_order (user_id, product_id, order_item_id),
  INDEX idx_product_id  (product_id),
  INDEX idx_is_approved (is_approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. BANG SAN PHAM YEU THICH (WISHLISTS)
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT       NOT NULL,
  product_id INT       NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_product (user_id, product_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. BANG YEU CAU BAO HANH (WARRANTY_REQUESTS)
-- ============================================================
CREATE TABLE IF NOT EXISTS warranty_requests (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  user_id             INT          NOT NULL,
  order_item_id       INT          NOT NULL,
  serial_number       VARCHAR(100) NULL,
  issue_description   TEXT         NOT NULL,
  status              ENUM('pending','processing','completed','rejected') NOT NULL DEFAULT 'pending',
  assigned_staff_id   INT          NULL,
  resolution_note     TEXT         NULL,
  received_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at        DATETIME     NULL DEFAULT NULL,
  FOREIGN KEY (user_id)           REFERENCES users(id)        ON DELETE RESTRICT,
  FOREIGN KEY (order_item_id)     REFERENCES order_items(id)  ON DELETE RESTRICT,
  FOREIGN KEY (assigned_staff_id) REFERENCES users(id)        ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_status  (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. BANG LICH SU KHO HANG (INVENTORY_LOGS)
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory_logs (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  product_id      INT          NOT NULL,
  user_id         INT          NULL,
  quantity_change INT          NOT NULL,
  stock_before    INT          NOT NULL,
  stock_after     INT          NOT NULL,
  type            ENUM('import','export','adjustment','return') NOT NULL,
  note            TEXT         NULL,
  reference_code  VARCHAR(100) NULL,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE SET NULL,
  INDEX idx_product_id (product_id),
  INDEX idx_type       (type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. BANG THONG BAO (NOTIFICATIONS)
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  title      VARCHAR(200) NOT NULL,
  content    TEXT         NOT NULL,
  type       VARCHAR(50)  NULL COMMENT 'order, warranty, system, promotion',
  is_read    TINYINT(1)  NOT NULL DEFAULT 0,
  ref_id     VARCHAR(50)  NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id  (user_id),
  INDEX idx_is_read  (is_read),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
