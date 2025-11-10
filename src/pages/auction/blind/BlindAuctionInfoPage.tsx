import React from 'react';
import { useParams } from 'react-router';
import { AuctionInfo, RecommendsGoods } from '@/features/auction/ui';
import { BaseLayout, MainLayout } from '@shared/layout';
import { useIncreaseAuctionView } from '@/features/auction/hooks';
import USperator from '@shared/ui/USperator.tsx';

type Params = {
    id: number;
};
const BlindAuctionInfoPage = () => {
    const { id } = useParams<Params>();
    if (!id) {
        return <>error</>;
    }
    useIncreaseAuctionView(id);
    return (
        <div>
            <MainLayout>{}</MainLayout>
            <AuctionInfo id={id} type={'blind'} />
            <USperator data={'다른 경매 상품'} />
            <BaseLayout>
                <RecommendsGoods id={id} />
            </BaseLayout>
        </div>
    );
};

export default BlindAuctionInfoPage;
