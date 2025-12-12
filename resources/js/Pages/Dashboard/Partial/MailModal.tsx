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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div 
        className="relative bg-gradient-to-b from-[#F9E3B0] to-[#E6C48B] rounded-[40px] px-1 pb-6 pt-5 flex flex-col items-center min-w-[500px] h-auto"
        style={{ 
          backgroundImage: "url('/Img/Dashboard/modalBG.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Header Layer - Top Section */}
        <div className="absolute bottom-[219px] left-0 right-0 h-25 flex items-center justify-center z-20">
          <span className="text-white text-2xl font-black tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {isDeletingAll ? 'Delete All' : 'Delete'}
          </span>
        </div>
        
        {/* Close Button */}
        <button
          className="absolute top-2 right-10 rounded-full w-[45px] h-[60px] flex items-center justify-center transition hover:scale-110 z-50"
          onClick={onClose}
        >
          <img src="/Img/Dashboard/X.png" alt="X" className="w-full h-auto" />
        </button>
        
        {/* Body Layer - Content Section */}
        <div className="relative flex flex-col items-center w-full px-[60px] mt-5 z-40">
          <div className="mt-3 mb-8 w-full max-w-md">
            {/* Message */}
            <div className="mb-[35px] text-center">
              <p className="fix text-[#3D2410] text-2xl font-bold mt-153">
                {isDeletingAll 
                  ? 'Are you sure you want to delete ALL'
                  : 'Are you sure you want to delete this'
                }
              </p> 
              <p className="fix text-[#3D2410] text-2xl font-bold mt-153">
                {isDeletingAll ? 'notifications?' : 'notification?'}
              </p>
              {isDeletingAll && (
                <p className="fix text-[#3D2410] text-lg font-medium mt-2">
                  This action cannot be undone.
                </p>
              )}
            </div>
            
            {/* Buttons */}
            <div className="flex justify-center gap-6 mb-25">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-1.5 bg-[#F8E193] mb-25 text-[#282725] text-lg font-bold rounded-lg border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-5 py-1.5 bg-[#9A4112] text-white text-lg font-bold rounded-lg border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
              >
                Delete
              </button>
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

    const handleSelect = (notification: AppNotification) => {
        setSelected(notification);
        if (!notification.is_read) {
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
                        <div className="flex flex-col items-center w-full px-[80px]">
                            <span className="absolute text-white text-4xl font-black tracking-wide top-3">
                                Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                            </span>
                            
                            {/* Action Buttons (commented out as per your original code) */}
                            {/* <div className="absolute top-7 left-9 flex gap-2">
                                <button
                                    onClick={markAllAsRead}
                                    disabled={unreadCount === 0}
                                    className="px-3 py-1 bg-[#9A4112] text-white text-xs rounded-lg disabled:opacity-50 transition hover:scale-105"
                                >
                                    Mark All Read
                                </button>
                                <button
                                    onClick={() => openDeleteModal("all")}
                                    disabled={localNotifications.length === 0}
                                    className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg disabled:opacity-50 transition hover:scale-105"
                                >
                                    Delete All
                                </button>
                            </div> */}

                            <button
                                className="absolute top-7 right-9 rounded-full w-[60px] h-[60px] flex items-center justify-center shadow-lg transition hover:scale-110"
                                onClick={onClose}
                                aria-label="Close"
                                disabled={isDeleting}
                            >
                                <img src="/Img/Dashboard/X.png" alt="X" className="w-full h-auto" />
                            </button>
                        </div>

                        <div className="mt-24 md:mt-24 lg:mt-24 ml-16 flex w-full h-full px-10 gap-6">
                            <div className="w-[190px] md:w-[250px] lg:w-[350px] h-[350px] md:h-[350px] lg:h-[350px] border-r-2 border-[#88643D] overflow-y-auto p-3 rounded-md">
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

                                                <div onClick={() => handleSelect(notification)}>
                                                    <h3 className="font-bold text-[#3D2410] text-base lg:text-xl pr-8">
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
                                            <h2 className="font-bold text-lg lg:text-2xl text-[#3D2410]">
                                                {selected.title}
                                            </h2>
                                            <div className="flex gap-2">
                                                {/* Action buttons for selected notification (commented out) */}
                                                {/* <button
                                                    onClick={() => selected.is_read 
                                                        ? markAsUnread(selected.id)
                                                        : markAsRead(selected.id)
                                                    }
                                                    className="px-3 py-1 bg-[#9A4112] text-white text-xs rounded-lg transition hover:scale-105"
                                                >
                                                    {selected.is_read ? 'Mark Unread' : 'Mark Read'}
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(selected.id)}
                                                    className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg transition hover:scale-105"
                                                    disabled={isDeleting}
                                                >
                                                    Delete
                                                </button> */}
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