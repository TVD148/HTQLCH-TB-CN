import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CompareBar from '../components/CompareBar';

export default function MainLayout() {
  return (
    <>
      <Header />
      <div className="page-wrapper">
        <Outlet />
      </div>
      <Footer />
      <CompareBar />
    </>
  );
}
