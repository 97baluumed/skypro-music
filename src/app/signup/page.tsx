'use client';

import styles from '@/app/signup/signup.module.css';
import { useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Регистрация временно недоступна. Используйте тестовые данные для входа.');
        window.location.href = '/login';
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