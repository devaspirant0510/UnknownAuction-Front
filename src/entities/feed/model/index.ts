export type FileProjection = {
    id: number;
    fileId: number;
    url: string;
    fileType: 'FEED' | 'PROFILE' | string;
};

export type FeedListResponse = {
    id: number;
    contents: string;
    writerId: number | null;
    writerName: string;
    writerProfileImageUrl: string | null;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    liked: boolean;
    images: FileProjection[];
};
