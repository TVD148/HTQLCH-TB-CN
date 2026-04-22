const db = require('./src/config/database');
const slugify = require('slugify');

async function run() {
  try {
    // 1. Update all existing reviews to da_duyet = 1
    await db.query('UPDATE danh_gia SET da_duyet = 1 WHERE da_duyet = 0');
    console.log('Updated existing reviews to approved');

    // 2. Add categories if not exist
    const cats = ['Laptop Gaming', 'Laptop Văn Phòng'];
    const catIds = {};
    for (const c of cats) {
      const slug = slugify(c, { lower: true, locale: 'vi' });
      const [existing] = await db.query('SELECT ma_danh_muc FROM danh_muc WHERE ten_danh_muc = ?', [c]);
      if (existing.length) {
        catIds[c] = existing[0].ma_danh_muc;
      } else {
        const [res] = await db.query('INSERT INTO danh_muc (ten_danh_muc, duong_dan, trang_thai) VALUES (?, ?, 1)', [c, slug]);
        catIds[c] = res.insertId;
      }
    }

    // Default brand (get first one or create 'Lenovo' / 'Dell')
    const [brands] = await db.query('SELECT ma_thuong_hieu FROM thuong_hieu LIMIT 1');
    const brand_id = brands.length ? brands[0].ma_thuong_hieu : 1;

    // 3. Add products
    const products = [
      {
        name: 'Laptop Gaming ASUS ROG Strix G15',
        cat: 'Laptop Gaming',
        price: 25000000,
        sale_price: 23990000,
        thumb: 'https://placehold.co/600x400/1E293B/3B82F6?text=ASUS+ROG+Strix+G15',
        desc: '<h2>Sức mạnh tuyệt đỉnh</h2><p>Được trang bị vi xử lý mạnh mẽ và card đồ họa RTX, ASUS ROG Strix G15 mang đến trải nghiệm chơi game mượt mà nhất.</p>',
        short_desc: 'RTX 3050 | 144Hz | 8GB RAM',
        specs: [
          { name: 'CPU', value: 'AMD Ryzen 7 4800H' },
          { name: 'RAM', value: '8GB DDR4' },
          { name: 'GPU', value: 'NVIDIA RTX 3050' },
          { name: 'Màn hình', value: '15.6" FHD 144Hz' }
        ]
      },
      {
        name: 'Laptop Gaming Acer Nitro 5',
        cat: 'Laptop Gaming',
        price: 22000000,
        sale_price: 20500000,
        thumb: 'https://placehold.co/600x400/1E293B/3B82F6?text=Acer+Nitro+5',
        desc: '<h2>Thiết kế hầm hố, tản nhiệt mát mẻ</h2><p>Acer Nitro 5 phiên bản mới nhất với hệ thống tản nhiệt kép và công nghệ CoolBoost.</p>',
        short_desc: 'GTX 1650 | 144Hz | 8GB RAM',
        specs: [
          { name: 'CPU', value: 'Intel Core i5-11400H' },
          { name: 'RAM', value: '8GB DDR4' },
          { name: 'GPU', value: 'NVIDIA GTX 1650' },
          { name: 'Màn hình', value: '15.6" FHD 144Hz' }
        ]
      },
      {
        name: 'Laptop Dell Inspiron 15',
        cat: 'Laptop Văn Phòng',
        price: 15000000,
        sale_price: 14200000,
        thumb: 'https://placehold.co/600x400/1E293B/3B82F6?text=Dell+Inspiron+15',
        desc: '<h2>Mỏng nhẹ, thanh lịch</h2><p>Dell Inspiron 15 là sự lựa chọn hoàn hảo cho sinh viên và dân văn phòng với thiết kế đẹp mắt và hiệu năng ổn định.</p>',
        short_desc: 'Core i5 | 8GB RAM | 512GB SSD',
        specs: [
          { name: 'CPU', value: 'Intel Core i5-1135G7' },
          { name: 'RAM', value: '8GB DDR4' },
          { name: 'Ổ cứng', value: '512GB SSD NVMe' },
          { name: 'Màn hình', value: '15.6" FHD' }
        ]
      },
      {
        name: 'Laptop HP Pavilion 14',
        cat: 'Laptop Văn Phòng',
        price: 16500000,
        sale_price: 15900000,
        thumb: 'https://placehold.co/600x400/1E293B/3B82F6?text=HP+Pavilion+14',
        desc: '<h2>Hiệu suất cao cho công việc</h2><p>Màn hình sắc nét, thời lượng pin lâu dài giúp bạn làm việc hiệu quả cả ngày dài.</p>',
        short_desc: 'Ryzen 5 | 8GB RAM | 256GB SSD',
        specs: [
          { name: 'CPU', value: 'AMD Ryzen 5 5500U' },
          { name: 'RAM', value: '8GB DDR4' },
          { name: 'Ổ cứng', value: '256GB SSD NVMe' },
          { name: 'Màn hình', value: '14" FHD IPS' }
        ]
      }
    ];

    for (const p of products) {
      const slug = slugify(p.name, { lower: true, locale: 'vi' }) + '-' + Date.now().toString().slice(-4);
      const category_id = catIds[p.cat];

      const [res] = await db.query(
        `INSERT INTO san_pham (ten_san_pham, duong_dan, mo_ta, mo_ta_ngan, gia_goc, gia_khuyen_mai, so_luong_ton, ma_danh_muc, ma_thuong_hieu, anh_dai_dien)
         VALUES (?, ?, ?, ?, ?, ?, 50, ?, ?, ?)`,
        [p.name, slug, p.desc, p.short_desc, p.price, p.sale_price, category_id, brand_id, p.thumb]
      );
      const pid = res.insertId;

      for (let i = 0; i < p.specs.length; i++) {
        await db.query(
          'INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, thu_tu) VALUES (?, ?, ?, ?)',
          [pid, p.specs[i].name, p.specs[i].value, i]
        );
      }
      console.log('Added product:', p.name);
    }
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
