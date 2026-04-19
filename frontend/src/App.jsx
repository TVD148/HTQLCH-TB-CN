import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { CompareProvider } from './context/CompareContext';
import AppRoutes from './routes/AppRoutes';


function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <CompareProvider>
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'var(--surface-2)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                  },
                }}
              />
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
