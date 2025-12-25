import { MainLayout } from '@shared/layout';
import { AuctionInfo } from '@/features/auction/ui';
import React from 'react';
import { useParams } from 'react-router';
import USperator from '@shared/ui/USperator.tsx';

type Params = {
    id: number;
};
const LiveAuctionInfoPage = () => {
    const { id } = useParams<Params>();
    // useIncreaseAuctionView(id);
    if (!id) {
        return <>존재하지 않는 페이지입니다.</>;
    }
    return (
        <div>
            <MainLayout>{}</MainLayout>
            <AuctionInfo id={id} type={'live'} />
            <USperator data={'다른 경매 상품'} />
            {/*<BaseLayout>*/}
            {/*    <RecommendsGoods id={id} />*/}
            {/*</BaseLayout>*/}
        </div>
    );
};
export default LiveAuctionInfoPage;
