import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Zap, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lockedMsg, setLockedMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLockedMsg('');
    if (!form.email || !form.password) { toast.error('Vui lòng điền đầy đủ thông tin!'); return; }
    setLoading(true);
    try {
      const res = await authApi.login(form);
      login(res.data.data.token, res.data.data.user);
      toast.success(`Xin chào, ${res.data.data.user.name}! 👋`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại!';
      if (err.response?.status === 403) {
        setLockedMsg(msg);
      } else {
        toast.error(msg);
      }
    } finally { setLoading(false); }
  };

  const fillDemo = (role) => {
    const demos = {
      admin: { email: 'admin@techstore.vn',           password: 'password' },
      user:  { email: 'nguyenvan.an@example.com',     password: 'password' },
      staff: { email: 'staff@techstore.vn',            password: 'password' },
    };
    setForm(demos[role] || demos.user);
    toast('Đã điền thông tin demo — nhấn Đăng nhập', { icon: '✅' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.08), transparent 60%)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div className="header__logo-icon"><Zap size={18} color="#fff" strokeWidth={2.5} /></div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>TechStore</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Đăng nhập để tiếp tục mua sắm</p>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-body" style={{ padding: 32 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>Đăng nhập</h2>

            {/* Demo accounts */}
            <div style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                🧪 Tài khoản demo (mật khẩu: password)
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => fillDemo('user')}
                  style={{ fontSize: '0.75rem', border: '1px solid var(--border)', flex: 1 }}>
                  👤 Khách hàng
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => fillDemo('staff')}
                  style={{ fontSize: '0.75rem', border: '1px solid var(--border)', flex: 1 }}>
                  🛠 Nhân viên
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => fillDemo('admin')}
                  style={{ fontSize: '0.75rem', border: '1px solid rgba(59,130,246,0.5)', flex: 1, color: 'var(--accent)' }}>
                  ⚙️ Admin
                </button>
              </div>
            </div>

            {lockedMsg && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderLeft: '4px solid #ef4444',
                borderRadius: 8, padding: '12px 16px', marginBottom: 16,
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <span style={{ fontSize: '1.2rem' }}>⛔</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--red)', marginBottom: 2 }}>Tài khoản bị khóa</div>
                  <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{lockedMsg}</div>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <div className="input-group">
                  <input className="form-control" type={showPw ? 'text' : 'password'} placeholder="Mật khẩu của bạn" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                  <button type="button" className="input-icon" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowPw(v => !v)}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8, height: 44 }} disabled={loading}>
                {loading ? 'Đang đăng nhập...' : <><LogIn size={16} /> Đăng nhập</>}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
