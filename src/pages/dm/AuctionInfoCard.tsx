import React from 'react';

type AuctionInfoCardProps = {
    auctionData: any;
    serverUrl?: string;
    isBuyer?: boolean;
    isAuctionSold?: boolean;
    isPurchasing?: boolean;
    onPurchaseConfirm?: () => void;
};

const AuctionInfoCard: React.FC<AuctionInfoCardProps> = ({
    auctionData,
    serverUrl = 'http://localhost:8080',
    isBuyer = false,
    isAuctionSold = false,
    isPurchasing = false,
    onPurchaseConfirm,
}) => {
    if (!auctionData) return null;

    // 데이터 추출
    const auction = auctionData?.data?.auction;
    const images = auctionData?.data?.images;
    const lastBid = auctionData?.data?.lastBiddingLog;

    const category = auction?.category?.name;
    const productName = auction?.goods?.title;
    const price = lastBid?.price || auction?.startPrice;
    const imageUrl = images?.[0]?.url;
    const auctionType = auction?.auctionType; // LIVE 또는 BLIND
    const startTime = auction?.startTime;
    const endTime = auction?.endTime;
    const description = auction?.goods?.description;

    // 이미지 URL 생성
    const fullImageUrl = imageUrl?.startsWith('/') ? `${serverUrl}${imageUrl}` : imageUrl;

    // 날짜 포맷
    const formatDateTime = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    // 가격 포맷
    const formatPrice = (price: number) => {
        return price?.toLocaleString('ko-KR');
    };

    return (
        <div className='mb-6 rounded-2xl border-2 border-orange-300 bg-white shadow-lg overflow-hidden max-w-md'>
            {/* 헤더 */}
            <div className='bg-gradient-to-r from-orange-300 to-orange-400 px-6 py-3'>
                <h3 className='text-lg font-bold text-white'>낙찰 상품</h3>
            </div>

            <div className='p-6 space-y-4'>
                {/* 1. 카테고리 */}
                {category && (
                    <div>
                        <p className='text-xs text-gray-500'>[{category}]</p>
                    </div>
                )}

                {/* 2. 상품 이름 */}
                {productName && (
                    <h4 className='text-lg font-bold text-gray-900 break-words'>{productName}</h4>
                )}

                {/* 3. 낙찰 가격 */}
                {price && (
                    <div className='space-y-1'>
                        <p className='text-sm text-gray-600'>낙찰가</p>
                        <p className='text-3xl font-bold text-orange-500'>
                            {formatPrice(price)}
                            <span className='text-lg ml-1'>p</span>
                        </p>
                    </div>
                )}

                {/* 4. 상품 이미지 */}
                {fullImageUrl && (
                    <div className='rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center h-48'>
                        <img
                            src={fullImageUrl}
                            alt='상품'
                            className='w-full h-full object-cover'
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                {/* 5. 경매 유형 */}
                {auctionType && (
                    <div>
                        <p className='text-sm text-gray-700 mb-3'>경매 유형</p>
                        <div className='flex gap-6'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        auctionType === 'LIVE'
                                            ? 'border-orange-400 bg-orange-100'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    {auctionType === 'LIVE' && (
                                        <div className='w-3 h-3 bg-orange-400 rounded-full'></div>
                                    )}
                                </div>
                                <span className='text-sm text-gray-700'>실시간</span>
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        auctionType === 'BLIND'
                                            ? 'border-orange-400 bg-orange-100'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    {auctionType === 'BLIND' && (
                                        <div className='w-3 h-3 bg-orange-400 rounded-full'></div>
                                    )}
                                </div>
                                <span className='text-sm text-gray-700'>블라인드</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* 6. 경매 기간 */}
                {startTime && endTime && (
                    <div>
                        <p className='text-sm text-gray-700 mb-2'>경매 기간</p>
                        <p className='text-sm text-gray-600'>
                            {formatDateTime(startTime)} ~ {formatDateTime(endTime)}
                        </p>
                    </div>
                )}

                {/* 7. 상품 설명 */}
                {description && (
                    <div className='pt-2'>
                        <p className='text-sm text-gray-700 mb-2'>상품 설명</p>
                        <p className='text-sm text-gray-700 bg-gray-50 p-3 rounded-lg'>
                            {description}
                        </p>
                    </div>
                )}
            </div>

            {/* 구매 확정 버튼 - 구매자이고 아직 판매되지 않았을 때만 표시 */}
            {isBuyer && !isAuctionSold && (
                <div className='px-6 pb-6'>
                    <button
                        onClick={onPurchaseConfirm}
                        disabled={isPurchasing}
                        className='w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition'
                    >
                        {isPurchasing ? '처리 중...' : '구매 확정'}
                    </button>
                </div>
            )}

            {/* 판매 완료 상태 표시 */}
            {isAuctionSold && (
                <div className='px-6 pb-6'>
                    <div className='w-full bg-gray-200 text-gray-700 py-3 rounded-lg text-center font-semibold'>
                        구매 완료
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuctionInfoCard;
