import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiHelpCircle, FiInbox, FiMessageSquare, FiClock, FiUser, FiLogOut, FiBell } from 'react-icons/fi';
import { logout, getAuthData } from '../../utils/localStorage';
import { useState, useEffect } from 'react';
import NotificationDropdown from '../NotificationDropdown';
import { getNotifications } from '../../services/notificationService';

const PenerimaNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const loadUserData = () => {
    const authData = getAuthData();
    setUser(authData);
  };

  const fetchNotifCount = async () => {
    try {
      const res = await getNotifications();
      if (res.success) {
        setUnreadCount(res.unread_count);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUserData();
    fetchNotifCount();
    const notifInterval = setInterval(fetchNotifCount, 30000);

    // Listen untuk profile update event real-time
    const handleProfileUpdate = (e) => {
      const updatedUser = e.detail;
      setUser(updatedUser);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    const handleFocus = () => {
      loadUserData();
      fetchNotifCount();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('focus', handleFocus);
      clearInterval(notifInterval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
    return `http://localhost:8080/storage/${photoPath}`;
  };

  const photoUrl = user ? getPhotoUrl(user.avatar || user.photo) : null;
  const displayInitial = user?.name?.charAt(0).toUpperCase() || 'P';

  const menuItems = [
    { path: '/dashboard-penerima', label: 'Dashboard', icon: FiHome },
    { path: '/penerima/permintaan-saya', label: 'Permintaan Saya', icon: FiHelpCircle },
    { path: '/penerima/riwayat', label: 'Riwayat', icon: FiClock },
    { path: '/penerima/chat', label: 'Chat', icon: FiMessageSquare },
    { path: '/penerima/profil', label: 'Profil', icon: FiUser },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center h-20">
          {/* Logo & Desktop Menu */}
          <div className="flex items-center space-x-8">
            <Link to="/dashboard-penerima" className="flex items-center space-x-3 group">
              <img
                src="/logo-donasiku.png"
                alt="DonasiKu Logo"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-110"
              />
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${isActive(item.path)
                    ? 'bg-gradient-to-r from-[#00306C] to-[#001F4D] text-white shadow-lg'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-[#00306C]'
                    }`}
                >
                  <item.icon className="text-lg" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop User Info & Logout - Now moved to the left after menu */}
          <div className="hidden lg:flex items-center ml-8 space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-3 px-4 py-2 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00306C] to-[#001F4D] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">{displayInitial}</span>
                )}
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-gray-900 line-clamp-1">{user?.name}</div>
                <div className="text-xs text-gray-600">Penerima</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>

          {/* Spacer to push the notification bell to the absolute far right */}
          <div className="flex-1"></div>

          {/* Notification Bell - Far right */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`w-full h-full flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors ${isNotifOpen ? 'bg-gray-100' : ''}`}
            >
              <FiBell className="text-2xl text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
            />
          </div>

          {/* Mobile Menu Button - At the very end on mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden ml-4 p-2 text-gray-700 hover:bg-gray-100 rounded-xl flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive(item.path)
                    ? 'bg-gradient-to-r from-[#00306C] to-[#001F4D] text-white'
                    : 'text-gray-700 hover:bg-blue-50'
                    }`}
                >
                  <item.icon className="text-xl" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="px-4 py-3 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00306C] to-[#001F4D] rounded-full flex items-center justify-center">
                    <FiUser className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-600">Penerima</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all"
              >
                <FiLogOut className="text-xl" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PenerimaNavbar;
