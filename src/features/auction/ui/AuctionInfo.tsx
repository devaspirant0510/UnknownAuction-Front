import React, { FC, useCallback, useEffect, useState } from 'react';
import { useQueryGetAuctionById } from '@/features/auction/lib';
import { Badge } from '@shared/components/ui/badge.tsx';
import AuctionImageCarousel from '@widgets/auction/AuctionImageCarousel.tsx';
import UserProfile from '@/features/user/ui/UserProfile.tsx';
import SellerCard from '@widgets/user/SellerCard.tsx';
import { Button } from '@shared/components/ui/button.tsx';
import { Link, useNavigate } from 'react-router';
import { axiosClient, DateUtil, toastError } from '@shared/lib';
import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';
import { ChartLine } from 'lucide-react';
import AuctionInfoStatus from '@widgets/auction/AuctionInfoStatus.tsx';
import AuctionBiddingNow from '@/features/auction/ui/AuctionBiddingNow.tsx';
import { useMutation } from '@tanstack/react-query';
import FetchAccountStatus from '@/features/profile/ui/FetchAccountStatus.tsx';
import { ProfileImage } from '@shared/ui';
import { BaseLayout } from '@shared/layout';
import { toast } from 'react-toastify';

type Props = {
    id: number;
    type: 'blind' | 'live';
};

