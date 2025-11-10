import React, { FC } from 'react';
import { Header } from '@widgets/ui';
import { BaseLayout } from '@shared/layout/index.ts';

type Props = {
    children: React.ReactNode;
    isBanner?: boolean;
    className?: string;
    headerClassName?: string;
};
const MainLayout: FC<Props> = ({ children, isBanner, className, headerClassName }) => {
    return (
        <>
            <div className={`relative ${headerClassName}`}>
                {/* 배너 */}
                {/* 헤더 */}
                <div className='relative z-20'>
                    <Header />
                </div>
            </div>
            <BaseLayout className={className}>{children}</BaseLayout>
        </>
    );
};
export default MainLayout;
