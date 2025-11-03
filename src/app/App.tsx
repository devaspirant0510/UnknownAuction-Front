import './global.css';
import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RQProvider } from '@app/provider';
import { LoadingPage } from '@pages/common';
import PointPage from '@pages/profile/PointPage.tsx';
import { useAuthStore } from '@shared/store/AuthStore.ts';
import { axiosClient } from '@shared/lib';
import { ToastContainer, toast } from 'react-toastify';
import SalesViewPage from '@/features/profile/ui/SalesViewPage';
import BuysViewPage from '@/features/profile/ui/BuysViewPage';
import PublicProfilePage from '@/features/profile/ui/PublicProfilePage';
import { messaging } from '@/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import FloatingMenu from '@/widgets/ui/FloatingMenu';
import CompanyPage from '@pages/info/CompanyPage.tsx';
import TermPage from '@pages/info/TermPage.tsx';
import PrivacyPage from '@pages/info/PrivacyPage.tsx';
import InterestsViewPage from "@/features/profile/ui/InterestsViewPage";

const HomePage = React.lazy(() => import('@pages/home/HomePage.tsx'));
const FeedPage = React.lazy(() => import('@pages/feed/FeedPage.tsx'));
const LoginPage = React.lazy(() => import('@pages/login/LoginPage.tsx'));
const ProfilePage = React.lazy(() => import('@pages/profile/ProfilePage.tsx'));
const LiveAuctionPage = React.lazy(() => import('@pages/auction/realtime/LiveAuctionPage.tsx'));
const LiveAuctionInfoPage = React.lazy(
    () => import('@pages/auction/realtime/LiveAuctionInfoPage.tsx'),
);
const BlindAuctionInfoPage = React.lazy(
    () => import('@pages/auction/blind/BlindAuctionInfoPage.tsx'),
);
const ProductUploadPage = React.lazy(() => import('@pages/ProductUpload/ProductUploadPage.tsx'));
const FeedInfo = React.lazy(() => import('@pages/feed/component/FeedInfo.tsx'));
const RegisterPage = React.lazy(() => import('@pages/register/RegisterPage.tsx'));
const AuctionChatPage = React.lazy(() => import('@pages/auction/chat/AuctionChatPage.tsx'));
const BlindAuctionPage = React.lazy(() => import('@pages/auction/blind/BlindAuctionPage.tsx'));
const LiveAuctionBidHistoryPage = React.lazy(
    () => import('@pages/auction/realtime/LiveAuctionBidHistoryPage.tsx'),
);
const RegisterSnsPage = React.lazy(() => import('@pages/register/RegisterSnsPage.tsx'));
const AdminHomePage = React.lazy(() => import('@pages/admin/home/AdminHomePage.tsx'));
const BlindAuctionChatPage = React.lazy(
    () => import('@pages/auction/chat/BlindAuctionChatPage.tsx'),
);
const ShopPage = React.lazy(() => import('@pages/shop/ShopPage.tsx'));
const DMPage = React.lazy(() => import('@pages/dm/DMPage.tsx'));
const NotFoundPage = React.lazy(() => import('@pages/common/NotFoundPage.tsx'));

const ServerMaintenancePage = React.lazy(() => import('@pages/info/ServerMaintenancePage.tsx'));

function App() {
    const { setAccessToken } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [isMessageListenerAdded, setIsMessageListenerAdded] = useState(false);
    const [isInspection, setInspection] = useState(false);

    useEffect(() => {
        axiosClient
            .post('auth/token')
            .then((r) => {
                setAccessToken(r.data.data);
                if (!messaging) {
                    console.warn('Firebase Messaging is not available');
                    return;
                }

                // 포그라운드 메시지 리스너 설정 (1회만)
                if (!isMessageListenerAdded) {
                    onMessage(messaging, (payload) => {
                        console.log('Foreground message:', payload.notification);
                        toast.info(payload.notification?.body || 'New notification', {
                            position: 'top-right',
                            autoClose: 3000,
                            hideProgressBar: true,
                        });
                    });
                    setIsMessageListenerAdded(true);
                }

                // 알림 권한 요청 및 FCM 토큰 발급
                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted' && messaging) {
                        getToken(messaging, {
                            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                        })
                            .then((currentToken) => {
                                if (currentToken) {
                                    // 백엔드에 FCM 토큰 전송
                                    axiosClient
                                        .post('/auth/v1/fcm-token', { fcmToken: currentToken })
                                        .catch((err) => {
                                            console.error('FCM 토큰 전송 실패:', err);
                                        });
                                }
                            })
                            .catch((err) => {
                                console.error('FCM 토큰 가져오기 실패:', err);
                            });
                    }
                });
            })
            .catch((e) => {
                if (e.message === 'Network Error') {
                    setInspection(true);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <>loading</>;
    }
    if (isInspection) {
        return <ServerMaintenancePage />;
    }

    return (
        <RQProvider>
            <BrowserRouter>
                <Suspense fallback={<LoadingPage />}>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/community' element={<FeedPage />} />
                        <Route path='/Login' element={<LoginPage />} />
                        <Route path='/auction/live' element={<LiveAuctionPage />} />
                        <Route path='/auction/live/:id' element={<LiveAuctionInfoPage />} />
                        <Route path='/auction/blind' element={<BlindAuctionPage />} />
                        <Route path='/auction/blind/:id' element={<BlindAuctionInfoPage />} />
                        <Route path='/profile' element={<ProfilePage />} />
                        <Route path='/profile/point' element={<PointPage />} />
                        <Route path='/profile/sales-view' element={<SalesViewPage />} />
                        <Route path='/users/:userId' element={<PublicProfilePage />} />
                        <Route path='/profile/buys-view' element={<BuysViewPage />} />
                        <Route path='/auction/productUpload' element={<ProductUploadPage />} />
                        <Route path='/auction/chat/:id' element={<AuctionChatPage />} />
                        <Route path='/auction/blind/chat/:id' element={<BlindAuctionChatPage />} />
                        <Route path='/FeedInfo/:id' element={<FeedInfo />} />
                        <Route path='/register' element={<RegisterPage />} />
                        <Route path='/register/sns' element={<RegisterSnsPage />} />
                        <Route
                            path='/auction/live/:id/bid-history'
                            element={<LiveAuctionBidHistoryPage />}
                        />
                        <Route path='/admin/home' element={<AdminHomePage />} />
                        <Route path='/shop' element={<ShopPage />} />
                        <Route path='/dm' element={<DMPage />} />
                        <Route path='*' element={<NotFoundPage />} />
                        <Route path={'/company'} element={<CompanyPage />} />
                        <Route path={'/terms'} element={<TermPage />} />
                        <Route path={'/privacy'} element={<PrivacyPage />} />
                        <Route path='/profile/interests-view' element={<InterestsViewPage />} />
                    </Routes>
                    <FloatingMenu />
                    <ToastContainer hideProgressBar={true} autoClose={2000} />
                </Suspense>
            </BrowserRouter>
        </RQProvider>
    );
}

export default App;
