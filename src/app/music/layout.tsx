'use client';

import { useAppSelector } from '@/app/store/store';
import styles from './music-layout.module.css';
import MenuNav from '../components/MenuNav/MenuNav';
import Sidebar from '../components/Sidebar/Sidebar';
import Bar from '../components/Bar/Bar';

export default function MusicLayout({ children }: { children: React.ReactNode }) {
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
    const isAuthChecked = useAppSelector((state) => state.auth.isAuthChecked);

    if (!isAuthChecked || !isLoggedIn) {
        return <>{children}</>;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <main className={styles.main}>
                    <MenuNav />
                    {children}
                    <Sidebar />
                    <Bar />
                </main>
            </div>
        </div>
    );
}