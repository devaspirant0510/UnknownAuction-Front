import { FC, useState } from 'react'; // [추가] useState 임포트
import { ProfileImage } from '@shared/ui';
import { Button } from '@shared/components/ui/button.tsx';
import { UserDto } from '../lib/useQueryGetUserById.ts';
import { useMutationFollowUser } from '../lib/useMutationFollowUser.ts';
import { useMutationUnfollowUser } from '../lib/useMutationUnfollowUser.ts';
// [추가] Dialog 관련 컴포넌트 임포트
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@shared/components/ui/dialog.tsx';

interface Props {
    userData: UserDto;
    isMe: boolean;
}

export const PublicProfileHeader: FC<Props> = ({ userData, isMe }) => {
    // [추가] 언팔로우 확인 모달의 열림/닫힘 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user, followerCount, followingCount, feedCount, following } = userData;

    const followMutation = useMutationFollowUser();
    const unfollowMutation = useMutationUnfollowUser();

    // 로딩 상태 (Mutation이 진행 중일 때)
    const isFollowLoading = followMutation.isPending || unfollowMutation.isPending;

    // [수정] 팔로우/언팔로우 버튼 클릭 핸들러
    const handleFollowToggle = () => {
        if (isFollowLoading || isMe) return;

        if (following) {
            // 이미 팔로우 중이면, 뮤테이션을 바로 실행하는 대신 모달을 엽니다.
            setIsModalOpen(true);
        } else {
            // 팔로우하는 것이면 확인 없이 바로 실행
            followMutation.mutate(user.id);
        }
    };

    // [추가] 모달에서 "팔로우 취소" 버튼을 눌렀을 때 실행될 핸들러
    const handleConfirmUnfollow = () => {
        unfollowMutation.mutate(user.id, {
            onSuccess: () => {
                setIsModalOpen(false); // 성공 시 모달 닫기
            },
        });
    };

    return (
        <>
            {/* 1. 기존 프로필 헤더 UI */}
            <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-12 p-4 border-b mb-8'>
                <div className='flex-shrink-0'>
                    <ProfileImage size={120} src={user.profileUrl ?? undefined} />
                </div>
                <div className='flex flex-col gap-4 items-center sm:items-start'>
                    <div className='flex items-center gap-4'>
                        <h1 className='text-2xl font-bold'>{user.nickname}</h1>

                        {!isMe && (
                            <Button
                                style={{
                                    backgroundColor: following ? '#E0E0E0' : '#ED6C37',
                                    color: following ? '#333333' : 'white',
                                }}
                                onClick={handleFollowToggle} // [수정] 핸들러 변경됨
                                disabled={isFollowLoading}
                            >
                                {isFollowLoading ? '처리 중...' : following ? '팔로잉' : '팔로우'}
                            </Button>
                        )}
                    </div>
                    <div className='flex gap-6 text-sm sm:text-base'>
                        <span>
                            게시물 <span className='font-bold'>{feedCount}</span>
                        </span>
                        <span>
                            팔로워 <span className='font-bold'>{followerCount}</span>
                        </span>
                        <span>
                            팔로잉 <span className='font-bold'>{followingCount}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. [추가] 언팔로우 확인 모달 */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className='w-full max-w-[400px]'>
                    <DialogHeader>
                        <DialogTitle>팔로우 취소</DialogTitle>
                        <DialogDescription className='pt-4'>
                            {/* 유저 닉네임을 넣어 구체적으로 물어봅니다. */}
                            <span className='font-semibold'>{user.nickname}</span>님의 팔로우를
                            취소하시겠습니까?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='gap-2 pt-4'>
                        <Button
                            variant='secondary'
                            onClick={() => setIsModalOpen(false)} // 취소 버튼
                        >
                            닫기
                        </Button>
                        <Button
                            style={{ backgroundColor: '#ED6C37', color: 'white' }}
                            onClick={handleConfirmUnfollow} // 확인 버튼
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
