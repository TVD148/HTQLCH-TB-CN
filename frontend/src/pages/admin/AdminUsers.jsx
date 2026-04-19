import { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users,  setUsers]  = useState([]);
  const [loading,setLoading]= useState(true);
  const [search, setSearch] = useState('');
  const [sort,   setSort]   = useState('name_asc');
  const [role,   setRole]   = useState('');

  const load = () => {
    setLoading(true);
    adminApi.getUsers({ search, sort, role })
      .then(r => setUsers(r.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { document.title='Khách hàng – Admin'; load(); }, []);

  const toggle = async (id) => {
    await adminApi.toggleUser(id);
    toast.success('Đã cập nhật trạng thái!');
    setUsers(prev => prev.map(u => u.id===id ? {...u, is_active: !u.is_active} : u));
  };

  const SORT_OPTS = [
    { v:'name_asc',  l:'Tên A → Z' },
    { v:'name_desc', l:'Tên Z → A' },
    { v:'newest',    l:'Mới nhất' },
    { v:'oldest',    l:'Cũ nhất' },
    { v:'points',    l:'Điểm tích lũy ↓' },
  ];

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">👥 Quản lý khách hàng ({users.length})</h1>
      </div>

      {/* Toolbar */}
      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
        <div style={{position:'relative',flex:1,minWidth:200,maxWidth:320}}>
          <Search size={14} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}}/>
          <input className="form-control" style={{paddingLeft:32}} placeholder="Tìm tên, email, SĐT..."
            value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()}/>
        </div>
        <select className="form-control" style={{width:'auto',minWidth:150}} value={sort} onChange={e=>{setSort(e.target.value);setTimeout(load,0);}}>
          {SORT_OPTS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
        <select className="form-control" style={{width:'auto',minWidth:120}} value={role} onChange={e=>{setRole(e.target.value);setTimeout(load,0);}}>
          <option value="">Tất cả vai trò</option>
          <option value="user">Khách hàng</option>
          <option value="staff">Nhân viên</option>
        </select>
        <button className="btn btn-outline btn-sm" onClick={load}>Tìm</button>
      </div>

      <div className="card"><div className="card-body" style={{padding:0}}>
        {loading ? <div className="spinner-wrap"><div className="spinner"/></div> : users.length===0 ? (
          <div className="empty-state">
            <Users size={48} style={{opacity:.3}}/>
            <div className="empty-state__title">Không tìm thấy người dùng</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên (Tên → Họ)</th>
                <th>Email</th>
                <th>Số ĐT</th>
                <th style={{textAlign:'center'}}>Điểm tích lũy</th>
                <th>Vai trò</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                // Hiển thị tên đế dễ sort: Tên (first_name) — Họ (last_name)
                const sortName = u.first_name || u.name?.split(' ').pop() || '';
                const fullName = u.name;
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{fontWeight:700,fontSize:'0.88rem'}}>{fullName}</div>
                      {u.first_name && (
                        <div style={{fontSize:'0.72rem',color:'var(--accent)'}}>
                          Sort: <strong>{u.first_name}</strong> {u.last_name && `(${u.last_name})`}
                        </div>
                      )}
                    </td>
                    <td style={{color:'var(--text-muted)',fontSize:'0.83rem'}}>{u.email}</td>
                    <td style={{fontSize:'0.85rem'}}>{u.phone||'—'}</td>
                    <td style={{textAlign:'center',color:'var(--amber)',fontWeight:700}}>
                      ⭐ {u.loyalty_points}
                    </td>
                    <td>
                      <span className={`badge ${u.role==='admin'?'badge-featured':u.role==='staff'?'badge-confirmed':'badge-pending'}`}>
                        {u.role==='user'?'Khách hàng':u.role==='staff'?'Nhân viên':u.role}
                      </span>
                    </td>
                    <td style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className={`badge ${u.is_active?'badge-delivered':'badge-cancelled'}`}>
                        {u.is_active?'Hoạt động':'Đã khóa'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.is_active?'btn-danger':'btn-success'}`}
                        onClick={()=>toggle(u.id)}
                      >
                        {u.is_active?'Khóa':'Mở khóa'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div></div>
    </div>
  );
}
