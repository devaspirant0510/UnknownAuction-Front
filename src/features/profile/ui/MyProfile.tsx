import { useState } from 'react';
import { ProfileImage } from '@shared/ui';
import { ShareProfileModal } from '@/features/profile/ui/ShareProfileModal.tsx';
import { Link } from 'react-router';

interface User {
    nickname: string;
    email: string;
    url: string;
    cash?: number;
    wishListCount?: number;
    biddingCount?: number;
    onEditClick: () => void;
}

const MyProfile = ({
    nickname,
    email,
    url,
    cash,
    wishListCount,
    biddingCount,
    onEditClick,
}: User) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const currentProfileUrl = window.location.href;

    return (
        <aside className='col-span-3 space-y-4 mt-30'>
            <h2
                className='font-semibold'
                style={{ color: '#f26522', fontSize: 24, fontWeight: 'bold' }}
            >
                MY 프로필
            </h2>
            <div className='bg-white rounded-xl shadow border text-center'>
                <div className='py-10'>
                    <div className={'flex justify-center'}>
                        <ProfileImage size={100} src={url} />
                    </div>
                    <div className='font-semibold'>{nickname}</div>
                    <div className='text-sm text-muted-foreground'>{email}</div>
                    <button
                        className='w-2/3 rounded-4xl bg-orange-100 py-2 mt-5'
                        style={{ backgroundColor: '#E3E3E3', color: '#969696' }}
                    >
                        본인인증
                    </button>
                    <div className='space-y-1 mt-10'>
                        <button
                            onClick={onEditClick}
                            className='w-2/3 rounded-4xl py-2'
                            style={{ backgroundColor: '#FFDDCF', color: '#FB8A5B' }}
                        >
                            프로필 수정
                        </button>
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            className='w-2/3 rounded-4xl py-2 mb-10'
                            style={{ backgroundColor: '#FFDDCF', color: '#FB8A5B' }}
                        >
                            프로필 공유
                        </button>
                    </div>
                </div>
                <div className='bg-white rounded-xl text-sm'>
                    <div
                        className='flex justify-between border-2 p-5 text-center items-center'
                        style={{
                            borderColor: '#CBA89A',
                            fontSize: '16px',
                            borderLeft: 'none',
                            borderRight: 'none',
                            borderBottom: 'none',
                        }}
                    >
                        <span style={{ color: '#969696' }}>나의 캐시</span>
                        <span style={{ color: '#F7A17E', fontSize: '24px', fontWeight: 'bold' }}>
                            {cash?.toLocaleString() || 0}
                        </span>
                    </div>
                    <Link to='/profile/interests-view'>
                        <div
                            className='flex justify-between border-2 p-5 text-center items-center cursor-pointer hover:bg-gray-50 transition-colors' // 3. cursor-pointer, hover 효과 추가
                            style={{
                                borderColor: '#CBA89A',
                                fontSize: '16px',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderBottom: 'none',
                            }}
                        >
                            <span style={{ color: '#969696' }}>관심 상품</span>
                            <span
                                style={{ color: '#F7A17E', fontSize: '24px', fontWeight: 'bold' }}
                            >
                                {wishListCount || 0}
                            </span>
                        </div>
                    </Link>
                    <div
                        className='flex justify-between border-2 p-5 text-center items-center'
                        style={{
                            borderColor: '#CBA89A',
                            fontSize: '16px',
                            borderLeft: 'none',
                            borderRight: 'none',
                        }}
                    >
                        <span style={{ color: '#969696' }}>입찰 상품</span>
                        <span style={{ color: '#F7A17E', fontSize: '24px', fontWeight: 'bold' }}>
                            {biddingCount || 0}
                        </span>
                    </div>
                </div>
                <div className='text-center py-5' style={{ color: '#969696', fontSize: '14px' }}>
                    회원탈퇴
                </div>
            </div>

            {isShareModalOpen && (
                <ShareProfileModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    profileUrl={currentProfileUrl}
                />
            )}
        </aside>
    );
};

export default MyProfile;
