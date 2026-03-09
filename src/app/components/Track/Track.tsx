'use client';

import styles from './track.module.css';
import Link from 'next/link';
import { TrackType } from '@/app/sharedTypes/types';
import { useAppDispatch } from '@/app/store/store';
import { formatTime } from '@/app/utils/helpers';
import { setCurrentTrack } from '@/app/store/features/trackSlice';

type TrackProps = {
    track: TrackType;
};

export default function Track({ track }: TrackProps) {
    const dispatch = useAppDispatch();

    const onClickTrack = () => {
        dispatch(setCurrentTrack(track));
    };

    // Извлекаем подзаголовок: (feat. ...) или (Remix)
    const subtitleMatch = track.name.match(/\s*\(.+?\)/);
    const mainName = subtitleMatch ? track.name.replace(subtitleMatch[0], '') : track.name;
    const subtitle = subtitleMatch ? subtitleMatch[0] : '';

    return (
        <div className={styles.playlist__item} onClick={onClickTrack}>
            <div className={styles.playlist__track}>
                <div className={styles.track__title}>
                    <div className={styles.track__titleImage}>
                        <svg className={styles.track__titleSvg}>
                            <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                        </svg>
                    </div>
                    <div className="track__title-text">
                        <Link className={styles.track__titleLink} href="#">
                            {mainName}
                            {subtitle && <span className={styles.track__titleSpan}>{subtitle}</span>}
                        </Link>
                    </div>
                </div>
                <div className={styles.track__author}>
                    <Link className={styles.track__authorLink} href="#">
                        {track.author}
                    </Link>
                </div>
                <div className={styles.track__album}>
                    <Link className={styles.track__albumLink} href="#">
                        {track.album}
                    </Link>
                </div>
                <div className="track__time">
                    <svg className={styles.track__timeSvg}>
                        <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
                    </svg>
                    <span className={styles.track__timeText}>
                        {formatTime(track.duration_in_seconds)}
                    </span>
                </div>
            </div>
        </div>
    );
}