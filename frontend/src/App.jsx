import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import AppRoutes from './routes/AppRoutes';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <CompareProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1E293B',
                  color: '#F8FAFC',
                  border: '1px solid rgba(148,163,184,0.15)',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                },
              }}
            />
          </CompareProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
