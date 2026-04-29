'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Centerblock from '../../../components/Centerblock/Centerblock';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setAllTracks, setTracks } from '@/app/store/features/trackSlice';
import { fetchPlaylistById, fetchTracks } from '@/app/api/tracks';
import { TrackType } from '@/app/sharedTypes/types';

export default function CategoryPage() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const isAuthChecked = useAppSelector((state) => state.auth.isAuthChecked);
    const allTracks = useAppSelector((state) => state.tracks.allTracks);
    const areAllTracksLoaded = useAppSelector((state) => state.tracks.areAllTracksLoaded);

    const [tracks, setTracksLocal] = useState<TrackType[]>([]);
    const [playlistName, setPlaylistName] = useState('Подборка');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const playlistId = Number(params.id);

        if (!isAuthChecked || !accessToken || !playlistId || isNaN(playlistId)) {
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                const playlistRes = await fetchPlaylistById(accessToken, playlistId.toString());
                if (!playlistRes.success) throw new Error('Подборка не найдена');

                const { name, items } = playlistRes.data;

                let tracksData: TrackType[] = [];

                if (areAllTracksLoaded && allTracks.length > 0) {
                    tracksData = allTracks;
                } else {
                    const res = await fetchTracks(accessToken);
                    if (!res.success || !Array.isArray(res.data)) {
                        throw new Error('Не удалось загрузить треки');
                    }
                    tracksData = res.data;
                    dispatch(setAllTracks(res.data));
                }

                const filtered = tracksData.filter(track =>
                    items.map(Number).includes(track._id)
                );

                setTracksLocal(filtered);
                dispatch(setTracks(filtered));
                setPlaylistName(name);
            } catch (err) {
                console.error('Ошибка:', err);
                setTracksLocal([]);
                setPlaylistName('Ошибка');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [accessToken, params.id, areAllTracksLoaded, allTracks, isAuthChecked, dispatch]);

    if (!isAuthChecked || !accessToken) return null;
    if (loading) return <div>Загрузка подборки...</div>;

    return <Centerblock tracks={tracks} playlistName={playlistName} />;
}