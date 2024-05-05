export type RMCharacter = {
    id: number;
    name: string;
    image: string;
    episode: Array<string>;
}

export type RMApiResponse = {
    info: {
        pages: number;
    };
    results: Array<RMCharacter>;
}