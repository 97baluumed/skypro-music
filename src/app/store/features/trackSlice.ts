import { TrackType } from '@/app/sharedTypes/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
    currentTrack: TrackType | null;
    isPlay: boolean,
};

const initialState: initialStateType = {
    currentTrack: null,
    isPlay: false,
};

const trackSlice = createSlice({
    name: 'tracks',
    initialState,
    reducers: {
        setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
            state.currentTrack = action.payload;
            state.isPlay = true;
        },
        play: (state, action: PayloadAction<boolean>) => {
            state.isPlay = action.payload;
        },
        pause: (state) => {
            state.isPlay = false;
        },
        togglePlay: (state) => {
            state.isPlay = !state.isPlay;
        },
    },
});

export const { setCurrentTrack, play, pause, togglePlay } = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;