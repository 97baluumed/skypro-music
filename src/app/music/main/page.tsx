'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Centerblock from '@/app/components/Centerblock/Centerblock';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setTracks as setTracksAction } from '@/app/store/features/trackSlice';
import { fetchTracks } from '@/app/api/tracks';

export default function MainPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const isAuthChecked = useAppSelector((state) => state.auth.isAuthChecked);

    useEffect(() => {
        if (!isAuthChecked) return;

        if (!accessToken) {
            router.replace('/login');
            return;
        }

        const loadTracks = async () => {
            try {
                const res = await fetchTracks(accessToken);
                if (res.success && Array.isArray(res.data)) {
                    dispatch(setTracksAction(res.data));
                }
            } catch (err) {
                console.error('Ошибка загрузки треков:', err);
                dispatch(setTracksAction([]));
            }
        };

        loadTracks();
    }, [isAuthChecked, accessToken, dispatch, router]);

    if (!isAuthChecked || !accessToken) {
        return null;
    }

    return <Centerblock playlistName="Треки" />;
}