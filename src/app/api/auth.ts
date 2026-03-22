import { LoginResponse } from '@/app/sharedTypes/types';

export const login = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const res = await fetch(
        'https://webdev-music-003b5b991590.herokuapp.com/user/token/',
        {
            method: 'POST',
            body: formData.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || error.detail || 'Login failed');
    }

    return res.json();
};