import React, { FC, useCallback } from 'react';
import { HeartIcon } from 'lucide-react';
import { axiosClient, getServerURL } from '@shared/lib';
import { ApiResult } from '@entities/common';
import Cookies from 'js-cookie';
import { useQueryClient } from '@tanstack/react-query';
import { AuctionInfoData } from '@entities/auction/model';

type Props = {
    isWishListed: boolean;
    auctionId: number;
};
const AuctionWishListButton: FC<Props> = ({ isWishListed, auctionId }) => {
    const queryClient = useQueryClient();
    const onClickWishList = useCallback(async () => {
        console.log(auctionId);
        const result = await axiosClient.patch<ApiResult<boolean>>(
            `${getServerURL()}/api/v1/auction/wishlist/${auctionId}`,
            {},
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token') || ''}`,
                },
            } as any,
        );
        if (result.status === 200) {
            // 성공적으로 위시리스트에 추가/제거됨
            console.log('위시리스트 업데이트 성공:', result.data.data);
            // 위시리스트 상태를 업데이트
            console.log(auctionId);
            queryClient.setQueryData(
                ['api', 'v1', 'auction', Number(auctionId)],
                (prev: ApiResult<AuctionInfoData>) => {
                    const newData = structuredClone(prev);
                    console.log(newData);
                    if (newData.data) {
                        newData.data.isWishListed = true;
                        newData.data.wishListCount++;
                    }
                    return newData;
                },
            );
        } else {
            // 위시리스트 업데이트 실패
            console.error('위시리스트 업데이트 실패:', result.data.message);
        }
    }, [auctionId]);
    const onClickCancelWishList = useCallback(async () => {
        const result = await axiosClient.delete<ApiResult<boolean>>(
            `${getServerURL()}/api/v1/auction/wishlist/${auctionId}`,
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token') || ''}`,
                },
            } as any,
        );
        if (result.status === 200) {
            // 성공적으로 위시리스트에서 제거됨
            console.log('위시리스트 제거 성공:', result.data.data);
            queryClient.setQueryData(
                ['api', 'v1', 'auction', Number(auctionId)],
                (prev: ApiResult<AuctionInfoData>) => {
                    const newData = structuredClone(prev);
                    console.log(newData);
                    if (newData.data) {
                        newData.data.isWishListed = false;
                        newData.data.wishListCount--;
                    }
                    return newData;
                },
            );
        } else {
            // 위시리스트 제거 실패
            console.error('위시리스트 제거 실패:', result.data.message);
        }
    }, [auctionId]);
    return (
        <>
            <button className='bg-white rounded-full p-1 flex items-center justify-center shadow'>
                {isWishListed ? (
                    <HeartIcon
                        color='#e53e3e'
                        size={25}
                        onClick={onClickCancelWishList}
                        className={'fill-[#fc8181]'}
                    />
                ) : (
                    <HeartIcon onClick={onClickWishList} color='#ccc' size={25} />
                )}
            </button>
        </>
    );
};

export default AuctionWishListButton;
