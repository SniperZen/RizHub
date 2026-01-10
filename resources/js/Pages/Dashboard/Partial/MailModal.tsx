import React, { useState } from 'react';
import { router } from '@inertiajs/react';

interface MailModalProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: AppNotification[];
}

interface AppNotification {
    id: number;
    title: string;
    message: string;
    type: string;
    created_at: string;
    is_read: boolean;
}

// Delete Confirmation Modal Component
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeletingAll?: boolean;
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeletingAll = false }: DeleteConfirmationModalProps) {
  const [isBgLoaded, setIsBgLoaded] = useState(true);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="relative flex flex-col items-center">
        {/* Background Image */}
        <img
          src="/Img/Dashboard/modalBG.png"
          alt="Modal Background"
          style={{
          width: '700px',
          height: '300px'
        }}
          className="w-full h-auto rounded-[20px] md:rounded-[40px]"
        />
        
        {/* Overlay Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-between rounded-[20px] md:rounded-[40px]">
          {/* Header Layer - Top Section */}
          <div className="relative h-[60px] md:h-[80px] w-full flex items-center justify-center z-20">
            <span className="text-white text-xl md:text-2xl lg:text-3xl font-black tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mt-2 md:mt-2 mb-6 sm:mb-6 md:mb-8 lg:mt-0">
              {isDeletingAll ? 'Delete All' : 'Delete'}
            </span>
          </div>
          
          {/* Close Button */}
          <button
            className="absolute top-2 md:top-3 right-3 md:right-6 rounded-full w-[35px] h-[45px] md:w-[45px] md:h-[55px] flex items-center justify-center transition hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-white/50"
            onClick={onClose}
            aria-label="Close modal"
          >
            <img 
              src="/Img/Dashboard/X.png" 
              alt="Close" 
              className="w-full h-auto" 
            />
          </button>
          
          {/* Body Layer - Content Section */}
          <div className="relative flex flex-col items-center w-full px-4 md:px-[60px] pb-4 md:pb-6 pt-2 md:pt-5 lg:bottom-5 z-40 flex-grow justify-center">
            <div className="w-full max-w-md">
              {/* Message */}
              <div className="mb-6 md:mb-8 lg:mb-[20px] text-center">
                <p className="text-[#3D2410] font-extrabold text-lg md:text-xl lg:text-3xl px-2 md:px-5 font-bold">
                  {isDeletingAll 
                    ? 'Sigurado ka ba na gusto mong burahin ang lahat ng mga mensahe?'
                    : 'Sigurado ka ba na gusto mong burahin ang mensahe?'
                  }
                </p> 
                {isDeletingAll && (
                  <p className="text-[#3D2410] text-base md:text-lg font-medium mt-2 md:mt-3">
                    This action cannot be undone.
                  </p>
                )}
              </div>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-4 md:mb-6 lg:mb-6 pr-10 lg:pr-none pl-10 lg:pr-none">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-2 md:px-2 py-2 md:py-2.5 bg-[#F8E193] text-[#282725] text-base md:text-lg font-bold border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto min-w-[120px] md:min-w-[140px]"
                >
                  Kanselahin
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="px-2 md:px-2 py-2 md:py-2.5 bg-[#9A4112] text-white text-base md:text-lg font-bold border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto min-w-[120px] md:min-w-[140px]"
                >
                  Burahin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MailModal({ isOpen, onClose, notifications }: MailModalProps) {
    const [localNotifications, setLocalNotifications] = useState<AppNotification[]>(notifications);
    const [selected, setSelected] = useState<AppNotification | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<number | "all" | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isBgLoaded, setIsBgLoaded] = useState(false);

    if (!isOpen) return null;

    const handleSelect = (notification: AppNotification | null) => {
        setSelected(notification);
        if (notification && !notification.is_read) {
            markAsRead(notification.id);
        }
    };

    const markAsRead = (notificationId: number) => {
        const updated = localNotifications.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
        );
        setLocalNotifications(updated);

        router.post(route('notifications.markAsRead'), {
            notification_id: notificationId
        }, {
            preserveScroll: true,
            onError: () => {
                const reverted = localNotifications.map((n) =>
                    n.id === notificationId ? { ...n, is_read: false } : n
                );
                setLocalNotifications(reverted);
            }
        });
    };

    const markAsUnread = (notificationId: number) => {
        const updated = localNotifications.map((n) =>
            n.id === notificationId ? { ...n, is_read: false } : n
        );
        setLocalNotifications(updated);

        router.post(route('notifications.markAsUnread'), {
            notification_id: notificationId
        }, {
            preserveScroll: true,
            onError: () => {
                const reverted = localNotifications.map((n) =>
                    n.id === notificationId ? { ...n, is_read: true } : n
                );
                setLocalNotifications(reverted);
            }
        });
    };

    const deleteNotification = async (notificationId: number) => {
        setIsDeleting(true);
        const updatedNotifications = localNotifications.filter(n => n.id !== notificationId);
        setLocalNotifications(updatedNotifications);

        if (selected?.id === notificationId) {
            setSelected(null);
        }

        router.delete(route('notifications.destroy', notificationId), {
            preserveScroll: true,
            onError: () => {
                const originalNotification = notifications.find(n => n.id === notificationId);
                if (originalNotification) {
                    setLocalNotifications(prev => [...prev, originalNotification]);
                }
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    const deleteAllNotifications = () => {
        setIsDeleting(true);
        setLocalNotifications([]);
        setSelected(null);

        router.delete(route('notifications.destroyAll'), {
            preserveScroll: true,
            onError: () => {
                setLocalNotifications(notifications);
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    const markAllAsRead = () => {
        const updated = localNotifications.map(n => ({ ...n, is_read: true }));
        setLocalNotifications(updated);

        router.post(route('notifications.markAllAsRead'), {}, {
            preserveScroll: true,
            onError: () => {
                setLocalNotifications(notifications);
            }
        });
    };

    const openDeleteModal = (target: number | "all") => {
        setDeleteTarget(target);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDeleteTarget(null);
        setShowDeleteModal(false);
    };

    const confirmDelete = () => {
        if (deleteTarget === "all") {
            deleteAllNotifications();
        } else if (typeof deleteTarget === "number") {
            deleteNotification(deleteTarget);
        }
        closeDeleteModal();
    };

    const unreadCount = localNotifications.filter(n => !n.is_read).length;

    return (
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="relative flex flex-col items-center">
                {/* Background Image with customizable inline styles */}
                <img
                    src="/Img/Dashboard/modalBG.png"
                    alt="Modal Background"
                    style={{
                        width: '900px',
                        height: '500px'
                    }}
                    className="rounded-[40px]"
                    onLoad={() => setIsBgLoaded(true)}
                    onError={() => setIsBgLoaded(true)}
                />
                
                {/* Loading Overlay - Only show when image is not loaded */}
                {!isBgLoaded && (
                    <div 
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#F9E3B0] to-[#E6C48B] rounded-[40px] z-20 w-full h-full"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-[#9A4112] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-[#9A4112] font-bold">Loading...</p>
                        </div>
                    </div>
                )}
                
                {/* Content Container - Only show when image is loaded */}
                {isBgLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="flex flex-col items-center w-full px-4 md:px-[80px]">
                            <span className="absolute text-white text-2xl md:text-4xl font-black tracking-wide top-3">
                                Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                            </span>
                            
                            <button
                                className="absolute top-4 md:top-7 right-4 md:right-9 rounded-full w-[40px] h-[40px] md:w-[60px] md:h-[60px] flex items-center justify-center shadow-lg transition hover:scale-110"
                                onClick={onClose}
                                aria-label="Close"
                                disabled={isDeleting}
                            >
                                <img src="/Img/Dashboard/X.png" alt="X" className="w-full h-auto" />
                            </button>
                        </div>

                        {/* Mobile View - Full Screen Modal */}
                        <div className="lg:hidden mt-16 md:mt-20 w-full px-3 sm:px-4">
                        {!selected ? (
                            // Notification List View
                            <div className="w-full max-w-full overflow-y-auto p-2 sm:p-3" 
                                style={{ maxHeight: 'calc(500px - 100px)' }}>
                            {localNotifications.length > 0 ? (
                                <div className="space-y-3 sm:space-y-4">
                                {localNotifications.map((notification) => (
                                    <div
                                    key={notification.id}
                                    className={`cursor-pointer p-3 sm:p-4 rounded-lg border-2 border-[#88643D] transition-all duration-200 active:scale-[0.98] group relative ${
                                        notification.is_read
                                        ? 'bg-white/90'
                                        : 'bg-yellow-100/90'
                                    }`}
                                    onClick={() => handleSelect(notification)}
                                    >
                                    {/* Unread indicator - more subtle */}
                                    {!notification.is_read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-lg"></div>
                                    )}

                                    {/* Action Buttons - Always visible on mobile */}
                                    <div className="absolute top-2 right-2 flex gap-1.5 sm:gap-2">
                                        <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            notification.is_read 
                                            ? markAsUnread(notification.id)
                                            : markAsRead(notification.id);
                                        }}
                                        className="w-6 h-6 sm:w-7 sm:h-7 bg-[#9A4112] text-white text-xs rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                        title={notification.is_read ? 'Mark as unread' : 'Mark as read'}
                                        >
                                        {notification.is_read ? '↶' : '✓'}
                                        </button>
                                        <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openDeleteModal(notification.id);
                                        }}
                                        className="w-6 h-6 sm:w-7 sm:h-7 bg-red-600 text-white text-xs rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                        title="Delete"
                                        disabled={isDeleting}
                                        >
                                        ×
                                        </button>
                                    </div>

                                    <div className="pr-12 sm:pr-14">
                                        <h3 className="font-bold text-[#3D2410] text-sm sm:text-base pr-2">
                                        {notification.title}
                                        {/* Removed the floating dot for cleaner look */}
                                        </h3>

                                        <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                                        {new Date(notification.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                        </p>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            ) : (
                                <div className="text-center text-[#3D2410] py-8">
                                <p className="text-sm sm:text-base">No notifications yet.</p>
                                </div>
                            )}
                            </div>
                        ) : (
                            // Full Screen Message View
                            <div className="w-full max-w-full flex flex-col p-3 sm:p-4" 
                                style={{ maxHeight: 'calc(500px - 100px)' }}>
                            {/* Header with Back Button */}
                            <div className="flex items-center mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-[#88643D]">
                                <button
                                onClick={() => handleSelect(null)}
                                className="flex items-center gap-1.5 sm:gap-2 text-[#3D2410] hover:text-[#9A4112] transition"
                                >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="text-sm sm:text-lg font-bold">Back to Notifications</span>
                                </button>
                            </div>

                            {/* Message Content */}
                            <div className="flex-1 overflow-y-auto pr-1">
                                <h2 className="font-bold text-base sm:text-lg text-[#3D2410] mb-3 sm:mb-4">
                                {selected.title}
                                </h2>
                                
                                <div className="bg-white/90 p-3 sm:p-4 rounded-lg border border-[#88643D] min-h-[100px] sm:min-h-[20vh]">
                                <p className="text-[#3D2410] text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                    {selected.message}
                                </p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#88643D] gap-2">
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                    {new Date(selected.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                    selected.is_read 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {selected.is_read ? 'Read' : 'Unread'}
                                    </span>
                                </div>
                                </div>
                            </div>
                            </div>
                        )}
                        </div>

                        {/* Desktop View (Original Layout) */}
                        <div className="hidden lg:flex mt-24 ml-16 w-full h-full px-10 gap-6">
                            <div className="w-[350px] h-[350px] border-r-2 border-[#88643D] overflow-y-auto p-3 rounded-md">
                                {localNotifications.length > 0 ? (
                                    <div className="space-y-4">
                                        {localNotifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`cursor-pointer p-4 rounded-lg border-2 border-[#88643D] transition hover:scale-105 group relative ${
                                                    notification.is_read
                                                        ? 'bg-white/80'
                                                        : 'bg-yellow-100/90'
                                                } ${
                                                    selected?.id === notification.id
                                                        ? 'ring-2 ring-[#D97706]'
                                                        : ''
                                                }`}
                                                onClick={() => handleSelect(notification)}
                                            >
                                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            notification.is_read 
                                                                ? markAsUnread(notification.id)
                                                                : markAsRead(notification.id);
                                                        }}
                                                        className="w-6 h-6 bg-[#9A4112] text-white text-xs rounded-full flex items-center justify-center"
                                                        title={notification.is_read ? 'Mark as unread' : 'Mark as read'}
                                                    >
                                                        {notification.is_read ? '↶' : '✓'}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openDeleteModal(notification.id);
                                                        }}
                                                        className="w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center"
                                                        title="Delete"
                                                        disabled={isDeleting}
                                                    >
                                                        ×
                                                    </button>
                                                </div>

                                                <div>
                                                    <h3 className="font-bold text-[#3D2410] text-xl pr-8">
                                                        {notification.title}
                                                        {!notification.is_read && (
                                                            <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                                                        )}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-[#3D2410] py-8">
                                        <p>No notifications yet.</p>
                                    </div>
                                )}
                            </div>

                            <div className="w-1/2 overflow-y-auto">
                                {selected ? (
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="font-bold text-2xl text-[#3D2410]">
                                                {selected.title}
                                            </h2>
                                            <div className="flex gap-2">
                                                {/* Action buttons for selected notification */}
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white/80 p-4 rounded-lg">
                                            <p className="text-[#3D2410] text-base whitespace-pre-line">
                                                {selected.message}
                                            </p>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mt-4">
                                            <p className="text-xs text-gray-500">
                                                {new Date(selected.created_at).toLocaleString()}
                                            </p>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                selected.is_read 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {selected.is_read ? 'Read' : 'Unread'}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500 italic">
                                        Select a notification to preview
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* New Delete Confirmation Modal */}
        <DeleteConfirmationModal    
            isOpen={showDeleteModal}
            onClose={closeDeleteModal}
            onConfirm={confirmDelete}
            isDeletingAll={deleteTarget === "all"}
        />
        </>
    );
}