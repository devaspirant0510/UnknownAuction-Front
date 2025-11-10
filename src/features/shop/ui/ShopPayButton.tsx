// filepath: /Users/kotlinandnode/seungho/capstone/FlashBid-Front/src/features/shop/ui/ShopPayButton.tsx
import React from 'react';
import { Bootpay } from '@bootpay/client-js';
import { useMutationPaymentSuccess } from '@/features/shop/lib/useMutationPaymentSuccess.ts';
import { useAuthStore } from '@shared/store/AuthStore.ts';

export type ShopPayButtonProps = {
    price: number; // KRW price in won
    pointAmount: number; // 충전 포인트 양
    orderName: string;
    pg: string;
    method: string;
    enabled?: boolean;
    className?: string;
    // Optional callbacks
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
};

const ShopPayButton: React.FC<ShopPayButtonProps> = ({
    price,
    pointAmount,
    orderName,
    pg,
    method,
    enabled = true,
    className,
    onSuccess,
    onError,
}) => {
    const { mutateAsync: postPaymentSuccess } = useMutationPaymentSuccess();
    const { userAuth } = useAuthStore();

    const handleClick = async () => {
        if (!enabled) return;

        try {
            const orderId = `POINT_RECHARGE_${Date.now()}`;

            const payload: any = {
                application_id: '68cff793836e97280fee80fb',
                price,
                order_name: orderName,
                order_id: orderId,
                pg,
                method,
                tax_free: 0,
                user: {
                    id: userAuth?.id,
                    username: userAuth?.nickname,
                    phone: '',
                    email: userAuth?.email,
                },
                items: [
                    {
                        id: 'point_charge',
                        name: orderName,
                        qty: 1,
                        price,
                    },
                ],
                extra: {
                    open_type: 'iframe',
                    card_quota: method === '카드' ? '0,2,3,6,12' : '0',
                    escrow: false,
                },
            };

            const response: any = await (Bootpay as any).requestPayment(payload as any);

            // external success callback first
            if (onSuccess) onSuccess(response);

            // Handle by event
            switch (response?.event) {
                case 'done': {
                    const paymentPayload = {
                        paymentKey: 'test payment key', //response.payment_key || response.receipt_id || '',
                        orderId: response.order_id || orderId,
                        receiptId: response.receipt_id || '',
                        receiptUrl: response.receipt_url || '',
                        status: response.status || 'DONE',
                        userId: userAuth?.id!,
                        pointAmount: pointAmount,
                        paymentAmount: price,
                        method: response.method || method,
                        purchaseAt:
                            (response.purchased_at &&
                                new Date(response.purchased_at).toISOString()) ||
                            new Date().toISOString(),
                    };

                    await postPaymentSuccess(paymentPayload);
                    alert(`결제가 완료되었습니다! 주문번호: ${paymentPayload.receiptId}`);
                    break;
                }
                case 'issued': {
                    // 가상계좌 발급 등
                    break;
                }
                case 'confirm': {
                    // 별도 승인 플로우 필요 시 사용 (현재는 스킵)
                    break;
                }
                default: {
                    // no-op
                }
            }
        } catch (error: any) {
            if (onError) onError(error);
            else {
                console.error('결제 실패:', error);
                if (error?.event === 'cancel') alert('결제가 취소되었습니다.');
                else if (error?.event === 'error')
                    alert(`결제 중 오류가 발생했습니다: ${error?.message || '알 수 없는 오류'}`);
                else alert('결제 처리 중 문제가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={!enabled}
            className={
                className ??
                `w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    enabled
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`
            }
        >
            결제하기
        </button>
    );
};

export default ShopPayButton;
