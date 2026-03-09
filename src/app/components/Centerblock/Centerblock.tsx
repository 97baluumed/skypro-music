import styles from './Centerblock.module.css';
import classnames from 'classnames';
import Track from '../Track/Track';

// 🔽 Обновлённые моки — теперь с правильными данными
const mockTracks = [
    {
        _id: 1,
        name: 'Guilt',
        author: 'Nero',
        album: 'Welcome Reality',
        release_date: '2011-02-14',
        genre: ['dubstep', 'electro house'],
        duration_in_seconds: 284, // 4:44
        logo: null,
        track_file: '/tracks/guilt.mp3',
        stared_user: [],
    },
    {
        _id: 2,
        name: 'Elektro',
        author: 'Dynoro, Outwork, Mr. Gee',
        album: 'Elektro',
        release_date: '2018-06-15',
        genre: ['electro house', 'dance'],
        duration_in_seconds: 142, // 2:22
        logo: null,
        track_file: '/tracks/elektro.mp3',
        stared_user: [],
    },
    {
        _id: 3,
        name: 'I’m Fire',
        author: 'Ali Bakgor',
        album: 'I’m Fire',
        release_date: '2019-03-08',
        genre: ['house', 'progressive'],
        duration_in_seconds: 142, // 2:22
        logo: null,
        track_file: '/tracks/im-fire.mp3',
        stared_user: [],
    },
    {
        _id: 4,
        name: 'Non Stop',
        author: 'Стоункат, Psychopath',
        album: 'Non Stop',
        release_date: '2020-11-20',
        genre: ['hardbass', 'russian rave'],
        duration_in_seconds: 252, // 4:12
        logo: null,
        track_file: '/tracks/non-stop.mp3',
        stared_user: [],
    },
    {
        _id: 5,
        name: 'Run Run',
        author: 'Jaded, Will Clarke, AR/CO',
        album: 'Run Run',
        release_date: '2021-07-09',
        genre: ['tech house', 'electronic'],
        duration_in_seconds: 174, // 2:54
        logo: null,
        track_file: '/tracks/run-run.mp3',
        stared_user: [],
    },
];

export default function Centerblock() {
    return (
        <div className={styles.centerblock}>
            <div className={styles.centerblock__search}>
                <svg className={styles.search__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
                </svg>
                <input
                    className={styles.search__text}
                    type="search"
                    placeholder="Поиск"
                    name="search"
                />
            </div>
            <h2 className={styles.centerblock__h2}>Треки</h2>
            <div className={styles.centerblock__filter}>
                <div className={styles.filter__title}>Искать по:</div>
                <div className={styles.filter__button}>исполнителю</div>
                <div className={styles.filter__button}>году выпуска</div>
                <div className={styles.filter__button}>жанру</div>
            </div>
            <div className={styles.centerblock__content}>
                <div className={styles.content__title}>
                    <div className={classnames(styles.playlistTitle__col, styles.col01)}>
                        Трек
                    </div>
                    <div className={classnames(styles.playlistTitle__col, styles.col02)}>
                        Исполнитель
                    </div>
                    <div className={classnames(styles.playlistTitle__col, styles.col03)}>
                        Альбом
                    </div>
                    <div className={classnames(styles.playlistTitle__col, styles.col04)}>
                        <svg className={styles.playlistTitle__svg}>
                            <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
                        </svg>
                    </div>
                </div>
                <div className={styles.content__playlist}>
                    {mockTracks.map((track) => (
                        <Track key={track._id} track={track} />
                    ))}
                </div>
            </div>
        </div>
    );
}