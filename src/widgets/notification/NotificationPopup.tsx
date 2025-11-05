import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { axiosClient } from '@shared/lib/axiosClient.ts';
import { useQuery } from '@tanstack/react-query';

type Notification = {
    id: number;
    title: string;
    content: string;
    link?: string;
    createdAt: string;
    notificationType: 'AUCTION_ENDED' | 'POINT' | 'ALL';
    isRead: boolean;
};

type NotificationPopupProps = {
    unreadCount: number;
    onMarkAsRead?: () => void;
};

const NotificationPopup: React.FC<NotificationPopupProps> = ({ unreadCount, onMarkAsRead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    // 최근 5개 알림 조회
    const { data: notificationsData = [], isLoading } = useQuery({
        queryKey: ['notifications', 'recent'],
        queryFn: async () => {
            const response = await axiosClient.get('/api/v1/notifications/recent');
            return response.data || [];
        },
        enabled: isOpen,
        staleTime: 30000,
    });

    // 팝업 열릴 때 알림 읽음 처리
    useEffect(() => {
        if (isOpen && Array.isArray(notificationsData) && notificationsData.length > 0) {
            handleMarkNotificationsAsRead();
        }
    }, [isOpen, notificationsData]);

    // 바깥 영역 클릭 시 팝업 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // 알림 읽음 처리
    const handleMarkNotificationsAsRead = async () => {
        try {
            await axiosClient.post('/api/v1/notifications/read');
            onMarkAsRead?.();
        } catch (error) {
            console.error('알림 읽음 처리 실패:', error);
        }
    };

    // 알림 클릭 시
    const handleNotificationClick = (notification: Notification) => {
        if (notification.link) {
            window.location.href = notification.link;
        }
    };

    return (
        <div className='relative' ref={popupRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='relative transition'
            >
                <img
                    src='/img/notification.svg'
                    alt='notification'
                    className='h-5'
                />

                {/* 읽지 않은 알림 배지 */}
                {unreadCount > 0 && (
                    <span
                        className='absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full'
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* 알림 팝업 */}
            {isOpen && (
                <div className='absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 before:content-[""] before:absolute before:top-[-8px] before:right-6 before:w-0 before:h-0 before:border-l-4 before:border-r-4 before:border-b-4 before:border-l-transparent before:border-r-transparent before:border-b-white'>
                    {/* 헤더 */}
                    <div className='flex justify-between items-center p-4 border-b border-gray-200'>
                        <h3 className='font-semibold text-gray-800'>알림</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className='text-gray-500 hover:text-gray-700'
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* 알림 목록 */}
                    <div className='max-h-80 overflow-y-auto'>
                        {isLoading ? (
                            <div className='flex justify-center items-center h-32'>
                                <span className='text-gray-500'>로딩 중...</span>
                            </div>
                        ) : Array.isArray(notificationsData) && notificationsData.length > 0 ? (
                            <ul className='divide-y divide-gray-200'>
                                {notificationsData.map((notification: Notification) => (
                                    <li
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className='p-4 hover:bg-gray-50 cursor-pointer transition'
                                    >
                                        <div className='flex gap-3'>
                                            {/* 텍스트 */}
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-medium text-gray-900 text-sm'>
                                                    {notification.title}
                                                </p>
                                                <p className='text-gray-600 text-xs mt-1 line-clamp-2'>
                                                    {notification.content}
                                                </p>
                                                <p className='text-gray-400 text-xs mt-2'>
                                                    {formatDate(notification.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className='flex justify-center items-center h-32'>
                                <span className='text-gray-500'>알림이 없습니다</span>
                            </div>
                        )}
                    </div>

                    {/* 전체보기 버튼 */}
                    <div className='border-t border-gray-200 p-3 text-center'>
                        <Link
                            to='/notifications'
                            className='text-sm font-medium text-orange-500 hover:text-orange-600 transition'
                            onClick={() => setIsOpen(false)}
                        >
                            전체보기 →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

// 날짜 포맷 함수
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR');
}

export default NotificationPopup;