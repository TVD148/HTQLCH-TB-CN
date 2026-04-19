import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p||0);
const emptyForm = { code:'', name:'', description:'', discount_type:'percent', discount_value:'', max_discount_amount:'', min_order_value:0, max_uses:100, max_uses_per_user:1, start_date:'', expired_at:'' };

export default function AdminVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const load = () => adminApi.getVouchers().then(r => setVouchers(r.data.data));
  useEffect(() => { document.title='Voucher – Admin'; load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await adminApi.updateVoucher(editId, form); toast.success('Cập nhật voucher thành công!'); }
      else { await adminApi.createVoucher(form); toast.success('Tạo voucher thành công!'); }
      setShowModal(false); setForm(emptyForm); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Có lỗi xảy ra!'); }
  };

  const openEdit = (v) => {
    setForm({...v, start_date: v.start_date?.slice(0,16)||'', expired_at: v.expired_at?.slice(0,16)||''});
    setEditId(v.id); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận vô hiệu hóa voucher này?')) return;
    await adminApi.deleteVoucher(id); toast.success('Đã vô hiệu hóa!'); load();
  };

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-title">🏷️ Quản lý Voucher</h1>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true); }}>
          <Plus size={14}/> Tạo voucher mới
        </button>
      </div>

      <div className="card"><div className="card-body" style={{padding:0}}>
        <table className="data-table">
          <thead><tr><th>Mã</th><th>Tên</th><th>Giảm</th><th>Đơn tối thiểu</th><th>Lượt dùng</th><th>Hết hạn</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            {vouchers.map(v=>(
              <tr key={v.id}>
                <td><code style={{background:'var(--surface-3)',padding:'2px 8px',borderRadius:4,fontWeight:700,color:'var(--accent)'}}>{v.code}</code></td>
                <td>{v.name}</td>
                <td style={{fontWeight:700}}>
                  {v.discount_type==='percent' ? `${v.discount_value}%` : fmt(v.discount_value)}
                  {v.max_discount_amount && <span style={{fontSize:'0.72rem',color:'var(--text-muted)'}}> (max {fmt(v.max_discount_amount)})</span>}
                </td>
                <td>{fmt(v.min_order_value)}</td>
                <td style={{color:'var(--text-muted)'}}>{v.used_count}/{v.max_uses}</td>
                <td style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{new Date(v.expired_at).toLocaleDateString('vi-VN')}</td>
                <td><span className={`badge ${v.is_active ? 'badge-delivered' : 'badge-cancelled'}`}>{v.is_active?'Đang hoạt động':'Đã hủy'}</span></td>
                <td>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(v)}><Pencil size={13}/></button>
                    <button className="btn btn-ghost btn-sm" style={{color:'var(--red)'}} onClick={()=>handleDelete(v.id)}><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal__header">
              <span className="modal__title">{editId?'Chỉnh sửa Voucher':'Tạo Voucher mới'}</span>
              <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body" style={{display:'grid',gap:12}}>
                {!editId && (
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Mã voucher *</label>
                    <input className="form-control" required value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} placeholder="VD: SALE15" />
                  </div>
                )}
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Tên hiển thị</label>
                  <input className="form-control" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Flash Sale 15%" />
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Loại giảm</label>
                    <select className="form-control" value={form.discount_type} onChange={e=>setForm({...form,discount_type:e.target.value})}>
                      <option value="percent">Phần trăm (%)</option>
                      <option value="fixed_amount">Số tiền cố định (đ)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Giá trị giảm *</label>
                    <input className="form-control" type="number" required value={form.discount_value} onChange={e=>setForm({...form,discount_value:e.target.value})} />
                  </div>
                </div>
                {form.discount_type==='percent' && (
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Giảm tối đa (đ)</label>
                    <input className="form-control" type="number" value={form.max_discount_amount} onChange={e=>setForm({...form,max_discount_amount:e.target.value})} placeholder="Để trống = không giới hạn" />
                  </div>
                )}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Đơn tối thiểu (đ)</label>
                    <input className="form-control" type="number" value={form.min_order_value} onChange={e=>setForm({...form,min_order_value:e.target.value})}/>
                  </div>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Số lượt dùng tối đa</label>
                    <input className="form-control" type="number" value={form.max_uses} onChange={e=>setForm({...form,max_uses:e.target.value})}/>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Ngày bắt đầu</label>
                    <input className="form-control" type="datetime-local" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})}/>
                  </div>
                  <div className="form-group" style={{margin:0}}>
                    <label className="form-label">Ngày hết hạn *</label>
                    <input className="form-control" type="datetime-local" required value={form.expired_at} onChange={e=>setForm({...form,expired_at:e.target.value})}/>
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary btn-sm">{editId?'Cập nhật':'Tạo voucher'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
