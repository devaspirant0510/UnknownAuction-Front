import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTime } from '@pages/feed/getTime.ts';
import CommentReplyInput from '@pages/feed/CommentReplyInput.tsx';
import { axiosClient, getServerURL, httpFetcher } from '@shared/lib';

interface User {
    nickname: string;
}

interface Comment {
    id: number;
    contents: string;
    user: User;
    createdAt: string;
}

const fetchComments = async (feedId: number): Promise<Comment[]> => {
    try {
        const response = await axiosClient.get(
            `${getServerURL()}/api/v1/feed/comment/${feedId}/root`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data.data || [];
    } catch (error) {
        console.error('댓글 로딩 실패:', error);
        return [];
    }
};

const fetchReplies = async (commentId: number): Promise<Comment[]> => {
    try {
        const response = await axiosClient.get(
            `${getServerURL()}/api/v1/feed/comment/reply/${commentId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data.data || [];
    } catch (error) {
        console.error('답글 로딩 실패:', error);
        return [];
    }
};

const CommentList = ({ feedId }: { feedId: number }) => {
    const { data: comments, isLoading } = useQuery({
        queryKey: ['api', 'v1', 'feed', 'comment', feedId, 'root'],
        queryFn: httpFetcher,
        enabled: !!feedId,
    });

    const [replyInputVisibleMap, setReplyInputVisibleMap] = useState<{
        [key: number]: boolean;
    }>({});
    const [repliesVisibleMap, setRepliesVisibleMap] = useState<{ [key: number]: boolean }>({});

    const toggleReplyInput = (commentId: number) => {
        setReplyInputVisibleMap((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const toggleReplies = async (commentId: number) => {
        setRepliesVisibleMap((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    // ✅ useQuery로 답글도 관리
    const RepliesSection = ({ commentId }: { commentId: number }) => {
        const { data: replies = [] } = useQuery({
            queryKey: ['replies', commentId],
            queryFn: () => fetchReplies(commentId),
            enabled: repliesVisibleMap[commentId],
        });

        if (!repliesVisibleMap[commentId]) return null;

        return (
            <div className='ml-4 mt-3 pt-3 border-t border-gray-200 space-y-2'>
                {replies.length > 0 ? (
                    replies.map((reply) => (
                        <div
                            key={reply.id}
                            className='p-2 bg-white border border-gray-100 rounded-md'
                        >
                            <div className='text-xs font-semibold text-gray-700'>
                                {reply.user?.nickname || '익명'}
                            </div>
                            <div className='text-gray-600 text-sm mt-1'>{reply.contents}</div>
                            <div className='text-xs text-gray-400 mt-1'>
                                {getTime(reply.createdAt)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-xs text-gray-400 py-2'>답글이 없습니다.</div>
                )}
            </div>
        );
    };

    if (isLoading) {
        return <div className='mt-4 text-gray-500'>댓글 로딩 중...</div>;
    }

    return (
        <div className='mt-4 space-y-3'>
            {comments && comments.data.length > 0 ? (
                comments.data.map((comment) => (
                    <div
                        key={comment.id}
                        className='p-3 border border-gray-200 rounded-lg bg-gray-50'
                    >
                        <div className='text-sm font-semibold text-gray-800'>
                            {comment.user?.nickname || '익명'}
                        </div>

                        <div className='text-gray-700 text-sm mt-1'>{comment.contents}</div>

                        <div className='flex items-center gap-3 mt-2'>
                            <div className='text-xs text-gray-400'>
                                {getTime(comment.createdAt)}
                            </div>
                            <button
                                onClick={() => toggleReplyInput(comment.id)}
                                className='text-xs text-gray-600 hover:text-orange-500 transition'
                            >
                                답글
                            </button>
                            <button
                                onClick={() => toggleReplies(comment.id)}
                                className='text-xs text-blue-500 hover:text-blue-700 transition'
                            >
                                {repliesVisibleMap[comment.id] ? '답글 숨기기' : '답글 보기'}
                            </button>
                        </div>

                        {replyInputVisibleMap[comment.id] && (
                            <div className='mt-3'>
                                <CommentReplyInput
                                    feedId={feedId}
                                    commentId={comment.id}
                                    onReplyPosted={() => {
                                        toggleReplyInput(comment.id);
                                    }}
                                />
                            </div>
                        )}

                        <RepliesSection commentId={comment.id} />
                    </div>
                ))
            ) : (
                <div className='text-center text-gray-400 py-4'>댓글이 없습니다.</div>
            )}
        </div>
    );
};

export default CommentList;
