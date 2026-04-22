const db = require('./src/config/database');

async function run() {
  try {
    await db.query('DROP TABLE IF EXISTS thong_bao');
    const createTableQuery = `
      CREATE TABLE thong_bao (
        ma_thong_bao INT AUTO_INCREMENT PRIMARY KEY,
        ma_nguoi_dung INT NOT NULL,
        tieu_de VARCHAR(255) NOT NULL,
        noi_dung TEXT NOT NULL,
        loai VARCHAR(50) DEFAULT 'system',
        da_doc TINYINT(1) DEFAULT 0,
        ma_tham_chieu VARCHAR(50) DEFAULT NULL,
        ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE CASCADE
      );
    `;
    await db.query(createTableQuery);
    console.log("Table 'thong_bao' recreated with correct schema.");
    
    // Create some dummy notifications for the user 1
    await db.query(`
      INSERT INTO thong_bao (ma_nguoi_dung, tieu_de, noi_dung, loai, ma_tham_chieu) VALUES
      (1, 'Đơn hàng đã giao', 'Đơn hàng #DH-123 của bạn đã được giao thành công.', 'order', '123'),
      (1, 'Voucher mới', 'Bạn vừa nhận được voucher giảm giá 10% từ hệ thống.', 'voucher', 'VOUCHER10'),
      (1, 'Bảo hành duyệt', 'Yêu cầu bảo hành SP123 của bạn đã được duyệt.', 'warranty', 'W-456')
    `);

    process.exit(0);
  } catch (error) {
    console.error("Error setting up DB:", error);
    process.exit(1);
  }
}

run();
