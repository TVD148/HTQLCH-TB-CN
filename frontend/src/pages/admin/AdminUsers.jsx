import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Users } from 'lucide-react';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [sort,    setSort]    = useState('name_asc');
  const [role,    setRole]    = useState('');

  const debounceRef = useRef(null);

  // Load users with current filters
  const load = useCallback((s = search, so = sort, r = role) => {
    setLoading(true);
    adminApi.getUsers({ search: s, sort: so, role: r })
      .then(res => setUsers(res.data.data))
      .catch(() => toast.error('Không thể tải danh sách!'))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  useEffect(() => { document.title = 'Khách hàng – Admin'; load(); }, []);

  // Debounced search
  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(val, sort, role), 350);
  };

  // Instant sort change
  const handleSort = (val) => {
    setSort(val);
    load(search, val, role);
  };

  // Instant role filter change
  const handleRole = (val) => {
    setRole(val);
    load(search, sort, val);
  };

  // Toggle lock/unlock — notify user via BroadcastChannel if locking
  const toggle = async (u) => {
    try {
      await adminApi.toggleUser(u.id);
      const willBeLocked = u.is_active; // currently active → will be locked
      if (willBeLocked) {
        toast.success(`Đã khóa tài khoản ${u.name}`);
        // Thông báo tất cả tab đang đăng nhập với user này phải logout
        try {
          const bc = new BroadcastChannel('auth_channel');
          bc.postMessage({ type: 'ACCOUNT_LOCKED', userId: u.id });
          bc.close();
        } catch (_) {}
      } else {
        toast.success(`Đã mở khóa tài khoản ${u.name}`);
      }
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_active: !x.is_active } : x));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const SORT_OPTS = [
    { v: 'name_asc',  l: 'Tên A → Z' },
    { v: 'name_desc', l: 'Tên Z → A' },
    { v: 'newest',    l: 'Mới nhất' },
    { v: 'oldest',    l: 'Cũ nhất' },
    { v: 'points',    l: 'Điểm tích lũy ↓' },
  ];

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">👥 Quản lý khách hàng ({users.length})</h1>
      </div>

      {/* Toolbar — no search button */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 340 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-control"
            style={{ paddingLeft: 32 }}
            placeholder="Tìm tên, email, SĐT..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        <select
          className="form-control"
          style={{ width: 'auto', minWidth: 150 }}
          value={sort}
          onChange={e => handleSort(e.target.value)}
        >
          {SORT_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
        <select
          className="form-control"
          style={{ width: 'auto', minWidth: 130 }}
          value={role}
          onChange={e => handleRole(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="user">Khách hàng</option>
          <option value="staff">Nhân viên</option>
        </select>
      </div>

      <div className="card"><div className="card-body" style={{ padding: 0 }}>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <Users size={48} style={{ opacity: .3 }} />
            <div className="empty-state__title">Không tìm thấy người dùng</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Số ĐT</th>
                <th style={{ textAlign: 'center' }}>Điểm tích lũy</th>
                <th>Vai trò</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{u.name}</div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{u.email}</td>
                  <td style={{ fontSize: '0.85rem' }}>{u.phone || '—'}</td>
                  <td style={{ textAlign: 'center', color: 'var(--amber)', fontWeight: 700 }}>
                    ⭐ {u.loyalty_points}
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-featured' : u.role === 'staff' || u.role === 'nhan_vien' ? 'badge-confirmed' : 'badge-pending'}`}>
                      {u.role === 'khach_hang' || u.role === 'user' ? 'Khách hàng'
                        : u.role === 'nhan_vien' || u.role === 'staff' ? 'Nhân viên'
                        : u.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {new Date(u.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge-delivered' : 'badge-cancelled'}`}>
                      {u.is_active ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => toggle(u)}
                    >
                      {u.is_active ? 'Khóa' : 'Mở khóa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>
    </div>
  );
}
