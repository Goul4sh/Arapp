import {type JSX, useEffect, useState} from "react";
import styles from './Dashboard.module.css'
import {useAuth} from "../../auth/auth";
import api from "../../auth/api.ts";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import type {GlobalDashboardData, DailyDashboardData} from "../dashboardTypes.ts";
import {faCircleCheck, faCircleXmark, faClock, faFire, faListCheck} from "@fortawesome/free-solid-svg-icons";
import WeeklyCalendar from "../WeeklyCalendar.tsx";

function Dashboard(): JSX.Element {

    const {user} = useAuth();
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

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [dailyDetails, setDailyDetails] = useState<DailyDashboardData | null>(null);


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

    const handleDateClick = async (dateString: string) => {
        if (dateString === selectedDate) {
            setSelectedDate(null);
            setDailyDetails(null);
            return;
        }

        setSelectedDate(dateString);
        try {
            console.log('Fetching details for date:', dateString);
            const dayStats = await api.get(`/api/statistics/history/${dateString}`, {
                withCredentials: true
            });
            setDailyDetails(dayStats.data);
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    };

    return (

        <>
            <div className={styles.dashboardPage}>
                <div className={styles.welcomeContainer}>
                    <h1 className={styles.welcomeText}>Witam {name}!</h1>

                </div>

                <div className={styles.contentContainer}>

                    <div className={styles.statsContainer}>

                        <div className={styles.overallBox}>

                            <div className={styles.statItem}>

                                <div className={styles.cardIcon}>

                                    <FontAwesomeIcon icon={faFire}/>

                                </div>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.cardStat}> {stats.currentStreak}</h2>
                                    <p className={styles.statsTitle}>Seria dni nauki</p>
                                </div>
                            </div>

                            <div className={styles.statItem}>

                                <div className={styles.cardIcon}>

                                    <FontAwesomeIcon icon={faClock}/>

                                </div>
                                <div className={styles.cardContent}>
                                    <h2> {formatTime(stats.totalDurationSeconds)}</h2>
                                    <p className={styles.statsTitle}>Czas nauki</p>
                                </div>
                            </div>
                            <div className={styles.statItem}>

                                <div className={styles.cardIcon}>

                                    <FontAwesomeIcon icon={faListCheck}/>

                                </div>
                                <div className={styles.cardContent}>
                                    <h2> {stats.totalCompletedTasks}</h2>
                                    <p className={styles.statsTitle}>Wykonane zadania</p>
                                </div>
                            </div>
                            <div className={styles.statItem}>

                                <div className={styles.cardIcon}>

                                    <FontAwesomeIcon icon={faCircleCheck}/>

                                </div>
                                <div className={styles.cardContent}>
                                    <h2> {stats.totalCorrectAnswers}</h2>
                                    <p className={styles.statsTitle}>Dobre odpowiedzi</p>
                                </div>
                            </div>
                            <div className={styles.statItem}>

                                <div className={styles.cardIcon}>

                                    <FontAwesomeIcon icon={faCircleXmark}/>

                                </div>
                                <div className={styles.cardContent}>
                                    <h2> {stats.totalIncorrectAnswers}</h2>
                                    <p className={styles.statsTitle}>Złe odpowiedzi</p>
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
                                                <p className={styles.statValue}> {formatTime(dailyStats.durationSeconds)}</p>
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

                                <div className={`${styles.contentCard} ${styles.activityCard}`}>
                                    <h2 className={styles.cardTitle}>Ostatnia aktywność</h2>
                                    <div className={styles.calendarWrapper}>

                                        <WeeklyCalendar activityDates={stats.activityDates}
                                                        onDateClick={handleDateClick}/>

                                    </div>
                                </div>

                                <div className={styles.detailsCard}>

                                    <h2 className={styles.detailstTitle}
                                    >{selectedDate ? `Szczegóły z dnia ${selectedDate}` : 'Kliknij na dzień, aby zobaczyć szczegóły'}</h2>
                                    <div className={styles.detailsContent}>

                                        {dailyDetails ? (
                                        <div className={styles.statsList}>
                                            <div className={styles.columnStatItem}>
                                                <div className={styles.columnStatContent}><p
                                                    className={styles.statText}>Czas nauki:</p>
                                                    <p className={styles.statValue}> {formatTime(dailyDetails.durationSeconds)}</p>
                                                </div>

                                            </div>

                                            <div className={styles.columnStatItem}>
                                                <div className={styles.columnStatContent}><p
                                                    className={styles.statText}>Ukończone zadania:</p>
                                                    <p className={styles.statValue}> {dailyDetails.completedTasks}</p></div>

                                            </div>

                                            <div className={styles.columnStatItem}>
                                                <div className={styles.columnStatContent}><p
                                                    className={styles.statText}>Poprawne odpowiedzi:</p>
                                                    <p className={styles.statValue}> {dailyDetails.correctAnswers} </p></div>

                                            </div>

                                            <div className={styles.columnStatItem}>
                                                <div className={styles.columnStatContent}><p
                                                    className={styles.statText}>Złe odpowiedzi:</p>
                                                    <p className={styles.statValue}> {dailyDetails.incorrectAnswers} </p></div>

                                            </div>
                                        </div>
                                        ) : (
                                            <p className={styles.noDetailsText}>Brak danych dla wybranego dnia.</p>
                                        )}



                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </>
    );

}

export default Dashboard;