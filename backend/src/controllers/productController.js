const db = require('../config/database');
const slugify = require('slugify');

/**
 * GET /api/products
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      search = '', category = '', brand = '',
      min_price = 0, max_price = 0,
      min_rating = 0, sort = 'newest',
      page = 1, limit = 12, featured = ''
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(48, Math.max(1, parseInt(limit)));
    const offset   = (pageNum - 1) * limitNum;

    let where = ['p.trang_thai = 1'];
    let params = [];

    if (search) {
      where.push('(p.ten_san_pham LIKE ? OR p.mo_ta_ngan LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      where.push('(p.ma_danh_muc = ? OR dm.ma_danh_muc_cha = ?)');
      params.push(category, category);
    }
    if (brand) {
      const brandIds = brand.split(',').map(Number).filter(Boolean);
      where.push(`p.ma_thuong_hieu IN (${brandIds.map(() => '?').join(',')})`);
      params.push(...brandIds);
    }
    if (Number(min_price) > 0) {
      where.push('COALESCE(p.gia_khuyen_mai, p.gia_goc) >= ?');
      params.push(Number(min_price));
    }
    if (Number(max_price) > 0) {
      where.push('COALESCE(p.gia_khuyen_mai, p.gia_goc) <= ?');
      params.push(Number(max_price));
    }
    if (Number(min_rating) > 0) {
      where.push('p.danh_gia_tb >= ?');
      params.push(Number(min_rating));
    }
    if (featured === '1') {
      where.push('p.noi_bat = 1');
    }

    const sortMap = {
      newest:     'p.ngay_tao DESC',
      oldest:     'p.ngay_tao ASC',
      price_asc:  'COALESCE(p.gia_khuyen_mai, p.gia_goc) ASC',
      price_desc: 'COALESCE(p.gia_khuyen_mai, p.gia_goc) DESC',
      rating:     'p.danh_gia_tb DESC',
      popular:    'p.luot_xem DESC',
      bestseller: 'tong_da_ban DESC',
    };
    const orderBy = sortMap[sort] || 'p.ngay_tao DESC';
    const whereStr = where.join(' AND ');
    const isBestseller = sort === 'bestseller';

    // Bestseller: can LEFT JOIN them vao chi_tiet_don_hang (khong tinh don bi huy)
    const bestsellJoin = isBestseller
      ? `LEFT JOIN chi_tiet_don_hang ctdh ON ctdh.ma_san_pham = p.ma_san_pham
         LEFT JOIN don_hang dh ON dh.ma_don_hang = ctdh.ma_don_hang AND dh.trang_thai != 'da_huy'`
      : '';
    const bestsellSelect = isBestseller
      ? ', COALESCE(SUM(ctdh.so_luong), 0) AS tong_da_ban'
      : '';

    const baseQuery = `
      FROM san_pham p
      LEFT JOIN danh_muc dm ON dm.ma_danh_muc = p.ma_danh_muc
      LEFT JOIN thuong_hieu th ON th.ma_thuong_hieu = p.ma_thuong_hieu
      ${bestsellJoin}
      WHERE ${whereStr}
    `;

    const [countRows] = await db.query(`SELECT COUNT(DISTINCT p.ma_san_pham) AS total ${baseQuery}`, params);
    const total = countRows[0].total;

    const groupBy = isBestseller ? 'GROUP BY p.ma_san_pham' : '';

    const [products] = await db.query(
      `SELECT
              p.ma_san_pham AS id, p.ten_san_pham AS name, p.duong_dan AS slug,
              p.mo_ta_ngan AS short_desc, p.gia_goc AS price, p.gia_khuyen_mai AS sale_price,
              p.so_luong_ton AS stock_quantity, p.anh_dai_dien AS thumbnail,
              p.danh_gia_tb AS avg_rating, p.luot_xem AS view_count, p.noi_bat AS is_featured,
              dm.ma_danh_muc AS category_id, dm.ten_danh_muc AS category_name,
              th.ma_thuong_hieu AS brand_id, th.ten_thuong_hieu AS brand_name
              ${bestsellSelect}
       ${baseQuery}
       ${groupBy}
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    res.json({
      success: true,
      data: products,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
};

/**
 * GET /api/products/:slug
 */
