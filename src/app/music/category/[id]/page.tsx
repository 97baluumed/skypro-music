'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Centerblock from '../../../components/Centerblock/Centerblock';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setTracks } from '@/app/store/features/trackSlice';
import { fetchTracks, fetchPlaylistById } from '@/app/api/tracks';
import styles from '../../../components/Centerblock/Centerblock.module.css';

export default function CategoryPage() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const allTracks = useAppSelector((state) => state.tracks.tracks);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [playlistName, setPlaylistName] = useState<string>('Треки');

    useEffect(() => {
        const playlistId = Number(params.id);

        if (!accessToken) return;
        if (playlistId === 1) {
            setError('Подборка не найдена');
            setLoading(false);
            return;
        }

        const loadCategory = async () => {
            try {
                let tracksToUse = allTracks;
                if (tracksToUse.length === 0) {
                    const tracksRes = await fetchTracks(accessToken);
                    if (!tracksRes.success || !Array.isArray(tracksRes.data)) {
                        throw new Error('Не удалось загрузить треки');
                    }
                    tracksToUse = tracksRes.data;
                    dispatch(setTracks(tracksToUse));
                }

                const playlistRes = await fetchPlaylistById(accessToken, playlistId.toString());
                if (!playlistRes.success) {
                    throw new Error('Подборка не найдена');
                }

                const playlist = playlistRes.data;
                const itemIds = Array.isArray(playlist.items) ? playlist.items : [];

                const filteredTracks = tracksToUse.filter(track =>
                    itemIds.includes(typeof track._id === 'string' ? parseInt(track._id) : track._id)
                );

                setPlaylistName(playlist.name);

                dispatch(setTracks(filteredTracks));
            } catch (err) {
                console.error('Ошибка загрузки подборки:', err);
                setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
                dispatch(setTracks([]));
            } finally {
                setLoading(false);
            }
        };

        loadCategory();
    }, [accessToken, params.id, dispatch, allTracks]);

    if (loading) {
        return <div className={styles.centerblock}> Загрузка подборки...</div >;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <Centerblock playlistName={playlistName} />;
}