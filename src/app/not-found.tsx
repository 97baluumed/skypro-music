import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFoundPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.description}>
                Страница не найдена
            </p>
            <p className={styles.correction}>
                Возможно, она была удалена или перенесена на другой адрес
            </p>
            <Link href="/music/main" className={styles.homeLink}>
                Вернуться на главную
            </Link>
        </div>
    );
}