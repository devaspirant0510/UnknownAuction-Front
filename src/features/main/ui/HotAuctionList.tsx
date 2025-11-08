import React from 'react';
import { useQueryGetHotAuction } from '@/features/main/lib';
import HotAuctionItem from '@widgets/auction/HotAuctionItem.tsx';

const HotAuctionList = () => {
    const { isLoading, data, isError, error } = useQueryGetHotAuction();
    if (isLoading) {
        return <>loading</>;
    }
    if (isError) {
        return <>error</>;
    }
    if (!data || !data.data) {
        return <>nodata</>;
    }
    return (
        <div>
            <div className={'text-5xl font-bold text-[#B2B2B2] text-center mt-24'}>
                진행 중인 <span className={'text-uprimary'}>HOT 경매</span>
            </div>
            <div className={'text-xl text-center text-[#F7A17E] my-4'}>HOT BID</div>

            <div className={'flex justify-center gap-16 w-full '}>
                {data.data.map((v, index) => {
                    return (
                        <div className={'flex-1 w-full'} key={index}>
                            <HotAuctionItem item={v} />
                        </div>
                    );
                })}
                {data.data.length < 4 && <div className={'w-full h-full'}></div>}
            </div>
        </div>
    );
};

export default HotAuctionList;
