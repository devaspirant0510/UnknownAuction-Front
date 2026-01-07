import type React from 'react';
import { AdminUserListItem } from '@widgets/admin-user';

const formatNumber = (value: number) => new Intl.NumberFormat('ko-KR').format(value);

type Props = {
    items: AdminUserListItem[];
};

const AdminUserListTable: React.FC<Props> = ({ items }) => {
    return (
        <div className='bg-white rounded shadow overflow-hidden'>
            <div className='px-6 py-4 border-b'>
                <div className='text-lg font-semibold'>유저 목록</div>
            </div>

            <div className='overflow-auto'>
                <table className='min-w-[980px] w-full text-sm'>
                    <thead className='bg-gray-50 text-gray-700'>
                        <tr>
                            <th className='text-left px-4 py-3 border-b'>ID</th>
                            <th className='text-left px-4 py-3 border-b'>프로필</th>
                            <th className='text-left px-4 py-3 border-b'>닉네임</th>
                            <th className='text-left px-4 py-3 border-b'>이메일</th>
                            <th className='text-left px-4 py-3 border-b'>상태</th>
                            <th className='text-left px-4 py-3 border-b'>로그인</th>
                            <th className='text-left px-4 py-3 border-b'>포인트</th>
                            <th className='text-left px-4 py-3 border-b'>인증</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={8} className='px-4 py-8 text-center text-gray-500'>
                                    표시할 유저가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            items.map((u) => (
                                <tr key={u.id} className='hover:bg-gray-50'>
                                    <td className='px-4 py-3 border-b'>{u.id}</td>
                                    <td className='px-4 py-3 border-b'>
                                        <div className='flex items-center gap-3'>
                                            <img
                                                src={u.profileUrl ?? '/img/default.png'}
                                                alt='profile'
                                                className='w-8 h-8 rounded-full object-cover border'
                                                loading='lazy'
                                            />
                                            <div className='text-xs text-gray-500'>
                                                UUID: {u.uuid}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-4 py-3 border-b font-medium'>{u.nickname}</td>
                                    <td className='px-4 py-3 border-b'>{u.email}</td>
                                    <td className='px-4 py-3 border-b'>
                                        <span className='inline-flex items-center px-2 py-1 rounded bg-gray-100 border border-gray-200 text-xs'>
                                            {u.userStatus}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3 border-b'>{u.loginType}</td>
                                    <td className='px-4 py-3 border-b'>{formatNumber(u.point)}</td>
                                    <td className='px-4 py-3 border-b'>
                                        {u.verified ? (
                                            <span className='text-emerald-600 font-semibold'>
                                                Y
                                            </span>
                                        ) : (
                                            <span className='text-gray-400 font-semibold'>N</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserListTable;
