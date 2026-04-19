import { useNavigate } from 'react-router-dom';
import { BarChart2, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext';

export default function CompareBar() {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (!compareList.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'var(--surface-1)',
      borderTop: '2px solid var(--accent)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.25)',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap',
    }}>
      {/* Icon + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <BarChart2 size={18} color="var(--accent)" />
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
          So sánh ({compareList.length}/3)
        </span>
      </div>

      {/* Thumbnails */}
      <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        {compareList.map(p => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--surface-2)', borderRadius: 8,
            padding: '6px 10px', border: '1px solid var(--border)',
          }}>
            <img
              src={p.thumbnail}
              alt={p.name}
              style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4 }}
              onError={e => { e.target.src = 'https://placehold.co/36x36/1E293B/3B82F6?text=SP'; }}
            />
            <span style={{ fontSize: '0.78rem', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
              {p.name}
            </span>
            <button
              onClick={() => removeFromCompare(p.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, lineHeight: 1 }}
              title="Xóa"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: 3 - compareList.length }).map((_, i) => (
          <div key={i} style={{
            width: 90, height: 50, borderRadius: 8,
            border: '1.5px dashed var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.72rem', color: 'var(--text-muted)',
          }}>
            + Thêm
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button className="btn btn-ghost btn-sm" onClick={clearCompare}
          style={{ color: 'var(--red)' }}>
          Xóa tất cả
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/compare')}
          disabled={compareList.length < 2}
          title={compareList.length < 2 ? 'Cần ít nhất 2 sản phẩm' : ''}
        >
          So sánh ngay <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
