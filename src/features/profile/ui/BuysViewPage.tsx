// features/profile/page/BuysViewPage.tsx

import React from 'react';
import { MainLayout } from '@shared/layout';
import { useQueryGetMyPurchases } from '@/features/profile/lib/useQueryGetMyPurchases.ts';
import MyBuysList from '@/features/profile/ui/MyBuysList.tsx';
import { BackButton } from '@shared/ui';

const BuysViewPage = () => {
    const { data, isLoading, isError } = useQueryGetMyPurchases();

    // [추가] 데이터 유효성 검사 및 최신순 정렬
    const validPurchases = React.useMemo(() => {
        if (!data?.data || !Array.isArray(data.data)) {
            return [];
        }

        // 유효한 데이터(auction 객체가 있는)만 필터링
        const validItems = data.data.filter(
            (item) => typeof item === 'object' && item !== null && item.auction,
        );

        // 최신 구매순 (경매 생성일 기준 내림차순) 정렬
        validItems.sort(
            (a, b) =>
                new Date(b.auction.createdAt).getTime() - new Date(a.auction.createdAt).getTime(),
        );

        return validItems;
    }, [data?.data]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className='py-20 text-center text-gray-500'>구매 목록을 불러오는 중...</div>
            );
        }
        if (isError) {
            return (
                <div className='py-20 text-center text-red-500'>
                    구매 목록을 불러오는데 실패했습니다.
                </div>
            );
        }
        if (validPurchases.length === 0) {
            return <div className='py-20 text-center text-gray-500'>구매 내역이 없습니다.</div>;
        }

        return (
            // [수정] SalesViewPage와 동일하게 고정 4열 그리드로 변경
            <div className='grid grid-cols-4 gap-4'>
                {validPurchases.map((purchase) => (
                    <MyBuysList key={purchase.auction.id} item={purchase} />
                ))}
            </div>
        );
    };

    return (
        <MainLayout>
            <div className='container mx-auto px-4 py-8'>
                <div className='flex items-center mb-6'>
                    <BackButton />
                    <h1 className='text-2xl font-bold ml-4' style={{ color: '#ED6C37' }}>
                        MY 구매 목록
                    </h1>
                </div>
                {renderContent()}
            </div>
        </MainLayout>
    );
};

export default BuysViewPage;
