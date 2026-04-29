'use client';

import styles from './Centerblock.module.css';
import classnames from 'classnames';
import Track from '../Track/Track';
import { useState } from 'react';
import Search from '../Search/Search';
import { getUniqueValuesByKey } from '@/app/utils/helpers';
import { TrackType } from '@/app/sharedTypes/types';
import { useMemo, useCallback } from 'react';

export default function Centerblock({
    tracks: initialTracks,
    playlistName = 'Треки',
}: {
    tracks: TrackType[];
    playlistName?: string;
}) {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [selectedAuthors, setSelectedAuthors] = useState<Set<string>>(new Set());
    const [selectedYears, setSelectedYears] = useState<Set<number>>(new Set());
    const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTracks = useMemo(() => {
        return initialTracks.filter((track) => {
            const searchMatch = !searchQuery ||
                track.name.toLowerCase().includes(searchQuery.toLowerCase());

            const authorMatch = selectedAuthors.size === 0 ||
                selectedAuthors.has(track.author);

            const date = new Date(track.release_date);
            const year = !isNaN(date.getTime()) ? date.getFullYear() : 0;
            const yearMatch = selectedYears.size === 0 ||
                selectedYears.has(year);

            const genreMatch = selectedGenres.size === 0 ||
                track.genre.some(genre => selectedGenres.has(genre));

            return searchMatch && authorMatch && yearMatch && genreMatch;
        });
    }, [initialTracks, selectedAuthors, selectedYears, selectedGenres, searchQuery]);

    const toggleFilter = useCallback((filterName: string) => {
        setActiveFilter(prev => prev === filterName ? null : filterName);
    }, []);

    const handleAuthorSelect = useCallback((author: string) => {
        setSelectedAuthors(prev => {
            const newSet = new Set(prev);
            if (newSet.has(author)) {
                newSet.delete(author);
            } else {
                newSet.add(author);
            }
            return newSet;
        });
    }, []);

    const handleYearSelect = useCallback((year: number) => {
        setSelectedYears(prev => {
            const newSet = new Set(prev);
            if (newSet.has(year)) {
                newSet.delete(year);
            } else {
                newSet.add(year);
            }
            return newSet;
        });
    }, []);

    const handleGenreSelect = useCallback((genre: string) => {
        setSelectedGenres(prev => {
            const newSet = new Set(prev);
            if (newSet.has(genre)) {
                newSet.delete(genre);
            } else {
                newSet.add(genre);
            }
            return newSet;
        });
    }, []);

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
    }, []);

    const authors = getUniqueValuesByKey(initialTracks, 'author');
    const genres = getUniqueValuesByKey(initialTracks, 'genre');
    const years = [...new Set(
        initialTracks
            .map(track => {
                const date = new Date(track.release_date);
                return !isNaN(date.getTime()) ? date.getFullYear() : 0;
            })
            .filter(year => year > 0)
    )].sort((a, b) => b - a);

    return (
        <div className={styles.centerblock}>
            <Search onSearchChange={handleSearchChange} />
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
                                        [styles.selected]: selectedAuthors.has(author),
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
                                        [styles.selected]: selectedYears.has(year),
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
                                        [styles.selected]: selectedGenres.has(genre),
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