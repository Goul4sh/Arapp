import {type JSX, useEffect, useState} from "react";
import styles from './Dashboard.module.css'
import {useAuth} from "../../auth/auth";
import api from "../../auth/api.ts";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import type {GlobalDashboardData, DailyDashboardData, NextLessonData} from "../dashboardTypes.ts";
import {
    faBook,
    faBookBookmark,
    faCircleCheck,
    faCircleXmark,
    faClock,
    faFire,
    faListCheck
} from "@fortawesome/free-solid-svg-icons";
import WeeklyCalendar from "../WeeklyCalendar.tsx";
import {Link} from "react-router-dom";

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
    const [dueFlashcardsCount, setDueFlashcardsCount] = useState<number>(0);
    const [nextLesson, setNextLesson] = useState<NextLessonData | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsResp, dailyStatsResp, dueCount, lessonDataResp] = await Promise.all([
                    api.get('/api/statistics', {withCredentials: true}),
                    api.get('/api/statistics/daily', {withCredentials: true}),
                    api.get('/api/flashcards/due/count', {withCredentials: true}),
                    api.get('/api/lessons/complete/next', {withCredentials: true})
                ]);
                setStats(statsResp.data);
                setDailyStats(dailyStatsResp.data);
                setDueFlashcardsCount(dueCount.data);
                setNextLesson(lessonDataResp.data);
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
                    <h1 className={styles.welcomeText}>Cześć, {name}!</h1>

                </div>

                <div className={styles.contentContainer}>


                    {/*TODO Poprawić rozszerzanie się kart przy pojawianiu się przycisków*/}

                    <div className={styles.statsContainer}>

                        <div className={styles.actionsContainer}>
                            <div className={styles.reviewCard}>


                                {dueFlashcardsCount === 0 ? (

                                    <div className={styles.noFlashcardsText}>
                                        <div className={styles.cardIcon}>
                                            <FontAwesomeIcon icon={faFire}/>
                                        </div>

                                        <h2 className={styles.actionTitle}>Brak fiszek do powtórki</h2>
                                    </div>

                                ) : (
                                    <div className={styles.reviewCardContent}>

                                        <div className={styles.cardIcon}>
                                            <FontAwesomeIcon icon={faFire}/>
                                        </div>

                                        <div className={styles.contentText}>
                                            <h2 className={styles.actionTitle}>Fiszki do powtórki: </h2>
                                            <h2 className={styles.cardStat}>{dueFlashcardsCount}</h2>
                                        </div>

                                        <Link to="/review" className={styles.actionLink}>Przejdź do powtórek</Link>

                                    </div>
                                )
                                }

                            </div>

                            <div className={styles.lessonCard}>

                                <div className={styles.cardIcon}>

                                    <FontAwesomeIcon icon={faBookBookmark}/>

                                </div>

                                {nextLesson ? (
                                    <>
                                        <h2 className={styles.actionTitle}>Następna lekcja</h2>
                                        <p className={styles.nextLessonTitle}>{nextLesson.title}</p>
                                        <Link to={`/lessons/${nextLesson.id}`} className={styles.actionLink}>
                                            Rozpocznij</Link>
                                    </>
                                ) : (
                                    <>
                                        <h2 className={styles.actionTitle}>Brak kolejnych lekcji</h2>
                                        <p className={styles.nextLessonTitle}>Ukończyłeś wszystkie dostępne lekcje!</p>
                                    </>
                                )

                                }

                            </div>
                        </div>


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

                            <div className={styles.statItem}>

                                <div className={styles.cardIcon}>

                                    <FontAwesomeIcon icon={faBook}/>

                                </div>
                                <div className={styles.cardContent}>
                                    <h2> {stats.totalIncorrectAnswers}</h2>
                                    <p className={styles.statsTitle}>placeholder!</p>
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

                                    Placeholder! Tutaj mozna cos dodac albo zmienic uklad strony.

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
                                                        <p className={styles.statValue}> {dailyDetails.completedTasks}</p>
                                                    </div>

                                                </div>

                                                <div className={styles.columnStatItem}>
                                                    <div className={styles.columnStatContent}><p
                                                        className={styles.statText}>Poprawne odpowiedzi:</p>
                                                        <p className={styles.statValue}> {dailyDetails.correctAnswers} </p>
                                                    </div>

                                                </div>

                                                <div className={styles.columnStatItem}>
                                                    <div className={styles.columnStatContent}><p
                                                        className={styles.statText}>Złe odpowiedzi:</p>
                                                        <p className={styles.statValue}> {dailyDetails.incorrectAnswers} </p>
                                                    </div>

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