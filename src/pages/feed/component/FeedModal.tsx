import React, { useState, useRef, useEffect } from 'react';
import { axiosClient, getServerURL, httpFetcher, toastError } from '@shared/lib';
import { toast } from 'react-toastify';
import { ImagePlus, PackageIcon, X as XIcon, Loader2 } from 'lucide-react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ApiResult } from '@entities/common';
import { FeedListResponse } from '@entities/feed/model';
import type { ConfirmBidItem } from '@/entities/feed/model';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import { ConfirmBidSelectSection } from '@/features/feed/ui';
import { ConfirmBidPreviewCard } from '@/widgets/feed/ConfirmBidPreviewCard';

interface InfiniteData<T> {
    pages: T[];
    pageParams: unknown[];
}

interface ModalProps {
    onClose: () => void;
}

interface PromoItem {
    endTime: string;
    auctionId: number;
    categoryName: string;
    auctionDescription: string;
    startTime: string;
    auctionTitle: string;
    thumbnail: string;
}

interface PromoResponse {
    data: PromoItem[];
    message: string;
    success: boolean;
    error: unknown;
    timestamp?: string;
}

export const FeedModal = ({ onClose }: ModalProps) => {
    const [content, setContent] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const prevUrlsRef = useRef<string[]>([]);
    const queryClient = useQueryClient();

    // Collapsible open/close 상태
    const [isPromoOpen, setPromoOpen] = useState(false);

    // 거래내역 collapsible open/close 상태
    const [isConfirmBidOpen, setConfirmBidOpen] = useState(false);

    // ✅ [신규] 선택된 홍보 상품을 저장할 state
    const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);

    // ✅ [신규] 선택된 거래내역(낙찰/구매확정) 자랑 데이터
    const [selectedConfirmBid, setSelectedConfirmBid] = useState<ConfirmBidItem | null>(null);

    useEffect(() => {
        return () => {
            prevUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            prevUrlsRef.current = [];
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (selected && selected.length > 0) {
            const added = Array.from(selected);
            const newUrls = added.map((f) => URL.createObjectURL(f));
            prevUrlsRef.current = prevUrlsRef.current.concat(newUrls);
            setFiles((prev) => prev.concat(added));
            setPreviewUrls((prev) => prev.concat(newUrls));
            inputRef.current!.value = '';
        }
    };

    const handleRemoveFileAt = (index: number) => {
        const url = previewUrls[index];
        if (url) URL.revokeObjectURL(url);
        prevUrlsRef.current = prevUrlsRef.current.filter((u) => u !== url);
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const triggerFilePicker = () => {
        inputRef.current!.click();
    };

    const promoQuery = useQuery<PromoResponse>({
        queryKey: ['api', 'v1', 'feed', 'my', 'auction'],
        queryFn: httpFetcher,
        enabled: isPromoOpen,
        staleTime: 0,
    });

    // ✅ [수정] useMutation: auctionId도 함께 전송
    const { mutate: submitFeed, isPending } = useMutation({
        mutationFn: async () => {
            if (!content.trim()) {
                throw new Error('내용을 입력해주세요');
            }

            const formData = new FormData();

            // ✅ content와 함께 auctionId도 data Blob에 포함!
            const dataToSubmit = {
                content,
                auctionId: selectedPromo ? selectedPromo.auctionId : null,
            };

            formData.append(
                'data',
                new Blob([JSON.stringify(dataToSubmit)], { type: 'application/json' }),
            );
            files.forEach((f) => formData.append('files', f));

            const response = await axiosClient.post(`${getServerURL()}/api/v1/feed`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: (data) => {
            console.log(data);
            toast.success('작성 성공');
            setContent('');
            prevUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
            prevUrlsRef.current = [];
            setFiles([]);
            setPreviewUrls([]);
            setSelectedPromo(null); // ✅ [추가] 성공 시 선택된 상품도 리셋
            queryClient.setQueryData(
                ['api', 'v2', 'feed'],
                (oldData: InfiniteData<ApiResult<FeedListResponse[]>> | undefined) => {
                    if (!oldData) return oldData;
                    const newData = structuredClone(oldData);
                    if (!newData.pages?.[0]?.data) return newData;
                    newData.pages[0].data.unshift({ ...data.data });
                    return newData;
                },
            );
            onClose();
        },
        onError: (error: unknown) => {
            const message =
                error && typeof error === 'object' && 'message' in error
                    ? String((error as { message?: unknown }).message)
                    : undefined;
            toastError(message || '게시글 작성 중 오류 발생');
        },
    });

    // ✅ [신규] 상품 리스트에서 아이템 클릭 시 실행될 핸들러
    const handlePromoSelect = (item: PromoItem) => {
        // 이미 선택된 걸 또 누르면 선택 해제 (토글)
        if (selectedPromo?.auctionId === item.auctionId) {
            setSelectedPromo(null);
        } else {
            setSelectedPromo(item);
        }
        setPromoOpen(false); // 메뉴 닫기
    };

    return (
        <div className='fixed inset-0 bg-black/50 z-50 flex justify-center items-center'>
            <div
                className='relative bg-white w-[500px] max-w-full rounded-lg shadow-lg p-6'
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className='absolute top-4 right-4 text-orange-400 text-xl font-bold hover:text-orange-600'
                    onClick={onClose}
                >
                    ×
                </button>

                <h2 className='text-center text-orange-500 text-lg font-semibold mb-4'>
                    게시글 작성
                </h2>
                <hr className='border-t-1 border-uprimary' />

                {/* ▼▼▼ [신규] 선택된 상품 카드뷰 ▼▼▼ */}
                {selectedPromo && (
                    <div className='relative mt-5 border border-orange-200 rounded-lg p-3 bg-orange-50 flex gap-3'>
                        <img
                            src={selectedPromo.thumbnail}
                            alt={selectedPromo.auctionTitle}
                            className='w-20 h-20 object-cover rounded-md'
                        />
                        <div className='flex-1'>
                            <span className='inline-block bg-orange-200 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded mb-1'>
                                {selectedPromo.categoryName}
                            </span>
                            <h4 className='font-semibold text-gray-800'>
                                {selectedPromo.auctionTitle}
                            </h4>
                            <p className='text-xs text-gray-500 mt-1'>
                                {new Date(selectedPromo.startTime).toLocaleString()} -{' '}
                                {new Date(selectedPromo.endTime).toLocaleString()}
                            </p>
                        </div>
                        {/* 선택 해제 버튼 */}
                        <button
                            type='button'
                            onClick={() => setSelectedPromo(null)}
                            className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'
                            aria-label='홍보 상품 선택 해제'
                        >
                            <XIcon className='w-4 h-4' />
                        </button>
                    </div>
                )}
                {/* ▲▲▲ [신규] 선택된 상품 카드뷰 ▲▲▲ */}

                {/* ✅ 선택된 거래내역 미리보기 (X로 취소 가능) */}
                {selectedConfirmBid && (
                    <ConfirmBidPreviewCard
                        item={selectedConfirmBid}
                        onClear={() => setSelectedConfirmBid(null)}
                    />
                )}

                <textarea
                    className={`w-full h-80 p-4 bg-orange-50 text-gray-700 border border-orange-100 rounded-md resize-none outline-none ${
                        selectedPromo ? 'mt-3' : 'mt-5' // 카드뷰 있을 때만 mt-3
                    }`}
                    placeholder='게시글 내용 작성'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {/* 이미지 미리보기 (이하 동일) */}
                <div className='mt-4'>
                    {previewUrls.length > 0 && (
                        <div className='flex gap-2 flex-wrap mb-2'>
                            {previewUrls.map((url, idx) => (
                                <div
                                    key={url + idx}
                                    className='relative w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden'
                                >
                                    <img
                                        src={url}
                                        alt={`preview-${idx}`}
                                        className='object-cover w-full h-full'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => handleRemoveFileAt(idx)}
                                        className='absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/70'
                                        aria-label={`이미지 삭제 ${idx + 1}`}
                                    >
                                        <XIcon className='w-3 h-3' />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='flex items-start gap-3'>
                        <input
                            ref={(el) => {
                                inputRef.current = el;
                            }}
                            type='file'
                            accept='image/*'
                            multiple
                            className='hidden'
                            onChange={handleFileChange}
                        />
                        <div className='flex flex-col gap-1 w-full'>
                            <button
                                type='button'
                                onClick={triggerFilePicker}
                                className='inline-flex items-center gap-2 px-3 py-1 rounded-md text-uprimary hover:bg-uprimary/10 transition'
                            >
                                <ImagePlus className='w-5 h-5' />
                                <span className='font-medium text-sm'>사진 추가</span>
                            </button>

                            {/* ▼▼▼ Collapsible 부분 수정 ▼▼▼ */}
                            <Collapsible
                                open={isPromoOpen}
                                onOpenChange={setPromoOpen}
                                className='w-full'
                            >
                                <CollapsibleTrigger asChild>
                                    <button
                                        type='button'
                                        className='inline-flex items-center gap-2 px-3 py-1 rounded-md text-uprimary hover:bg-uprimary/10 transition'
                                    >
                                        <PackageIcon className='w-5 h-5' />
                                        <span className='font-medium text-sm'>내 상품 홍보</span>
                                    </button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className='pt-2 animate-in slide-in-from-top-4'>
                                    <div className='border rounded-md p-3 shadow-sm bg-white'>
                                        <h3 className='text-sm font-semibold mb-3'>
                                            홍보할 상품 선택
                                        </h3>
                                        {promoQuery.isLoading ? (
                                            <div className='space-y-2'>
                                                <Skeleton className='h-16 w-full' />
                                                <Skeleton className='h-16 w-full' />
                                            </div>
                                        ) : promoQuery.data?.data?.length === 0 ? (
                                            <div className='py-6 text-center text-sm text-gray-500'>
                                                상품이 없습니다.
                                            </div>
                                        ) : (
                                            <div className='flex flex-col gap-2 max-h-44 overflow-auto'>
                                                {promoQuery.data?.data?.map((it) => (
                                                    <div
                                                        key={it.auctionId}
                                                        // ✅ [수정] onClick 핸들러와 선택 스타일 추가
                                                        onClick={() => handlePromoSelect(it)}
                                                        className={`flex items-center gap-3 p-2 border rounded-md cursor-pointer transition-colors ${
                                                            selectedPromo?.auctionId ===
                                                            it.auctionId
                                                                ? 'bg-orange-100 border-orange-300' // 선택됨
                                                                : 'hover:bg-gray-50' // 호버
                                                        }`}
                                                    >
                                                        <img
                                                            src={it.thumbnail}
                                                            alt={it.auctionTitle}
                                                            className='w-16 h-16 object-cover rounded'
                                                        />
                                                        <div className='flex-1'>
                                                            <div
                                                                className={`text-sm ${
                                                                    selectedPromo?.auctionId ===
                                                                    it.auctionId
                                                                        ? 'font-semibold text-orange-800' // 선택됨
                                                                        : 'font-medium'
                                                                }`}
                                                            >
                                                                {it.auctionTitle}
                                                            </div>
                                                            <div className='text-xs text-gray-500'>
                                                                {new Date(
                                                                    it.startTime,
                                                                ).toLocaleString()}{' '}
                                                                -{' '}
                                                                {new Date(
                                                                    it.endTime,
                                                                ).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                            {/* ▲▲▲ Collapsible 부분 수정 ▲▲▲ */}

                            {/* ▼▼▼ [신규] 거래내역 자랑하기 섹션 ▼▼▼ */}
                            <ConfirmBidSelectSection
                                open={isConfirmBidOpen}
                                onOpenChange={setConfirmBidOpen}
                                selected={selectedConfirmBid}
                                onSelect={setSelectedConfirmBid}
                            />
                            {/* ▲▲▲ [신규] 거래내역 자랑하기 섹션 ▲▲▲ */}
                        </div>
                    </div>
                </div>

                <hr className='border-t-1 mt-4 border-uprimary' />
                <div className='text-center mt-6'>
                    <button
                        onClick={() => submitFeed()}
                        disabled={isPending}
                        className={`bg-orange-500 text-white font-semibold py-2 px-6 rounded transition ${
                            isPending ? 'opacity-60 cursor-not-allowed' : 'hover:bg-orange-600'
                        }`}
                    >
                        {isPending ? (
                            <div className='flex items-center justify-center gap-2'>
                                <Loader2 className='w-4 h-4 animate-spin' />
                                게시 중...
                            </div>
                        ) : (
                            '게시하기'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedModal;
