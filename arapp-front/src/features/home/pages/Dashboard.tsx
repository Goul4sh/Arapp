import {type JSX, useEffect, useState} from "react";
import styles from './Dashboard.module.css'
import {useAuth} from "../../auth/auth";
import api from "../../auth/api.ts";

function Dashboard(): JSX.Element {

    const {user, logout} = useAuth();
    const name = user?.name || 'Uzytkownik';

    const [stats, setStats] = useState({
        completedTasks: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        durationSeconds: 0
    });


    const handleLogout = async () => {
        logout();

    };



    useEffect(() => {
        api.get('/api/statistics', { withCredentials: true })
            .then(resp => setStats(resp.data))
            .catch(err => console.error('Failed to fetch stats:', err));
    }, []);



    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m ${seconds % 60}s`;
    };




    return (

        <>
            <div className={styles.dashboardPage}>
                <div className={styles.welcomeContainer}>
                    <h1 className={styles.welcomeText}>Witam {name}!</h1>

                </div>

                <div className={styles.contentContainer}>


                    <div className={styles.statsContainer}>


                        <div className={styles.statsBox}>



                        </div>

                        <h2 className={styles.statsTitle}>Twoje statystyki:</h2>

                        <p className={styles.statItem}>Czas nauki: {formatTime(stats.durationSeconds)} </p>
                        <p className={styles.statItem}>Ukończone zadania: {stats.completedTasks}</p>
                        <p className={styles.statItem}>Poprawne odpowiedzi: {stats.correctAnswers}</p>
                        <p className={styles.statItem}>Niepoprawne odpowiedz: {stats.incorrectAnswers}</p>

                    </div>



                    <button className={styles.logoutButton} onClick={handleLogout}>
                        Wyloguj się
                    </button>

                </div>
            </div>
        </>
    );

}

export default Dashboard;