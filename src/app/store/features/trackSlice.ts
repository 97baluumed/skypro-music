import { TrackType } from '@/app/sharedTypes/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
    allTracks: TrackType[];
    tracks: TrackType[];
    currentTrack: TrackType | null;
    isPlay: boolean;
    isShuffle: boolean;
    isLoop: boolean;
    volume: number;
    currentTime: number;
    areAllTracksLoaded: boolean;
    likedTracks: Record<string, boolean>;
};

const initialState: initialStateType = {
    allTracks: [],
    tracks: [],
    currentTrack: null,
    isPlay: false,
    isShuffle: false,
    isLoop: false,
    volume: 0.8,
    currentTime: 0,
    areAllTracksLoaded: false,
    likedTracks: {},
};

const trackSlice = createSlice({
    name: 'tracks',
    initialState,
    reducers: {
        setAllTracks: (state, action: PayloadAction<TrackType[]>) => {
            state.allTracks = action.payload;
            state.areAllTracksLoaded = true;
        },
        setTracks: (state, action: PayloadAction<TrackType[]>) => {
            state.tracks = action.payload;
        },
        setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
            state.currentTrack = action.payload;
            state.isPlay = true;
            state.currentTime = 0;
        },
        togglePlay: (state) => {
            state.isPlay = !state.isPlay;
        },
        toggleShuffle: (state) => {
            state.isShuffle = !state.isShuffle;
        },
        toggleLoop: (state) => {
            state.isLoop = !state.isLoop;
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload;
        },
        setCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        nextTrack: (state) => {
            if (!state.currentTrack || state.tracks.length <= 1) return;

            const currentIndex = state.tracks.findIndex(t => t._id === state.currentTrack?._id);
            let nextIndex;

            if (state.isShuffle) {
                const available = state.tracks.filter(t => t._id !== state.currentTrack?._id);
                const randomTrack = available[Math.floor(Math.random() * available.length)];
                nextIndex = state.tracks.findIndex(t => t._id === randomTrack._id);
            } else {
                nextIndex = (currentIndex + 1) % state.tracks.length;
            }

            state.currentTrack = state.tracks[nextIndex];
            state.isPlay = true;
        },
        prevTrack: (state) => {
            if (!state.currentTrack || state.tracks.length <= 1) return;

            const currentIndex = state.tracks.findIndex(t => t._id === state.currentTrack?._id);

            if (state.currentTime > 3) {
                state.currentTime = 0;
                return;
            }

            let prevIndex;

            if (state.isShuffle) {
                const available = state.tracks.filter(t => t._id !== state.currentTrack?._id);
                const randomTrack = available[Math.floor(Math.random() * available.length)];
                prevIndex = state.tracks.findIndex(t => t._id === randomTrack._id);
            } else {
                prevIndex = (currentIndex - 1 + state.tracks.length) % state.tracks.length;
            }

            state.currentTrack = state.tracks[prevIndex];
            state.isPlay = true;
        },
        setLikedStatus: (state, action: PayloadAction<{ trackId: string; isLiked: boolean }>) => {
            state.likedTracks[action.payload.trackId] = action.payload.isLiked;
        },
        setMultipleLikedStatuses: (state, action: PayloadAction<Record<string, boolean>>) => {
            state.likedTracks = { ...state.likedTracks, ...action.payload };
        },
        removeLikedTrack: (state, action: PayloadAction<string>) => {
            delete state.likedTracks[action.payload];
        },
    },
});

export const {
    setAllTracks,
    setTracks,
    setCurrentTrack,
    togglePlay,
    toggleShuffle,
    toggleLoop,
    setVolume,
    setCurrentTime,
    nextTrack,
    prevTrack,
    setLikedStatus,
    setMultipleLikedStatuses,
    removeLikedTrack,
} = trackSlice.actions;

export const trackSliceReducer = trackSlice.reducer;