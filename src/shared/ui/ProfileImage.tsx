import React, { FC } from 'react';

type Props = {
    src?: string | null;
    size: number;
    onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
};
const ProfileImage: FC<Props> = ({ size = 36, src, onClick }) => {
    const getImageUrl = () => {
        if (!src) {
            return '/img/default.png'; // src가 없으면 기본 이미지
        }
        if (src.startsWith('blob:')) {
            return src; // src가 'blob:'으로 시작하면 (미리보기) 그대로 사용
        }
        return src; // 그 외의 경우 (서버 이미지) 서버 주소와 결합
    };

    return (
        <div style={{ width: size, height: size }}>
            <img
                onClick={onClick}
                src={getImageUrl()}
                className={`rounded-full object-cover w-full h-full`}
                alt='profile image'
            />
        </div>
    );
};

export default ProfileImage;
