import styles from "./Renderer.module.css";
import ExerciseRenderer from "./ExerciseRenderer.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import type {Task} from "../taskTypes.ts";
import ProgressBar from "../components/ProgressBar.tsx";
import {LessonContext} from "../components/LessonContext.tsx";


// Komponent opakowujący komponent ćwiczenia. Pobiera dane na podstawie ID z url.

function ExerciseWrapperPage() {

    const {id, lesson_id} = useParams();
    const [taskQueue, setTaskQueue] = useState<Task[]>([]);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [totalTasks, setTotalTasks] = useState<number>(0);
    const [completedTasks, setCompletedTasks] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const workingMode = !!lesson_id;


    const [sessionStats, setSessionStats] = useState({
        correctAnswers: 0,
        incorrectAnswers: 0,
        startTime: Date.now(),
        completedTasksCount: 0
    });

    useEffect(() => {
        setLoading(true);

        if (workingMode) {
            api.get(`/api/lessons/${lesson_id}`, {withCredentials: true})
                .then(resp => {

                    const tasks = resp.data.tasks;
                    console.log(tasks);
                    setTaskQueue(tasks);
                    setCurrentTask(tasks[0]);
                    setTotalTasks(tasks.length);
                    setLoading(false);

                });


        } else {
            api.get(`/api/exercises/${id}`, {withCredentials: true})
                .then(resp => {

                    setTaskQueue(resp.data);
                    setCurrentTask(resp.data);
                    setTotalTasks(1);
                    setLoading(false);

                });
        }
    }, [id, lesson_id, workingMode]);

    // Oblicza postęp paska na podstawie odpowiedzi
    function submitAnswer(answer: boolean) {
        if (answer) {
            alert("Dobrze!")

            const newCompletedCount = sessionStats.completedTasksCount + 1;
            const newCorrectAnswers = sessionStats.correctAnswers + 1;

            setSessionStats(prev => ({
                ...prev,
                correctAnswers: newCorrectAnswers,
                completedTasksCount: newCompletedCount
            }));


            const newQueue = taskQueue.slice(1);
            setTaskQueue(newQueue);
            setCompletedTasks(prev => prev + 1);

            if (newQueue.length > 0) {
                setCurrentTask(newQueue[0]);

            } else {
                // Wszystkie zadania ukończone!

                //Wysyłanie statystyk po zakończeniu lekcji
                submitSessionStats(newCompletedCount, newCorrectAnswers, sessionStats.incorrectAnswers)
                    .finally(() => {navigate("/exercises");})
                alert("Wszsystkie zadania ukończone!");

            }

        } else {
            alert("źle!")

            const newIncorrectAnswers = sessionStats.incorrectAnswers + 1;


            setSessionStats(prev => ({
                ...prev,
                incorrectAnswers: newIncorrectAnswers
            }));

            // Przeniesienie aktualnego zadania na koniec kolejki - nie zostało rozwiązane poprawnie
            const [first, ...rest] = taskQueue;
            const newQueue = [...rest, first];
            setTaskQueue(newQueue);
            setCurrentTask(newQueue[0]);

        }

    }

    const submitSessionStats = async (completedCount: number, correctAnswers: number, incorrectAnswers: number) => {
        const duration = Math.floor((Date.now() - sessionStats.startTime) / 1000); // w sekundach


        try {
            await api.post('/api/statistics', {
                completedTasks: completedCount,
                correctAnswers: correctAnswers,
                incorrectAnswers: incorrectAnswers,
                durationSeconds: duration,

            }, { withCredentials: true });
        } catch (error) {
            console.error('Failed to submit stats:', error);
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentTask) {
        return <div>Task not found. Koniec zadań!</div>;
    }


    return (
        <div>

            <div className={styles.exercisePage}>

                <div className={styles.topBar}>

                    <div className={styles.exitButton}>
                        <Link to="/exercises">EXIT</Link>
                    </div>

                    <ProgressBar progress={progress}/>

                </div>

                <LessonContext.Provider value={{submitAnswer}}>

                    <ExerciseRenderer currentTask={currentTask}/>
                </LessonContext.Provider>

            </div>

        </div>
    )
}

export default ExerciseWrapperPage;