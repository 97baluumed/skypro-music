'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Centerblock from '@/app/components/Centerblock/Centerblock';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchTracks } from '@/app/api/tracks';
import { setTracks as setTracksAction } from '@/app/store/features/trackSlice';

export default function MainPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const isAuthChecked = useAppSelector((state) => state.auth.isAuthChecked);

    useEffect(() => {
        if (!isAuthChecked) return; // Ждём завершения проверки

        if (!accessToken) {
            router.push('/login');
        }
    }, [isAuthChecked, accessToken, router]);

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

    if (!isAuthChecked || !accessToken) {
        return null; // Пока не авторизован — ничего не показываем
    }

    return <Centerblock playlistName="Треки" />;
}