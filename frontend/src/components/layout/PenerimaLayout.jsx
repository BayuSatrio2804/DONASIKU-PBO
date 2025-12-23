import { Outlet } from 'react-router-dom';
import PenerimaNavbar from './PenerimaNavbar';
import DashboardFooter from './DashboardFooter';

const PenerimaLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Navbar */}
      <PenerimaNavbar />

      {/* Main Content */}
      <main className="flex-grow mt-20 p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
};

export default PenerimaLayout;
