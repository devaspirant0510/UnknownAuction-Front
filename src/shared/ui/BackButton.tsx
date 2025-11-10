import React, { FC, useCallback } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

type Props = {
    className?: string;
};
const BackButton: FC<Props> = ({ className }) => {
    const navigate = useNavigate();
    const onClickBackButton = useCallback(() => {
        navigate(-1);
    }, []);
    return (
        <ArrowLeftIcon
            onClick={onClickBackButton}
            className={`text-uprimary ${className}`}
            size={25}
        ></ArrowLeftIcon>
    );
};

export default BackButton;
