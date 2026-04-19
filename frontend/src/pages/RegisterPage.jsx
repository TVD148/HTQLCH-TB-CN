import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    ho: '',          // Họ
    ten_dem: '',     // Tên đệm
    ten: '',         // Tên
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const setF = (k, v) => setForm(f => ({...f, [k]: v}));

  const fullName = [form.ho.trim(), form.ten_dem.trim(), form.ten.trim()].filter(Boolean).join(' ');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.ho || !form.ten || !form.email || !form.password) {
      toast.error('Vui lòng điền các trường bắt buộc!'); return;
    }
    if (form.password.length < 6) {
      toast.error('Mật khẩu ít nhất 6 ký tự!'); return;
    }
    if (form.password !== form.confirm_password) {
      toast.error('Xác nhận mật khẩu không khớp!'); return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({
        name: fullName,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });
      login(res.data.data.token, res.data.data.user);
      toast.success(`Đăng ký thành công! Chào mừng ${fullName} 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.08), transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div className="header__logo-icon"><Zap size={18} color="#fff" strokeWidth={2.5} /></div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>TechStore</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Tạo tài khoản mới</p>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: 32 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 6 }}>Đăng ký</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 24 }}>
              Tên đầy đủ: <strong style={{ color: 'var(--accent)' }}>{fullName || '...'}</strong>
            </p>

            <form onSubmit={handleSubmit}>
              {/* Họ – Tên đệm – Tên */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Họ <span style={{ color: 'var(--red)' }}>*</span></label>
                  <input
                    className="form-control"
                    placeholder="Nguyễn"
                    value={form.ho}
                    onChange={e => setF('ho', e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Tên đệm</label>
                  <input
                    className="form-control"
                    placeholder="Văn"
                    value={form.ten_dem}
                    onChange={e => setF('ten_dem', e.target.value)}
                    autoComplete="additional-name"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Tên <span style={{ color: 'var(--red)' }}>*</span></label>
                  <input
                    className="form-control"
                    placeholder="An"
                    value={form.ten}
                    onChange={e => setF('ten', e.target.value)}
                    autoComplete="given-name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email <span style={{ color: 'var(--red)' }}>*</span></label>
                <input
                  className="form-control"
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={e => setF('email', e.target.value)}
                  autoComplete="email"
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Số điện thoại <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>(tùy chọn)</span></label>
                <input
                  className="form-control"
                  type="tel"
                  placeholder="0901234567"
                  value={form.phone}
                  onChange={e => setF('phone', e.target.value)}
                  autoComplete="tel"
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Mật khẩu <span style={{ color: 'var(--red)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-control"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Ít nhất 6 ký tự"
                    value={form.password}
                    onChange={e => setF('password', e.target.value)}
                    style={{ paddingRight: 42 }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                      padding: 0,
                    }}
                    title={showPwd ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div style={{
                    marginTop: 6, display: 'flex', gap: 4,
                  }}>
                    {[...Array(4)].map((_, i) => {
                      const strength = form.password.length >= 12 ? 4
                        : form.password.length >= 8 ? 3
                        : form.password.length >= 6 ? 2 : 1;
                      return (
                        <div key={i} style={{
                          height: 3, flex: 1, borderRadius: 2,
                          background: i < strength
                            ? strength === 1 ? 'var(--red)'
                              : strength === 2 ? 'var(--amber)'
                              : strength === 3 ? 'var(--accent)'
                              : 'var(--emerald)'
                            : 'var(--surface-3)',
                          transition: 'background .3s',
                        }}/>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu <span style={{ color: 'var(--red)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-control"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    value={form.confirm_password}
                    onChange={e => setF('confirm_password', e.target.value)}
                    style={{
                      paddingRight: 42,
                      borderColor: form.confirm_password && form.password !== form.confirm_password
                        ? 'var(--red)' : undefined,
                    }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                      padding: 0,
                    }}
                    title={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.confirm_password && form.password !== form.confirm_password && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--red)', marginTop: 4 }}>
                    ❌ Mật khẩu không khớp
                  </div>
                )}
                {form.confirm_password && form.password === form.confirm_password && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--emerald)', marginTop: 4 }}>
                    ✅ Mật khẩu khớp
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                style={{ marginTop: 4, height: 46 }}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : <><UserPlus size={16} /> Đăng ký</>}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Đã có tài khoản? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
