import React, { FC } from 'react';
import { FeedWrapper } from '@pages/feed/component/FeedList.tsx';
import { ProfileImage } from '@shared/ui';
import { HeartIcon, MessageSquareIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate 임포트

type Props = {
    feed: FeedWrapper;
};

const HotFeedItem: FC<Props> = ({ feed }) => {
    // 3. 팔로우 관련 훅(useNavigate, useQueryClient 등) 선언 제거
    const navigate = useNavigate();
    const userId = feed.feed.user.id;

    // 4. 프로필 클릭 핸들러
    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/users/${userId}`);
    };

    return (
        <div className={''}>
            <div className={'flex items-center gap-2 my-2 flex-1'}>
                <div className={'flex flex-1 gap-2 items-center'}>
                    {/* 프로필 이미지 (클릭 기능) */}
                    <div onClick={handleProfileClick} className='cursor-pointer'>
                        <ProfileImage size={40} src={feed.feed.user.profileUrl} />
                    </div>

                    <div className={'flex-col flex gap-1'}>
                        {/* 닉네임 (클릭 기능) */}
                        <div
                            onClick={handleProfileClick}
                            className='cursor-pointer hover:underline'
                        >
                            {feed.feed.user.nickname}
                        </div>
                    </div>
                </div>
                <div className={'truncate flex-4'}>{feed.feed.contents}</div>
                <div className={'flex flex-1 justify-evenly'}>
                    <div className={'flex items-center justify-between gap-2'}>
                        <MessageSquareIcon />
                        <span>{feed.commentCount}</span>
                    </div>
                    <div className={'flex items-center justify-between gap-2'}>
                        <HeartIcon />
                        <span>{feed.likeCount}</span>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
};

export default HotFeedItem;
