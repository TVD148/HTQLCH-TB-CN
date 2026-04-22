const db = require('./src/config/database');

async function run() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS thong_bao (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ma_nguoi_dung INT NOT NULL,
        tieu_de VARCHAR(255) NOT NULL,
        noi_dung TEXT NOT NULL,
        loai VARCHAR(50) DEFAULT 'system',
        da_doc TINYINT(1) DEFAULT 0,
        duong_dan VARCHAR(255) DEFAULT NULL,
        ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE CASCADE
      );
    `;
    await db.query(createTableQuery);
    console.log("Table 'thong_bao' created or already exists.");

    process.exit(0);
  } catch (error) {
    console.error("Error setting up DB:", error);
    process.exit(1);
  }
}

run();
