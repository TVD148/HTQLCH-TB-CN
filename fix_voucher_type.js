const mysql = require('mysql2/promise');

async function fix() {
  const db = await mysql.createConnection({
    host: 'localhost', user: 'root', password: '', database: 'htqlch_thiet_bi_cn'
  });

  // Xem hiện trạng
  const [rows] = await db.query('SELECT ma_code, loai_giam, loai_voucher FROM ma_giam_gia');
  console.log('Current state:');
  rows.forEach(r => console.log(`  ${r.ma_code} | loai_giam=${r.loai_giam} | loai_voucher=${r.loai_voucher}`));

  // 1. freeship => shipping
  const [r1] = await db.query("UPDATE ma_giam_gia SET loai_voucher = 'shipping' WHERE loai_giam = 'freeship'");
  console.log('\nUpdated freeship -> shipping:', r1.affectedRows, 'rows');

  // 2. percent/fixed_amount mà chưa có loai_voucher => product
  const [r2] = await db.query("UPDATE ma_giam_gia SET loai_voucher = 'product' WHERE loai_giam IN ('percent','fixed_amount') AND loai_voucher IS NULL");
  console.log('Updated NULL -> product:', r2.affectedRows, 'rows');

  // 3. Verify
  const [after] = await db.query('SELECT ma_code, loai_giam, loai_voucher FROM ma_giam_gia');
  console.log('\nAfter fix:');
  after.forEach(r => console.log(`  ${r.ma_code} | loai_giam=${r.loai_giam} | loai_voucher=${r.loai_voucher}`));

  await db.end();
  console.log('\nDone!');
}
fix().catch(console.error);
