import { useQuery, useQueryClient } from '@tanstack/react-query';
import { httpFetcher, getServerURL, axiosClient } from '@shared/lib';
import { ApiResult } from '@entities/common';
import { useParams, useNavigate } from 'react-router';
import { Header } from '@widgets/ui';
import { getTime } from '@pages/feed/getTime.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faExclamation, faHeart, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import CommentInput from '@pages/feed/CommentInput.tsx';
import CommentList from '@pages/feed/CommentList.tsx';
import React, { useState, useEffect } from 'react';
import { ProfileImage } from '@shared/ui';
import { EditModal } from '@pages/feed/component/EditModal.tsx';
import { useAuthStore } from '@shared/store/AuthStore.ts';

interface User {
    nickname: string;
    profileUrl?: string;
    id?: number;
}

interface Feed {
    id: number | string;
    contents: string;
    createdAt: string;
    user: User;
}

interface Image {
    url: string;
    fileName: string;
}

interface FeedWrapper {
    feed: Feed;
    images: Image[];
    commentCount: number;
    likeCount: number;
    isLiked: boolean;
}

const FeedInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { getUserAuth } = useAuthStore();

    const [showComments, setShowComments] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [editingFeedId, setEditingFeedId] = useState<number | null>(null);
    const [editingFeedData, setEditingFeedData] = useState<FeedWrapper | null>(null);
    const [likeLoading, setLikeLoading] = useState(false);
    const [likeStatus, setLikeStatus] = useState<{ isLiked: boolean; count: number }>({
        isLiked: false,
        count: 0,
    });

    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['api', 'v1', 'feed', id],
        queryFn: httpFetcher<ApiResult<FeedWrapper>>,
    });

    // 현재 사용자 ID 가져오기
    useEffect(() => {
        const userAuth = getUserAuth();
        if (userAuth?.id) {
            setCurrentUserId(userAuth.id);
        }
    }, [getUserAuth]);

    // 좋아요 상태 초기화
    useEffect(() => {
        if (data?.data) {
            setLikeStatus({
                isLiked: data.data.liked,
                count: data.data.likeCount,
            });
        }
    }, [data]);

    const handleLikeToggle = async () => {
        if (!id || likeLoading) return;

        setLikeLoading(true);

        try {
            await axiosClient.patch(`${getServerURL()}/api/v1/feed/${id}/like`);
            setLikeStatus((prev) => ({
                isLiked: !prev.isLiked,
                count: prev.isLiked ? Math.max(0, prev.count - 1) : prev.count + 1,
            }));

            // 캐시 새로고침
            queryClient.refetchQueries({
                queryKey: ['api', 'v1', 'feed', id],
                type: 'active',
            });
        } catch (error: any) {
            console.error('좋아요 처리 에러:', error);
            alert(error.response?.data?.message || '좋아요 처리 중 오류가 발생했습니다.');
        } finally {
            setLikeLoading(false);
        }
    };

    const handleEditClick = (feedData: FeedWrapper) => {
        setEditingFeedId(Number(feedData.feed.id));
        setEditingFeedData(feedData);
    };

    const handleDeleteClick = () => {
        if (!id) return;
        if (window.confirm('이 글을 삭제하시겠습니까?')) {
            handleDeleteFeed();
        }
    };

    const handleDeleteFeed = async () => {
        if (!id) return;
        try {
            await axiosClient.delete(`${getServerURL()}/api/v1/feed/${id}`);
            ('글이 삭제되었습니다.');
            navigate('/community');
        } catch (error: any) {
            console.error('삭제 에러:', error);
            alert(error.response?.data?.message || '삭제 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) return <>loading</>;
    if (isError) return <>{error?.message || 'error'}</>;
    if (!data || !data.data) return <>nodata</>;

    const v = data.data;
    const feedId = Number(v.feed.id);
    const isAuthor = currentUserId && v.feed.user.id && currentUserId === v.feed.user.id;

    return (
        <>
            <Header />
            <div className='min-h-screen w-full bg-[#F7F7F7] py-5'>
                {editingFeedId && editingFeedData && (
                    <EditModal
                        feedId={editingFeedId}
                        initialContent={editingFeedData.feed.contents}
                        initialImages={editingFeedData.images}
                        onClose={() => {
                            setEditingFeedId(null);
                            setEditingFeedData(null);
                        }}
                    />
                )}

                <div className='max-w-[700px] mx-auto bg-white w-full rounded-xl shadow-md px-6 py-5'>
                    <div className='flex justify-between items-start mb-4'>
                        <div className='flex items-center'>
                            <ProfileImage src={v.feed.user.profileUrl} size={56} />
                            <div className='ml-3'>
                                <div className='font-semibold'>{v.feed.user.nickname}</div>
                                <div className='text-sm text-gray-400'>
                                    {getTime(v.feed.createdAt)}
                                </div>
                            </div>
                        </div>
                        {isAuthor && (
                            <div className='flex gap-2 text-xs text-gray-500'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(v);
                                    }}
                                    className='hover:text-gray-700 transition'
                                >
                                    수정
                                </button>
                                <span>|</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick();
                                    }}
                                    className='hover:text-gray-700 transition'
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className='py-5  whitespace-pre-line'>{v.feed.contents}</div>
                        {v.images.length > 0 && (
                            <div className='flex flex-col gap-3 items-center my-3'>
                                {v.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={`${img.url}`}
                                        alt={img.fileName}
                                        className='h-60 rounded-md object-cover'
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='flex items-center justify-between text-gray-500 text-sm border-t pt-3'>
                        <div className='flex gap-3'>
                            <button
                                disabled={likeLoading}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeToggle();
                                }}
                                className={`transition ${
                                    likeStatus.isLiked
                                        ? 'text-red-500'
                                        : 'text-gray-500 hover:text-red-400'
                                } disabled:opacity-50`}
                            >
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    style={{
                                        color: likeStatus.isLiked ? '#ef4444' : 'inherit',
                                        fill: likeStatus.isLiked ? '#ef4444' : 'none',
                                    }}
                                />{' '}
                                {likeStatus.count}
                            </button>
                            <button
                                style={{ background: '#FFFFFF' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowComments((prev) => !prev);
                                }}
                            >
                                <FontAwesomeIcon icon={faComment} /> {v.commentCount}
                            </button>
                        </div>
                        <div className='flex gap-3'>
                            <button onClick={(e) => e.stopPropagation()}>
                                <FontAwesomeIcon icon={faShareNodes} />
                            </button>
                            <button onClick={(e) => e.stopPropagation()}>
                                <FontAwesomeIcon icon={faExclamation} />
                            </button>
                        </div>
                    </div>

                    {showComments && (
                        <div className='mt-4'>
                            <CommentInput feedId={feedId} />
                            <CommentList feedId={feedId} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FeedInfo;
