'use client';

import styles from './Centerblock.module.css';
import classnames from 'classnames';
import Track from '../Track/Track';
import { useEffect, useState } from 'react';
import { fetchTracks } from '@/app/api/tracks';
import { useAppSelector, useAppDispatch } from '@/app/store/store';
import Search from '../Search/Search';
import { getUniqueValuesByKey } from '@/app/utils/helpers';
import { setTracks as setTracksAction } from '@/app/store/features/trackSlice';

export default function Centerblock({ playlistName = 'Треки' }: { playlistName?: string }) {
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const tracks = useAppSelector((state) => state.tracks.tracks);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (tracks.length > 0) return;
        if (!accessToken) return;

        setLoading(true);
        const loadTracks = async () => {
            try {
                const response = await fetchTracks(accessToken);
                if (response.success && Array.isArray(response.data)) {
                    dispatch(setTracksAction(response.data));
                } else {
                    dispatch(setTracksAction([]));
                }
            } catch (err) {
                console.error('Failed to load tracks:', err);
                dispatch(setTracksAction([]));
            } finally {
                setLoading(false);
            }
        };

        loadTracks();
    }, [tracks.length, accessToken, dispatch]);

    const filteredTracks = tracks
        .filter((track) => !selectedAuthor || track.author === selectedAuthor)
        .filter((track) => {
            const date = new Date(track.release_date);
            const year = !isNaN(date.getTime()) ? date.getFullYear() : 0;
            return !selectedYear || year === selectedYear;
        })
        .filter((track) => !selectedGenre || track.genre.includes(selectedGenre));

    const authors = getUniqueValuesByKey(tracks, 'author');
    const genres = getUniqueValuesByKey(tracks, 'genre');

    const years = [...new Set(
        tracks
            .map(track => {
                const date = new Date(track.release_date);
                return !isNaN(date.getTime()) ? date.getFullYear() : 0;
            })
            .filter(year => year > 0)
    )].sort((a, b) => b - a);

    const toggleFilter = (filterName: string) => {
        setActiveFilter(prev => prev === filterName ? null : filterName);
    };

    const handleAuthorSelect = (author: string) => {
        setSelectedAuthor(author);
        setActiveFilter(null);
    };

    const handleYearSelect = (year: number) => {
        setSelectedYear(year);
        setActiveFilter(null);
    };

    const handleGenreSelect = (genre: string) => {
        setSelectedGenre(genre);
        setActiveFilter(null);
    };

    if (loading && tracks.length === 0) {
        return <div className={styles.centerblock}>Загрузка...</div>;
    }

    return (
        <div className={styles.centerblock}>
            <Search />
            <h2 className={styles.centerblock__h2}>{playlistName}</h2>

            <div className={styles.centerblock__filter}>
                <div className={styles.filter__title}>Искать по:</div>

                <div className={styles.filter__container}>
                    <div
                        className={classnames(styles.filter__button, {
                            [styles.active]: activeFilter === 'author',
                        })}
                        onClick={() => toggleFilter('author')}
                    >
                        исполнителю
                    </div>
                    {activeFilter === 'author' && (
                        <div className={styles.filter__list}>
                            {authors.map(author => (
                                <div
                                    key={author}
                                    className={classnames(styles.filter__item, {
                                        [styles.selected]: selectedAuthor === author,
                                    })}
                                    onClick={() => handleAuthorSelect(author)}
                                >
                                    {author}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.filter__container}>
                    <div
                        className={classnames(styles.filter__button, {
                            [styles.active]: activeFilter === 'year',
                        })}
                        onClick={() => toggleFilter('year')}
                    >
                        году выпуска
                    </div>
                    {activeFilter === 'year' && (
                        <div className={styles.filter__list}>
                            {years.map(year => (
                                <div
                                    key={year}
                                    className={classnames(styles.filter__item, {
                                        [styles.selected]: selectedYear === year,
                                    })}
                                    onClick={() => handleYearSelect(year)}
                                >
                                    {year}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.filter__container}>
                    <div
                        className={classnames(styles.filter__button, {
                            [styles.active]: activeFilter === 'genre',
                        })}
                        onClick={() => toggleFilter('genre')}
                    >
                        жанру
                    </div>
                    {activeFilter === 'genre' && (
                        <div className={styles.filter__list}>
                            {genres.map(genre => (
                                <div
                                    key={genre}
                                    className={classnames(styles.filter__item, {
                                        [styles.selected]: selectedGenre === genre,
                                    })}
                                    onClick={() => handleGenreSelect(genre)}
                                >
                                    {genre}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
                    {filteredTracks.length > 0 ? (
                        filteredTracks.map((track) => (
                            <Track key={track._id} track={track} />
                        ))
                    ) : (
                        <p>Треки не найдены</p>
                    )}
                </div>
            </div>
        </div>
    );
}