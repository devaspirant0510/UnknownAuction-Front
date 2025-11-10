import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Menu,
    X,
    ArrowUp,
    User,
    Megaphone,
    MessagesSquare,
    LifeBuoy, // '고객센터' 아이콘으로 추가
} from 'lucide-react';

/**
 * 플로팅 액션 버튼 컴포넌트 (Tailwind CSS 버전)
 */
const FloatingMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    /**
     * 맨 위로 스크롤
     */
    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        closeMenu();
    };

    /**
     * --- 수정된 메뉴 아이템 ---
     * App.tsx 라우팅 정보를 기반으로 경로를 업데이트합니다.
     * '고객센터'와 '공지사항'은 임시 경로를 사용합니다.
     */
    const menuItems = [
        {
            key: 'top',
            type: 'a',
            to: '#',
            icon: <ArrowUp size={20} />,
            text: '맨 위로',
            action: scrollToTop,
        },
        {
            key: 'notice',
            type: 'link',
            to: '/notices',
            icon: <Megaphone size={20} />,
            text: '공지사항',
            action: closeMenu,
        },
        {
            key: 'help',
            type: 'link',
            to: '/help',
            icon: <LifeBuoy size={20} />,
            text: '고객센터',
            action: closeMenu,
        },
        {
            key: 'profile',
            type: 'link',
            to: '/profile',
            icon: <User size={20} />,
            text: '프로필',
            action: closeMenu,
        },
        {
            key: 'dm',
            type: 'link',
            to: '/dm',
            icon: <MessagesSquare size={20} />,
            text: 'DM',
            action: closeMenu,
        },
    ];
    // --- /수정된 메뉴 아이템 ---

    // 각 메뉴 아이템에 대한 클릭 핸들러
    const handleItemClick = (e, item) => {
        // item.action이 있으면 실행 (e.g., scrollToTop)
        if (item.action) {
            item.action(e);
        } else {
            // 없으면 (일반 Link) 그냥 메뉴 닫기
            closeMenu();
        }
    };

    return (
        <div className='fixed bottom-8 right-8 z-50 flex flex-col-reverse items-center'>
            {/* 1. 메인 플로팅 버튼 */}
            <button
                type='button'
                className='flex h-14 w-14 items-center justify-center rounded-full bg-uprimary text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:bg-usecondary'
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-label='메뉴 토글'
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* 2. 메뉴 아이템 리스트 */}
            <div className='flex flex-col items-center mb-4 space-y-2.5'>
                {menuItems.map((item, index) => {
                    // 메뉴가 열릴 땐 아래에서 위로(index * 50ms), 닫힐 땐 위에서 아래로(역순 * 50ms) 딜레이 적용
                    const openDelay = index * 50;
                    const closeDelay = (menuItems.length - index - 1) * 50;

                    return (
                        <div
                            key={item.key}
                            className={`group relative transition-all duration-300 ease-in-out
                ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 invisible'}
              `}
                            style={{ transitionDelay: `${isOpen ? openDelay : closeDelay}ms` }}
                        >
                            {/* 툴팁 */}
                            <span className='absolute right-full top-1/2 z-10 mr-3 w-20 -translate-y-1/2 rounded-md bg-gray-800 py-1.5 text-center text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 invisible group-hover:visible'>
                                {item.text}
                                {/* 툴팁 화살표 (Tailwind border로 구현) */}
                                <div className='absolute left-full top-1/2 h-0 w-0 -translate-y-1/2 border-y-[5px] border-l-[5px] border-y-transparent border-l-gray-800 border-r-transparent' />
                            </span>

                            {/* 메뉴 아이템 버튼 (Link 또는 a) */}
                            {item.type === 'link' ? (
                                <Link
                                    to={item.to}
                                    onClick={(e) => handleItemClick(e, item)}
                                    className='flex h-12 w-12 items-center justify-center rounded-full bg-white text-uprimary shadow-md transition-all duration-200 ease-in-out hover:scale-110 hover:bg-uprimary hover:text-white!'
                                >
                                    {item.icon}
                                </Link>
                            ) : (
                                <a
                                    href={item.to}
                                    onClick={(e) => handleItemClick(e, item)}
                                    className='flex h-12 w-12 items-center justify-center rounded-full bg-white text-uprimary shadow-md transition-all duration-200 ease-in-out hover:scale-110 hover:bg-uprimary hover:text-white!'
                                >
                                    {item.icon}
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FloatingMenu;
