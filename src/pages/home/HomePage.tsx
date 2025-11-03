import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@shared/components/ui/button.tsx';
import { Car } from 'lucide-react';
import { Card } from '@shared/components/ui/card.tsx';
import { Link } from 'react-router';
import { AppLayout, BaseLayout, MainLayout } from '@shared/layout';
import AuthUser from '@/features/user/ui/AuthUser.tsx';
import HotAuctionList from '@/features/main/ui/HotAuctionList.tsx';
import { Row } from '@shared/ui';
import Column from '@shared/ui/grid/Column.tsx';
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
            <img src={'/img/banner.png'} className={'-z-1 -mt-48'} />
            <BaseLayout>
                <HotAuctionList />
            </BaseLayout>
            <img src={'/img/eventbanner.png'} />
            <BaseLayout>
                <HotFeedList />
            </BaseLayout>
        </AppLayout>
    );
};
export default HomePage;
