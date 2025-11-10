import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FilterIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { BaseLayout } from '@shared/layout';
import CategoryItem from '@widgets/auction/CategoryItem';
import { useQueryGetCategories } from '@/features/auction/lib';

type Props = {
    type: 'blind' | 'live';
};

const AuctionCategory: FC<Props> = ({ type }) => {
    const { isLoading, data, isError, error } = useQueryGetCategories();
    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ 카테고리 데이터 (data?.data로부터 가져옴)
    const category = useMemo(() => {
        return [
            { id: null, name: '전체', root: null, createdAt: null, updatedAt: null },
            ...(data?.data ?? []),
        ];
    }, [data]);

    // ✅ selected 배열은 category 길이에 맞춰 생성
    const [selected, setSelected] = useState<boolean[]>([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        console.log(category);
        if (category.length > 0) {
            const initialSelected = new Array(category.length).fill(false);
            initialSelected[0] = true;
            setSelected(initialSelected);
        }
    }, [category]);

    useEffect(() => {
        if (selected.length > 0) {
            setSelected((prev) => prev.map((_, i) => i === current));
        }
    }, [current]);

    const onClickItem = useCallback(
        (index: number) => {
            if (index !== 0) {
                setSearchParams({ category: category[index].name });
            } else {
                setSearchParams({});
            }
            setCurrent(index);
        },
        [category, setSearchParams],
    );

    if (isLoading) return <>loading...</>;
    if (isError) return <>{String(error)}</>;
    if (!category.length) return <>no data</>;

    const isLive = type === 'live';
    const bgColor = isLive ? 'bg-[#F3F4F6]' : 'bg-[#D5D5D6]';
    const textColor = isLive ? 'text-black' : 'text-[#B0B0B0]';

    return (
        <>
            <div className={`flex ${bgColor} rounded-full gap-4 py-2 px-4`}>
                {category.map((value, index) => (
                    <div key={index} onClick={() => onClickItem(index)}>
                        <CategoryItem type={type} value={value.name} active={selected[index]} />
                    </div>
                ))}
            </div>

            <BaseLayout>
                <div className={'flex justify-between items-center w-full mb-4'}>
                    <div className={textColor}>카테고리 - {category[current]?.name}</div>
                    <div
                        className={`border-1 flex justify-between p-2 rounded-full text-sm items-center ${
                            isLive ? '' : 'border-[#9F9F9F] text-[#9F9F9F]'
                        }`}
                    >
                        필터
                        <FilterIcon size={16} />
                    </div>
                </div>
            </BaseLayout>
        </>
    );
};

export default AuctionCategory;
