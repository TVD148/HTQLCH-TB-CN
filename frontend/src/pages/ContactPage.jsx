import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, ChevronRight, CheckCircle2, Zap, ExternalLink, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CONTACT_INFO = [
  {
    icon: <MapPin size={20} />,
    color: '#EF4444',
    label: 'Địa chỉ',
    value: '10 Đ. Trịnh Văn Cẩn, Bến Thành,\nQuận 1, TP. Hồ Chí Minh',
  },
  {
    icon: <Clock size={20} />,
    color: '#3B82F6',
    label: 'Giờ làm việc',
    value: '8h – 21h\nThứ 2 đến Chủ nhật',
  },
  {
    icon: <Phone size={20} />,
    color: '#10B981',
    label: 'Hotline',
    value: '0911 713 000',
    link: 'tel:0911713000',
  },
  {
    icon: <Mail size={20} />,
    color: '#F59E0B',
    label: 'Email',
    value: 'techstore@gmail.com',
    link: 'mailto:techstore@gmail.com',
  },
];

const SOCIALS = [
  { icon: <ExternalLink size={18} />, label: 'Facebook', url: '#', color: '#1877F2' },
  { icon: <ExternalLink size={18} />, label: 'YouTube',  url: '#', color: '#FF0000' },
  { icon: <MessageCircle size={18} />, label: 'Zalo',  url: '#', color: '#0068FF' },
];

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  useEffect(() => { document.title = 'Liên hệ – TechStore'; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Vui lòng điền đầy đủ thông tin!'); return;
    }
    setSending(true);
    // Simulate sending (no real API endpoint needed for demo)
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    toast.success('Đã gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại sớm.');
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F172A 100%)',
        padding: '60px 0 48px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -60, width: 360, height: 360, borderRadius: '50%', background: 'rgba(59,130,246,0.07)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)' }}>Trang chủ</Link>
            <ChevronRight size={13} />
            <span style={{ color: '#fff' }}>Liên hệ</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#3B82F6,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={19} color="#fff" />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase' }}>TechStore</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
            Liên hệ, hotline địa chỉ<br />và hỗ trợ nhanh
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', maxWidth: 480, lineHeight: 1.7 }}>
            Nếu bạn có thắc mắc, hãy gửi yêu cầu cho chúng tôi — chúng tôi sẽ liên lạc lại với bạn sớm nhất có thể.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────── */}
      <section style={{ padding: '52px 0', background: 'var(--surface-2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 40, alignItems: 'start' }}>

            {/* LEFT: Info */}
            <div>
              {/* Company intro */}
              <div style={{
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                borderRadius: 16, padding: 28, marginBottom: 24,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#3B82F6,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={19} color="#fff" />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)' }}>TechStore</h2>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  TechStore là địa chỉ uy tín chuyên cung cấp các thiết bị công nghệ chính hãng với giá tốt.
                  Tại đây, khách hàng có thể lựa chọn laptop, chuột, màn hình, ổ cứng, RAM và nhiều thiết bị hiện đại khác.
                  Chúng tôi cam kết sản phẩm chất lượng, bảo hành đầy đủ, dịch vụ tận tâm.
                </p>
              </div>

              {/* Contact cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {CONTACT_INFO.map((item, i) => (
                  <div key={i} style={{
                    background: 'var(--surface-1)', border: '1px solid var(--border)',
                    borderRadius: 14, padding: '18px 20px',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.boxShadow = `0 4px 16px ${item.color}20`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, marginBottom: 12,
                      background: `${item.color}18`, color: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                      {item.label}
                    </div>
                    {item.link ? (
                      <a href={item.link} style={{ fontSize: '0.88rem', color: item.color, fontWeight: 600, textDecoration: 'none' }}>
                        {item.value}
                      </a>
                    ) : (
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                        {item.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div style={{
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '18px 20px', marginTop: 16,
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                  Mạng xã hội
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {SOCIALS.map(s => (
                    <a key={s.label} href={s.url} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 14px', borderRadius: 8,
                      background: `${s.color}12`, color: s.color,
                      fontSize: '0.82rem', fontWeight: 600,
                      border: `1px solid ${s.color}25`,
                      transition: 'all 0.2s', textDecoration: 'none',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = `${s.color}25`}
                      onMouseLeave={e => e.currentTarget.style.background = `${s.color}12`}
                    >
                      {s.icon} {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Contact Form */}
            <div style={{
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              borderRadius: 20, padding: 36,
              boxShadow: 'var(--shadow-md)',
            }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                Liên hệ với chúng tôi
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 28 }}>
                Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24 giờ.
              </p>

              {sent ? (
                <div style={{
                  textAlign: 'center', padding: '48px 20px',
                  background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 14,
                }}>
                  <CheckCircle2 size={52} color="var(--emerald)" style={{ margin: '0 auto 16px' }} />
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Gửi thành công!</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Chúng tôi sẽ liên lạc với bạn sớm nhất có thể.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Họ và tên *</label>
                      <input className="form-control" placeholder="Nguyễn Văn A"
                        value={form.name} required
                        onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Email *</label>
                      <input className="form-control" type="email" placeholder="you@email.com"
                        value={form.email} required
                        onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Điện thoại</label>
                    <input className="form-control" type="tel" placeholder="0901 234 567"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nội dung *</label>
                    <textarea className="form-control" rows={5} required
                      placeholder="Nội dung câu hỏi, yêu cầu hoặc phản hồi của bạn..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ resize: 'vertical', minHeight: 120 }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-full"
                    style={{ height: 48, fontSize: '0.95rem', gap: 8 }}
                    disabled={sending}
                  >
                    <Send size={16} />
                    {sending ? 'Đang gửi...' : 'Gửi thông tin'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP ──────────────────────────────────────── */}
      <section style={{ height: 400, position: 'relative' }}>
        <iframe
          title="TechStore Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d106.6910!3d10.7736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528c9b596c31b%3A0x74d1855b2af47b52!2zMTAgxJAuIFRy4buLbmggVsSDbiBD4bqpbiwgQuG6v24gVGjDoG5oLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2svn!4v1713600000000!5m2!1svi!2svn"
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Map overlay label */}
        <div style={{
          position: 'absolute', top: 16, left: 16,
          background: 'var(--surface-1)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '12px 16px',
          boxShadow: 'var(--shadow-md)', maxWidth: 260, zIndex: 2,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>TechStore</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            10 Đ. Trịnh Văn Cẩn, Bến Thành,<br />Quận 1, TP. Hồ Chí Minh
          </div>
        </div>
      </section>
    </div>
  );
}
