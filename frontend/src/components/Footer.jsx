import { Link } from 'react-router-dom';
import { Zap, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div className="header__logo-icon">
                <Zap size={18} color="#fff" strokeWidth={2.5} />
              </div>
              <span className="footer__brand">TechStore</span>
            </div>
            <p className="footer__desc">
              Hệ thống cửa hàng thiết bị công nghệ uy tín hàng đầu. Chính hãng 100%, bảo hành chính thức, giao hàng toàn quốc.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
              {[
                { icon: <Phone size={14} />, text: '1800 6818' },
                { icon: <Mail size={14} />,  text: 'support@techstore.vn' },
                { icon: <MapPin size={14} />, text: '123 Nguyễn Huệ, Q.1, TP.HCM' },
              ].map((item, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* Sản phẩm */}
          <div>
            <div className="footer__title">Sản phẩm</div>
            <div className="footer__links">
              {['Laptop Gaming', 'Laptop Văn phòng', 'Màn hình', 'Chuột & Bàn phím', 'Ổ cứng SSD', 'RAM & Phụ kiện'].map(l => (
                <Link key={l} to="/shop" className="footer__link">{l}</Link>
              ))}
            </div>
          </div>

          {/* Hỗ trợ */}
          <div>
            <div className="footer__title">Hỗ trợ</div>
            <div className="footer__links">
              {['Hướng dẫn mua hàng', 'Chính sách đổi trả', 'Chính sách bảo hành', 'Thanh toán & Vận chuyển', 'Tích điểm đổi quà', 'Liên hệ hỗ trợ'].map(l => (
                <Link key={l} to="/" className="footer__link">{l}</Link>
              ))}
            </div>
          </div>

          {/* Kết nối */}
          <div>
            <div className="footer__title">Kết nối với chúng tôi</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[
                { icon: <ExternalLink size={16} />, label: 'Facebook' },
                { icon: <ExternalLink size={16} />,  label: 'Youtube' },
              ].map(s => (
                <a key={s.label} href="#" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-3)', borderRadius: '50%', color: 'var(--text-secondary)', transition: 'all var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="footer__title" style={{ marginBottom: 10 }}>Chứng nhận</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>🔒 Thanh toán bảo mật 256-bit SSL</span>
              <span>✅ Đã đăng ký Bộ Công Thương</span>
              <span>🚚 Giao hàng toàn quốc 2-3 ngày</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 TechStore. Bảo lưu mọi quyền.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/" className="footer__link">Điều khoản dịch vụ</Link>
            <Link to="/" className="footer__link">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
