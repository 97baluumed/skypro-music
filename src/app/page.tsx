'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/store/store';
import { rehydrate } from '@/app/store/features/authSlice';
import styles from './page.module.css';
import Bar from './components/Bar/Bar';
import Sidebar from './components/Sidebar/Sidebar';
import Centerblock from './components/Centerblock/Centerblock';
import MenuNav from './components/MenuNav/MenuNav';

export default function Home() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
    const isAuthChecked = useAppSelector((state) => state.auth.isAuthChecked);

    useEffect(() => {
        dispatch(rehydrate());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthChecked && !isLoggedIn) {
            router.push('/login');
        }
    }, [isAuthChecked, isLoggedIn, router]);

    if (!isAuthChecked) {
        return null;
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <main className={styles.main}>
                    <MenuNav />
                    <Centerblock />
                    <Sidebar />
                    <Bar />
                </main>
            </div>
        </div>
    );
}