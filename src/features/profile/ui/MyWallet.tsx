import { Link } from 'react-router';

interface MyWalletProps {
    cash?: number;
}

const MyWallet = ({ cash }: MyWalletProps) => {
    return (
        <div>
            <h2
                className='font-semibold mb-4'
                style={{ color: '#f26522', fontSize: 24, fontWeight: 'bold' }}
            >
                MY 지갑
            </h2>

            <div className='text-center flex justify-between h-40'>
                {/* 보유 캐시 영역 */}
                <div className='w-4/5 rounded-xl shadow border text-sm flex items-center justify-center'>
                    <div className='pr-60'>
                        <span style={{ fontSize: 24, color: '#7E7E7E', fontWeight: 'bold' }}>
                            보유 포인트
                        </span>
                    </div>
                    <div className='text-3xl font-bold'>
                        <label style={{ fontSize: 48, color: '#ED6C37', fontWeight: 'bold' }}>
                            {cash?.toLocaleString() || 0}
                        </label>
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div
                    className='w-1/5 rounded-xl shadow border text-sm flex flex-col items-center justify-center'
                    style={{ backgroundColor: '#FFE7DD' }}
                >
                    <div>
                        <Link to={'/shop'}>
                            <button
                                className='px-4 py-2 rounded-xl border'
                                style={{ backgroundColor: '#FFF3EE', color: '#F88A5B' }}
                            >
                                충전하기
                            </button>
                        </Link>
                    </div>
                    <div>
                        <Link to={'/profile/point'}>
                            <button
                                className='px-4 py-2 mt-3 rounded-xl border'
                                style={{ backgroundColor: '#FFF3EE', color: '#F88A5B' }}
                            >
                                이용내역
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyWallet;
