import React from 'react';

// 우리가 만든 바로 그 캐릭터 이미지!
const serverMaintenanceImage = '/img/server_maintenance.png';

const ServerMaintenancePage = () => {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4'>
            <div className='max-w-md text-center'>
                <img src={'/img/logo.svg'} className={'mx-auto'} alt={'로고'} />
                <img
                    src={serverMaintenanceImage}
                    alt='서버 점검 중인 캐릭터'
                    className='mx-auto mb-8 h-64 w-64'
                />

                <h1 className='mb-4 text-3xl font-bold text-gray-900'>🚧 서버 점검 중입니다 🚧</h1>

                <p className='mb-6 text-lg text-gray-600'>
                    더 나은 서비스를 제공하기 위해
                    <br />
                    잠시 시스템을 점검하고 있습니다.
                    <br />
                    너그러운 양해 부탁드립니다.
                </p>

                <p className='text-md font-semibold text-uprimary'>잠시 후 다시 시도해 주세요!</p>
            </div>
        </div>
    );
};

export default ServerMaintenancePage;
