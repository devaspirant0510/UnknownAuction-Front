import React from 'react';
import { useQueryGetMyInterests } from '@/features/profile/lib/useQueryGetMyInterests.ts';
import MySalesList from '@/features/profile/ui/MySalesList.tsx';
import { BackButton } from '@shared/ui';
import {AppLayout} from "@/shared/layout";

const InterestsViewPage = () => {
    // 3. 훅 변경
    const { data, isLoading, isError } = useQueryGetMyInterests();

    // 4. 데이터 정렬 (필요시 BuysViewPage.tsx 참고)
    const validInterests = React.useMemo(() => {
        if (!data?.data || !Array.isArray(data.data)) {
            return [];
        }
        return data.data.filter(item => typeof item === 'object' && item !== null && item.auction)
            .sort((a, b) => new Date(b.auction.createdAt).getTime() - new Date(a.auction.createdAt).getTime());
    }, [data?.data]);

    const renderContent = () => {
        if (isLoading) {
            return <div className='py-20 text-center text-gray-500'>관심 목록을 불러오는 중...</div>;
        }
        if (isError) {
            return <div className='py-20 text-center text-red-500'>목록을 불러오는데 실패했습니다.</div>;
        }
        if (validInterests.length === 0) {
            return <div className='py-20 text-center text-gray-500'>관심 상품이 없습니다.</div>;
        }

        return (
            <div className='grid grid-cols-4 gap-4'>
                {/* 5. MySalesList 컴포넌트로 목록 렌더링 */}
                {validInterests.map((item) => (
                    <MySalesList key={item.auction.id} item={item} />
                ))}
            </div>
        );
    };

    return (
        <AppLayout>
            <div className='container mx-auto px-4 py-8'>
                <div className='flex items-center mb-6'>
                    <BackButton />
                    {/* 6. 타이틀 변경 */}
                    <h1 className='text-2xl font-bold ml-4' style={{ color: '#ED6C37' }}>
                        MY 관심 상품
                    </h1>
                </div>
                {renderContent()}
            </div>
        </AppLayout>
    );
};

export default InterestsViewPage;