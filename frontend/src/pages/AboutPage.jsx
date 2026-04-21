import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Truck, RefreshCw, Headphones, Award, Users, Target, Heart,
         MapPin, Phone, Mail, Clock, ChevronRight, Star, Zap } from 'lucide-react';

const STATS = [
  { icon: '🏪', label: 'Cửa hàng',      value: '1+' },
  { icon: '🗺️', label: 'Tỉnh thành',     value: '1+' },
  { icon: '🏢', label: 'Văn phòng đại diện', value: '1' },
  { icon: '👥', label: 'Nhân sự',         value: '10+' },
];

const FOUNDERS = [
  {
    name: 'Trần Văn Đình',
    role: 'Đồng sáng lập & CEO',
    avatar: 'T',
    color: '#3B82F6',
    desc: 'Người đặt nền móng chiến lược cho TechStore với tầm nhìn xây dựng hệ sinh thái công nghệ hàng đầu Việt Nam.',
  },
  {
    name: 'Trịnh Nhật Hoàng',
    role: 'Đồng sáng lập & CTO',
    avatar: 'H',
    color: '#10B981',
    desc: 'Chuyên gia kỹ thuật số, kiến trúc sư hệ thống công nghệ và nền tảng thương mại điện tử của TechStore.',
  },
  {
    name: 'Đỗ Thị Mai Hương',
    role: 'Đồng sáng lập & COO',
    avatar: 'M',
    color: '#F59E0B',
    desc: 'Phụ trách vận hành toàn diện, xây dựng quy trình dịch vụ khách hàng và mạng lưới đối tác thương hiệu.',
  },
];

const VALUES = [
  { icon: <Shield size={24} />,     color: 'green',  title: 'Chính hãng 100%',   desc: 'Toàn bộ sản phẩm được nhập khẩu và phân phối chính thức từ các thương hiệu lớn.' },
  { icon: <Award size={24} />,      color: 'blue',   title: 'Chất lượng hàng đầu', desc: 'Kiểm định nghiêm ngặt trước khi đến tay khách hàng, đảm bảo trải nghiệm tốt nhất.' },
  { icon: <Heart size={24} />,      color: 'red',    title: 'Tận tâm phục vụ',    desc: 'Đội ngũ hỗ trợ 24/7, lắng nghe và giải quyết mọi vấn đề của khách hàng.' },
  { icon: <Target size={24} />,     color: 'amber',  title: 'Đổi mới liên tục',   desc: 'Không ngừng cập nhật sản phẩm mới nhất, theo kịp xu hướng công nghệ toàn cầu.' },
];

const MILESTONES = [
  { year: '2022', event: 'TechStore được thành lập tại TP. Hồ Chí Minh với đội ngũ 5 người.' },
  { year: '2023', event: 'Mở rộng danh mục lên 200+ sản phẩm, đạt 1.000+ khách hàng.' },
  { year: '2024', event: 'Ra mắt nền tảng thương mại điện tử, tích hợp so sánh & tích điểm.' },
  { year: '2025', event: 'Hơn 10.000 khách hàng tin tưởng, 110 sản phẩm đa dạng từ 29 thương hiệu.' },
];

