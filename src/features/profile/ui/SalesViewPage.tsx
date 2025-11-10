// features/profile/page/SalesViewPage.tsx

import { useMemo, useState } from 'react';
import { MainLayout } from '@shared/layout';
import { useQueryGetMySales } from '@/features/profile/lib/useQueryGetMySales.ts';
import MySalesList from '@/features/profile/ui/MySalesList.tsx';
import { BackButton } from '@shared/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs.tsx';
import { AuctionData } from '@entities/auction/model';

const SalesViewPage = () => {
    const { data, isLoading, isError } = useQueryGetMySales();
    const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');

    const { ongoingSales, completedSales } = useMemo(() => {
        if (!data?.data) {
            return { ongoingSales: [], completedSales: [] };
        }

        const now = new Date();
        // [수정] 데이터가 배열인지 확인
        const allSales = Array.isArray(data.data) ? [...data.data] : [];

        // [수정] 데이터가 객체이고 auction 속성이 있는지 필터링
        const validSales = allSales.filter(
            (sale) => typeof sale === 'object' && sale !== null && sale.auction,
        );

        // 유효한 데이터만 정렬
        validSales.sort(
            (a, b) =>
                new Date(b.auction.createdAt).getTime() - new Date(a.auction.createdAt).getTime(),
        );

        const ongoing = validSales.filter((sale) => new Date(sale.auction.endTime) > now);
        const completed = validSales.filter((sale) => new Date(sale.auction.endTime) <= now);

        return { ongoingSales: ongoing, completedSales: completed };
    }, [data?.data]);

    // 판매 목록을 렌더링하는 헬퍼 함수
    const renderSalesList = (sales: AuctionData[], emptyMessage: string) => {
        if (sales.length === 0) {
            return <div className='py-20 text-center text-gray-500'>{emptyMessage}</div>;
        }

        return (
            // [수정] 반응형 그리드 대신, MySales.tsx와 동일한 고정 4열 그리드를 사용합니다.
            <div className='grid grid-cols-4 gap-4'>
                {sales.map((sale) => (
                    <MySalesList key={sale.auction.id} item={sale} />
                ))}
            </div>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className='py-20 text-center text-gray-500'>판매 목록을 불러오는 중...</div>
            );
        }
        if (isError) {
            return (
                <div className='py-20 text-center text-red-500'>
                    판매 목록을 불러오는데 실패했습니다.
                </div>
            );
        }

        return (
            <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as 'ongoing' | 'completed')}
            >
                <TabsList className='grid w-full grid-cols-2 mb-6'>
                    <TabsTrigger value='ongoing'>진행중 ({ongoingSales.length})</TabsTrigger>
                    <TabsTrigger value='completed'>판매완료 ({completedSales.length})</TabsTrigger>
                </TabsList>
                <TabsContent value='ongoing' className='mt-0'>
                    {renderSalesList(ongoingSales, '진행중인 상품이 없습니다.')}
                </TabsContent>
                <TabsContent value='completed' className='mt-0'>
                    {renderSalesList(completedSales, '판매완료된 상품이 없습니다.')}
                </TabsContent>
            </Tabs>
        );
    };

    return (
        <MainLayout>
            <div className='container mx-auto px-4 py-8'>
                <div className='flex items-center mb-6'>
                    <BackButton />
                    <h1 className='text-2xl font-bold ml-4' style={{ color: '#ED6C37' }}>
                        MY 판매 상품
                    </h1>
                </div>
                {renderContent()}
            </div>
        </MainLayout>
    );
};

export default SalesViewPage;
