import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <div className="section" style={{textAlign:'center'}}>
      <div style={{fontSize:'6rem',fontWeight:900,color:'var(--surface-3)',lineHeight:1}}>404</div>
      <div style={{fontSize:'1.5rem',fontWeight:700,margin:'12px 0 8px'}}>Trang không tìm thấy</div>
      <div style={{color:'var(--text-muted)',marginBottom:24}}>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</div>
      <Link to="/" className="btn btn-primary">← Về trang chủ</Link>
    </div>
  );
}
