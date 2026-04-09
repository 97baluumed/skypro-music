import { TrackType } from '@/app/sharedTypes/types';

export interface TracksResponse {
    success: boolean;
    data: TrackType[];
}

export interface PlaylistResponse {
    success: boolean;
    data: {
        _id: number;
        name: string;
        items: number[];
        owner: number[];
        __v?: number;
    };
}

export const fetchTracks = async (accessToken: string): Promise<TracksResponse> => {
    const res = await fetch('https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        const error = await res.text();
        console.error('Fetch tracks error:', error);
        throw new Error(`Failed to fetch tracks: ${res.status}`);
    }

    return res.json();
};

export const fetchPlaylistById = async (
    accessToken: string,
    playlistId: string
): Promise<PlaylistResponse> => {
    const res = await fetch(
        `https://webdev-music-003b5b991590.herokuapp.com/catalog/selection/${playlistId}/`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!res.ok) {
        const error = await res.text();
        console.error('Fetch playlist error:', error);
        throw new Error(`Failed to fetch playlist: ${res.status}`);
    }

    return res.json();
};