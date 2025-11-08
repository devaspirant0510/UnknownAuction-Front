import { useParams } from 'react-router-dom';
import { MainLayout } from '@shared/layout';
import { BackButton } from '@shared/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs.tsx';

// 훅
import { useQueryGetUserById } from '../lib/useQueryGetUserById.ts';
import { useQueryGetUserFeeds } from '../lib/useQueryGetUserFeeds.ts';
import { useQueryGetUserSales } from '../lib/useQueryGetUserSales.ts';
import { useQueryGetUserPurchases } from '../lib/useQueryGetUserPurchases.ts'; // [추가]
import { useAuthUser } from '@shared/hooks/useAuthUser.tsx';
import { AuctionData } from '@entities/auction/model';

// 컴포넌트
import { PublicProfileHeader } from '../ui/PublicProfileHeader.tsx';
import MyFeed from '@/features/profile/ui/MyFeed.tsx';
import MySalesList from '@/features/profile/ui/MySalesList.tsx';
import MyBuysList from '@/features/profile/ui/MyBuysList.tsx'; // [추가]

const PublicProfilePage = () => {
    const { userId } = useParams<{ userId: string }>();
    const [_, authUserId] = useAuthUser();

    // 1. 유저 정보
    const { data: userData, isLoading: isUserLoading, isError: isUserError } =
        useQueryGetUserById(userId);

    // 2. 유저 피드
    const { data: feedsData, isLoading: isFeedsLoading, isError: isFeedsError } =
        useQueryGetUserFeeds(userId);

    // 3. 유저 판매상품
    const { data: salesData, isLoading: isSalesLoading, isError: isSalesError } =
        useQueryGetUserSales(userId);

    // 4. [추가] 유저 구매상품
    const { data: purchasesData, isLoading: isPurchasesLoading, isError: isPurchasesError } =
        useQueryGetUserPurchases(userId);

    const isLoading = isUserLoading || isFeedsLoading || isSalesLoading || isPurchasesLoading; // [수정]
    const isError = isUserError || isFeedsError || isSalesError || isPurchasesError; // [수정]

    const feeds = feedsData?.data || [];
    const sales = salesData?.data || [];
    const purchases = purchasesData?.data || []; // [추가]
    const userProfile = userData?.data;

    const isMe = Number(authUserId) === Number(userId);

    // 판매 목록 헬퍼
    const renderSalesList = (sales: AuctionData[], emptyMessage: string) => {
        if (sales.length === 0) {
            return <div className='py-20 text-center text-gray-500'>{emptyMessage}</div>;
        }
        return (
            <div className='grid grid-cols-4 gap-4'>
                {sales.map((sale) => (
                    <MySalesList key={sale.auction.id} item={sale} />
                ))}
            </div>
        );
    };

    // [추가] 구매 목록 헬퍼
    const renderPurchasesList = (purchases: AuctionData[], emptyMessage: string) => {
        if (purchases.length === 0) {
            return <div className='py-20 text-center text-gray-500'>{emptyMessage}</div>;
        }
        // MyBuysList.tsx 재사용
        return (
            <div className='grid grid-cols-4 gap-4'>
                {purchases.map((purchase) => (
                    <MyBuysList key={purchase.auction.id} item={purchase} />
                ))}
            </div>
        );
    };


    const renderContent = () => {
        if (isLoading) {
            return <div className='py-20 text-center text-gray-500'>로딩 중...</div>;
        }
        if (isError || !userProfile) {
            return <div className='py-20 text-center text-red-500'>프로필을 불러오는데 실패했습니다.</div>;
        }

        const salesCount = sales.length;
        const purchasesCount = purchases.length; // [추가]

        return (
            <>
                <PublicProfileHeader userData={userProfile} isMe={isMe} />

                {/* 2. 콘텐츠 탭 */}
                <Tabs defaultValue='feeds'>
                    {/* [수정] grid-cols-3으로 변경 */}
                    <TabsList className='grid w-full grid-cols-3 mb-6'>
                        <TabsTrigger value='feeds'>
                            게시물 ({userProfile.feedCount})
                        </TabsTrigger>
                        <TabsTrigger value='sales'>
                            판매 상품 ({salesCount})
                        </TabsTrigger>
                        {/* [추가] 구매 상품 탭 */}
                        <TabsTrigger value='purchases'>
                            구매 상품 ({purchasesCount})
                        </TabsTrigger>
                    </TabsList>

                    {/* 게시물 탭 */}
                    <TabsContent value='feeds' className='mt-0'>
                        {feeds.length === 0 ? (
                            <div className='py-20 text-center text-gray-500'>게시물이 없습니다.</div>
                        ) : (
                            <div className='grid grid-cols-3 gap-4'>
                                {feeds.map((feed) => (
                                    <MyFeed key={feed.feed.id} feedData={feed} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* 판매 상품 탭 */}
                    <TabsContent value='sales' className='mt-0'>
                        {isSalesLoading ? (
                            <div className='py-20 text-center text-gray-500'>판매 상품을 불러오는 중...</div>
                        ) : isSalesError ? (
                            <div className='py-20 text-center text-red-500'>판매 상품을 불러오는데 실패했습니다.</div>
                        ) : (
                            renderSalesList(sales, '판매중인 상품이 없습니다.')
                        )}
                    </TabsContent>

                    {/* [추가] 구매 상품 탭 */}
                    <TabsContent value='purchases' className='mt-0'>
                        {isPurchasesLoading ? (
                            <div className='py-20 text-center text-gray-500'>구매 상품을 불러오는 중...</div>
                        ) : isPurchasesError ? (
                            <div className='py-20 text-center text-red-500'>구매 상품을 불러오는데 실패했습니다.</div>
                        ) : (
                            renderPurchasesList(purchases, '구매(낙찰)한 상품이 없습니다.')
                        )}
                    </TabsContent>
                </Tabs>
            </>
        );
    };

    return (
        <MainLayout>
            <div className='container mx-auto px-4 py-8 max-w-4xl'>
                <div className='flex items-center mb-6'>
                    <BackButton />
                </div>
                {renderContent()}
            </div>
        </MainLayout>
    );
};

export default PublicProfilePage;