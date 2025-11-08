import React, { FC } from 'react';
import { Header } from '@widgets/ui';
import Footer from '@widgets/ui/Footer.tsx';
import WebFooter from '@/widgets/ui/WebFooter';

type Props = {
    children: React.ReactNode;
    headerClassName?: string;
    className?: string;
    isFooter?: boolean;
};
const AppLayout: FC<Props> = ({ children, headerClassName, className, isFooter = true }) => {
    return (
        <div className='flex flex-col min-h-screen'>
            <div className='relative z-20'>
                <Header className={headerClassName} />
            </div>

            {/* 본문 영역 — 페이지 전체 스크롤 */}
            <main className={`flex-grow ${className}`}>{children}</main>

            {/* 항상 화면에 고정된 Footer */}
            <div className='fixed bottom-0 left-0 w-full z-50'>
                <Footer />
            </div>

            {/* 일반 WebFooter — 페이지 맨 아래 */}
            {isFooter && (
                <div className='hidden md:block!'>
                    <WebFooter />
                </div>
            )}
        </div>
    );
};

export default AppLayout;
