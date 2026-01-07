import type React from 'react';
import { AdminLiveAuctionListItem } from '@/features/admin-auction';

const formatNumber = (value: number) => new Intl.NumberFormat('ko-KR').format(value);

type Props = {
    items: AdminLiveAuctionListItem[];
};

const AdminLiveAuctionListTable: React.FC<Props> = ({ items }) => {
    return (
        <div className='bg-white rounded shadow overflow-hidden'>
            <div className='px-6 py-4 border-b'>
                <div className='text-lg font-semibold'>실시간 경매 목록</div>
            </div>

            <div className='overflow-auto'>
                <table className='min-w-[1200px] w-full text-sm'>
                    <thead className='bg-gray-50 text-gray-700'>
                        <tr>
                            <th className='text-left px-4 py-3 border-b'>ID</th>
                            <th className='text-left px-4 py-3 border-b'>상품명</th>
                            <th className='text-left px-4 py-3 border-b'>판매자</th>
                            <th className='text-left px-4 py-3 border-b'>카테고리</th>
                            <th className='text-left px-4 py-3 border-b'>상태</th>
                            <th className='text-left px-4 py-3 border-b'>시작가</th>
                            <th className='text-left px-4 py-3 border-b'>마지막 입찰</th>
                            <th className='text-left px-4 py-3 border-b'>입찰수</th>
                            <th className='text-left px-4 py-3 border-b'>참여자수</th>
                            <th className='text-left px-4 py-3 border-b'>조회수</th>
                            <th className='text-left px-4 py-3 border-b'>채팅</th>
                            <th className='text-left px-4 py-3 border-b'>시작시간</th>
                            <th className='text-left px-4 py-3 border-b'>종료시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={13} className='px-4 py-8 text-center text-gray-500'>
                                    표시할 경매가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            items.map((a) => (
                                <tr key={a.auctionId} className='hover:bg-gray-50'>
                                    <td className='px-4 py-3 border-b'>{a.auctionId}</td>
                                    <td className='px-4 py-3 border-b font-medium'>
                                        {a.goodsTitle}
                                    </td>
                                    <td className='px-4 py-3 border-b'>{a.sellerNickname}</td>
                                    <td className='px-4 py-3 border-b'>{a.categoryName}</td>
                                    <td className='px-4 py-3 border-b'>
                                        <span className='inline-flex items-center px-2 py-1 rounded bg-gray-100 border border-gray-200 text-xs'>
                                            {a.auctionStatus.valueOf()}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3 border-b'>
                                        {formatNumber(a.startPrice)}
                                    </td>
                                    <td className='px-4 py-3 border-b'>
                                        {formatNumber(a.lastBidAmount)}
                                    </td>
                                    <td className='px-4 py-3 border-b'>
                                        {formatNumber(a.biddingCount)}
                                    </td>
                                    <td className='px-4 py-3 border-b'>
                                        {formatNumber(a.participantsCount)}
                                    </td>
                                    <td className='px-4 py-3 border-b'>
                                        {formatNumber(a.viewCount)}
                                    </td>
                                    <td className='px-4 py-3 border-b'>
                                        {formatNumber(a.chatCount)}
                                    </td>
                                    <td className='px-4 py-3 border-b'>{a.startTime}</td>
                                    <td className='px-4 py-3 border-b'>{a.endTime}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLiveAuctionListTable;
