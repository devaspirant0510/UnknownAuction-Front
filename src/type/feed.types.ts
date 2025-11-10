export interface LikeStatus {
    isLiked: boolean;
    count: number;
}

export interface FeedItemProps {
    feedId: number;
    isLiked: boolean;
    likeCount: number;
    onLikeToggle: (feedId: number) => Promise<void>;
}
