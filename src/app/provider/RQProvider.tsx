import { FC, JSX } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@shared/lib';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type Props = {
    children: JSX.Element;
};

const RQProvider: FC<Props> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
};

export default RQProvider;
