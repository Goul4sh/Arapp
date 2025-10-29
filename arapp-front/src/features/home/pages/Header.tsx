import React from 'react';
import styles from './Header.module.css';



export default function Header() {
    return (
        <header className={styles.header}>

            <div className={styles.links}>
            <ul >
                <li className={styles.listItem}><a className={styles.link} href="/">Strona Główna</a></li>
                <li className={styles.listItem}><a className={styles.link} href="/login">Logowanie</a></li>
                <li className={styles.listItem}><a className={styles.link} href="/signup">Rejestracja</a></li>
                <li className={styles.listItem}><a className={styles.link} href="/dashboard">Dashboard</a></li>
            </ul>

            </div>





        </header>
    );
}