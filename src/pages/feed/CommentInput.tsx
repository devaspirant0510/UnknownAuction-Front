// components/CommentInput.tsx
import { useState } from 'react';
import { axiosClient, getServerURL, toastSuccess } from '@shared/lib';
import { useQueryClient } from '@tanstack/react-query';

interface CommentInputProps {
    feedId: number | string;
    onCommentPosted?: () => void;
}

const CommentInput = ({ feedId, onCommentPosted }: CommentInputProps) => {
    const [contents, setContents] = useState('');
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!contents.trim()) {
            alert('댓글을 입력하세요.');
            return;
        }

        setIsLoading(true);

        try {
            console.log('asdf');
            const response = await axiosClient.post(
                `${getServerURL()}/api/v1/feed/comment`,
                JSON.stringify({
                    contents,
                    feedId,
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                } as any,
            );

            setContents('');
            toastSuccess('댓글이 등록되었습니다.');
            await queryClient.refetchQueries({
                queryKey: ['api', 'v1', 'feed', 'comment', feedId, 'root'],
            });
            onCommentPosted?.();
        } catch (err: any) {
            console.error('댓글 등록 에러:', err);
            alert(err.response?.data?.message || '댓글 등록에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='mt-4 border-t pt-3 flex items-center gap-2'>
            <input
                type='text'
                placeholder='댓글 작성하기'
                value={contents}
                onChange={(e) => setContents(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 placeholder-gray-400 outline-none focus:ring-1 focus:ring-orange-400'
                onClick={(e) => e.stopPropagation()}
                disabled={isLoading}
            />
            <button
                className='px-2 py-2.5 text-black rounded-md text-sm font-semibold whitespace-nowrap leading-normal bg-transparent'
                onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                }}
                disabled={isLoading}
            >
                {isLoading ? '중...' : '등록'}
            </button>
        </div>
    );
};

export default CommentInput;
