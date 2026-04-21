import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Copy, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { voucherApi } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const TYPE_COLOR = {
  percent:      '#3B82F6',
  fixed_amount: '#10B981',
  freeship:     '#F59E0B',
};
const TYPE_LABEL = {
  percent:      '% Giảm',
  fixed_amount: 'Giảm tiền',
  freeship:     '🚚 Miễn ship',
};

function VoucherCard({ v }) {
  const expired = v.expires_at && new Date(v.expires_at) < new Date();
  const accent  = TYPE_COLOR[v.discount_type] || '#3B82F6';

  const getDiscountLabel = () => {
    if (v.discount_type === 'percent')      return `Giảm ${v.discount_value}%${v.max_discount ? ` (tối đa ${fmt(v.max_discount)})` : ''}`;
    if (v.discount_type === 'fixed_amount') return `Giảm ${fmt(v.discount_value)}`;
    if (v.discount_type === 'freeship')     return 'Miễn phí vận chuyển';
    return '';
  };

  return (
    <div style={{
      display: 'flex', borderRadius: 12, overflow: 'hidden',
      border: `1.5px solid ${v.used || expired ? 'var(--border)' : accent + '44'}`,
      background: 'var(--surface-2)',
      opacity: v.used || expired ? 0.6 : 1,
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => { if (!v.used && !expired) e.currentTarget.style.boxShadow = `0 4px 20px ${accent}28`; }}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Left strip */}
      <div style={{
        width: 72, flexShrink: 0,
        background: `linear-gradient(160deg, ${accent}, ${accent}BB)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)',
      }}>
        <Ticket size={22} color="rgba(255,255,255,0.9)" />
        <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.85)', fontWeight: 800, textAlign: 'center' }}>
          {TYPE_LABEL[v.discount_type]}
        </span>
      </div>

      {/* Dashed divider */}
      <div style={{ width: 1, borderLeft: `2px dashed ${accent}44`, margin: '10px 0', flexShrink: 0 }} />

      {/* Info */}
      <div style={{ flex: 1, padding: '14px 16px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: accent, marginBottom: 3 }}>
          {getDiscountLabel()}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 2 }}>
          Mã: <strong style={{ color: 'var(--text-primary)', letterSpacing: 1 }}>{v.code}</strong>
        </div>
        {v.min_order > 0 && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>
            Đơn tối thiểu: {fmt(v.min_order)}
          </div>
        )}
        <div style={{ fontSize: '0.72rem', color: v.expires_at && new Date(v.expires_at) < new Date() ? 'var(--red)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <Clock size={11} />
          HSD: {v.expires_at ? new Date(v.expires_at).toLocaleDateString('vi-VN') : 'Không giới hạn'}
        </div>
      </div>

      {/* Right: status + action */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, flexShrink: 0 }}>
        {v.used ? (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <XCircle size={13} /> Đã dùng
          </span>
        ) : expired ? (
          <span style={{ fontSize: '0.72rem', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <XCircle size={13} /> Hết hạn
          </span>
        ) : (
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={13} /> Có thể dùng
          </span>
        )}

        {!v.used && !expired && (
          <button
            onClick={() => { navigator.clipboard.writeText(v.code); toast.success(`Đã chép mã ${v.code}!`); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: accent, color: '#fff', border: 'none',
              padding: '5px 12px', borderRadius: 20,
              fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Copy size={12} /> Sao chép
          </button>
        )}
      </div>
    </div>
  );
}

export default function MyVouchersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('available'); // 'available' | 'used'

  useEffect(() => {
    document.title = 'Voucher của tôi – TechStore';
    if (!user) { navigate('/login'); return; }
    voucherApi.getMine()
      .then(r => setVouchers(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const available = vouchers.filter(v => !v.used && (!v.expires_at || new Date(v.expires_at) >= new Date()));
  const used      = vouchers.filter(v => v.used || (v.expires_at && new Date(v.expires_at) < new Date()));

  const current = tab === 'available' ? available : used;

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Ticket size={26} /> Voucher của tôi
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '0.88rem' }}>
          Danh sách mã giảm giá bạn đã nhận — dùng khi thanh toán để tiết kiệm hơn!
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1.5px solid var(--border)', paddingBottom: 0 }}>
          {[
            { key: 'available', label: `Có thể dùng (${available.length})` },
            { key: 'used',      label: `Đã dùng / Hết hạn (${used.length})` },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '10px 16px', fontSize: '0.88rem', fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? 'var(--accent)' : 'var(--text-muted)',
                borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1.5, transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : current.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            <Ticket size={48} strokeWidth={1.2} style={{ marginBottom: 14, opacity: 0.4 }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 6 }}>
              {tab === 'available' ? 'Bạn chưa có voucher nào!' : 'Chưa có voucher đã dùng'}
            </div>
            {tab === 'available' && (
              <p style={{ fontSize: '0.85rem', marginBottom: 20 }}>
                Nhấn <strong>"Nhận"</strong> trên các voucher ở trang chủ để lưu vào đây.
              </p>
            )}
            {tab === 'available' && (
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/')}>
                Về trang chủ →
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {current.map(v => <VoucherCard key={v.id} v={v} />)}
          </div>
        )}
      </div>
    </div>
  );
}
