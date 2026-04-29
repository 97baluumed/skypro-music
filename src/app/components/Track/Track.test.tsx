import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Track from './Track';
import { RootState } from '@/app/store/store';

const createTestStore = (state?: Partial<RootState>) => {
    const defaultState: RootState = {
        tracks: {
            allTracks: [],
            tracks: [],
            currentTrack: null,
            isPlay: false,
            isShuffle: false,
            isLoop: false,
            volume: 0.8,
            currentTime: 0,
            areAllTracksLoaded: false,
            likedTracks: {}
        },
        auth: {
            accessToken: 'test-token',
            refreshToken: null,
            isLoggedIn: true,
            email: 'test@example.com',
            isAuthChecked: true
        }
    };

    return configureStore({
        reducer: {
            tracks: (state = defaultState.tracks, _action) => state,
            auth: (state = defaultState.auth, _action) => state
        },
        preloadedState: state ? { ...defaultState, ...state } : defaultState
    });
};

const mockTrack = {
    _id: 1,
    name: 'Test Track',
    author: 'Test Artist',
    release_date: '2023-01-01',
    genre: ['Rock'] as string[],
    duration_in_seconds: 180,
    album: 'Test Album',
    logo: null,
    track_file: 'track.mp3',
    stared_user: [] as number[]
};

describe('Track Component', () => {
    test('рендерит трек с корректной информацией', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <Track track={mockTrack} />
            </Provider>
        );

        expect(screen.getByText('Test Track')).toBeInTheDocument();
        expect(screen.getByText('Test Artist')).toBeInTheDocument();
        expect(screen.getByText('Test Album')).toBeInTheDocument();
        expect(screen.getByText('3:00')).toBeInTheDocument();
    });

    test('отображает активный статус при совпадении с текущим треком', () => {
        const store = createTestStore({
            tracks: {
                allTracks: [],
                tracks: [],
                currentTrack: mockTrack,
                isPlay: true,
                isShuffle: false,
                isLoop: false,
                volume: 0.8,
                currentTime: 0,
                areAllTracksLoaded: false,
                likedTracks: {}
            }
        });

        render(
            <Provider store={store}>
                <Track track={mockTrack} />
            </Provider>
        );

        const trackElement = screen.getByText('Test Track').closest('.playlist__item');
        expect(trackElement).toHaveClass('playlist__item--active');
        expect(trackElement).toHaveClass('playlist__item--playing');
    });

    test('отображает состояние лайка', () => {
        const store = createTestStore({
            tracks: {
                allTracks: [],
                tracks: [],
                currentTrack: null,
                isPlay: false,
                isShuffle: false,
                isLoop: false,
                volume: 0.8,
                currentTime: 0,
                areAllTracksLoaded: false,
                likedTracks: { '1': true }
            }
        });

        render(
            <Provider store={store}>
                <Track track={mockTrack} />
            </Provider>
        );

        const likeButton = screen.getByTestId('like-button');
        const likeIcon = likeButton.querySelector('svg');
        expect(likeIcon).toHaveClass('active');
    });

    test('вызывает setCurrentTrack при клике на трек', () => {
        const store = createTestStore();
        const dispatchSpy = jest.spyOn(store, 'dispatch');

        render(
            <Provider store={store}>
                <Track track={mockTrack} />
            </Provider>
        );

        const trackElement = screen.getByText('Test Track').closest('.playlist__item');
        fireEvent.click(trackElement!);

        expect(dispatchSpy).toHaveBeenCalled();
    });

    test('обрабатывает лайк/дизлайк трека', () => {
        const store = createTestStore({
            tracks: {
                allTracks: [],
                tracks: [],
                currentTrack: null,
                isPlay: false,
                isShuffle: false,
                isLoop: false,
                volume: 0.8,
                currentTime: 0,
                areAllTracksLoaded: false,
                likedTracks: {}
            }
        });
        const dispatchSpy = jest.spyOn(store, 'dispatch');

        render(
            <Provider store={store}>
                <Track track={mockTrack} />
            </Provider>
        );

        const likeButton = screen.getByTestId('like-button');
        fireEvent.click(likeButton);

        expect(dispatchSpy).toHaveBeenCalled();
    });

    test('корректно обрабатывает трек без данных', () => {
        const emptyTrack = {
            ...mockTrack,
            name: '',
            author: '',
            album: ''
        };
        const store = createTestStore();

        render(
            <Provider store={store}>
                <Track track={emptyTrack} />
            </Provider>
        );

        expect(screen.getByText('Неизвестный трек')).toBeInTheDocument();
        expect(screen.getByText('Неизвестный автор')).toBeInTheDocument();
        expect(screen.getByText('Неизвестный альбом')).toBeInTheDocument();
    });

    test('обрабатывает длительность трека', () => {
        const shortTrack = { ...mockTrack, duration_in_seconds: 45 };
        const longTrack = { ...mockTrack, duration_in_seconds: 3661 };

        const store = createTestStore();

        render(
            <Provider store={store}>
                <>
                    <Track track={shortTrack} />
                    <Track track={longTrack} />
                </>
            </Provider>
        );

        expect(screen.getByText('0:45')).toBeInTheDocument();
        expect(screen.getByText('61:01')).toBeInTheDocument();
    });
});