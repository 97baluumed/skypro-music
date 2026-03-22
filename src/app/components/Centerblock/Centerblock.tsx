'use client';

import styles from './Centerblock.module.css';
import classnames from 'classnames';
import Track from '../Track/Track';
import { useEffect, useState } from 'react';
import { fetchTracks } from '@/app/api/tracks';
import { useAppSelector } from '@/app/store/store';
import { TrackType } from '@/app/sharedTypes/types';

export default function Centerblock() {
    const [tracks, setTracks] = useState<TrackType[]>([]);
    const [loading, setLoading] = useState(true);
    const accessToken = useAppSelector((state) => state.auth.accessToken);

    useEffect(() => {
        if (!accessToken) return;

        const loadTracks = async () => {
            try {
                const response = await fetchTracks(accessToken);
                if (response.success && Array.isArray(response.data)) {
                    setTracks(response.data);
                } else {
                    setTracks([]);
                }
            } catch (err) {
                console.error('Failed to load tracks:', err);
                setTracks([]);
            } finally {
                setLoading(false);
            }
        };

        loadTracks();
    }, [accessToken]);

    if (loading) return <div className={styles.centerblock}>Загрузка...</div>;

    return (
        <div className={styles.centerblock}>
            <div className={styles.centerblock__search}>
                <svg className={styles.search__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
                </svg>
                <input
                    className={styles.search__text}
                    type="search"
                    placeholder="Поиск"
                    name="search"
                />
            </div>
            <h2 className={styles.centerblock__h2}>Треки</h2>
            <div className={styles.centerblock__filter}>
                <div className={styles.filter__title}>Искать по:</div>
                <div className={styles.filter__button}>исполнителю</div>
                <div className={styles.filter__button}>году выпуска</div>
                <div className={styles.filter__button}>жанру</div>
            </div>
            <div className={styles.centerblock__content}>
                <div className={styles.content__title}>
                    <div className={classnames(styles.playlistTitle__col, styles.col01)}>
                        Трек
                    </div>
                    <div className={classnames(styles.playlistTitle__col, styles.col02)}>
                        Исполнитель
                    </div>
                    <div className={classnames(styles.playlistTitle__col, styles.col03)}>
                        Альбом
                    </div>
                    <div className={classnames(styles.playlistTitle__col, styles.col04)}>
                        <svg className={styles.playlistTitle__svg}>
                            <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
                        </svg>
                    </div>
                </div>
                <div className={styles.content__playlist}>
                    {tracks.length > 0 ? (
                        tracks.map((track) => <Track key={track._id} track={track} />)
                    ) : (
                        <p>Треки не найдены</p>
                    )}
                </div>
            </div>
        </div>
    );
}