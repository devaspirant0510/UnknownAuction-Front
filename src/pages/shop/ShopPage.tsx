import React, { useState } from 'react';
import {
    CreditCard,
    Phone,
    Banknote,
    Wallet,
    ShoppingBag,
    Plus,
    ArrowRight,
    RotateCcw,
    Zap,
} from 'lucide-react';
import { AppLayout, MainLayout } from '@shared/layout';
import ShopPayButton from '@/features/shop/ui/ShopPayButton.tsx';
import { getPaymentConfig } from '@/features/shop/lib/getPaymentConfig.ts';
import AuthUser from '@/features/user/ui/AuthUser.tsx';
import { useQuery } from '@tanstack/react-query';
import { useAuthUser } from '@shared/hooks/useAuthUser.tsx';
import { httpFetcher } from '@shared/lib';
import { ApiResult } from '@entities/common';
import { LoadingPage } from '@pages/common';
import LoginPage from "@/pages/login/LoginPage";
import {Link} from "react-router";

// 결제 수단 아이콘 매핑
const paymentMethodIcons = {
    간편결제: <Wallet className='h-6 w-6' />,
    신용카드: <CreditCard className='h-6 w-6' />,
    휴대폰결제: <Phone className='h-6 w-6' />,
    무통장입금: <Banknote className='h-6 w-6' />,
};

// 결제 금액 옵션 데이터
const paymentOptions = [
    { value: '5000', label: '5,000 포인트', price: '5,100 원' },
    { value: '10000', label: '10,000 포인트', price: '10,200 원' },
    { value: '50000', label: '50,000 포인트', price: '51,000 원' },
    { value: '100000', label: '100,000 포인트', price: '102,000 원' },
    { value: '500000', label: '500,000 포인트', price: '510,000 원' },
    { value: '1000000', label: '1,000,000 포인트', price: '1,020,000 원' },
];

