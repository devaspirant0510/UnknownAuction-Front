import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient, getServerURL, httpFetcher } from '@shared/lib';
import { ApiResult } from '@entities/common';
import { useNavigate } from 'react-router';
import { faComment, faExclamation, faHeart, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTime } from '@pages/feed/getTime.ts';
import CommentInput from '@pages/feed/CommentInput.tsx';
import CommentList from '@pages/feed/CommentList.tsx';
import { ProfileImage } from '@shared/ui';
import { useAuthStore } from '@shared/store/AuthStore.ts';
import { EditModal } from '@pages/feed/component/EditModal.tsx';
import { toast } from 'react-toastify';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/shared/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { FeedListResponse } from '@entities/feed/model';
import { Spinner } from '@shared/components/ui/spinner.tsx';
import { FeedAuctionPromotionCard } from '@/widgets/feed/FeedAuctionPromotionCard';
import { FeedConfirmBidCard } from '@/widgets/feed/FeedConfirmBidCard';

const FeedList = () => {
    const queryClient = useQueryClient();
    const { userAuth } = useAuthStore();
    const navigate = useNavigate();
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const fetchingRef = useRef(false);

    const { isLoading, isError, data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ['api', 'v2', 'feed'],
            initialPageParam: undefined as number | undefined,
            queryFn: async ({ pageParam }) => {
                const cursorQuery = typeof pageParam === 'number' ? `?cursor=${pageParam}` : '';
                return httpFetcher<ApiResult<FeedListResponse[]>>({
                    queryKey: ['api', 'v2', `feed${cursorQuery}`],
                });
            },
            getNextPageParam: (lastPage) => {
                const items = lastPage.data ?? [];
                if (items.length === 0) return undefined;
                const lastId = items[items.length - 1]?.id;
                return typeof lastId === 'number' ? lastId : undefined;
            },
        });

    const [commentVisibleMap, setCommentVisibleMap] = useState<Record<number, boolean>>({});
    const [dynamicCommentCounts, setDynamicCommentCounts] = useState<Record<number, number>>({});
    const [likeStatusMap, setLikeStatusMap] = useState<
        Record<number, { isLiked: boolean; count: number }>
    >({});
    const [likeLoadingMap, setLikeLoadingMap] = useState<Record<number, boolean>>({});
    const [editingFeedId, setEditingFeedId] = useState<number | null>(null);
    const [editingFeedData, setEditingFeedData] = useState<FeedListResponse | null>(null);

    const toggleComment = (feedId: number) => {
        setCommentVisibleMap((prev) => ({ ...prev, [feedId]: !prev[feedId] }));
    };

    // ✅ 자동로딩 IntersectionObserver
    useEffect(() => {
        const loader = loaderRef.current;
        if (!loader) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (
                    target.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage &&
                    !fetchingRef.current
                ) {
                    fetchingRef.current = true;
                    fetchNextPage().finally(() => {
                        fetchingRef.current = false;
                    });
                }
            },
            { rootMargin: '100px', threshold: 0 },
        );

        observer.observe(loader);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // ✅ 좋아요 / 댓글 카운트 초기화
    useEffect(() => {
        if (!data?.pages) return;
        const commentCounts: Record<number, number> = {};
        const likeStatus: Record<number, { isLiked: boolean; count: number }> = {};

        data.pages.forEach((page) => {
            page.data?.forEach((item) => {
                commentCounts[item.id] = item.commentCount;
                likeStatus[item.id] = {
                    isLiked: item.liked ?? false,
                    count: item.likeCount,
                };
            });
        });

        setDynamicCommentCounts(commentCounts);
        setLikeStatusMap(likeStatus);
    }, [data]);

    const handleLikeToggle = async (feedId: number) => {
        const currentStatus = likeStatusMap[feedId];
        if (!currentStatus || likeLoadingMap[feedId]) return;

        setLikeLoadingMap((prev) => ({ ...prev, [feedId]: true }));
        try {
            await axiosClient.patch(`${getServerURL()}/api/v1/feed/${feedId}/like`);
            await queryClient.invalidateQueries({ queryKey: ['api', 'v2', 'feed'] });
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'message' in error
                    ? String((error as { message?: unknown }).message)
                    : undefined;
            toast.error(message || '좋아요 처리 중 오류 발생');
        } finally {
            setLikeLoadingMap((prev) => ({ ...prev, [feedId]: false }));
        }
    };

    const handleEditClick = (feedData: FeedListResponse) => {
        setEditingFeedId(feedData.id);
        setEditingFeedData(feedData);
    };

    const handleDeleteFeed = async (feedId: number) => {
        try {
            await axiosClient.delete(`${getServerURL()}/api/v1/feed/${feedId}`);
            toast('글이 삭제되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['api', 'v2', 'feed'] });
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'message' in error
                    ? String((error as { message?: unknown }).message)
                    : undefined;
            toast.error(message || '삭제 중 오류 발생');
        }
    };

    if (isLoading) return <>loading...</>;
    if (isError) return <>{(error as Error)?.message || 'error'}</>;

    const allFeeds = data?.pages.flatMap((page) => page.data ?? []) ?? [];

    return (
        <div className='flex flex-col items-center gap-2 mt-8'>
            {editingFeedId && editingFeedData && (
                <EditModal
                    feedId={editingFeedId}
                    initialContent={editingFeedData.contents}
                    initialImages={editingFeedData.images.map((img) => ({
                        url: img.url,
                        fileName: String(img.fileId),
                    }))}
                    onClose={() => {
                        setEditingFeedId(null);
                        setEditingFeedData(null);
                    }}
                />
            )}

            {allFeeds.map((v) => {
                const feedId = v.id;
                const isVisible = commentVisibleMap[feedId] ?? false;
                const commentCount = dynamicCommentCounts[feedId] ?? v.commentCount;
                const likeStatus = likeStatusMap[feedId] ?? {
                    isLiked: v.liked,
                    count: v.likeCount,
                };
                const isLikeLoading = likeLoadingMap[feedId] ?? false;
                const isAuthor = userAuth?.id === v.writerId;

                return (
                    <div
                        key={feedId}
                        className='bg-white w-full rounded-xl shadow-md px-6 py-5 mt-2 border border-gray-300'
                    >
                        {/* 상단 작성자 */}
                        <div className='flex items-start justify-between mb-2'>
                            <div className='flex items-center'>
                                <div style={{ cursor: v.writerId ? 'pointer' : 'default' }}>
                                    <ProfileImage
                                        src={v.writerProfileImageUrl}
                                        size={48}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (v.writerId) navigate(`/users/${v.writerId}`);
                                        }}
                                    />
                                </div>
                                <div className='ml-3'>
                                    <div className='font-semibold'>{v.writerName}</div>
                                    <div className='text-sm text-gray-400'>
                                        {getTime(v.createdAt)}
                                    </div>
                                </div>
                            </div>

                            {isAuthor && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className='p-2 rounded-md hover:bg-gray-100 text-gray-600'>
                                            <MoreVertical className='w-5 h-5' />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side='left' align='start'>
                                        <DropdownMenuItem onClick={() => handleEditClick(v)}>
                                            <Pencil className='w-4 h-4 mr-2' /> 수정하기
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                if (window.confirm('이 글을 삭제하시겠습니까?'))
                                                    handleDeleteFeed(feedId);
                                            }}
                                            className='text-red-600'
                                        >
                                            <Trash2 className='w-4 h-4 mr-2' /> 삭제하기
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {/* 본문 */}
                        <div onClick={() => navigate(`/FeedInfo/${feedId}`)}>
                            <div className='text-gray-800 leading-relaxed mb-4 whitespace-pre-line line-clamp-10'>
                                {v.contents}
                            </div>

                            {v.feedAuction && <FeedAuctionPromotionCard auction={v.feedAuction} />}
                            {v.feedConfirmBid && <FeedConfirmBidCard item={v.feedConfirmBid} />}

                            {v.images.length > 0 && (
                                <div className='flex gap-2 overflow-x-auto mb-3'>
                                    {v.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img.url}
                                            alt='feed image'
                                            className='h-60 rounded-md object-cover border border-gray-200'
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 액션 */}
                        <div className='flex items-center justify-between text-gray-500 text-sm border-t pt-3'>
                            <div className='flex gap-3'>
                                <button
                                    onClick={() => handleLikeToggle(feedId)}
                                    disabled={isLikeLoading}
                                    className={`transition ${
                                        likeStatus.isLiked
                                            ? 'text-red-500'
                                            : 'text-gray-500 hover:text-red-400'
                                    } disabled:opacity-50`}
                                >
                                    <FontAwesomeIcon icon={faHeart} /> {likeStatus.count}
                                </button>
                                <button onClick={() => toggleComment(feedId)}>
                                    <FontAwesomeIcon icon={faComment} /> {commentCount}
                                </button>
                            </div>
                            <div className='flex gap-3'>
                                <FontAwesomeIcon icon={faShareNodes} />
                                <FontAwesomeIcon icon={faExclamation} />
                            </div>
                        </div>

                        {isVisible && <CommentList feedId={feedId} />}
                        <div className='mt-4'>
                            <CommentInput feedId={feedId} />
                        </div>
                    </div>
                );
            })}

            <div
                ref={(el) => {
                    loaderRef.current = el;
                }}
                className='h-10 flex justify-center items-center mb-8'
            >
                {isFetchingNextPage && (
                    <div className='flex justify-center mt-2'>
                        <Spinner className='size-8' />
                    </div>
                )}
                {!hasNextPage && allFeeds.length > 0 && (
                    <span className='text-gray-400'>모든 피드를 불러왔어요 🎉</span>
                )}
            </div>
        </div>
    );
};

export default FeedList;
