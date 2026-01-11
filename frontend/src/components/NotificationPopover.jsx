import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import {
    BellIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    ExclamationCircleIcon,
    TrashIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const NotificationPopover = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const popoverRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await authService.getUserNotifications();
            setNotifications(data.results || data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await authService.markNotificationAsRead(id);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await authService.deleteNotification(id);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'enrollment':
            case 'event_registration':
                return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
            case 'system_announcement':
            case 'urgent_update':
                return <ExclamationCircleIcon className="w-5 h-5 text-red-400" />;
            default:
                return <InformationCircleIcon className="w-5 h-5 text-[#30d9fe]" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={popoverRef}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
        >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                <h3 className="font-bold text-white flex items-center">
                    <BellIcon className="w-5 h-5 mr-2 text-[#30d9fe]" />
                    Notifications
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#30d9fe] mx-auto"></div>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-white/5 transition-all flex gap-3 relative group ${!notification.is_read ? 'bg-[#30d9fe]/5' : ''}`}
                            >
                                <div className="mt-1 flex-shrink-0">
                                    {getIcon(notification.notification_type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-white truncate">
                                        {notification.title}
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                        {notification.message}
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-2">
                                        {new Date(notification.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="text-[10px] text-[#30d9fe] hover:underline whitespace-nowrap"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <BellIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">No new notifications</p>
                    </div>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="p-3 bg-slate-900/50 border-t border-white/10 text-center">
                    <Link
                        to={authService.getUserRole() === 'admin' ? '/admin' :
                            authService.getUserRole() === 'mentor' ? '/mentor-dashboard' :
                                '/learner-dashboard'}
                        onClick={onClose}
                        className="text-xs text-[#30d9fe] font-semibold hover:underline"
                    >
                        View all notifications
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NotificationPopover;
