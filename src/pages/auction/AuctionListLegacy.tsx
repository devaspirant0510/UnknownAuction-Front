import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib';
import { Card } from '@shared/components/ui/card.tsx';

const AuctionListLegacy = () => {
    const { isLoading, isError, error, data } = useQuery({
        queryKey: ['api', 'auction-list'],
        queryFn: httpFetcher,
    });
    if (isLoading) {
        return <>loading</>;
    }
    if (isError) {
        return <>{error}</>;
    }
    if (!data) {
        return <>no data</>;
    }
    return (
        <>
            {data.map((item, index) => {
                return (
                    <Card className={'m-4 p-2'} key={index}>
                        <div className={'flex items-center'}>
                            <img src={item.userProfileUrl} className={'rounded-full w-12 h-12'} />
                            <div className={'flex ml-4 text-xl'}>{item.userName}</div>
                        </div>
                        <hr />
                        <div className={'flex justify-between'}>
                            <div className={'text-black font-bold'}>{item.title}</div>
                            <div>{item.createdAt}</div>
                        </div>
                        <img
                            src={item.image}
                            width={400}
                            height={400}
                            style={{ width: '400px', height: '400px' }}
                        />
                        <div>{item.description}</div>
                    </Card>
                );
            })}
        </>
    );
};
export default AuctionListLegacy;
