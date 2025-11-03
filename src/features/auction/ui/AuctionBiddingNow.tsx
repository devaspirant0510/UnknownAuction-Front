import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import { AuctionInfoData } from '@entities/auction/model';
import { Button } from '@shared/components/ui/button.tsx';
import StompClient from '@/features/auction/ui/StompClient.tsx';
import Stomp from 'stompjs';
import { useAuthUser } from '@shared/hooks/useAuthUser.tsx';
import { Input } from '@shared/components/ui/input.tsx';
import BiddingDialog from '@widgets/auction/dialog/BiddingDialog.tsx';

type Props = {
    data: AuctionInfoData;
};
const AuctionBiddingNow: FC<Props> = ({ data }) => {
    const [userNickname, userId] = useAuthUser();
    const [price, setPrice] = useState<string>('');
    const onChangePrice = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setPrice(Number(e.target.value.replace(/,/g, '')).toLocaleString());
    }, []);
    const onClickBuyNow = useCallback(
        (data: AuctionInfoData, client: Stomp) => {
            const jsondata = {
                nickname: userNickname,
                userId: userId,
                bid: {
                    price: Number(price.replace(/,/g, '')),
                    prevPrice: data.lastBiddingLog.price,
                },
            };
            client.publish({
                destination: '/app/chat/send/' + data.auction.id,
                body: JSON.stringify(jsondata),
            });
        },
        [price, userNickname, userId],
    );
    if (data.auction.auctionStatus === 'ENDED' || new Date(data.auction.endTime) < new Date()) {
        const finalPrice = data.lastBiddingLog
            ? data.lastBiddingLog.price.toLocaleString()
            : data.auction.startPrice.toLocaleString(); // 낙찰 기록이 없으면 시작가

        return (
            // BiddingDialog는 팝업을 띄우는 역할 같아서,
            // 여기서는 팝업 없이 비활성화된 UI만 보여주기 위해 StompClient와 BiddingDialog를 뺐어.
            // 만약 '종료' 상태도 다이얼로그 안에서 보여줘야 한다면 <BiddingDialog>로 감싸주면 돼!
            <section className={'flex flex-col bg-ubackground1 p-4'}>
                {/* 1. 제목 변경 */}
                <div className={'text-xl font-bold mb-1'}>경매 종료</div>
                <div className={'text-usecondary mb-2 text-sm'}>이 경매는 종료되었습니다.</div>

                {/* 2. 현재가 -> 최종가 변경 */}
                <div className={'flex justify-between mb-2'}>
                    <div className={'text-usecondary'}>최종가 : {finalPrice}p</div>
                    {/* 3. 낙찰자 정보 (있다면) 표시 */}
                    {data.lastBiddingLog?.bidder.nickname && (
                        <div className={'text-usecondary font-bold'}>
                            낙찰자 : {data.lastBiddingLog.bidder.nickname}
                        </div>
                    )}
                </div>

                {/* 4. 입력창 UI를 비활성화된 '최종 가격' 표시창으로 변경 */}
                <div
                    className={
                        'rounded-full bg-ubackground2 flex justify-between items-center opacity-70' // 비활성화 느낌을 위해 opacity 추가!
                    }
                >
                    <div
                        className={
                            'bg-usecondary rounded-full text-white py-2 px-6 font-bold whitespace-nowrap'
                        }
                    >
                        최종 가격
                    </div>
                    <div className={'flex items-center w-full'}>
                        {/* Input 대신 그냥 div로 가격 표시 */}
                        <div className='w-full bg-transparent text-right text-xl font-bold text-usecondary focus:outline-none pr-2'>
                            {finalPrice}
                        </div>
                        <div className={'text-xl font-bold text-uprimary pr-4'}>p</div>
                    </div>
                </div>

                {/* 5. 버튼 비활성화 및 텍스트 변경 */}
                <Button
                    className={'bg-gray-500 py-6 text-xl mt-4 cursor-not-allowed'} // 회색 배경 + 커서 변경
                    disabled
                >
                    종료된 경매입니다
                </Button>
            </section>
        );
    }
    return (
        <StompClient auctionId={data.auction.id}>
            {(client) => {
                return (
                    <BiddingDialog client={client}>
                        <section className={'flex flex-col bg-ubackground1 p-4'}>
                            <div>바로 입찰하기</div>
                            <div className={'flex justify-between mb-2'}>
                                <div className={'text-usecondary'}>
                                    현재가 :
                                    {data.lastBiddingLog
                                        ? data.lastBiddingLog.price.toLocaleString()
                                        : data.auction.startPrice.toLocaleString()}
                                    p
                                </div>
                                <div className={'text-usecondary'}>
                                    입찰단위 : {data.auction.bidUnit}
                                </div>
                            </div>
                            <div
                                className={
                                    'rounded-full bg-ubackground2 flex justify-between items-center'
                                }
                            >
                                <div
                                    className={
                                        'bg-usecondary rounded-full text-white py-2 px-6 font-bold whitespace-nowrap'
                                    }
                                >
                                    입찰 가격
                                </div>
                                <div className={'flex items-center w-full'}>
                                    <Input
                                        type='text'
                                        className='w-full bg-transparent text-right text-xl font-bold text-usecondary focus:outline-none pr-2 no-spinner'
                                        disabled
                                        placeholder='가격을 입력하세요'
                                    />
                                    <div className={'text-xl font-bold text-uprimary pr-4'}>p</div>
                                </div>
                            </div>
                            <Button className={'bg-uprimary py-6 text-xl mt-4'}>입찰하기</Button>
                        </section>
                    </BiddingDialog>
                );
            }}
        </StompClient>
    );
};

export default AuctionBiddingNow;
