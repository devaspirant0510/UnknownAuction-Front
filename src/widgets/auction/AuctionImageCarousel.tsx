import React, { FC } from 'react';
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from '@shared/components/ui/carousel.tsx';
import { Card, CardContent, CardFooter } from '@shared/components/ui/card.tsx';
import { FileEntity } from '@entities/auction/model';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AuctionWishListButton from '@/features/auction/ui/AuctionWishListButton.tsx';
import { useParams } from 'react-router';
import { Button } from '@shared/components/ui/button.tsx';

type Props = {
    images: FileEntity[];
    isWishListed: boolean;
};
const AuctionImageCarousel: FC<Props> = ({ images, isWishListed }) => {
    const { id: auctionId } = useParams<{ id: number }>();
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    if (!auctionId) {
        return <></>;
    }

    return (
        <div className=' '>
            <Card>
                <CardContent className='p-0 relative'>
                    <Carousel setApi={setApi} className={'w-full '}>
                        <CarouselContent>
                            {images.map((image, index) => {
                                return (
                                    <CarouselItem className={''} key={index}>
                                        <div className='flex items-center justify-center p-6 relative'>
                                            <img
                                                className='w-full h-auto max-h-96 object-contain'
                                                src={image.url}
                                            />
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                    </Carousel>
                    <Button
                        onClick={() => api?.scrollPrev()}
                        className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow'
                    >
                        <ChevronLeft className='h-6 w-6 text-uprimary' />
                    </Button>
                    <Button
                        onClick={() => api?.scrollNext()}
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow'
                    >
                        <ChevronRight className='h-6 w-6 text-uprimary' />
                    </Button>
                </CardContent>
                <CardFooter>
                    <div className={'flex justify-between w-full items-center'}>
                        <div></div>
                        <div className='flex justify-center space-x-2 w-full'>
                            {Array.from({ length: count }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                        i === current - 1 ? 'bg-uprimary' : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <div className={''}>
                            <AuctionWishListButton
                                isWishListed={isWishListed}
                                auctionId={auctionId}
                            />
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AuctionImageCarousel;
