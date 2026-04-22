import { useState, useEffect } from 'react';
import { Star, Eye, EyeOff, MessageSquare, ExternalLink, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:3001/api';
const getAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const fmt = d => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

export default function AdminReviews() {
  const [reviews, setReviews]     = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [status, setStatus]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const limit = 15;

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/admin/reviews/all`, {
        ...getAuth(),
        params: { status, page, limit },
      });
      setReviews(r.data.data || []);
      setTotal(r.data.total || 0);
    } catch { toast.error('Lỗi tải đánh giá'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [status, page]);

  const handleToggle = async (id) => {
    try {
      const r = await axios.patch(`${API}/admin/reviews/${id}/toggle`, {}, getAuth());
      toast.success(r.data.message);
      load();
    } catch { toast.error('Lỗi cập nhật'); }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await axios.patch(`${API}/admin/reviews/${replyModal.id}/reply`, { reply: replyText }, getAuth());
      toast.success('Đã gửi phản hồi!');
      setReplyModal(null);
      setReplyText('');
      load();
    } catch { toast.error('Lỗi gửi phản hồi'); }
  };

  const stars = n => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={12} fill={i < n ? 'var(--amber)' : 'none'} color={i < n ? 'var(--amber)' : 'var(--surface-3)'} />
  ));

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 20 }}>Quản lý đánh giá</h2>

      {/* Bộ lọc */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {[
          { val: '',         label: 'Tất cả' },
          { val: 'approved', label: '✅ Hiển thị' },
          { val: 'pending',  label: '🚫 Đã ẩn' },
        ].map(opt => (
          <button key={opt.val} onClick={() => { setStatus(opt.val); setPage(1); }}
            className={`btn btn-sm ${status === opt.val ? 'btn-primary' : 'btn-ghost'}`}>
            {opt.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
          Tổng: {total} đánh giá
        </span>
      </div>

      {/* Bảng */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--surface-2)' }}>
                {['Khách hàng', 'Sản phẩm', 'Sao', 'Nội dung', 'Phản hồi', 'Ngày', 'Trạng thái', 'Hành động'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Không có đánh giá</td></tr>
              ) : reviews.map(rv => (
                <tr key={rv.id} style={{ borderBottom: '1px solid var(--border)', opacity: rv.is_approved ? 1 : 0.5 }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{rv.user_name}</div>
                  </td>
                  <td style={{ padding: '10px 12px', maxWidth: 160 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.8rem', lineHeight: 1.3 }}>{rv.product_name}</span>
                      <a href={`http://localhost:5173/shop/${rv.product_slug}#reviews`} target="_blank" rel="noopener noreferrer"
                        title="Xem đánh giá trên sản phẩm">
                        <ExternalLink size={12} color="var(--accent)" />
                      </a>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: 2 }}>{stars(rv.rating)}</div>
                  </td>
                  <td style={{ padding: '10px 12px', maxWidth: 200 }}>
                    <div style={{ fontSize: '0.8rem', lineHeight: 1.4, color: 'var(--text-secondary)',
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {rv.comment || <em style={{ color: 'var(--text-muted)' }}>Không có nội dung</em>}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', maxWidth: 160 }}>
                    {rv.admin_reply ? (
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent)', lineHeight: 1.4,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        💬 {rv.admin_reply}
                      </div>
                    ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>—</span>}
                  </td>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {fmt(rv.created_at)}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: 99,
                      fontSize: '0.72rem', fontWeight: 700,
                      background: rv.is_approved ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: rv.is_approved ? '#22c55e' : '#ef4444',
                    }}>
                      {rv.is_approved ? 'Hiển thị' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleToggle(rv.id)}
                        className="btn btn-ghost btn-sm" title={rv.is_approved ? 'Ẩn' : 'Hiện'}
                        style={{ padding: '4px 8px' }}>
                        {rv.is_approved ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => { setReplyModal(rv); setReplyText(rv.admin_reply || ''); }}
                        className="btn btn-ghost btn-sm" title="Trả lời"
                        style={{ padding: '4px 8px', color: 'var(--accent)' }}>
                        <MessageSquare size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '12px 16px', display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft size={14} />
            </button>
            <span style={{ alignSelf: 'center', fontSize: '0.85rem' }}>{page} / {totalPages}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div onClick={() => setReplyModal(null)} style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--surface-1)', borderRadius: 10, width: '100%', maxWidth: 480,
            overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          }}>
            <div style={{ background: 'var(--accent)', padding: '14px 18px', color: '#fff', fontWeight: 700 }}>
              Trả lời đánh giá của {replyModal.user_name}
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8, fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>{stars(replyModal.rating)}</div>
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>&ldquo;{replyModal.comment}&rdquo;</p>
              </div>
              <textarea className="form-control" rows={4} placeholder="Nhập phản hồi của bạn..."
                value={replyText} onChange={e => setReplyText(e.target.value)} style={{ resize: 'vertical' }} />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setReplyModal(null)}>Hủy</button>
                <button className="btn btn-primary btn-sm" onClick={handleReply}>Gửi phản hồi</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
