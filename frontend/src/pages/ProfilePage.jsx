import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name||'', phone: user?.phone||'', address: user?.address||'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await authApi.updateProfile(form);
      updateUser(res.data.data);
      toast.success('Cập nhật hồ sơ thành công!');
    } catch { toast.error('Có lỗi xảy ra!'); } finally { setLoading(false); }
  };

  return (
    <div className="section"><div className="container">
      <h1 style={{fontSize:'1.6rem',fontWeight:800,marginBottom:28}}>👤 Hồ sơ của tôi</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:24,maxWidth:800}}>
        {/* Sidebar */}
        <div className="card"><div className="card-body" style={{textAlign:'center'}}>
          <div style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent),#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',fontWeight:800,color:'#fff',margin:'0 auto 12px'}}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{fontWeight:700}}>{user?.name}</div>
          <div style={{fontSize:'0.8rem',color:'var(--text-muted)',marginBottom:12}}>{user?.email}</div>
          <div style={{background:'var(--accent-light)',borderRadius:'var(--radius-md)',padding:'10px',marginBottom:8}}>
            <div style={{fontSize:'1.2rem',fontWeight:800,color:'var(--accent)'}}>{user?.loyalty_points || 0}</div>
            <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>Điểm tích lũy</div>
          </div>
          <span style={{fontSize:'0.78rem',padding:'3px 10px',borderRadius:20,background:'var(--surface-3)',color:'var(--text-muted)',textTransform:'capitalize'}}>{user?.role}</span>
        </div></div>

        {/* Form */}
        <div className="card"><div className="card-body">
          <h3 style={{fontWeight:700,marginBottom:20}}>Chỉnh sửa thông tin</h3>
          <form onSubmit={handleSubmit}>
            {[
              {k:'name',    l:'Họ và tên',    t:'text', p:'Nguyễn Văn A'},
              {k:'phone',   l:'Số điện thoại',t:'tel',  p:'0901234567'},
              {k:'address', l:'Địa chỉ',      t:'text', p:'Địa chỉ của bạn'},
            ].map(f=>(
              <div key={f.k} className="form-group">
                <label className="form-label">{f.l}</label>
                <input className="form-control" type={f.t} placeholder={f.p} value={form[f.k]}
                  onChange={e=>setForm({...form,[f.k]:e.target.value})} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Email (không thể thay đổi)</label>
              <input className="form-control" value={user?.email} disabled style={{opacity:.6}}/>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading?'Đang lưu...':'Lưu thay đổi'}
            </button>
          </form>
        </div></div>
      </div>
    </div></div>
  );
}
