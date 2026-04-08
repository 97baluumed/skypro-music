'use client';

import styles from '@/app/login/signin.module.css';
import { useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { login } from '@/app/api/auth';
import { useAppDispatch } from '@/app/store/store';
import { setTokens } from '@/app/store/features/authSlice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useAppDispatch();
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data = await login(email, password);
            dispatch(setTokens({ access: data.access, refresh: data.refresh, email }));
            router.push('/music/main'); // После входа — на главную
            router.refresh();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Ошибка входа';
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
                        {error && (
                            <div className={styles.errorContainer}>
                                <p>{error}</p>
                            </div>
                        )}
                        <button type="submit" className={styles.modal__btnEnter}>
                            Войти
                        </button>
                        <Link href="/signup" className={styles.modal__btnSignup}>
                            Зарегистрироваться
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}