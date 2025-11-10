import { AppLayout, BaseLayout } from '@shared/layout';
import HotAuctionList from '@/features/main/ui/HotAuctionList.tsx';
import React from 'react';
import HotFeedList from '@/features/feed/ui/HotFeedList.tsx';

type TodoItem = {
    userId: number;
    id: number;
    title: string;
    completed: false;
};
const HomePage = () => {
    return (
        <AppLayout>
            <img src={'img/banner.png'} className={'-mt-52'} />
            <BaseLayout>
                <HotAuctionList />
            </BaseLayout>
            <div className={'h-32'}></div>
            <BaseLayout>
                <HotFeedList />
            </BaseLayout>
            <div className={'h-32'}></div>
            <img src={'/img/eventbanner.png'} />
        </AppLayout>
    );
};
export default HomePage;
