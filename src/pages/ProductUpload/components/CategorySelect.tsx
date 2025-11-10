import { useEffect, useState } from 'react';
import { axiosClient } from '@shared/lib';

type Props = {
    selectedCategoryId: number | null; // null 허용으로 수정
    setSelectedCategoryId: (id: number | null) => void; // null 허용
};

export default function CategorySelect({
    selectedCategoryId,
    setSelectedCategoryId,
    token,
}: Props) {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosClient.get(`/api/v1/category`, {
                    withCredentials: true,
                } as any);

                const result = await res.data;
                setCategories(result.data);
            } catch (error) {
                console.error('카테고리 가져오기 에러:', error);
            }
        };

        fetchCategories();
    }, [token]);

    return (
        <div className='mb-6'>
            <label className='block font-semibold mb-2 text-orange-500'>카테고리 선택 *</label>
            <select
                className='w-full border rounded-md px-4 py-2'
                value={selectedCategoryId ?? ''} // ✅ null일 때는 빈 문자열
                onChange={(e) => {
                    const value = e.target.value;
                    setSelectedCategoryId(value ? Number(value) : null); // ✅ 빈 값이면 null로 설정
                }}
            >
                <option value=''>카테고리를 선택해주세요</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
