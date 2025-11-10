import React from 'react';
// shadcn 기본 유틸
import { LayoutDashboard, Users, Package, DollarSign, MessageSquare, Folder } from 'lucide-react';

type Props = {
    children: React.ReactNode;
};

const menu = [
    {
        title: '유저관리',
        items: ['전체 유저 조회', '신고내역관리'],
        icon: <Users className='w-4 h-4 mr-2' />,
    },
    {
        title: '피드 관리',
        items: ['전체 피드 조회', '신고내역관리'],
        icon: <LayoutDashboard className='w-4 h-4 mr-2' />,
    },
    {
        title: '상품관리',
        items: ['전체 상품 조회', '블라인드경매', '실시간 경매', '신고내역 관리'],
        icon: <Package className='w-4 h-4 mr-2' />,
    },
    {
        title: '포인트/캐시 관리',
        items: ['포인트 충전내역', '포인트 지급', '캐시 환전 처리'],
        icon: <DollarSign className='w-4 h-4 mr-2' />,
    },
    {
        title: '고객센터 관리',
        items: ['Q&A 게시판 관리', '1대1 문의 관리'],
        icon: <MessageSquare className='w-4 h-4 mr-2' />,
    },
    {
        title: '카테고리 관리',
        items: ['추가', '수정', '삭제'],
        icon: <Folder className='w-4 h-4 mr-2' />,
    },
];
const AdminLayout = ({ children }: Props) => {
    return (
        <div className='flex flex-col h-screen'>
            {/* 헤더 */}
            <header className='h-24 bg-white border-b flex items-center px-6 py-5'>
                <h1 className='text-4xl  font-bold text-uprimary '>UnknownAuction Admin</h1>
            </header>

            {/* 사이드바 + 메인 영역 */}
            <div className='flex flex-1'>
                {/* 사이드바 */}
                <aside className='w-64 bg-gray-900 text-gray-100 p-4'>
                    <h2 className='text-xl font-bold mb-6'>Admin</h2>
                    <nav className='space-y-4'>
                        {menu.map((section) => (
                            <div key={section.title}>
                                <div className='flex items-center text-sm font-semibold mb-2'>
                                    {section.icon}
                                    {section.title}
                                </div>
                                <ul className='ml-6 space-y-1'>
                                    {section.items.map((item) => (
                                        <li
                                            key={item}
                                            className='text-sm text-gray-300 hover:text-white cursor-pointer'
                                        >
                                            • {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* 컨텐츠 */}
                <main className='flex-1 overflow-y-auto p-6 bg-gray-50'>{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
