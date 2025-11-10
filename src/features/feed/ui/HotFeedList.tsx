import React from 'react';
import { useQueryHotFeed } from '@/features/feed/lib/useQueryHotFeed.ts';
import HotFeedItem from '@widgets/feed/HotFeedItem.tsx';
import { Link } from 'react-router-dom'; // 1. react-router-dom에서 Link를 import

const HotFeedList = () => {
    const { isLoading, isError, data } = useQueryHotFeed();
    if (isLoading) {
        return <>loading</>;
    }
    if (isError) {
        return <>error</>;
    }
    if (!data || !data.data) {
        return <>no data</>;
    }
    return (
        <div>
            <div className={'text-5xl font-bold text-[#B2B2B2] text-center '}>
                지금 가장 <span className={'text-uprimary'}>HOT 커뮤니티</span>
            </div>
            <div className={'text-xl text-center text-[#F7A17E] mt-4 mb-20'}>HOT COMMUNITY</div>

            {/* 2. Link 컴포넌트로 "+더보기" 텍스트를 감싸줍니다. */}
            <Link to='/community'>
                <div className={'text-end text-uprimary mb-2 mr-2 cursor-pointer hover:underline'}>
                    +더보기
                </div>
            </Link>
            {/* --- /수정된 부분 --- */}

            <div className={'border-uprimary border-1'} />
            {data.data.map((v, index) => {
                return (
                    <div key={index}>
                        <HotFeedItem feed={v} />
                    </div>
                );
            })}
        </div>
    );
};

export default HotFeedList;
