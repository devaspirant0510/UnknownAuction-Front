// features/profile/ui/FollowUserItem.tsx
import React, { useState } from 'react';
import { FollowUser } from '@entities/user/model';
import { useMutationFollowUser } from '../lib/useMutationFollowUser.ts';
import { useMutationUnfollowUser } from '../lib/useMutationUnfollowUser.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthUser } from '@shared/hooks/useAuthUser.tsx';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@shared/components/ui/dialog.tsx';
import { Button } from '@shared/components/ui/button.tsx';
import { Link } from 'react-router-dom';

interface FollowUserItemProps {
    user: FollowUser;
    type: 'followers' | 'followings';
    authUserId: number;
    onCloseModal: () => void; // [추가] 모달 닫기 함수 prop
}

export const FollowUserItem: React.FC<FollowUserItemProps> = ({
    user,
    type,
    authUserId,
    onCloseModal, // [추가]
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [_, currentAuthUserId] = useAuthUser();

    const followMutation = useMutationFollowUser();
    const unfollowMutation = useMutationUnfollowUser();

    const isLoading = followMutation.isPending || unfollowMutation.isPending;

    // ... (invalidateQueries, handleUnfollow, handleRemoveFollower, handleConfirmUnfollow, handleFollowBack, handleDmClick 함수는 동일) ...
    // 쿼리 무효화 (목록 + 메인 프로필 카운트 갱신)
    const invalidateQueries = () => {
        queryClient.invalidateQueries({
            queryKey: ['api', 'v1', 'profile', authUserId, 'followers'],
        });
        queryClient.invalidateQueries({
            queryKey: ['api', 'v1', 'profile', authUserId, 'followings'],
        });
        queryClient.invalidateQueries({
            queryKey: ['api', 'v1', 'profile', authUserId],
        });
    };

    // '팔로우 취소' (모달 열기)
    const handleUnfollow = () => {
        setIsModalOpen(true);
    };

    // 모달에서 '확인' 클릭
    const handleConfirmUnfollow = () => {
        unfollowMutation.mutate(user.id, {
            onSuccess: () => {
                invalidateQueries();
                setIsModalOpen(false);
            },
        });
    };

    // '맞팔로우' 버튼 클릭
    const handleFollowBack = () => {
        followMutation.mutate(user.id, {
            onSuccess: invalidateQueries,
        });
    };

    // 내 자신은 목록에 표시하지 않음
    if (Number(currentAuthUserId) === user.id) {
        return null;
    }

    return (
        <>
            <div className='flex items-center justify-between py-2 px-4'>
                {/* [수정] Link 컴포넌트로 프로필 영역을 감쌉니다. */}
                <Link
                    to={`/users/${user.id}`} // [수정] 동적 URL
                    onClick={onCloseModal} // [수정] 클릭 시 모달을 닫습니다.
                    className='flex items-center space-x-3 group' // [수정] group 클래스 추가 (hover 효과용)
                >
                    {user.profileUrl ? (
                        <img
                            src={user.profileUrl}
                            alt={`${user.nickname} 프로필`}
                            className='w-10 h-10 rounded-full object-cover'
                        />
                    ) : (
                        <div className='w-10 h-10 bg-gray-300 rounded-full' />
                    )}
                    <span className='group-hover:underline'>{user.nickname}</span>
                </Link>

                {/* --- 버튼 영역 --- */}
                {type === 'followers' ? (
                    // 팔로워 탭 (나를 팔로우하는 사람들)
                    <div className='flex items-center space-x-2'>
                        {user.following ? (
                            <Button
                                variant='secondary'
                                className='bg-gray-200 text-gray-800 px-4 py-1 rounded-md text-sm'
                                onClick={handleUnfollow}
                                disabled={isLoading}
                            >
                                {isLoading ? '...' : '팔로잉'}
                            </Button>
                        ) : (
                            <Button
                                className='bg-orange-500 text-white px-4 py-1 rounded-md text-sm'
                                onClick={handleFollowBack}
                                disabled={isLoading}
                            >
                                {isLoading ? '...' : '맞팔로우'}
                            </Button>
                        )}
                    </div>
                ) : (
                    // 팔로잉 탭 (내가 팔로우하는 사람들)
                    <div className='flex items-center space-x-3'>
                        <Button
                            variant='secondary'
                            className='bg-gray-200 text-gray-800 px-4 py-1 rounded-md text-sm'
                            onClick={handleUnfollow}
                            disabled={isLoading}
                        >
                            {isLoading ? '...' : '팔로잉'}
                        </Button>
                    </div>
                )}
            </div>

            {/* --- 언팔로우 확인 모달 --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className='w-full max-w-[400px]'>
                    {/* ... (모달 내용은 동일) ... */}
                    <DialogHeader>
                        <DialogTitle>팔로우 취소</DialogTitle>
                        <DialogDescription className='pt-4'>
                            <span className='font-semibold'>{user.nickname}</span>님의 팔로우를
                            취소하시겠습니까?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='gap-2 pt-4'>
                        <Button variant='secondary' onClick={() => setIsModalOpen(false)}>
                            닫기
                        </Button>
                        <Button
                            style={{ backgroundColor: '#ED6C37', color: 'white' }}
                            onClick={handleConfirmUnfollow}
                            disabled={unfollowMutation.isPending}
                        >
                            {unfollowMutation.isPending ? '취소 중...' : '팔로우 취소'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
