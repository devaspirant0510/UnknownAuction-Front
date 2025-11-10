import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@shared/lib/axiosClient';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';

type Notification = {
    id: number;
    title: string;
    content: string;
    link?: string;
    createdAt: string;
    notificationType: 'AUCTION_ENDED' | 'POINT' | 'ALL';
    isRead: boolean;
};

const NotificationListPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 알림 목록 조회
    const {
        data: notifications = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['notifications', 'list', currentPage],
        queryFn: async () => {
            const response = await axiosClient.get(`/api/v1/notifications?page=${currentPage}`);
            return Array.isArray(response.data) ? response.data : response.data.content || [];
        },
        staleTime: 10000,
    });

    // 페이지 진입 시 모든 안 읽은 알림 읽음 처리
    React.useEffect(() => {
        const markAllAsRead = async () => {
            try {
                await axiosClient.post('/api/v1/notifications/read-all-unread');
                // 읽지 않은 개수 갱신
                queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
            } catch (error) {
                console.error('알림 읽음 처리 실패:', error);
            }
        };
        markAllAsRead();
    }, []); // 컴포넌트 마운트 시 1회만 실행

    // 알림 클릭 핸들러 - 링크 이동만
    const handleNotificationClick = (notification: Notification) => {
        if (notification.link) {
            navigate(notification.link);
        }
    };

    // 이전 페이지
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // 다음 페이지
    const handleNextPage = () => {
        if (notifications.length === 10) {
            setCurrentPage(currentPage + 1);
        }
    };

    // 알림 타입별 배지 색상
    const getNotificationTypeBadge = (type: string) => {
        switch (type) {
            case 'AUCTION_ENDED':
                return 'bg-blue-100 text-blue-800';
            case 'POINT':
                return 'bg-green-100 text-green-800';
            case 'ALL':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // 알림 타입별 한글 이름
    const getNotificationTypeText = (type: string) => {
        switch (type) {
            case 'AUCTION_ENDED':
                return '경매';
            case 'POINT':
                return '포인트';
            case 'ALL':
                return '공지';
            default:
                return '알림';
        }
    };

    if (isLoading) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <Loader2 className='w-8 h-8 animate-spin text-orange-500' />
            </div>
        );
    }

    if (isError) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-gray-600 mb-4'>알림을 불러오는데 실패했습니다.</p>
                    <button
                        onClick={() => navigate('/')}
                        className='px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600'
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* 헤더 */}
            <div className='bg-white border-b border-gray-200 sticky top-0 z-10'>
                <div className='max-w-3xl mx-auto px-4 py-4 flex items-center gap-4'>
                    <button
                        onClick={() => navigate(-1)}
                        className='p-2 hover:bg-gray-100 rounded-full transition'
                    >
                        <ChevronLeft size={24} className='text-gray-700' />
                    </button>
                    <h1 className='text-xl font-semibold text-gray-900'>알림</h1>
                </div>
            </div>

            {/* 알림 목록 */}
            <div className='max-w-3xl mx-auto px-4 py-6'>
                {notifications.length === 0 ? (
                    <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
                        <div className='text-gray-400 mb-2'>
                            <svg
                                className='w-16 h-16 mx-auto'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                                />
                            </svg>
                        </div>
                        <p className='text-gray-600 text-lg font-medium'>알림이 없습니다</p>
                        <p className='text-gray-400 text-sm mt-2'>
                            새로운 알림이 도착하면 여기에 표시됩니다
                        </p>
                    </div>
                ) : (
                    <>
                        <div className='bg-white rounded-lg shadow-sm divide-y divide-gray-200'>
                            {notifications.map((notification: Notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className='p-4 transition cursor-pointer hover:bg-gray-50'
                                >
                                    <div className='flex gap-3'>
                                        {/* 알림 내용 */}
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center gap-2 mb-1'>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-xs font-medium ${getNotificationTypeBadge(
                                                        notification.notificationType,
                                                    )}`}
                                                >
                                                    {getNotificationTypeText(
                                                        notification.notificationType,
                                                    )}
                                                </span>
                                                <p className='text-gray-400 text-xs'>
                                                    {formatDate(notification.createdAt)}
                                                </p>
                                            </div>
                                            <p className='font-medium text-gray-900 mb-1'>
                                                {notification.title}
                                            </p>
                                            <p className='text-gray-600 text-sm line-clamp-2'>
                                                {notification.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 페이징 버튼 */}
                        <div className='flex justify-center items-center gap-4 mt-6'>
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 0}
                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                    currentPage === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                            >
                                이전
                            </button>
                            <span className='text-gray-600'>{currentPage + 1} 페이지</span>
                            <button
                                onClick={handleNextPage}
                                disabled={notifications.length < 10}
                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                    notifications.length < 10
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                            >
                                다음
                            </button>
                        </div>
                    </>
                )}
            </div>
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

    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default NotificationListPage;
