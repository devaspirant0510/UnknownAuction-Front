import React, { FC, useCallback } from 'react';
import { AuctionData } from '@entities/auction/model';
import { UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

type Props = {
    item: AuctionData;
};
const HotAuctionItem: FC<Props> = ({ item }) => {
    const navigate = useNavigate();

    // 1. 경매 타입 및 가격 변수
    const isBlind = item.auction.auctionType === 'BLIND';
    const displayPrice = item.currentPrice ?? item.auction.startPrice;

    // 2. 경매 아이템 클릭 핸들러
    const onClickItem = useCallback(() => {
        navigate(`/auction/${item.auction.auctionType.toLowerCase()}/${item.auction.id}`);
    }, [item, navigate]); // navigate 의존성 추가

    // 3. [추가] 프로필 클릭 핸들러
    const handleProfileClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation(); // 부모(onClickItem)의 클릭 이벤트 차단
            navigate(`/users/${item.auction.user.id}`); // 프로필 페이지로 이동
        },
        [item.auction.user.id, navigate],
    ); // id, navigate 의존성 추가

    return (
        <div className={'w-full cursor-pointer'} onClick={onClickItem}>
            {' '}
            {/* cursor-pointer 추가 */}
            {/* 1. 이미지 (relative 컨테이너로 변경) */}
            <div className='w-full aspect-square overflow-hidden relative'>
                {' '}
                {/* relative 추가 */}
                {/* [추가] 실시간/블라인드 태그 */}
                <div
                    className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold text-white shadow-md
                        ${isBlind ? 'bg-black/70' : 'bg-red-600/80'}
                    `}
                >
                    {isBlind ? '블라인드' : '실시간'}
                </div>
                {/* --- /추가된 부분 --- */}
                <img
                    className='w-full h-full object-cover rounded-2xl'
                    src={item.images.length > 0 ? item.images[0].url : ''}
                    alt=''
                />
            </div>
            {/* 2. 상품명 */}
            <div className={'truncate w-64'}>
                <div className={'truncate w-full text-[#565656] text-lg'}>
                    {item.auction.goods.title}
                </div>
            </div>
            {/* 3. 가격 (블라인드 처리 및 'P' 단위 적용) */}
            <div className={'font-bold text-lg text-black mt-2'}>
                {isBlind ? (
                    <span>Unknown</span>
                ) : (
                    <span>{displayPrice.toLocaleString('ko-KR')}P</span>
                )}
            </div>
            {/* 4. 조회수 및 입찰 횟수 */}
            <div className={'flex text-xs text-gray-500 mt-1 gap-2 items-center'}>
                <span>조회 {item.auction.viewCount}</span>
                <span className='text-gray-300'>|</span>
                <span>입찰 {item.biddingCount}</span>
            </div>
            {/* 5. [수정] 사용자 정보 (클릭 핸들러 추가) */}
            <div
                className={'mt-2 flex items-center z-10'} // z-10 추가 (클릭 우선순위)
                onClick={handleProfileClick}
            >
                {item.auction.user.profileUrl ? (
                    <img
                        src={item.auction.user.profileUrl}
                        alt={item.auction.user.nickname}
                        className={'w-6 h-6 rounded-full mr-2 object-cover'}
                    />
                ) : (
                    <UserIcon className={'w-6 h-6 text-[#BFA0A0] mr-2'} />
                )}
                <div className='hover:underline'>{item.auction.user.nickname}</div>
            </div>
            {/* --- /수정된 부분 --- */}
        </div>
    );
};

export default HotAuctionItem;
