import { FiBell, FiMenu } from 'react-icons/fi';
import { getAuthData } from '../../utils/localStorage';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from '../NotificationDropdown';
import { getNotifications } from '../../services/notificationService';

const DashboardTopbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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

    // Refresh notif every 30 seconds
    const notifInterval = setInterval(fetchNotifCount, 30000);

    // Listen untuk profile update event real-time
    const handleProfileUpdate = (e) => {
      const updatedUser = e.detail;
      setUser(updatedUser);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    // Refresh user data whenever window gains focus
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

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
    return `http://localhost:8081/storage/${photoPath}`;
  };

  const photoUrl = user ? getPhotoUrl(user.avatar || user.photo) : null;
  const displayInitial = user?.name?.charAt(0).toUpperCase() || 'U';

  const handleAvatarClick = () => {
    if (user?.role === 'donatur') {
      navigate('/donatur/detail-akun');
    } else if (user?.role === 'penerima') {
      navigate('/penerima/detail-akun');
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 h-20 bg-white border-b border-gray-200 shadow-sm z-30 transition-all">
      <div className="h-full px-6 flex items-center">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
        >
          <FiMenu className="text-2xl text-gray-700" />
        </button>

        {/* User Info - Now on the left */}
        <div
          onClick={handleAvatarClick}
          className="lg:ml-0 ml-4 flex items-center space-x-3 cursor-pointer hover:opacity-80 transition flex-shrink-0"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
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
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-gray-900 line-clamp-1">{user?.name}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
              {user?.role === 'donatur' ? 'Donatur' : 'Penerima'}
            </div>
          </div>
        </div>

        {/* Flexible spacer to push notification bell to the absolute far right */}
        <div className="flex-1"></div>

        {/* Notification Bell - Far right */}
        <div className="pl-4 lg:pl-8 border-l border-gray-200 flex items-center h-full flex-shrink-0">
          <div className="relative h-10 w-10">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`w-full h-full flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors ${isNotifOpen ? 'bg-gray-100' : ''}`}
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
        </div>
      </div>
    </nav>
  );
};

export default DashboardTopbar;