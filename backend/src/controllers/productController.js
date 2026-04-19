const db = require('../config/database');
const slugify = require('slugify');

/**
 * GET /api/products
 * Query params: search, category, brand, min_price, max_price, min_rating, sort, page, limit, featured
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

    let where = ['p.is_active = 1'];
    let params = [];

    if (search) {
      where.push('(p.name LIKE ? OR p.short_desc LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      // Lấy cả danh mục con
      where.push('(p.category_id = ? OR c.parent_id = ?)');
      params.push(category, category);
    }
    if (brand) {
      const brandIds = brand.split(',').map(Number).filter(Boolean);
      where.push(`p.brand_id IN (${brandIds.map(() => '?').join(',')})`);
      params.push(...brandIds);
    }
    if (Number(min_price) > 0) {
      where.push('COALESCE(p.sale_price, p.price) >= ?');
      params.push(Number(min_price));
    }
    if (Number(max_price) > 0) {
      where.push('COALESCE(p.sale_price, p.price) <= ?');
      params.push(Number(max_price));
    }
    if (Number(min_rating) > 0) {
      where.push('p.avg_rating >= ?');
      params.push(Number(min_rating));
    }
    if (featured === '1') {
      where.push('p.is_featured = 1');
    }

    const sortMap = {
      newest:     'p.created_at DESC',
      oldest:     'p.created_at ASC',
      price_asc:  'COALESCE(p.sale_price, p.price) ASC',
      price_desc: 'COALESCE(p.sale_price, p.price) DESC',
      rating:     'p.avg_rating DESC',
      popular:    'p.view_count DESC',
    };
    const orderBy = sortMap[sort] || 'p.created_at DESC';
    const whereStr = where.join(' AND ');

    const baseQuery = `
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN brands b     ON b.id = p.brand_id
      WHERE ${whereStr}
    `;

    const [countRows] = await db.query(`SELECT COUNT(DISTINCT p.id) as total ${baseQuery}`, params);
    const total = countRows[0].total;

    const [products] = await db.query(
      `SELECT DISTINCT p.id, p.name, p.slug, p.short_desc, p.price, p.sale_price,
              p.stock_quantity, p.thumbnail, p.avg_rating, p.view_count, p.is_featured,
              c.id as category_id, c.name as category_name,
              b.id as brand_id, b.name as brand_name
       ${baseQuery}
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    // Cập nhật view_count nếu xem chi tiết (không cần ở list)
    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/products/:slug
 */
