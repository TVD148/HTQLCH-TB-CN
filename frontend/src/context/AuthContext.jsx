import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authApi } from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  const doLogout = (msg) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (msg) toast.error(msg, { duration: 6000, id: 'account-locked' });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    if (token && saved) {
      setUser(JSON.parse(saved));
      authApi.getMe()
        .then(res => setUser(res.data.data))
        .catch(() => doLogout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Lắng nghe BroadcastChannel khi admin khóa tài khoản
    let bc;
    try {
      bc = new BroadcastChannel('auth_channel');
      bc.onmessage = (e) => {
        if (e.data?.type === 'ACCOUNT_LOCKED') {
          const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
          if (currentUser && String(currentUser.id) === String(e.data.userId)) {
            doLogout('⛔ Tài khoản của bạn đã bị khóa bởi quản trị viên. Vui lòng liên hệ hỗ trợ.');
            window.location.href = '/login';
          }
        }
      };
    } catch (_) {}

    return () => { try { bc?.close(); } catch (_) {} };
  }, []);

  // Poll /me mỗi 60 giây để phát hiện bị khóa khi đang online
  useEffect(() => {
    if (!user) return;
    pollRef.current = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await authApi.getMe();
        // getMe không trả is_active, nếu bị 403 thì token vẫn hợp lệ nhưng tài khoản khóa
        // Xử lý qua interceptor axios nếu cần
      } catch (err) {
        if (err?.response?.status === 403) {
          doLogout('⛔ Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.');
          window.location.href = '/login';
        }
      }
    }, 60000);
    return () => clearInterval(pollRef.current);
  }, [user?.id]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => doLogout();

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAdmin: user?.role === 'admin', isStaff: user?.role === 'staff' || user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
