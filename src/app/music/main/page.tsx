'use client';

import { useEffect } from 'react';
import Centerblock from '@/app/components/Centerblock/Centerblock';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchTracks } from '@/app/api/tracks';
import { setTracks as setTracksAction } from '@/app/store/features/trackSlice';

export default function MainPage() {
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector((state) => state.auth.accessToken);

    useEffect(() => {
        if (!accessToken) return;

        const loadAllTracks = async () => {
            try {
                const response = await fetchTracks(accessToken);
                if (response.success && Array.isArray(response.data)) {
                    dispatch(setTracksAction(response.data));
                } else {
                    dispatch(setTracksAction([]));
                }
            } catch (err) {
                console.error('Failed to load main tracks:', err);
                dispatch(setTracksAction([]));
            }
        };

        loadAllTracks();
    }, [accessToken, dispatch]);

    return <Centerblock playlistName="Треки" />;
}