import { TrackType } from "../sharedTypes/types";

export function getUniqueValuesByKey(
    arr: TrackType[],
    key: keyof TrackType,
): string[] {
    // Используем Set для хранения уникальных значений
    const uniqueValues = new Set<string>();

    // Проходим по массиву и добавляем уникальные значения ключа в Set
    arr.forEach((item) => {
        const value = item[key];

        // Если значение - массив строк
        if (Array.isArray(value)) {
            value.forEach((v) => {
                if (v) {
                    uniqueValues.add(String(v));
                }
            });
        }
        // Если значение - строка
        else if (typeof value === 'string') {
            uniqueValues.add(value);
        }
        // Если значение - число
        else if (typeof value === 'number') {
            uniqueValues.add(String(value));
        }
    });

    // Преобразуем Set в массив и возвращаем его
    return Array.from(uniqueValues);
}

export const formatTime = (seconds: number): string => {
    // Проверяем на NaN и отрицательные значения
    if (isNaN(seconds) || seconds < 0) {
        return '0:00';
    }

    // Обработка бесконечности
    if (!isFinite(seconds)) {
        return `${seconds}:00`;
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};