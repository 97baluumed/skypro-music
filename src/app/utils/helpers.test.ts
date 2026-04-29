import { getUniqueValuesByKey, formatTime } from './helpers';
import { TrackType } from '../sharedTypes/types';

describe('getUniqueValuesByKey', () => {
    const mockTracks: TrackType[] = [
        {
            _id: 1,
            name: 'Track 1',
            author: 'Artist A',
            release_date: '2023-01-01',
            genre: ['Rock', 'Pop'],
            duration_in_seconds: 180,
            album: 'Album 1',
            logo: null,
            track_file: 'track1.mp3',
            stared_user: []
        },
        {
            _id: 2,
            name: 'Track 2',
            author: 'Artist B',
            release_date: '2023-02-01',
            genre: ['Jazz'],
            duration_in_seconds: 240,
            album: 'Album 2',
            logo: null,
            track_file: 'track2.mp3',
            stared_user: []
        },
        {
            _id: 3,
            name: 'Track 3',
            author: 'Artist A',
            release_date: '2023-03-01',
            genre: ['Rock', 'Blues'],
            duration_in_seconds: 200,
            album: 'Album 3',
            logo: null,
            track_file: 'track3.mp3',
            stared_user: []
        }
    ];

    test('должна возвращать уникальных авторов', () => {
        const result = getUniqueValuesByKey(mockTracks, 'author');
        expect(result).toEqual(['Artist A', 'Artist B']);
        expect(result.length).toBe(2);
    });

    test('должна возвращать уникальные жанры', () => {
        const result = getUniqueValuesByKey(mockTracks, 'genre');
        expect(result).toEqual(['Rock', 'Pop', 'Jazz', 'Blues']);
        expect(result.length).toBe(4);
    });

    test('должна возвращать пустой массив при пустом входе', () => {
        const result = getUniqueValuesByKey([], 'author');
        expect(result).toEqual([]);
    });

    test('должна корректно обрабатывать отсутствующие значения', () => {
        const tracksWithNull: TrackType[] = [
            {
                _id: 1,
                name: 'Track 1',
                author: '',
                release_date: '2023-01-01',
                genre: [],
                duration_in_seconds: 180,
                album: '',
                logo: null,
                track_file: 'track1.mp3',
                stared_user: []
            }
        ];

        const result = getUniqueValuesByKey(tracksWithNull, 'author');
        expect(result).toEqual(['']);
    });
});

describe('formatTime', () => {
    test('должна форматировать время корректно', () => {
        expect(formatTime(65)).toBe('1:05');
        expect(formatTime(120)).toBe('2:00');
        expect(formatTime(90)).toBe('1:30');
        expect(formatTime(0)).toBe('0:00');
        expect(formatTime(59)).toBe('0:59');
    });

    test('должна обрабатывать граничные случаи', () => {
        expect(formatTime(-1)).toBe('0:00');
        expect(formatTime(NaN)).toBe('0:00');
        expect(formatTime(Infinity)).toBe('Infinity:00');
    });
});