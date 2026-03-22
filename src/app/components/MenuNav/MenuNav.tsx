'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './MenuNav.module.css';
import { useAppSelector, useAppDispatch } from '@/app/store/store';
import { logout } from '@/app/store/features/authSlice';
import { useRouter } from 'next/navigation';

export default function MenuNav() {
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <nav className={styles.main__nav}>
            <div className={styles.nav__logo}>
                <Image
                    width={250}
                    height={170}
                    className={styles.logo__image}
                    src="/img/logo.png"
                    alt="logo"
                />
            </div>
            <div className={styles.nav__burger}>
                <span className={styles.burger__line}></span>
                <span className={styles.burger__line}></span>
                <span className={styles.burger__line}></span>
            </div>
            <div className={styles.nav__menu}>
                <ul className={styles.menu__list}>
                    <li className={styles.menu__item}>
                        <Link href="#" className={styles.menu__link}>
                            Главное
                        </Link>
                    </li>
                    <li className={styles.menu__item}>
                        <Link href="#" className={styles.menu__link}>
                            Мой плейлист
                        </Link>
                    </li>
                    {isLoggedIn ? (
                        <li className={styles.menu__item}>
                            <button onClick={handleLogout} className={styles.menu__btnLogout}>
                                Выйти
                            </button>
                        </li>
                    ) : (
                        <li className={styles.menu__item}>
                            <Link href="/login" className={styles.menu__link}>
                                Войти
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}