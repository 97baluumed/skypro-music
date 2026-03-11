import styles from './page.module.css';
import Bar from './components/Bar/Bar';
import Sidebar from './components/Sidebar/Sidebar';
import Centerblock from './components/Centerblock/Centerblock';
import MenuNav from './components/MenuNav/MenuNav';

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <MenuNav />
          <Centerblock />
          <Sidebar />
          <Bar />
        </main>
        <footer className="footer"></footer>
      </div>
    </div>
  );
}