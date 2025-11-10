// profile/ui/MyFeedList.tsx
import { ChevronDown } from 'lucide-react';
import MyFeed from '@/features/profile/ui/MyFeed.tsx';
import { useQueryGetMyFeeds } from '../lib/useQueryGetMyFeeds';
import { useState, useMemo } from 'react'; // useMemo 임포트
import { Button } from '@shared/components/ui/button.tsx';

// DropdownMenu 컴포넌트 임포트
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@shared/components/ui/dropdown-menu.tsx';

// 한 번에 보여줄 아이템 수
const LOAD_COUNT_PER_PAGE = 6;

// 정렬 순서 타입을 정의
type SortOrder = 'desc' | 'asc';

const MyFeedList = () => {
    const { data, isLoading, isError } = useQueryGetMyFeeds();

    // 정렬 순서 상태 ('desc' = 최신순)
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    // 현재까지 보여줄 아이템 수를 관리하는 상태
    const [visibleCount, setVisibleCount] = useState(LOAD_COUNT_PER_PAGE);

    // 더보기 버튼 클릭 핸들러
    const handleLoadMore = () => {
        setVisibleCount((prevCount) => prevCount + LOAD_COUNT_PER_PAGE);
    };

    // 정렬 순서 변경 핸들러
    const handleSortChange = (order: SortOrder) => {
        setSortOrder(order);
        setVisibleCount(LOAD_COUNT_PER_PAGE); // 정렬 변경 시, 페이징 초기화
    };

    // useMemo를 사용해 데이터가 변경되거나 정렬 순서가 변경될 때만 리스트를 재정렬
    const sortedFeeds = useMemo(() => {
        if (!data?.data) return [];

        // 원본 데이터를 복사하여 정렬 (feed.createdAt 기준)
        const sortableArray = [...data.data];

        if (sortOrder === 'desc') {
            // 최신순 (desc): b의 시간이 a의 시간보다 커야 함 (최신)
            sortableArray.sort(
                (a, b) =>
                    new Date(b.feed.createdAt).getTime() - new Date(a.feed.createdAt).getTime(),
            );
        } else {
            // 오래된순 (asc): a의 시간이 b의 시간보다 작아야 함 (과거)
            sortableArray.sort(
                (a, b) =>
                    new Date(a.feed.createdAt).getTime() - new Date(b.feed.createdAt).getTime(),
            );
        }

        return sortableArray;
    }, [data?.data, sortOrder]);

    const renderContent = () => {
        if (isLoading) {
            return <div className='py-10 text-gray-500'>게시물을 불러오는 중...</div>;
        }

        if (isError) {
            return <div className='py-10 text-red-500'>게시물을 불러오는데 실패했습니다.</div>;
        }

        // allFeeds 대신 sortedFeeds 사용
        if (!sortedFeeds || sortedFeeds.length === 0) {
            return <div className='py-10 text-gray-500'>작성한 게시물이 없습니다.</div>;
        }

        // sortedFeeds를 기준으로 slice
        const visibleFeeds = sortedFeeds.slice(0, visibleCount);
        const hasMore = sortedFeeds.length > visibleCount;

        return (
            <>
                {/* grid-cols-3으로 고정 */}
                <div className='grid grid-cols-3 gap-4'>
                    {visibleFeeds.map((feed) => (
                        <MyFeed key={feed.feed.id} feedData={feed} />
                    ))}
                </div>

                {/* 더보기 버튼 */}
                {hasMore && (
                    <div className='mt-6 text-center'>
                        <Button
                            variant='outline'
                            onClick={handleLoadMore}
                            className='px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                        >
                            더보기
                        </Button>
                    </div>
                )}
            </>
        );
    };

    return (
        <section className='bg-white rounded-xl shadow border text-center px-8 py-5'>
            <div className='flex justify-between items-center mb-5'>
                <span
                    className='font-semibold '
                    style={{ fontSize: 24, color: '#ED6C37', fontWeight: 'bold' }}
                >
                    MY 게시물
                </span>

                {/* 드롭다운 메뉴 */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='ghost'
                            className='text-sm text-muted-foreground'
                            style={{ color: '#ED6C37' }}
                        >
                            {sortOrder === 'desc' ? '최신순' : '오래된순'}
                            <ChevronDown size={16} className='ml-1' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleSortChange('desc')}>
                            최신순
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange('asc')}>
                            오래된순
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {renderContent()}
        </section>
    );
};

export default MyFeedList;
