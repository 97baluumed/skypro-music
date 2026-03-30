'use client';

import styles from './bar.module.css';
import Link from 'next/link';
import classnames from 'classnames';
import { useAppSelector, useAppDispatch } from '@/app/store/store';
import { useRef, useEffect } from 'react';
import {
    togglePlay,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleLoop,
    setVolume,
    setCurrentTime,
} from '@/app/store/features/trackSlice';
import ProgressBar from '../ProgressBar/ProgressBar';
import { formatTime } from '@/app/utils/helpers';

export default function Bar() {
    const dispatch = useAppDispatch();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
    const isPlay = useAppSelector((state) => state.tracks.isPlay);
    const isShuffle = useAppSelector((state) => state.tracks.isShuffle);
    const isLoop = useAppSelector((state) => state.tracks.isLoop);
    const volume = useAppSelector((state) => state.tracks.volume);
    const currentTime = useAppSelector((state) => state.tracks.currentTime);
    const duration = currentTrack?.duration_in_seconds || 0;


    useEffect(() => {
        const audio = audioRef.current;
        if (!currentTrack || !audio) return;

        audio.src = currentTrack.track_file;
        audio.volume = volume;
        audio.currentTime = 0;
    }, [currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            dispatch(setCurrentTime(audio.currentTime));
        };

        const updateOnEnd = () => {
            if (isLoop) {
                audio.play().catch(console.warn);
            } else {
                dispatch(nextTrack());
            }
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('ended', updateOnEnd);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('ended', updateOnEnd);
        };
    }, [dispatch]);



    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentTrack) return;

        if (isPlay) {
            audio.play().catch(err => console.warn('Play failed (autoplay):', err));
        } else {
            audio.pause();
        }
    }, [isPlay, currentTrack]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleTogglePlay = () => dispatch(togglePlay());
    const handlePrev = () => dispatch(prevTrack());
    const handleNext = () => dispatch(nextTrack());
    const handleShuffle = () => dispatch(toggleShuffle());
    const handleLoop = () => dispatch(toggleLoop());

    const handleSeek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
        dispatch(setCurrentTime(time));
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = Number(e.target.value);
        dispatch(setVolume(vol));
    };

    if (!currentTrack) return null;

    return (
        <div className={styles.bar}>
            <audio ref={audioRef} />
            <div className={styles.bar__content}>
                <div className={styles.bar__playerProgress}>
                    <ProgressBar max={duration} value={currentTime} onChange={handleSeek} />
                </div>
                <div className={styles.bar__playerBlock}>
                    <div className={styles.bar__player}>
                        <div className={styles.player__controls}>
                            <div
                                className={classnames(styles.player__btnPrev, styles.btn)}
                                onClick={handlePrev}
                                role="button"
                                aria-label="Previous track"
                            >
                                <svg className={styles.player__btnPrevSvg}>
                                    <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                                </svg>
                            </div>

                            <div
                                className={classnames(styles.player__btnPlay, styles.btn)}
                                onClick={handleTogglePlay}
                                role="button"
                                aria-label={isPlay ? 'Pause' : 'Play'}
                            >
                                <svg className={styles.player__btnPlaySvg}>
                                    <use
                                        xlinkHref={
                                            isPlay
                                                ? '/img/icon/sprite.svg#icon-pause'
                                                : '/img/icon/sprite.svg#icon-play'
                                        }
                                    ></use>
                                </svg>
                            </div>

                            <div
                                className={classnames(styles.player__btnNext, styles.btn)}
                                onClick={handleNext}
                                role="button"
                                aria-label="Next track"
                            >
                                <svg className={styles.player__btnNextSvg}>
                                    <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                                </svg>
                            </div>

                            <div
                                className={classnames(
                                    styles.player__btnRepeat,
                                    styles.btnIcon,
                                    isLoop && styles.active
                                )}
                                onClick={handleLoop}
                                role="button"
                                aria-label={isLoop ? 'Disable loop' : 'Enable loop'}
                            >
                                <svg className={styles.player__btnRepeatSvg}>
                                    <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                                </svg>
                            </div>

                            <div
                                className={classnames(
                                    styles.player__btnShuffle,
                                    styles.btnIcon,
                                    isShuffle && styles.active
                                )}
                                onClick={handleShuffle}
                                role="button"
                                aria-label={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
                            >
                                <svg className={styles.player__btnShuffleSvg}>
                                    <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                                </svg>
                            </div>
                        </div>

                        <div className={styles.player__trackPlay}>
                            <div className={styles.trackPlay__contain}>
                                <div className={styles.trackPlay__image}>
                                    <svg className={styles.trackPlay__svg}>
                                        <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                                    </svg>
                                </div>
                                <div className={styles.trackPlay__author}>
                                    <Link className={styles.trackPlay__authorLink} href="#">
                                        {currentTrack.author || 'Неизвестный автор'}
                                    </Link>
                                </div>
                                <div className={styles.trackPlay__album}>
                                    <Link className={styles.trackPlay__albumLink} href="#">
                                        {currentTrack.album || 'Неизвестный альбом'}
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.trackPlay__likeDis}>
                                <div className={classnames(styles.trackPlay__like, styles.btnIcon)}>
                                    <svg className={styles.trackPlay__likeSvg}>
                                        <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                                    </svg>
                                </div>
                                <div className={classnames(styles.trackPlay__dislike, styles.btnIcon)}>
                                    <svg className={styles.trackPlay__dislikeSvg}>
                                        <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.bar__volumeBlock}>
                        <div className={styles.volume__content}>
                            <div className={styles.volume__image}>
                                <svg className={styles.volume__svg}>
                                    <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                                </svg>
                            </div>

                            <div className={styles.volume__progress}>
                                <input
                                    className={styles.volume__progressLine}
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                />
                            </div>
                            <div className={styles.volume__time}>
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}