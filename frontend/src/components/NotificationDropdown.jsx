import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCheck, FiInfo, FiTrash2, FiClock } from 'react-icons/fi';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const NotificationDropdown = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await getNotifications();
            if (res.success) {
                setNotifications(res.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const handleMarkAsRead = async (e, notifyId) => {
        e.stopPropagation();
        try {
            await markAsRead(notifyId);
            setNotifications(notifications.map(n =>
                n.id === notifyId ? { ...n, is_read: true } : n
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleNotificationClick = async (notif) => {
        if (notif.link) {
            navigate(notif.link);
            onClose(); // Close dropdown
        }

        if (!notif.is_read) {
            // Mark read in background
            try {
                await markAsRead(notif.id);
                // Update local state if needed (though we navigated away, but good for UX if user stays)
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (!isOpen) return null;

    // Show only latest 3 as per requirement
    const latestNotifications = notifications.slice(0, 3);

    return (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden origin-top-right ring-1 ring-black ring-opacity-5">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FiBell className="text-blue-600" />
                    Aktivitas Terbaru
                </h3>
                {notifications.some(n => !n.is_read) && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                    >
                        Tandai sudah baca
                    </button>
                )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {loading && (
                    <div className="p-8 text-center text-gray-500">
                        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-xs">Memuat...</p>
                    </div>
                )}

                {!loading && latestNotifications.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        <FiBell className="text-4xl mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-medium">Balkum ada aktivitas</p>
                    </div>
                )}

                {latestNotifications.map((notif) => (
                    <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer relative group ${!notif.is_read ? 'bg-blue-50/30' : ''}`}
                    >
                        <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${notif.type.includes('approved') ? 'bg-green-100 text-green-600' :
                                notif.type.includes('rejected') ? 'bg-red-100 text-red-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                <FiInfo size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 mb-0.5 mt-0">{notif.title}</p>
                                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400 font-medium">
                                    <FiClock size={12} />
                                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: id })}
                                </div>
                            </div>
                            {!notif.is_read && (
                                <button
                                    onClick={(e) => handleMarkAsRead(e, notif.id)}
                                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 hover:text-blue-700 transition-all border border-gray-100"
                                    title="Tandai sudah baca"
                                >
                                    <FiCheck size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {notifications.length > 3 && (
                <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                    <p className="text-[10px] text-gray-500 font-medium italic">
                        Menampilkan 3 aktivitas terbaru dari total {notifications.length}
                    </p>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
