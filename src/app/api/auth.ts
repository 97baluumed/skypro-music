import { LoginResponse } from '@/app/sharedTypes/types';

export interface SignupResponse {
    success: boolean;
    message?: string;
    user_id?: number;
}

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

export const signup = async (
    email: string,
    password: string,
    username: string
): Promise<{
    success: boolean;
    message: string;
    result?: { _id: number; email: string; username: string };
}> => {
    const res = await fetch(
        'https://webdev-music-003b5b991590.herokuapp.com/user/signup/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, username }),
        }
    );

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Signup failed');
    }

    return res.json();
};