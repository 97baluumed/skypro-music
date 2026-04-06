'use client';

import styles from './ProgressBar.module.css';
import { useEffect, useRef } from 'react';

type ProgressBarProps = {
    max: number;
    value: number;
    onChange: (value: number) => void;
};

export default function ProgressBar({ max, value, onChange }: ProgressBarProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newValue = percent * max;
        onChange(newValue);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement !== ref.current) return;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                onChange(Math.max(0, value - 5));
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                onChange(Math.min(max, value + 5));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [value, max, onChange]);

    const percent = max ? (value / max) * 100 : 0;

    return (
        <div
            ref={ref}
            className={styles.progress}
            onClick={handleClick}
            role="slider"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            tabIndex={0}
            style={{ '--percent': `${percent}%` } as React.CSSProperties}
        >
            <div className={styles.progress__fill} style={{ width: `${percent}%` }}></div>
            <div className={styles.progress__thumb}></div>
        </div>
    );
}