const AuctionInfo: FC<Props> = ({ id, type }) => {
    const { isLoading, isError, error, data } = useQueryGetAuctionById(id);
    const navigate = useNavigate();
    // POST 요청 mutation
    const { isPending, mutate } = useMutation({
        mutationFn: async () => {
            return axiosClient.post('api/v1/auction/participate', {
                auctionId: id,
            });
        },
        onSuccess: () => {
            if (type === 'blind') {
                navigate(`/auction/blind/chat/${id}`);
            } else {
                navigate(`/auction/chat/${id}`);
            }
        },
        onError: (error) => {
            console.error('경매 참여 실패', error);
            if (error.status === 401) {
                toast('로그인 후 이용해주세요', { type: 'error' });
                navigate('/login');
            } else {
                if (type === 'blind') {
                    navigate(`/auction/blind/chat/${id}`);
                } else {
                    navigate(`/auction/chat/${id}`);
                }
            }
        },
    });

    const onClickAuctionChat = useCallback(() => {
        mutate();
    }, [mutate]);
    // 남은 시간 상태 및 실시간 갱신
    const [remainTime, setRemainTime] = useState('');
    // 경매 종료 여부
    const isEnded = data && data.data && new Date(data.data.auction.endTime).getTime() < Date.now();
    useEffect(() => {
        if (!data || !data.data) return;
        if (data.data.auction.auctionType !== type.toUpperCase()) {
            navigate('/');
            toast('잘못된 접근입니다.', { type: 'error' });
            return;
        }
        const endTime = data.data.auction.endTime;
        let interval: NodeJS.Timeout | null = null;
        const updateRemain = () => {
            const remain = DateUtil.timeUntilDetail(endTime);
            setRemainTime(remain);
            // 1일 이하면 초단위, 1일 초과면 interval 해제
            if (!/\d+일/.test(remain)) {
                if (!interval) {
                    interval = setInterval(updateRemain, 1000);
                }
            } else {
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
            }
        };
        updateRemain();
        // 1일 이하로 진입하면 1초마다 갱신
        if (!/\d+일/.test(DateUtil.timeUntilDetail(endTime))) {
            interval = setInterval(updateRemain, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [data]);
    const handleBidHistory = (endTimeData: string) => {
        if (type === 'live') {
            navigate(`/auction/live/${id}/bid-history`);
            return;
        }

        if (type === 'blind') {
            const endTime = new Date(endTimeData);
            const now = new Date();

            if (endTime > now) {
                toastError('블라인드 경매는 종료 후에만 볼 수 있어요!');
                return;
            }

            navigate(`/auction/live/${id}/bid-history`);
        }
    };
    if (isLoading) {
        return <>loading</>;
    }
    if (isError) {
        return <>error</>;
    }
    if (!data || !data.data) {
        return <>no data</>;
    }
    if (isPending) {
        return <>참여하는중</>;
    }
    return (
        <>
            <BaseLayout>
                <div className={'flex gap-2'}>
                    <Badge className={'bg-[var(--uprimary)] text-white'}>
                        카테고리 - {data.data.auction.category.name}
                        {/*{data.data.goods.category}*/}
                    </Badge>
                    <div>경매번호 {data.data.auction.id}</div>
                </div>
                <div className={'mt-4 text-2xl font-bold flex justify-between'}>
                    <div>{data.data.auction.goods.title}</div>
                    <Button onClick={() => handleBidHistory(data?.data?.auction.endTime ?? '')}>
                        <ChartLine />
                        거래 내역 상세보기
                    </Button>
                </div>
                <div className={'text-[#E36E3E]'}>
                    경매 기간 :
                    {DateUtil.convertDateFormat(
                        data.data.auction.startTime,
                        'yyyy년MM월dd일 hh시mm분',
                    )}{' '}
                    ~{' '}
                    {DateUtil.convertDateFormat(
                        data.data.auction.endTime,
                        'yyyy년MM월dd일 hh시mm분',
                    )}
                </div>
                <AuctionImageCarousel
                    images={data.data.images}
                    isWishListed={data.data.isWishListed}
                />
            </BaseLayout>
            <section className={'flex bg-ubackground1 p-4'}>
                <article className={'flex flex-col flex-3'}>
                    <Badge className={'bg-[var(--uprimary)] text-white mb-1'}>판매자</Badge>
                    <FetchAccountStatus accountId={data.data.auction.user.id}>
                        {(data) => {
                            console.log(data);
                            return (
                                <div className={'flex'}>
                                    <ProfileImage size={60} src={data.profileUrl} />
                                    <div className={'ml-2'}>
                                        <div>{data.nickname}</div>
                                        <div>
                                            입찰 {data.biddingCount} | 판매 {data.sellCount} | 리뷰{' '}
                                            {data.reviewCount ?? 0}
                                        </div>
                                        <div>
                                            팔로워 {data.followerCount} | 팔로잉{' '}
                                            {data.followingCount}
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    </FetchAccountStatus>
                    <div className={'flex flex-col mt-2'}>
                        <Badge className={'bg-[var(--uprimary)] text-white mb-1'}>내용</Badge>
                        <p className={'whitespace-pre-wrap'}>
                            {data.data.auction.goods.description}
                        </p>
                    </div>
                </article>
                <div className={'w-24'}></div>
                <article className={'flex-2'}>
                    <div> 현재 판매 가격</div>
                    {type === 'live' ? (
                        <div className={'text-uprimary font-bold text-4xl'}>
                            {data.data.lastBiddingLog
                                ? data.data.lastBiddingLog.price.toLocaleString()
                                : data.data.auction.startPrice.toLocaleString()}
                            p
                        </div>
                    ) : (
                        <div className={'text-uprimary font-bold text-4xl'}>Unknown</div>
                    )}

                    <button
                        onClick={onClickAuctionChat}
                        className={
                            'bg-uprimary p-4 rounded-xl border-2 border-usecondary w-full mt-4 ' +
                            (isEnded ? ' opacity-60 cursor-not-allowed' : '')
                        }
                        disabled={isEnded}
                    >
                        <div>
                            <div className={'text-xl text-white'}>
                                {isEnded ? '마감된 경매' : '채팅방 참여하기'}
                            </div>
                            <div className={'text-white'}>
                                {isEnded
                                    ? '경매가 마감되었습니다.'
                                    : remainTime ||
                                      DateUtil.timeUntilDetail(data.data.auction.endTime)}
                            </div>
                        </div>
                    </button>
                    <AuctionInfoStatus data={data.data} />
                </article>
            </section>
            <AuctionBiddingNow data={data.data} />
        </>
    );
};

export default AuctionInfo;