const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const [rows] = await db.query(
      `SELECT p.*,
              p.ma_san_pham AS id, p.ten_san_pham AS name, p.duong_dan AS slug,
              p.gia_goc AS price, p.gia_khuyen_mai AS sale_price,
              p.so_luong_ton AS stock_quantity, p.anh_dai_dien AS thumbnail,
              p.danh_gia_tb AS avg_rating, p.luot_xem AS view_count,
              p.noi_bat AS is_featured, p.trang_thai AS is_active,
              p.mo_ta AS description, p.mo_ta_ngan AS short_desc,
              dm.ma_danh_muc AS category_id, dm.ten_danh_muc AS category_name, dm.duong_dan AS category_slug,
              th.ten_thuong_hieu AS brand_name, th.logo AS brand_logo
       FROM san_pham p
       JOIN danh_muc dm  ON dm.ma_danh_muc    = p.ma_danh_muc
       JOIN thuong_hieu th ON th.ma_thuong_hieu = p.ma_thuong_hieu
       WHERE p.duong_dan = ? AND p.trang_thai = 1`,
      [slug]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tìm thấy' });
    }

    const product = rows[0];
    const pid = product.ma_san_pham;

    const [specs] = await db.query(
      `SELECT ten_thong_so AS spec_name, gia_tri AS spec_value, don_vi AS unit
       FROM thong_so_ky_thuat WHERE ma_san_pham = ? ORDER BY thu_tu`,
      [pid]
    );

    const [images] = await db.query(
      `SELECT duong_dan_anh AS image_url, la_anh_chinh AS is_primary
       FROM anh_san_pham WHERE ma_san_pham = ? ORDER BY thu_tu`,
      [pid]
    );

    const [reviews] = await db.query(
      `SELECT dg.ma_danh_gia AS id, dg.so_sao AS rating, dg.binh_luan AS comment, dg.ngay_tao AS created_at,
              nd.ho_ten AS user_name, nd.anh_dai_dien AS avatar_url
       FROM danh_gia dg
       JOIN nguoi_dung nd ON nd.ma_nguoi_dung = dg.ma_nguoi_dung
       WHERE dg.ma_san_pham = ? AND dg.da_duyet = 1
       ORDER BY dg.ngay_tao DESC LIMIT 10`,
      [pid]
    );

    const [ratingSummary] = await db.query(
      `SELECT so_sao AS rating, COUNT(*) AS count
       FROM danh_gia WHERE ma_san_pham = ? AND da_duyet = 1
       GROUP BY so_sao ORDER BY so_sao DESC`,
      [pid]
    );

    const [related] = await db.query(
      `SELECT ma_san_pham AS id, ten_san_pham AS name, duong_dan AS slug,
              gia_goc AS price, gia_khuyen_mai AS sale_price, anh_dai_dien AS thumbnail, danh_gia_tb AS avg_rating
       FROM san_pham
       WHERE ma_danh_muc = ? AND ma_san_pham != ? AND trang_thai = 1
       ORDER BY luot_xem DESC LIMIT 8`,
      [product.ma_danh_muc, pid]
    );

    await db.query('UPDATE san_pham SET luot_xem = luot_xem + 1 WHERE ma_san_pham = ?', [pid]);

    res.json({
      success: true,
      data: { ...product, specs, images, reviews, rating_summary: ratingSummary, related },
    });
  } catch (err) { next(err); }
};

/**
 * GET /api/products/compare?ids=slug1,slug2
 */
