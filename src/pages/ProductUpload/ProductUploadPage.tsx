import React, { useEffect, useState } from 'react';
import ImageUploader from '@/pages/ProductUpload/components/ImageUploader';
import TitleInput from '@/pages/ProductUpload/components/TitleInput';
import DescriptionInput from '@/pages/ProductUpload/components/DescriptionInput';
import AuctionTypeSelector from '@/pages/ProductUpload/components/AuctionTypeSelector';
import AuctionInfoInputs from '@/pages/ProductUpload/components/AuctionInfoInputs';
import DeliveryOptions from '@/pages/ProductUpload/components/DeliveryOptions';
import SubmitButtons from '@/pages/ProductUpload/components/SubmitButtons';
import CategorySelect from '@/pages/ProductUpload/components/CategorySelect';
import { axiosClient, DateUtil, getServerURL } from '@shared/lib';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@shared/store/AuthStore.ts';
import { AppLayout } from '@/shared/layout';

export default function ProductUploadPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [auctionType, setAuctionType] = useState<'realtime' | 'blind' | null>(null);
    const [startPrice, setStartPrice] = useState('');
    const [bidUnit, setBidUnit] = useState('');
    const [auctionDate, setAuctionDate] = useState('');
    const [auctionPeriod, setAuctionPeriod] = useState('1');
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [deliveryFee, setDeliveryFee] = useState('');
    const [auctionHour, setAuctionHour] = useState('14');
    const [auctionMinute, setAuctionMinute] = useState('00');
    const [images, setImages] = useState<{ file: File; previewUrl: string }[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
        address?: string;
    } | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const navigate = useNavigate();
    const { userAuth } = useAuthStore();

    const handleSubmit = async () => {
        try {
            const startTime = new Date(
                `${auctionDate}T${auctionHour.padStart(2, '0')}:${auctionMinute.padStart(2, '0')}:00`,
            );
            const endTime = new Date(startTime);
            endTime.setDate(endTime.getDate() + Number(auctionPeriod));

            // 💡 배송비 유효성 검사
            const numericDeliveryFee = Number(deliveryFee.replace(/,/g, ''));
            if (deliveryMethod === '택배' && numericDeliveryFee > 20000) {
                alert('배송비는 최대 20,000원까지만 입력할 수 있습니다.');
                return;
            }

            const data = {
                title,
                description,
                categoryId: selectedCategoryId,
                startPrice: Number(startPrice),
                bidUnit: Number(bidUnit),
                startTime: DateUtil.toKSTISOString(startTime),
                endTime: DateUtil.toKSTISOString(endTime),
                deliveryType:
                    deliveryMethod === '택배'
                        ? 'PARCEL'
                        : deliveryMethod === '협의 후 결정'
                          ? 'NEGOTIATE'
                          : 'DIRECT',
                deliveryInfo: {
                    deliveryFee: Number(deliveryFee.replace(/,/g, '')),
                },
                tradingArea:
                    deliveryMethod === '직거래' && selectedLocation
                        ? {
                              latitude: selectedLocation.lat,
                              longitude: selectedLocation.lng,
                              radius: 3000, // 3km
                              address: selectedLocation.address ?? '',
                          }
                        : null,
            };

            const formData = new FormData();
            images.forEach((img) => {
                formData.append('files', img.file);
            });
            formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

            console.log('전송 데이터', data);
            console.log('formData 확인', formData.get('files'), formData.get('data'));

            const response = await axiosClient.post(
                `${getServerURL()}/api/v1/auction/${auctionType}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                } as any,
            );

            const result = response.data;
            toast('상품 등록 성공', { type: 'success' });
            navigate('/profile');
        } catch (err) {
            console.error(err);
            alert('상품 등록 중 오류가 발생했습니다.');
        }
    };
    useEffect(() => {
        if (!userAuth) {
            navigate('/login');
            toast('로그인후 이용해주세요', { type: 'error' });
        }
    }, []);
    return (
        <AppLayout>
            <div className='max-w-2xl mx-auto p-6'>
                <h1 className='text-2xl font-bold mb-6 text-orange-600'>상품 등록</h1>

                <ImageUploader images={images} setImages={setImages} />
                <TitleInput title={title} onChange={(e) => setTitle(e.target.value)} />
                <CategorySelect
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                />
                <DescriptionInput
                    description={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <AuctionTypeSelector auctionType={auctionType} setAuctionType={setAuctionType} />
                <AuctionInfoInputs
                    startPrice={startPrice}
                    setStartPrice={setStartPrice}
                    bidUnit={bidUnit}
                    setBidUnit={setBidUnit}
                    auctionDate={auctionDate}
                    setAuctionDate={setAuctionDate}
                    auctionHour={auctionHour}
                    setAuctionHour={setAuctionHour}
                    auctionMinute={auctionMinute}
                    setAuctionMinute={setAuctionMinute}
                    auctionPeriod={auctionPeriod}
                    setAuctionPeriod={setAuctionPeriod}
                />

                <DeliveryOptions
                    deliveryMethod={deliveryMethod}
                    setDeliveryMethod={setDeliveryMethod}
                    deliveryFee={deliveryFee}
                    setDeliveryFee={setDeliveryFee}
                    setSelectedLocation={setSelectedLocation}
                />

                <SubmitButtons onSubmit={handleSubmit} />
            </div>
        </AppLayout>
    );
}
