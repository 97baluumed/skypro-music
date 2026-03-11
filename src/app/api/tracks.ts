import { TrackType } from '@/app/sharedTypes/types';

export interface TracksResponse {
    success: boolean;
    data: TrackType[];
}

export const fetchTracks = async (
    accessToken: string
): Promise<TracksResponse> => {
    const res = await fetch(
        'https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!res.ok) {
        const error = await res.text();
        console.error('Fetch tracks error:', error);
        throw new Error(`Failed to fetch tracks: ${res.status}`);
    }

    return res.json();
};