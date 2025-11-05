import React, { FC, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '@shared/store/AuthStore.ts';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogDescription,
} from '@shared/components/ui/alert-dialog';
import { axiosClient } from '@shared/lib/axiosClient.ts';
import { Button } from '@shared/components/ui/button.tsx';
import UserProfile from '@/features/user/ui/UserProfile.tsx';
import { BellIcon, SearchIcon } from 'lucide-react';
import NotificationPopup from '@/widgets/notification/NotificationPopup.tsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type Props = {
    className?: string;
};

const Header: FC<Props> = ({ className }) => {
    const [query, setQuery] = useState('');
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const { userAuth, setAccessToken, setAuthUser } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 읽지 않은 알림 개수 조회
    const { data: unreadCount = 0, refetch: refetchUnreadCount } = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: async () => {
            if (!userAuth) return 0;
            try {
                const response = await axiosClient.get('/api/v1/notifications/unread-count');
                // [수정] API가 숫자를 바로 반환하므로 response.data를 사용
                return response.data || 0;
            } catch (error) {
                console.error('읽지 않은 알림 개수 조회 실패:', error);
                return 0;
            }
        },
        enabled: !!userAuth, // userAuth가 있을 때만 조회
        refetchInterval: 30000, // 30초마다 갱신
    });

    // 알림 읽음 처리 후 배지 업데이트
    const handleNotificationRead = () => {
        // queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        // refetchUnreadCount() 보다 invalidate가 권장됩니다.
        // unread-count 쿼리를 무효화하여 react-query가 자동으로 refetch하도록 합니다.
        queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    };

    const handleSearch = () => {
        if (query.trim() !== '') {
            console.log('검색어:', query);
            // navigate(`/search?q=${query}`);
        }
    };

    const handleLogout = async () => {
        try {
            navigate('/login');
            await axiosClient.post('/auth/logout');
            setAccessToken(null);
            setAuthUser(null);
            setLogoutDialogOpen(false);
        } catch (e) {
            // 에러 핸들링 필요시 추가
            setLogoutDialogOpen(false);
        }
    };

    return (
        <div className={className}>
            <div className='md:block! hidden rounded-br-[120px] border border-[#eee] shadow-sm bg-white'>
                {/* 로그아웃 모달 */}
                <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                    <AlertDialogContent className='w-[90vw] max-w-sm'>
                        <AlertDialogHeader>
                            <AlertDialogTitle>로그아웃 하시겠습니까?</AlertDialogTitle>
                            <AlertDialogDescription>
                                로그아웃하면 다시 로그인해야 서비스를 이용할 수 있습니다.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className='bg-gray-100 text-gray-700 hover:bg-gray-200'>
                                취소
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                className='bg-[#f26522] text-white hover:bg-[#d3541a]'
                            >
                                로그아웃
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                {/* 상단 작은 네비 */}
                <div className='flex justify-end gap-3 px-8 py-1 text-xs text-gray-600'>
                    <Link to='/help' className='hover:text-gray-800'>
                        고객센터
                    </Link>
                    <span>|</span>
                    {!userAuth ? (
                        <>
                            <Link to='/register' className='hover:text-gray-800'>
                                회원가입
                            </Link>
                            <span>|</span>
                            <Link to='/login' className='hover:text-gray-800'>
                                로그인
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to='/profile' className='hover:text-gray-800'>
                                {userAuth?.nickname}
                                <UserProfile userId={userAuth.id}>
                                    {(user) => {
                                        return (
                                            <>
                                                <span className={'text-[10px]'}>
                                                    (포인트: {user.user.point}p)
                                                </span>
                                            </>
                                        );
                                    }}
                                </UserProfile>
                            </Link>
                            <span>|</span>
                            <button
                                onClick={() => setLogoutDialogOpen(true)}
                                className='hover:text-gray-800'
                            >
                                로그아웃
                            </button>
                        </>
                    )}
                </div>

                {/* 메인 헤더 */}
                <header className='px-[110px] pt-[10px] pb-[20px]'>
                    {/* 로고 */}
                    <div className='text-2xl font-bold'>
                        <Link to='/'>
                            <img src='/img/logo.svg' alt='logo' className='h-[45px]' />
                        </Link>
                    </div>

                    {/* 메뉴, 검색, 아이콘들 */}
                    <div className='flex items-center justify-between mt-2 flex-wrap gap-5 '>
                        {/* 네비게이션 */}
                        <nav className='  text-[#f26522]'>
                            <ul className='flex items-center gap-5'>
                                <li>
                                    <FontAwesomeIcon
                                        icon={faBars}
                                        className='text-[#f26522] text-lg'
                                    />
                                </li>
                                <li>
                                    <Link to='/auction/blind' className='hover:underline'>
                                        블라인드 경매
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/auction/live' className='hover:underline'>
                                        실시간 경매
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/community' className='hover:underline'>
                                        커뮤니티
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/auction/productUpload' className='hover:underline'>
                                        상품판매
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/dm' className='hover:underline'>
                                        채팅
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        <div className='lg:bg-red-400 lg:flex-grow w-0  bg-green-400'></div>
                        <div className='flex items-center border-b-2 border-[#f26522] pb-1 flex-grow ml-auto'>
                            <input
                                type='text'
                                placeholder='검색어를 입력해주세요'
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className='flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 py-1'
                            />
                            <button onClick={handleSearch} className='ml-2 text-[#f26522] text-lg'>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                        </div>

                        {/* 오른쪽 아이콘들 */}
                        <div className='flex items-center gap-10 ml-4'>
                            <Link to='/shop'>
                                <img src='/img/point.svg' alt='cart' className='h-5' />
                            </Link>
                            {/* NotificationPopup으로 교체 */}
                            {userAuth ? (
                                <NotificationPopup
                                    unreadCount={unreadCount}
                                    onMarkAsRead={handleNotificationRead}
                                />
                            ) : (
                                <Link to='/login'>
                                    <img
                                        src='/img/notification.svg'
                                        alt='notification'
                                        className='h-5'
                                    />
                                </Link>
                            )}
                            <Link to='/Profile'>
                                <img src='/img/user.svg' alt='user' className='h-5' />
                            </Link>
                        </div>
                    </div>
                </header>
            </div>
            <div className='md:hidden! bg-white p-4 flex justify-between'>
                <div className='text-2xl font-bold'>
                    <Link to='/'>
                        <img src='/img/logo.svg' alt='logo' className='h-[45px]' />
                    </Link>
                </div>

                {/* 오른쪽 아이콘들 */}
                <div className='flex items-center gap-2'>
                    <SearchIcon className={'text-usecondary'} size={30} />
                    {userAuth ? (
                        <NotificationPopup
                            unreadCount={unreadCount}
                            onMarkAsRead={handleNotificationRead}
                        />
                    ) : (
                        <Link to='/login'>
                            <BellIcon className={'text-usecondary'} size={30} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
