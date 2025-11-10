import { FC } from 'react'; // useEffect, useRef, useState 제거
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment } from '@fortawesome/free-solid-svg-icons'; // faEllipsisVertical 제거
import { FeedWrapper } from '@pages/feed/component/FeedList';
import { useNavigate } from 'react-router-dom';

type Props = {
    feedData: FeedWrapper;
};

const MyFeed: FC<Props> = ({ feedData }) => {
    const navigate = useNavigate();

    const { feed, images, likeCount, commentCount } = feedData;
    const feedId = feed.id;

    // 네비게이션 핸들러
    const handleNavigate = () => {
        navigate(`/FeedInfo/${feedId}`);
    };

    return (
        <div className='flex flex-col'>
            {/* 이미지 영역 */}
            <div className='aspect-square w-full relative overflow-hidden rounded-md bg-gray-100'>
                {images && images.length > 0 ? (
                    <img
                        className='h-full w-full object-cover cursor-pointer'
                        src={`${images[0].url}`}
                        alt='feed'
                        onClick={handleNavigate}
                    />
                ) : (
                    <div
                        className='h-full w-full bg-gray-200 flex items-center justify-center cursor-pointer'
                        onClick={handleNavigate}
                    >
                        <span className='text-gray-500 text-sm'>No Image</span>
                    </div>
                )}

                {/* 메뉴 버튼 제거됨 */}
                {/* 드롭다운 메뉴 제거됨 */}
            </div>

            {/* 텍스트 정보 영역 */}
            <div className='text-left mt-2'>
                <p
                    className='text-[13px] text-black font-semibold text-left pr-1 truncate cursor-pointer'
                    title={feed.contents}
                    onClick={handleNavigate}
                >
                    {feed.contents}
                </p>
                <div className='text-[12px] text-gray-500 flex items-center space-x-3 mt-1'>
                    <div className='flex items-center'>
                        <FontAwesomeIcon icon={faHeart} className='mr-1 text-red-500' />
                        <span>{likeCount}</span>
                    </div>
                    <div className='flex items-center'>
                        <FontAwesomeIcon icon={faComment} className='mr-1' />
                        <span>{commentCount ?? 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyFeed;
