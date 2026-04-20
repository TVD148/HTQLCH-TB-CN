import { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext(null);

const MAX_COMPARE = 3;

export function CompareProvider({ children }) {
  // Lưu list slug (dùng slug để gọi API)
  const [compareList, setCompareList] = useState([]); // [{id, slug, name, thumbnail, price, sale_price}]

  const addToCompare = useCallback((product) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === product.id)) {
        toast('Sản phẩm đã có trong danh sách so sánh', { icon: 'ℹ️' });
        return prev;
      }
      if (prev.length >= MAX_COMPARE) {
        toast.error(`Chỉ được so sánh tối đa ${MAX_COMPARE} sản phẩm`);
        return prev;
      }
      toast.success(`Đã thêm "${product.name}" vào so sánh`);
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((productId) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const isInCompare = useCallback((productId) => {
    return compareList.some(p => p.id === productId);
  }, [compareList]);

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      count: compareList.length,
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