const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const [rows] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              b.name as brand_name, b.logo_url as brand_logo
       FROM products p
       JOIN categories c ON c.id = p.category_id
       JOIN brands b     ON b.id = p.brand_id
       WHERE p.slug = ? AND p.is_active = 1`,
      [slug]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tìm thấy' });
    }

    const product = rows[0];

    // Thông số kỹ thuật
    const [specs] = await db.query(
      'SELECT spec_name, spec_value, unit FROM product_specs WHERE product_id = ? ORDER BY sort_order',
      [product.id]
    );

    // Ảnh
    const [images] = await db.query(
      'SELECT image_url, is_primary FROM product_images WHERE product_id = ? ORDER BY sort_order',
      [product.id]
    );

    // Đánh giá (top 10)
    const [reviews] = await db.query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
              u.name as user_name, u.avatar_url
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.product_id = ? AND r.is_approved = 1
       ORDER BY r.created_at DESC LIMIT 10`,
      [product.id]
    );

    // Rating summary
    const [ratingSummary] = await db.query(
      `SELECT rating, COUNT(*) as count
       FROM reviews WHERE product_id = ? AND is_approved = 1
       GROUP BY rating ORDER BY rating DESC`,
      [product.id]
    );

    // Sản phẩm liên quan
    const [related] = await db.query(
      `SELECT id, name, slug, price, sale_price, thumbnail, avg_rating
       FROM products
       WHERE category_id = ? AND id != ? AND is_active = 1
       ORDER BY view_count DESC LIMIT 8`,
      [product.category_id, product.id]
    );

    // Tăng view count
    await db.query('UPDATE products SET view_count = view_count + 1 WHERE id = ?', [product.id]);

    res.json({
      success: true,
      data: { ...product, specs, images, reviews, rating_summary: ratingSummary, related },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/products/compare?ids=1,2,3
 */
const compareProducts = async (req, res, next) => {
  try {
    const ids = (req.query.ids || '').split(',').map(Number).filter(Boolean).slice(0, 4);
    if (ids.length < 2) {
      return res.status(400).json({ success: false, message: 'Cần ít nhất 2 sản phẩm để so sánh' });
    }

    const [products] = await db.query(
      `SELECT p.id, p.name, p.slug, p.price, p.sale_price, p.thumbnail, p.avg_rating,
              c.name as category_name, b.name as brand_name
       FROM products p
       JOIN categories c ON c.id = p.category_id
       JOIN brands b     ON b.id = p.brand_id
       WHERE p.id IN (${ids.map(() => '?').join(',')})`,
      ids
    );

    // Lấy tất cả specs của các sản phẩm
    const [allSpecs] = await db.query(
      `SELECT product_id, spec_name, spec_value, unit
       FROM product_specs WHERE product_id IN (${ids.map(() => '?').join(',')})
       ORDER BY sort_order`,
      ids
    );

    // Group specs theo product
    const specsMap = {};
    allSpecs.forEach(s => {
      if (!specsMap[s.product_id]) specsMap[s.product_id] = [];
      specsMap[s.product_id].push(s);
    });

    const result = products.map(p => ({
      ...p,
      specs: specsMap[p.id] || [],
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/products (Admin only)
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, short_desc, price, sale_price, stock_quantity,
            min_stock_alert, category_id, brand_id, thumbnail, is_featured, specs } = req.body;

    if (!name || !price || !category_id || !brand_id) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const slug = slugify(name, { lower: true, strict: true, locale: 'vi' }) + '-' + Date.now();

    const [result] = await db.query(
      `INSERT INTO products (name, slug, description, short_desc, price, sale_price,
        stock_quantity, min_stock_alert, category_id, brand_id, thumbnail, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, short_desc, price, sale_price || null,
       stock_quantity || 0, min_stock_alert || 5, category_id, brand_id,
       thumbnail || null, is_featured ? 1 : 0]
    );

    const productId = result.insertId;

    // Thêm thông số kỹ thuật
    if (specs && specs.length > 0) {
      const specValues = specs.map((s, i) => [productId, s.spec_name, s.spec_value, s.unit || null, i]);
      await db.query(
        'INSERT INTO product_specs (product_id, spec_name, spec_value, unit, sort_order) VALUES ?',
        [specValues]
      );
    }

    // Log nhập kho ban đầu
    if (stock_quantity > 0) {
      await db.query(
        `INSERT INTO inventory_logs (product_id, user_id, quantity_change, stock_before, stock_after, type, note)
         VALUES (?, ?, ?, 0, ?, 'import', 'Nhập hàng ban đầu khi tạo sản phẩm')`,
        [productId, req.user.id, stock_quantity, stock_quantity]
      );
    }

    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    res.status(201).json({ success: true, message: 'Tạo sản phẩm thành công!', data: product[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/products/:id
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, short_desc, price, sale_price, stock_quantity,
            min_stock_alert, category_id, brand_id, thumbnail, is_active, is_featured, specs } = req.body;

    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tìm thấy' });
    }

    const slug = name
      ? slugify(name, { lower: true, strict: true, locale: 'vi' }) + '-' + id
      : existing[0].slug;

    await db.query(
      `UPDATE products SET name=?, slug=?, description=?, short_desc=?, price=?,
        sale_price=?, stock_quantity=?, min_stock_alert=?, category_id=?,
        brand_id=?, thumbnail=?, is_active=?, is_featured=?
       WHERE id = ?`,
      [name || existing[0].name, slug, description, short_desc, price || existing[0].price,
       sale_price || null, stock_quantity ?? existing[0].stock_quantity,
       min_stock_alert ?? existing[0].min_stock_alert,
       category_id || existing[0].category_id, brand_id || existing[0].brand_id,
       thumbnail || existing[0].thumbnail, is_active ?? existing[0].is_active,
       is_featured ? 1 : 0, id]
    );

    // Cập nhật specs nếu có
    if (specs && specs.length > 0) {
      await db.query('DELETE FROM product_specs WHERE product_id = ?', [id]);
      const specValues = specs.map((s, i) => [id, s.spec_name, s.spec_value, s.unit || null, i]);
      await db.query(
        'INSERT INTO product_specs (product_id, spec_name, spec_value, unit, sort_order) VALUES ?',
        [specValues]
      );
    }

    const [updated] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Cập nhật sản phẩm thành công!', data: updated[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/products/:id
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Soft delete
    await db.query('UPDATE products SET is_active = 0 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Xóa sản phẩm thành công!' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProductBySlug, compareProducts, createProduct, updateProduct, deleteProduct };
