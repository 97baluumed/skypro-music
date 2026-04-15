'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Centerblock from '@/app/components/Centerblock/Centerblock';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setAllTracks, setTracks } from '@/app/store/features/trackSlice';
import { fetchTracks } from '@/app/api/tracks';
import { TrackType } from '@/app/sharedTypes/types';

export default function MainPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const isAuthChecked = useAppSelector((state) => state.auth.isAuthChecked);
    const areAllTracksLoaded = useAppSelector((state) => state.tracks.areAllTracksLoaded);
    const allTracks = useAppSelector((state) => state.tracks.allTracks);

    const [tracks, setTracksLocal] = useState<TrackType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthChecked) return;
        if (!accessToken) {
            router.replace('/login');
            return;
        }

        const load = async () => {
            try {
                if (areAllTracksLoaded && allTracks.length > 0) {
                    setTracksLocal(allTracks);
                    dispatch(setTracks(allTracks));
                    setLoading(false);
                    return;
                }

                const res = await fetchTracks(accessToken);
                if (res.success && Array.isArray(res.data)) {
                    setTracksLocal(res.data);
                    dispatch(setAllTracks(res.data));
                    dispatch(setTracks(res.data));
                } else {
                    setTracksLocal([]);
                }
            } catch (err) {
                console.error('Ошибка загрузки треков:', err);
                setTracksLocal([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [isAuthChecked, accessToken, areAllTracksLoaded, allTracks, dispatch, router]);

    if (!isAuthChecked || !accessToken) return null;
    if (loading) return <div>Загрузка...</div>;

    return <Centerblock tracks={tracks} playlistName="Треки" />;
}