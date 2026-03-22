'use client';

import styles from './Sidebar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from '@/app/store/store';

export default function Sidebar() {
    const email = useAppSelector((state) => state.auth.email);
    const username = email ? email.split('@')[0] : 'Пользователь';

    return (
        <div className={styles.main__sidebar}>
            <div className={styles.sidebar__personal}>
                <p className={styles.sidebar__personalName}>{username}</p>
                <div className={styles.sidebar__icon}>
                    <svg>
                        <use xlinkHref="/img/icon/sprite.svg#logout"></use>
                    </svg>
                </div>
            </div>
            <div className={styles.sidebar__block}>
                <div className={styles.sidebar__list}>
                    <div className={styles.sidebar__item}>
                        <Link href="#">
                            <Image
                                src="/img/playlist01.png"
                                alt="day's playlist"
                                width={250}
                                height={170}
                            />
                        </Link>
                    </div>
                    <div className={styles.sidebar__item}>
                        <Link href="#">
                            <Image
                                src="/img/playlist02.png"
                                alt="day's playlist"
                                width={250}
                                height={170}
                            />
                        </Link>
                    </div>
                    <div className={styles.sidebar__item}>
                        <Link href="#">
                            <Image
                                src="/img/playlist03.png"
                                alt="day's playlist"
                                width={250}
                                height={170}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}