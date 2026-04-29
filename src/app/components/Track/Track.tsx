'use client';

import styles from './track.module.css';
import Link from 'next/link';
import { TrackType } from '@/app/sharedTypes/types';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { formatTime } from '@/app/utils/helpers';
import { setCurrentTrack, setLikedStatus } from '@/app/store/features/trackSlice';
import { addTrackToFavorite, removeTrackFromFavorite } from '@/app/api/favorites';
import classnames from 'classnames';

type TrackProps = {
    track: TrackType;
};

export default function Track({ track }: TrackProps) {
    const dispatch = useAppDispatch();
    const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
    const isPlaying = useAppSelector((state) => state.tracks.isPlay);
    const isLiked = useAppSelector((state) => !!track && !!state.tracks.likedTracks[track._id]);

    const isActive = currentTrack?._id === track._id;
    const isCurrentAndPlaying = isActive && isPlaying;

    const onClickTrack = () => {
        dispatch(setCurrentTrack(track));
    };

    const durationInSeconds = typeof track.duration_in_seconds === 'number' &&
        !isNaN(track.duration_in_seconds)
        ? track.duration_in_seconds
        : 0;

    const subtitleMatch = track.name?.match(/\s*\(.+?\)/) || null;
    const mainName = subtitleMatch ? (track.name?.replace(subtitleMatch[0], '') || track.name) : track.name;
    const subtitle = subtitleMatch ? subtitleMatch[0] : '';

    return (
        <div
            className={`${styles.playlist__item} ${isActive ? styles['playlist__item--active'] : ''} ${isCurrentAndPlaying ? styles['playlist__item--playing'] : ''}`}
            onClick={onClickTrack}
        >
            <div className={styles.playlist__track}>
                <div className={styles.track__title}>
                    <div className={styles.track__titleImage}>
                        {isActive ? (
                            <div className={styles.track__dot}></div>
                        ) : (
                            <svg className={styles.track__titleSvg}>
                                <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                            </svg>
                        )}
                    </div>

                    <div className="track__title-text">
                        <Link className={styles.track__titleLink} href="#">
                            {mainName || 'Неизвестный трек'}
                            {subtitle && <span className={styles.track__titleSpan}>{subtitle}</span>}
                        </Link>
                    </div>
                </div>
                <div className={styles.track__author}>
                    <Link className={styles.track__authorLink} href="#">
                        {track.author || 'Неизвестный автор'}
                    </Link>
                </div>
                <div className={styles.track__album}>
                    <Link className={styles.track__albumLink} href="#">
                        {track.album || 'Неизвестный альбом'}
                    </Link>
                </div>
                <div className={styles.track__like}>
                    <div
                        data-testid="like-button"
                        className={styles.track__likeButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            const newStatus = !isLiked;
                            const trackId = String(track._id);

                            dispatch(setLikedStatus({ trackId, isLiked: newStatus }));

                            if (newStatus) {
                                addTrackToFavorite(trackId).catch(() => {
                                    dispatch(setLikedStatus({ trackId, isLiked: false }));
                                });
                            } else {
                                removeTrackFromFavorite(trackId).catch(() => {
                                    dispatch(setLikedStatus({ trackId, isLiked: true }));
                                });
                            }
                        }}
                        role="button"
                        aria-label={isLiked ? 'Удалить из избранного' : 'Добавить в избранное'}
                    >
                        <svg
                            className={classnames(styles.track__likeSvg, { [styles.active]: isLiked })}
                        >
                            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                        </svg>
                    </div>
                </div>
                <div className="track__time">
                    {/* <svg className={styles.track__timeSvg}>
                        <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
                    </svg> */}
                    <span className={styles.track__timeText}>
                        {formatTime(durationInSeconds)}
                    </span>
                </div>
            </div>
        </div>
    );
}