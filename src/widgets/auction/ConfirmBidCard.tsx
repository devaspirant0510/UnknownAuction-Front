import React from 'react';
// 'ConfirmedBid' 타입은 승호가 제공한 JSON의 'data' 객체 구조라고 가정할게!
import { ConfirmedBid } from '@entities/auction/model';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

/**
 * 헬퍼 함수: 숫자를 화폐 단위(포인트)로 포맷팅
 * (예: 100000 -> "100,000p")
 */
const formatPrice = (price: number | null | undefined) => {
    if (price == null) return 'N/A'; // 혹시 모를 null 값 처리
    return new Intl.NumberFormat('ko-KR').format(price) + 'p';
};

type Props = {
    data: ConfirmedBid;
    thumbnail: string;
};

const ConfirmBidCard: React.FC<Props> = ({ data, thumbnail }) => {
    const { bidder, auction, biddingLog } = data;

    // 입찰자 프로필 이미지 (샘플 데이터에선 null이었어)
    const profileImageUrl = bidder.profileUrl;

    return (
        // 카드 전체 래퍼 (shadcn/ui Card 컴포넌트)
        <Card className='w-full  p-4 sm:p-6 shadow-sm mt-4'>
            {/* 1. 상단: 축하 메시지 */}
            <div className='flex items-center gap-2.5 border-b pb-4 mb-4'>
                {/* 입찰자 아바타 (shadcn/ui Avatar)
                  이미지 없으면 닉네임 첫 글자 (Fallback) 표시
                */}
                <Avatar className='h-8 w-8'>
                    <AvatarImage src={profileImageUrl || undefined} alt={bidder.nickname} />
                    <AvatarFallback className='bg-orange-100 text-orange-600 font-semibold'>
                        {bidder.nickname.substring(0, 1)}
                    </AvatarFallback>
                </Avatar>
                {/* 스크린샷처럼 텍스트에 주황색 적용! */}
                <p className='text-sm font-medium text-orange-600'>
                    축하합니다! <span className='font-bold'>{bidder.nickname}</span> 님이 최종
                    낙찰자로 선정되었습니다.
                </p>
            </div>

            {/* 2. 하단: 상품 정보 및 가격 */}
            <div className='flex gap-4'>
                {/* 2-1. 상품 이미지 */}
                <div className='w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden flex-shrink-0 bg-gray-100'>
                    <img
                        src={thumbnail}
                        alt={auction.goods.title}
                        className='w-full h-full object-cover'
                    />
                </div>

                {/* 2-2. 상품 상세 (제목, 가격, 버튼) */}
                <div className='flex-1 flex flex-col min-w-0'>
                    {/* 제목 (길어지면 ... 처리) */}
                    <h3 className='font-semibold text-lg truncate' title={auction.goods.title}>
                        {auction.goods.title}
                    </h3>

                    {/* 가격 정보 */}
                    <div className='mt-2 space-y-1'>
                        <div className='flex justify-between text-sm text-muted-foreground'>
                            <span>시작가</span>
                            <span>{formatPrice(auction.startPrice)}</span>
                        </div>
                        {/* 낙찰가는 좀 더 강조! */}
                        <div className='flex justify-between text-base font-bold text-primary'>
                            <span>낙찰가</span>
                            <span className='text-orange-600'>{formatPrice(biddingLog.price)}</span>
                        </div>
                    </div>

                    {/* 입찰 내역 버튼
                      mt-auto: 부모(flex-col)의 남은 공간을 다 차지해서 버튼을 맨 아래로 밀어냄
                      flex justify-end: 버튼을 오른쪽으로 정렬
                    */}
                    <div className='mt-auto pt-2 flex justify-end'>
                        <Button
                            variant='outline'
                            // 스크린샷의 주황색 버튼 느낌을 살리는 커스텀 스타일!
                            className='bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100 hover:text-orange-800'
                        >
                            입찰내역 보기
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ConfirmBidCard;
