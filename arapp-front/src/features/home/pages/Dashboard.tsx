import {type JSX, useEffect, useState} from "react";
import styles from './Dashboard.module.css'
import {useAuth} from "../../auth/auth";
import api from "../../auth/api.ts";

import type {GlobalDashboardData, DailyDashboardData} from "../dashboardTypes.ts";

function Dashboard(): JSX.Element {

    const {user, logout} = useAuth();
    const name = user?.name || 'Uzytkownik';

    const [stats, setStats] = useState<GlobalDashboardData>({
        totalCompletedTasks: 0,
        totalCorrectAnswers: 0,
        totalDurationSeconds: 0,
        totalIncorrectAnswers: 0,
        currentStreak: 0,
        activityDates: []

    });
    const [dailyStats, setDailyStats] = useState<DailyDashboardData>({
        completedTasks: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        durationSeconds: 0
    });


    const handleLogout = async () => {
        logout();

    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsResp, dailyStatsResp] = await Promise.all([
                    api.get('/api/statistics', {withCredentials: true}),
                    api.get('/api/statistics/daily', {withCredentials: true})
                ]);

                setStats(statsResp.data);
                setDailyStats(dailyStatsResp.data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };
        fetchStats();

    }, []);

    useEffect(() => {
        console.log('Stats updated:', stats);
    }, [stats]);

    useEffect(() => {
        console.log('Daily stats updated:', dailyStats);
    }, [dailyStats]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m ${seconds % 60}s`;
    };

    // const totalAnswers = stats.correctAnswers + stats.incorrectAnswers;
    // const accuracy = totalAnswers > 0 ? Math.round((stats.correctAnswers / totalAnswers) * 100) : 0;

    return (

        <>
            <div className={styles.dashboardPage}>
                <div className={styles.welcomeContainer}>
                    <h1 className={styles.welcomeText}>Witam {name}!</h1>

                    <button className={styles.logoutButton} onClick={handleLogout}>
                        Wyloguj się
                    </button>

                </div>

                <div className={styles.contentContainer}>

                    <div className={styles.statsContainer}>

                        <div className={styles.overallBox}>

                            <div className={styles.statItem}>

                                <div className={styles.cardIcon}>📊</div>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.statsTitle}>Seria dni nauki</h2>
                                    <p> {stats.currentStreak}</p>
                                </div>
                            </div>

                            <div className={styles.statItem}>

                                <div className={styles.cardIcon}>📊</div>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.statsTitle}>Czas nauki</h2>
                                    <p> {formatTime(stats.totalDurationSeconds)}</p>
                                </div>
                            </div>
                            <div className={styles.statItem}>

                                <div className={styles.cardIcon}>📊</div>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.statsTitle}>Wykonane zadania</h2>
                                    <p> {stats.totalCompletedTasks}</p>
                                </div>
                            </div>
                            <div className={styles.statItem}>

                                <div className={styles.cardIcon}>📊</div>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.statsTitle}>Dobre odpowiedzi</h2>
                                    <p> {stats.totalCorrectAnswers}</p>
                                </div>
                            </div>
                            <div className={styles.statItem}>

                                <div className={styles.cardIcon}>📊</div>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.statsTitle}>Złe odpowiedzi</h2>
                                    <p> {stats.totalIncorrectAnswers}</p>
                                </div>
                            </div>

                        </div>

                        <div className={styles.columnsContainer}>

                            <div className={styles.leftColumn}>

                                <div className={styles.contentBox}>
                                    <h2 className={styles.cardTitle}>Dzisiejsze osiągnięcia</h2>
                                    <div className={styles.statsList}>
                                        <div className={styles.columnStatItem}>
                                            <div className={styles.columnStatContent}><p
                                                className={styles.statText}>Czas nauki:</p>
                                                <p className={styles.statValue}> {dailyStats.durationSeconds}</p>
                                            </div>

                                        </div>

                                        <div className={styles.columnStatItem}>
                                            <div className={styles.columnStatContent}><p
                                                className={styles.statText}>Ukończone zadania:</p>
                                                <p className={styles.statValue}> {dailyStats.completedTasks}</p></div>

                                        </div>

                                        <div className={styles.columnStatItem}>
                                            <div className={styles.columnStatContent}><p
                                                className={styles.statText}>Poprawne odpowiedzi:</p>
                                                <p className={styles.statValue}> {dailyStats.completedTasks} </p></div>

                                        </div>
                                    </div>
                                </div>

                                <div className={styles.separator}></div>

                                <div className={styles.contentBox}>
                                    <div className={styles.cardHeader}>
                                        <h2 className={styles.cardTitle}>Analiza zadań</h2>
                                        <select className={styles.taskTypeDropdown}>
                                            <option value="all">Wszystkie typy</option>
                                            <option value="multiple-choice">Wielokrotny wybór</option>
                                            <option value="fill-in-the-blank">Uzupełnij lukę</option>
                                            <option value="flashcards">Fiszki</option>
                                        </select>
                                    </div>

                                    <div className={styles.statsList}>
                                        <div className={styles.columnStatItem}><p>Czas w zadaniach:</p></div>
                                        <div className={styles.columnStatItem}><p>Średnia poprawność:</p></div>
                                        <div className={styles.columnStatItem}><p>Liczba wykonanych:</p></div>
                                    </div>
                                </div>
                            </div>


                            <div className={styles.rightColumn}>

                                <section className={`${styles.contentCard} ${styles.activityCard}`}>
                                    <h2 className={styles.cardTitle}>Ostatnia aktywność</h2>
                                    <div className={styles.chartPlaceholderContainer}>
                                        <p className={styles.placeholderText}>kalendarz wyswietlajacy serie dni z
                                            mozliwoscia klikniecia na dzien i sprzwdzenia konkretniej statystyk!.</p>

                                    </div>
                                </section>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </>
    );

}

export default Dashboard;