import { createSlice } from '@reduxjs/toolkit';

const getFromStorage = (key: string) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
};

const initialState = {
    accessToken: getFromStorage('accessToken'),
    refreshToken: getFromStorage('refreshToken'),
    isLoggedIn: !!getFromStorage('accessToken'),
    email: getFromStorage('userEmail'),
    isAuthChecked: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action) => {
            const { access, refresh, email } = action.payload;
            state.accessToken = access;
            state.refreshToken = refresh;
            state.isLoggedIn = true;
            state.email = email;

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            if (email) localStorage.setItem('userEmail', email);
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.isLoggedIn = false;
            state.email = null;
            state.isAuthChecked = true;

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userEmail');
        },
        rehydrate: (state) => {
            const access = getFromStorage('accessToken');
            const refresh = getFromStorage('refreshToken');
            const email = getFromStorage('userEmail');

            if (access && refresh) {
                state.accessToken = access;
                state.refreshToken = refresh;
                state.isLoggedIn = true;
                state.email = email;
            }
            state.isAuthChecked = true;
        },
    },
});

export const { setTokens, logout, rehydrate } = authSlice.actions;
export const authReducer = authSlice.reducer;