const compareProducts = async (req, res, next) => {
  try {
    const slugs = (req.query.ids || '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);
    if (slugs.length < 2) {
      return res.status(400).json({ success: false, message: 'Cần ít nhất 2 sản phẩm để so sánh' });
    }

    const [products] = await db.query(
      `SELECT p.ma_san_pham AS id, p.ten_san_pham AS name, p.duong_dan AS slug,
              p.gia_goc AS price, p.gia_khuyen_mai AS sale_price,
              p.anh_dai_dien AS thumbnail, p.danh_gia_tb AS avg_rating,
              dm.ten_danh_muc AS category_name, th.ten_thuong_hieu AS brand_name
       FROM san_pham p
       JOIN danh_muc dm  ON dm.ma_danh_muc    = p.ma_danh_muc
       JOIN thuong_hieu th ON th.ma_thuong_hieu = p.ma_thuong_hieu
       WHERE p.duong_dan IN (${slugs.map(() => '?').join(',')})`,
      slugs
    );

    const ids = products.map(p => p.id);
    if (!ids.length) return res.json({ success: true, data: [] });

    const [allSpecs] = await db.query(
      `SELECT ma_san_pham AS product_id, ten_thong_so AS spec_name, gia_tri AS spec_value, don_vi AS unit
       FROM thong_so_ky_thuat WHERE ma_san_pham IN (${ids.map(() => '?').join(',')}) ORDER BY thu_tu`,
      ids
    );

    const specsMap = {};
    allSpecs.forEach(s => {
      if (!specsMap[s.product_id]) specsMap[s.product_id] = [];
      specsMap[s.product_id].push(s);
    });

    const result = products.map(p => ({ ...p, specs: specsMap[p.id] || [] }));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

/** POST /api/admin/products */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, short_desc, price, sale_price, stock_quantity,
            min_stock_alert, category_id, brand_id, thumbnail, is_featured, specs } = req.body;

    if (!name || !price || !category_id || !brand_id) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const slug = slugify(name, { lower: true, strict: true, locale: 'vi' }) + '-' + Date.now();

    const [result] = await db.query(
      `INSERT INTO san_pham
         (ten_san_pham, duong_dan, mo_ta, mo_ta_ngan, gia_goc, gia_khuyen_mai,
          so_luong_ton, canh_bao_ton_toi_thieu, ma_danh_muc, ma_thuong_hieu, anh_dai_dien, noi_bat)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, short_desc, price, sale_price || null,
       stock_quantity || 0, min_stock_alert || 5, category_id, brand_id,
       thumbnail || null, is_featured ? 1 : 0]
    );
    const productId = result.insertId;

    if (specs && specs.length > 0) {
      const specValues = specs.map((s, i) => [productId, s.spec_name, s.spec_value, s.unit || null, i]);
      await db.query(
        'INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES ?',
        [specValues]
      );
    }

    if (stock_quantity > 0) {
      await db.query(
        `INSERT INTO lich_su_kho (ma_san_pham, ma_nguoi_dung, so_luong_bien_dong, ton_kho_truoc, ton_kho_sau, loai_giao_dich, ghi_chu)
         VALUES (?, ?, ?, 0, ?, 'nhap', 'Nhập hàng ban đầu khi tạo sản phẩm')`,
        [productId, req.user.id, stock_quantity, stock_quantity]
      );
    }

    const [product] = await db.query(
      `SELECT ma_san_pham AS id, ten_san_pham AS name, duong_dan AS slug,
              gia_goc AS price, gia_khuyen_mai AS sale_price, so_luong_ton AS stock_quantity
       FROM san_pham WHERE ma_san_pham = ?`, [productId]
    );
    res.status(201).json({ success: true, message: 'Tạo sản phẩm thành công!', data: product[0] });
  } catch (err) { next(err); }
};

/** PUT /api/admin/products/:id */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, short_desc, price, sale_price, stock_quantity,
            min_stock_alert, category_id, brand_id, thumbnail, is_active, is_featured, specs } = req.body;

    const [existing] = await db.query('SELECT * FROM san_pham WHERE ma_san_pham = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tìm thấy' });
    }
    const ex = existing[0];

    const slug = name
      ? slugify(name, { lower: true, strict: true, locale: 'vi' }) + '-' + id
      : ex.duong_dan;

    await db.query(
      `UPDATE san_pham SET
         ten_san_pham=?, duong_dan=?, mo_ta=?, mo_ta_ngan=?, gia_goc=?,
         gia_khuyen_mai=?, so_luong_ton=?, canh_bao_ton_toi_thieu=?,
         ma_danh_muc=?, ma_thuong_hieu=?, anh_dai_dien=?, trang_thai=?, noi_bat=?
       WHERE ma_san_pham = ?`,
      [name || ex.ten_san_pham, slug, description ?? ex.mo_ta, short_desc ?? ex.mo_ta_ngan,
       price || ex.gia_goc, sale_price || null,
       stock_quantity ?? ex.so_luong_ton, min_stock_alert ?? ex.canh_bao_ton_toi_thieu,
       category_id || ex.ma_danh_muc, brand_id || ex.ma_thuong_hieu,
       thumbnail || ex.anh_dai_dien, is_active ?? ex.trang_thai, is_featured ? 1 : 0, id]
    );

    if (specs && specs.length > 0) {
      await db.query('DELETE FROM thong_so_ky_thuat WHERE ma_san_pham = ?', [id]);
      const specValues = specs.map((s, i) => [id, s.spec_name, s.spec_value, s.unit || null, i]);
      await db.query(
        'INSERT INTO thong_so_ky_thuat (ma_san_pham, ten_thong_so, gia_tri, don_vi, thu_tu) VALUES ?',
        [specValues]
      );
    }

    const [updated] = await db.query(
      `SELECT ma_san_pham AS id, ten_san_pham AS name, duong_dan AS slug,
              gia_goc AS price, gia_khuyen_mai AS sale_price, so_luong_ton AS stock_quantity
       FROM san_pham WHERE ma_san_pham = ?`, [id]
    );
    res.json({ success: true, message: 'Cập nhật sản phẩm thành công!', data: updated[0] });
  } catch (err) { next(err); }
};

/** DELETE /api/admin/products/:id */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE san_pham SET trang_thai = 0 WHERE ma_san_pham = ?', [id]);
    res.json({ success: true, message: 'Xóa sản phẩm thành công!' });
  } catch (err) { next(err); }
};

module.exports = { getProducts, getProductBySlug, compareProducts, createProduct, updateProduct, deleteProduct };
