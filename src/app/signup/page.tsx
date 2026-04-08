'use client';

import styles from '@/app/signup/signup.module.css';
import { useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { signup } from '@/app/api/auth';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/store/store';
import { setTokens } from '@/app/store/features/authSlice';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();
    const dispatch = useAppDispatch();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Заполните все поля');
            return;
        }

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        // Генерируем username из email (часть до @)
        const username = email.split('@')[0];

        try {
            // 1. Регистрация (передаём username программно)
            await signup(email, password, username);

            // 2. Автоматический вход после регистрации
            const loginData = await fetch('https://webdev-music-003b5b991590.herokuapp.com/user/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ email, password }).toString(),
            });

            if (!loginData.ok) {
                throw new Error('Не удалось войти после регистрации');
            }

            const tokens = await loginData.json();

            // 3. Сохраняем токены и email
            dispatch(setTokens({ access: tokens.access, refresh: tokens.refresh, email }));

            // 4. Переход на главную
            router.push('/music/main');
            router.refresh();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Ошибка регистрации';
            setError(message);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.containerEnter}>
                <div className={styles.modal__block}>
                    <form onSubmit={onSubmit} className={styles.modal__form}>
                        <div className={styles.modal__logo}>
                            <Image
                                src="/img/logo_modal.png"
                                alt="logo"
                                width={140}
                                height={21}
                            />
                        </div>

                        <input
                            className={classNames(styles.modal__input, styles.login)}
                            type="email"
                            placeholder="Почта"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            className={styles.modal__input}
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            className={styles.modal__input}
                            type="password"
                            placeholder="Повторите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {error && (
                            <div className={styles.errorContainer}>
                                <p>{error}</p>
                            </div>
                        )}

                        <button type="submit" className={styles.modal__btnSignupEnt}>
                            Зарегистрироваться
                        </button>

                        <Link href="/login" style={{ marginTop: '20px', color: '#580ea2' }}>
                            Уже есть аккаунт? Войти
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}