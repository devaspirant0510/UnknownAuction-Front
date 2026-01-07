import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import {
    useQueryGetCategoryCount,
    CategoryCount,
} from '@/features/admin/lib/useQueryGetCategoryCount';

const colors = [
    '#8dd3c7',
    '#bebada',
    '#f6d93d',
    '#fb8072',
    '#80b1d3',
    '#f79442',
    '#b3de69',
    '#fccde5',
];

const CategoryChartWidget: React.FC = () => {
    const { data, isLoading, isError, error } = useQueryGetCategoryCount();

    if (isLoading) return <div className='p-6 bg-white rounded shadow'>로딩중...</div>;
    if (isError)
        return (
            <div className='p-6 bg-white rounded shadow'>
                에러: {(error as unknown as Error)?.message || '알 수 없는 에러'}
            </div>
        );

    const chartData: CategoryCount[] = data?.data || [];

    return (
        <div className='p-6 space-y-4 bg-white rounded shadow'>
            <div className='text-xl font-semibold'>카테고리별 상품 수</div>
            <div className=''>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width='100%' height='100%'>
                        <PieChart>
                            <Pie
                                dataKey='count'
                                data={chartData}
                                nameKey='name'
                                cx='50%'
                                cy='50%'
                                outerRadius={100}
                                label
                            >
                                {chartData.map((entry, idx) => (
                                    <Cell
                                        key={`cell-${entry.categoryId ?? idx}`}
                                        fill={colors[idx % colors.length]}
                                    />
                                ))}
                            </Pie>
                            <Legend layout='vertical' verticalAlign='middle' align='right' />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default CategoryChartWidget;