export default function AboutPage() {
  useEffect(() => { document.title = 'Giới thiệu – TechStore'; }, []);

  return (
    <div>
      {/* ── HERO BANNER ─────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)',
        padding: '80px 0 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(59,130,246,0.08)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(16,185,129,0.06)', pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)' }}>Trang chủ</Link>
            <ChevronRight size={13} />
            <span style={{ color: '#fff' }}>Giới thiệu</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={22} color="#fff" />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, textTransform: 'uppercase' }}>
              TechStore — Về chúng tôi
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 20, maxWidth: 700 }}>
            Hệ thống thiết bị công nghệ<br />
            <span style={{ color: '#3B82F6' }}>uy tín hàng đầu</span> Việt Nam
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', maxWidth: 560, lineHeight: 1.7, marginBottom: 36 }}>
            TechStore tự hào là địa chỉ tin cậy cung cấp thiết bị công nghệ chính hãng với dịch vụ khách hàng tận tâm và chính sách bảo hành minh bạch.
          </p>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {STATS.map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 16, padding: '20px 16px', textAlign: 'center',
                backdropFilter: 'blur(10px)',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              >
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ─────────────────────────────────── */}
      <section style={{ padding: '60px 0', background: 'var(--surface-1)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'var(--accent-light)', borderRadius: 20, marginBottom: 20 }}>
                <Target size={14} color="var(--accent)" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1 }}>Sứ mệnh</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 20 }}>
                Mang công nghệ đến gần hơn với mọi người
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16, fontSize: '0.95rem' }}>
                Chúng tôi tin rằng mỗi người đều xứng đáng được sở hữu những sản phẩm công nghệ chất lượng cao với mức giá hợp lý, kèm theo dịch vụ hậu mãi tốt nhất.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                TechStore không chỉ bán hàng — chúng tôi xây dựng một cộng đồng người dùng công nghệ thông thái, được tư vấn đúng sản phẩm, đúng nhu cầu và đúng ngân sách.
              </p>
            </div>

            {/* Timeline milestones */}
            <div>
              <div style={{ position: 'relative', paddingLeft: 28 }}>
                <div style={{
                  position: 'absolute', left: 9, top: 0, bottom: 0,
                  width: 2, background: 'linear-gradient(to bottom, var(--accent), var(--emerald))',
                  borderRadius: 2,
                }} />
                {MILESTONES.map((m, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: 28, paddingLeft: 12 }}>
                    <div style={{
                      position: 'absolute', left: -19, top: 4,
                      width: 12, height: 12, borderRadius: '50%',
                      background: i % 2 === 0 ? 'var(--accent)' : 'var(--emerald)',
                      border: '2px solid var(--surface-1)',
                      boxShadow: `0 0 0 3px ${i % 2 === 0 ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)'}`,
                    }} />
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: i % 2 === 0 ? 'var(--accent)' : 'var(--emerald)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{m.year}</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{m.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ─────────────────────────────── */}
      <section style={{ padding: '60px 0', background: 'var(--surface-2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Giá trị cốt lõi</h2>
            <p className="section-subtitle">Những nguyên tắc chúng tôi cam kết với từng khách hàng</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {VALUES.map(v => (
              <div key={v.title} style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 16, padding: 28, textAlign: 'center',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div className={`stat-card__icon icon-${v.color}`} style={{ width: 52, height: 52, margin: '0 auto 16px', borderRadius: 14 }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>{v.title}</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDING TEAM ───────────────────────────── */}
      <section style={{ padding: '60px 0', background: 'var(--surface-1)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(245,158,11,0.1)', borderRadius: 20, marginBottom: 16 }}>
              <Users size={14} color="var(--amber)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: 1 }}>Ban sáng lập</span>
            </div>
            <h2 className="section-title">Những người tạo nên TechStore</h2>
            <p className="section-subtitle">Đội ngũ sáng lập với niềm đam mê công nghệ và khát vọng phục vụ cộng đồng</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {FOUNDERS.map((f, i) => (
              <div key={i} style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 20, padding: 32, textAlign: 'center',
                transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.borderColor = f.color; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                {/* Top accent line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${f.color}, ${f.color}88)` }} />

                {/* Avatar */}
                <div style={{
                  width: 88, height: 88, borderRadius: '50%', margin: '0 auto 20px',
                  background: `linear-gradient(135deg, ${f.color}, ${f.color}CC)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', fontWeight: 800, color: '#fff',
                  boxShadow: `0 8px 24px ${f.color}40`,
                }}>
                  {f.avatar}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>{f.name}</h3>
                <div style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: 20,
                  background: `${f.color}18`, color: f.color,
                  fontSize: '0.78rem', fontWeight: 700, marginBottom: 16,
                }}>
                  {f.role}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>

                {/* Stars decoration */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 20 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={f.color} color={f.color} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ───────────────────────────── */}
      <section style={{ padding: '60px 0', background: 'linear-gradient(135deg, #0F172A, #1E3A5F)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
              Tại sao chọn TechStore?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
              Cam kết mang đến trải nghiệm mua sắm công nghệ tốt nhất
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { icon: <Shield size={26} />,    title: 'Bảo hành chính hãng', desc: '12–24 tháng', color: '#10B981' },
              { icon: <Truck size={26} />,     title: 'Giao hàng nhanh',     desc: '2–3 ngày toàn quốc', color: '#3B82F6' },
              { icon: <RefreshCw size={26} />, title: 'Đổi trả 15 ngày',     desc: 'Lỗi 1 đổi 1', color: '#F59E0B' },
              { icon: <Headphones size={26} />,title: 'Hỗ trợ 24/7',         desc: 'Kỹ thuật viên online', color: '#EF4444' },
            ].map(item => (
              <div key={item.title} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16, padding: 24, textAlign: 'center',
                backdropFilter: 'blur(10px)',
              }}>
                <div style={{ color: item.color, marginBottom: 12, display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, color: '#fff', marginBottom: 6, fontSize: '0.95rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/shop" className="btn btn-primary btn-lg" style={{ marginRight: 16 }}>
              Mua sắm ngay
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
              Liên hệ chúng tôi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
