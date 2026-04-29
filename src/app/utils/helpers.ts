import { TrackType } from "../sharedTypes/types";

export function getUniqueValuesByKey(
    arr: TrackType[],
    key: keyof TrackType,
): string[] {
    const uniqueValues = new Set<string>();

    arr.forEach((item) => {
        const value = item[key];

        if (Array.isArray(value)) {
            value.forEach((v) => {
                if (v) {
                    uniqueValues.add(String(v));
                }
            });
        }
        else if (typeof value === 'string') {
            uniqueValues.add(value);
        }
        else if (typeof value === 'number') {
            uniqueValues.add(String(value));
        }
    });

    return Array.from(uniqueValues);
}

export const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) {
        return '0:00';
    }

    if (!isFinite(seconds)) {
        return `${seconds}:00`;
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};