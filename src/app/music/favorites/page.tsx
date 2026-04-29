'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import Centerblock from '@/app/components/Centerblock/Centerblock';
import { setTracks, setMultipleLikedStatuses } from '@/app/store/features/trackSlice';
import { fetchFavoriteTracks } from '@/app/api/favorites';
import { TrackType } from '@/app/sharedTypes/types';

export default function FavoritesPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

    const [tracks, setTracksLocal] = useState<TrackType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn || !accessToken) {
            router.replace('/login');
            return;
        }

        const load = async () => {
            try {
                const data = await fetchFavoriteTracks();
                setTracksLocal(data);
                dispatch(setTracks(data));

                const likedMap = data.reduce<Record<string, boolean>>((acc, track) => {
                    acc[String(track._id)] = true;
                    return acc;
                }, {});

                dispatch(setMultipleLikedStatuses(likedMap));
            } catch (err) {
                console.error('Ошибка загрузки избранного:', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [dispatch, accessToken, isLoggedIn, router]);

    if (!isLoggedIn) return null;
    if (loading) return <div>Загрузка избранного...</div>;

    return <Centerblock tracks={tracks} playlistName="Избранное" />;
}