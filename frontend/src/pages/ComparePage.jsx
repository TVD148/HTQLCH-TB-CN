import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BarChart2, ShoppingCart, X } from 'lucide-react';
import { productApi } from '../api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const fmt = (p) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(p||0);

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allSpecs, setAllSpecs] = useState([]);
  const { addToCart } = useCart();

  const idsParam = searchParams.get('ids') || '';

  useEffect(() => {
    document.title = 'So sánh sản phẩm – TechStore';
    const ids = idsParam.split(',').filter(Boolean).slice(0, 3);
    if (!ids.length) return;
    setLoading(true);
    Promise.all(ids.map(id => productApi.getBySlug(id).catch(() => null)))
      .then(results => {
        const valid = results.filter(Boolean).map(r => r.data.data);
        setProducts(valid);
        // Collect all unique spec names
        const specNames = [...new Set(valid.flatMap(p => (p.specs||[]).map(s => s.spec_name)))];
        setAllSpecs(specNames);
      })
      .finally(() => setLoading(false));
  }, [idsParam]);

  if (!idsParam) return (
    <div className="section"><div className="container">
      <div className="empty-state">
        <BarChart2 size={48} style={{opacity:.3}}/>
        <div className="empty-state__title">Chưa chọn sản phẩm so sánh</div>
        <div className="empty-state__desc">Vào trang sản phẩm và nhấn nút "So sánh" để thêm sản phẩm</div>
        <Link to="/shop" className="btn btn-primary" style={{marginTop:16}}>Chọn sản phẩm</Link>
      </div>
    </div></div>
  );

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  const COLS = 1 + products.length;
  const gridCols = `200px ${products.map(()=>'1fr').join(' ')}`;

  const getValue = (p, specName) => p.specs?.find(s => s.spec_name === specName);

  const ROWS = [
    { label:'Hình ảnh', render: (p) => (
      <img src={p.thumbnail} alt={p.name} style={{width:'100%',maxWidth:180,height:135,objectFit:'cover',borderRadius:10,margin:'0 auto',display:'block'}}
        onError={e=>{e.target.src='https://placehold.co/180x135/1E293B/3B82F6?text=Tech';}}/>
    )},
    { label:'Tên sản phẩm', render:(p)=><span style={{fontWeight:700,fontSize:'0.95rem'}}>{p.name}</span> },
    { label:'Thương hiệu',  render:(p)=><span style={{color:'var(--accent)',fontWeight:600}}>{p.brand_name}</span> },
    { label:'Giá', render:(p)=>(
      <div>
        <div style={{fontSize:'1.1rem',fontWeight:800,color:'var(--accent)'}}>{fmt(p.sale_price||p.price)}</div>
        {p.sale_price && <div style={{fontSize:'0.8rem',color:'var(--text-muted)',textDecoration:'line-through'}}>{fmt(p.price)}</div>}
      </div>
    )},
    { label:'Đánh giá', render:(p)=>(
      <div>
        {'⭐'.repeat(Math.round(p.avg_rating||0))} {p.avg_rating?Number(p.avg_rating).toFixed(1):'Chưa có đánh giá'}
      </div>
    )},
    { label:'Còn hàng', render:(p)=>(
      <span style={{color:p.stock_quantity>0?'var(--emerald)':'var(--red)',fontWeight:600}}>
        {p.stock_quantity>0?`✅ ${p.stock_quantity} sản phẩm`:'❌ Hết hàng'}
      </span>
    )},
  ];

  const cellStyle = {
    padding: '14px 16px',
    borderBottom: '1px solid var(--border)',
    verticalAlign: 'middle',
  };

  return (
    <div className="section"><div className="container">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:28}}>
        <BarChart2 size={22} color="var(--accent)"/>
        <h1 style={{fontSize:'1.5rem',fontWeight:800}}>So sánh sản phẩm ({products.length})</h1>
        <Link to="/shop" className="btn btn-ghost btn-sm" style={{marginLeft:'auto'}}>+ Thêm sản phẩm</Link>
      </div>

      {products.length === 0 ? (
        <div className="empty-state"><div className="empty-state__title">Sản phẩm không tồn tại</div></div>
      ) : (
        <div className="card"><div className="card-body" style={{padding:0,overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',tableLayout:'fixed'}}>
            <colgroup>
              <col style={{width:180}}/>
              {products.map((_,i)=><col key={i}/>)}
            </colgroup>
            <tbody>
              {ROWS.map(row => (
                <tr key={row.label}>
                  <td style={{...cellStyle,background:'var(--surface-2)',fontWeight:700,fontSize:'0.85rem',color:'var(--text-muted)',whiteSpace:'nowrap'}}>{row.label}</td>
                  {products.map(p=>(
                    <td key={p.id} style={{...cellStyle,textAlign:'center',fontSize:'0.88rem'}}>{row.render(p)}</td>
                  ))}
                </tr>
              ))}

              {/* Specs */}
              {allSpecs.length > 0 && (
                <>
                  <tr>
                    <td colSpan={COLS} style={{background:'var(--surface-2)',padding:'10px 16px',fontWeight:700,fontSize:'0.88rem',color:'var(--accent)',letterSpacing:1}}>
                      THÔNG SỐ KỸ THUẬT
                    </td>
                  </tr>
                  {allSpecs.map(specName => {
                    const vals = products.map(p => {
                      const sp = getValue(p, specName);
                      return sp ? `${sp.spec_value}${sp.unit?' '+sp.unit:''}` : '—';
                    });
                    const allSame = vals.every(v => v === vals[0]);
                    return (
                      <tr key={specName}>
                        <td style={{...cellStyle,background:'var(--surface-2)',fontWeight:600,fontSize:'0.82rem',color:'var(--text-muted)'}}>{specName}</td>
                        {vals.map((v,i)=>(
                          <td key={i} style={{...cellStyle,textAlign:'center',fontSize:'0.85rem',
                            background: !allSame && v!=='—' ? 'rgba(59,130,246,0.05)' : undefined,
                            fontWeight: !allSame && v!=='—' ? 700 : 400}}>
                            {v}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </>
              )}

              {/* CTA */}
              <tr>
                <td style={{...cellStyle,background:'var(--surface-2)',fontWeight:700,fontSize:'0.85rem',color:'var(--text-muted)',whiteSpace:'nowrap'}}>Thao tác</td>
                {products.map(p=>(
                  <td key={p.id} style={{...cellStyle,textAlign:'center'}}>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{width:'100%',maxWidth:160}}
                      disabled={p.stock_quantity===0}
                      onClick={async()=>{await addToCart(p.id);toast.success('Đã thêm vào giỏ!');}}
                    >
                      <ShoppingCart size={13}/> Thêm vào giỏ
                    </button>
                    <Link to={`/shop/${p.slug}`} className="btn btn-ghost btn-sm" style={{width:'100%',maxWidth:160,marginTop:6,justifyContent:'center'}}>
                      Xem chi tiết
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div></div>
      )}
    </div></div>
  );
}
