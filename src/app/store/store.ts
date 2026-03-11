import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { trackSliceReducer } from '@/app/store/features/trackSlice';
import { authReducer } from '@/app/store/features/authSlice';

export const makeStore = () => {
    return configureStore({
        reducer: combineReducers({
            tracks: trackSliceReducer,
            auth: authReducer,
        }),
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

import { useDispatch, useSelector, useStore } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);
export const useAppStore = () => useStore<AppStore>();