const PointRechargePage = () => {
    const [selectedAmount, setSelectedAmount] = useState('100000');
    const [selectedMethod, setSelectedMethod] = useState('간편결제');
    const [agreedTerms, setAgreedTerms] = useState(false);

    const [_, id] = useAuthUser();
    const {
        isLoading,
        data: profileData,
        isError,
        error
    } = useQuery({
        queryKey: ['api', 'v1', 'profile', id],
        queryFn: httpFetcher<ApiResult<any>>,
        enabled: !!id,
    });

    // 선택된 옵션/가격 계산 (렌더 시 계산)
    const selectedOption = paymentOptions.find((option) => option.value === selectedAmount);
    const actualPrice = selectedOption ? parseInt(selectedOption.price.replace(/[^0-9]/g, '')) : 0;
    const paymentConfig = getPaymentConfig(selectedMethod);

    if (isLoading) {
        return <LoadingPage />;
    }

    if (isError) {
        console.error("포인트 페이지 프로필 로딩 오류:", error);
        return (
            <AppLayout>
                <div>데이터를 불러오는 데 실패했습니다.</div>
            </AppLayout>
        );
    }

    if (!profileData || !profileData.data) {
        return (
            <LoginPage />
        );
    }

    const { user } = profileData.data;
    const currentPoints = user.point;
    const nickname = user.nickname;

    return (
        <AppLayout>
            <AuthUser>
                <div className='min-h-screen bg-gray-50 p-4'>
                    <div className='max-w-7xl mx-auto'>
                        {/* 헤더 */}
                        <div className='mb-8'>
                            <p className='text-gray-500 text-sm mb-2'>Auction Point</p>
                            <h1 className='text-4xl font-bold text-orange-500 mb-4'>
                                포인트 충전하기
                            </h1>
                        </div>

                        <div className='grid lg:grid-cols-2 gap-8'>
                            {/* 왼쪽: 포인트 현황 */}
                            <div className='space-y-6'>
                                <div className='mb-6'>
                                    <p className='text-gray-600 text-sm'>
                                        <span className='font-semibold'>{nickname}</span> 님의 보유 포인트
                                        내역
                                    </p>
                                </div>

                                {/* 포인트 카드 */}
                                <div className='bg-gradient-to-br from-orange-400 to-orange-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden'>
                                    <div className='absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16'></div>
                                    <div className='absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12'></div>

                                    <div className='space-y-6'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-lg font-medium opacity-90'>
                                                총 보유 포인트
                                            </span>
                                            <span className='text-3xl font-bold'>
                                                {currentPoints.toLocaleString()} <span className='text-xl'>p</span>
                                            </span>
                                        </div>

                                        <div className='h-px bg-white opacity-30'></div>

                                        <div className='flex justify-between items-center'>
                                            <span className='text-lg font-medium opacity-90'>
                                                + 충전 포인트
                                            </span>
                                            <span className='text-3xl font-bold'>
                                                {Number(selectedAmount).toLocaleString()}
                                                <span className='text-xl'>p</span>
                                            </span>
                                        </div>

                                        <div className='h-px bg-white opacity-30'></div>

                                        <div className='flex justify-between items-center'>
                                            <span className='text-xl font-semibold'>
                                                충전 후 포인트
                                            </span>
                                            <span className='text-4xl font-extrabold'>
                                                {(currentPoints + Number(selectedAmount)).toLocaleString()}
                                                <span className='text-2xl'>p</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className='flex items-center mt-6 text-sm opacity-80 cursor-pointer hover:opacity-100 transition-opacity'>
                                        <ShoppingBag className='h-4 w-4 mr-2' />
                                        <Link to={'/profile/point'}>
                                            <span>이용내역</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* 포인트 관리 옵션들 */}
                                <div className='grid grid-cols-4 gap-4'>
                                    <div className='flex flex-col items-center p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow'>
                                        <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2'>
                                            <Plus className='h-6 w-6 text-orange-500' />
                                        </div>
                                        <span className='text-sm font-medium text-gray-700'>
                                            즉시 충전
                                        </span>
                                    </div>
                                    <div className='flex flex-col items-center p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow'>
                                        <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2'>
                                            <RotateCcw className='h-6 w-6 text-orange-500' />
                                        </div>
                                        <span className='text-sm font-medium text-gray-700'>
                                            자동 충전
                                        </span>
                                    </div>
                                    <div className='flex flex-col items-center p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow'>
                                        <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2'>
                                            <ArrowRight className='h-6 w-6 text-orange-500' />
                                        </div>
                                        <span className='text-sm font-medium text-gray-700'>
                                            포인트 선물
                                        </span>
                                    </div>
                                    <div className='flex flex-col items-center p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow'>
                                        <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2'>
                                            <Zap className='h-6 w-6 text-orange-500' />
                                        </div>
                                        <span className='text-sm font-medium text-gray-700'>
                                            환불
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 오른쪽: 결제 옵션 */}
                            <div className='bg-white rounded-2xl shadow-lg p-6 h-fit'>
                                <div className='mb-6'>
                                    <h2 className='text-xl font-bold text-gray-800 mb-2'>
                                        결제금액
                                    </h2>
                                </div>

                                {/* 금액 선택 */}
                                <div className='space-y-2 mb-8'>
                                    {paymentOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                                                selectedAmount === option.value
                                                    ? 'bg-orange-50 border-2 border-orange-500'
                                                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                            }`}
                                        >
                                            <div className='flex items-center'>
                                                <input
                                                    type='radio'
                                                    name='amount'
                                                    value={option.value}
                                                    checked={selectedAmount === option.value}
                                                    onChange={(e) =>
                                                        setSelectedAmount(e.target.value)
                                                    }
                                                    className='sr-only'
                                                />
                                                <div
                                                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                                        selectedAmount === option.value
                                                            ? 'border-orange-500'
                                                            : 'border-gray-300'
                                                    }`}
                                                >
                                                    {selectedAmount === option.value && (
                                                        <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                                                    )}
                                                </div>
                                                <span className='font-medium text-gray-700'>
                                                    {option.label}
                                                </span>
                                            </div>
                                            <span className='bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold'>
                                                {option.price}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {/* 결제 수단 */}
                                <div className='mb-8'>
                                    <h3 className='text-lg font-semibold mb-4'>결제수단</h3>
                                    <div className='flex gap-2 mb-4'>
                                        {Object.keys(paymentMethodIcons).map((method) => (
                                            <button
                                                key={method}
                                                onClick={() => setSelectedMethod(method)}
                                                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                                                    selectedMethod === method
                                                        ? 'border-orange-500 bg-orange-50'
                                                        : 'border-gray-200 bg-white hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className='flex flex-col items-center'>
                                                    {
                                                        paymentMethodIcons[
                                                            method as keyof typeof paymentMethodIcons
                                                        ]
                                                    }
                                                    <span className='text-xs mt-1 font-medium'>
                                                        {method}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* 간편결제 옵션들 */}
                                    {selectedMethod === '간편결제' && (
                                        <div>
                                            <p className='text-sm text-gray-500 mb-3'>
                                                결제방법을 선택해주세요
                                            </p>
                                            <div className='flex gap-2'>
                                                <div className='w-12 h-8 bg-yellow-400 rounded-md flex items-center justify-center'>
                                                    <span className='text-xs font-bold text-black'>
                                                        Kakao
                                                    </span>
                                                </div>
                                                <div className='w-12 h-8 bg-green-500 rounded-md flex items-center justify-center'>
                                                    <span className='text-xs font-bold text-white'>
                                                        N
                                                    </span>
                                                </div>
                                                <div className='w-12 h-8 bg-blue-500 rounded-md flex items-center justify-center'>
                                                    <span className='text-xs font-bold text-white'>
                                                        toss
                                                    </span>
                                                </div>
                                                <div className='w-12 h-8 bg-red-500 rounded-md flex items-center justify-center'>
                                                    <span className='text-xs font-bold text-white'>
                                                        PAYCO
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 정책 동의 */}
                                <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                                    <h4 className='font-semibold mb-2'>정책동의 / 주의사항</h4>
                                    <div className='text-sm text-gray-600 space-y-2 mb-4'>
                                        <p>
                                            포인트 충전을 위해서는 카드소유자 또는 카카오페이의
                                            본인이 일치해야 합니다.
                                        </p>
                                        <p>
                                            궁금한 점은 고객센터로 문의해주세요. ☎️{' '}
                                            <span className='font-semibold'>1644-7405</span>
                                        </p>
                                    </div>
                                    <div className='text-xs text-gray-500 mb-4'>
                                        <p>
                                            ※ 미성년자의 경우 보호자의 동의 후 이용하시고, 결제 취소
                                            시 신원 확인을 위한 절차가 있을 수 있습니다.
                                        </p>
                                    </div>
                                    <label className='flex items-center gap-2 cursor-pointer'>
                                        <input
                                            type='checkbox'
                                            checked={agreedTerms}
                                            onChange={(e) => setAgreedTerms(e.target.checked)}
                                            className='rounded'
                                        />
                                        <span className='text-sm'>동의</span>
                                        <span className='text-sm text-blue-500 hover:underline ml-auto'>
                                            전체보기
                                        </span>
                                    </label>
                                </div>

                                {/* 결제 버튼 */}
                                <ShopPayButton
                                    price={actualPrice}
                                    pointAmount={Number(selectedAmount)}
                                    orderName={`${selectedOption?.label ?? ''} 충전`}
                                    pg={paymentConfig.pg}
                                    method={paymentConfig.method}
                                    enabled={agreedTerms && actualPrice > 0}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AuthUser>
        </AppLayout>
    );
};

export default PointRechargePage;
