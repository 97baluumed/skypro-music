import axios from 'axios';
import { TrackType } from '@/app/sharedTypes/types';

const API_BASE = 'https://webdev-music-003b5b991590.herokuapp.com';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const withReAuth = async <T>(
    requestFn: (token: string) => Promise<T>
): Promise<T> => {
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');

    try {
        return await requestFn(access!);
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 401 && refresh) {

            try {
                const res = await axios.post<{ access: string }>(`${API_BASE}/user/token/refresh/`, { refresh });
                const newAccess = res.data.access;
                localStorage.setItem('accessToken', newAccess);

                return await requestFn(newAccess);
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userEmail');
                window.location.href = '/login';
                throw new Error('Сессия истекла');
            }
        }
        console.error('API request failed:', error);
        throw error;
    }
};

export const fetchFavoriteTracks = async (): Promise<TrackType[]> => {
    return withReAuth(async (token) => {
        const res = await axios.get<ApiResponse<TrackType[]>>(
            `${API_BASE}/catalog/track/favorite/all/`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        if (res.data.success && Array.isArray(res.data.data)) {
            return res.data.data;
        }
        throw new Error('Нет данных или ответ не массив');
    });
};

export const addTrackToFavorite = async (trackId: string): Promise<void> => {
    await withReAuth(async (token) => {
        await axios.post(`${API_BASE}/catalog/track/${trackId}/favorite/`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
    });
};

export const removeTrackFromFavorite = async (trackId: string): Promise<void> => {
    await withReAuth(async (token) => {
        await axios.delete(`${API_BASE}/catalog/track/${trackId}/favorite/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    });
};