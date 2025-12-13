import styles from "./Renderer.module.css";
import ExerciseRenderer from "./ExerciseRenderer.tsx";
import {Link, useParams} from "react-router-dom";
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

    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const workingMode = !!lesson_id;

    useEffect(() => {
        setLoading(true);

        if (workingMode) {
            alert("tryb lekcji")
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
            alert("tryb solo taska")
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
            const newQueue = taskQueue.slice(1);
            setTaskQueue(newQueue);
            setCompletedTasks(prev => prev + 1);

            if (newQueue.length > 0) {
                setCurrentTask(newQueue[0]);

            } else {
                // Wszystkie zadania ukończone!
                // setCurrentTask(null);
            }

        } else {
            alert("źle!")
            // Przeniesienie aktualnego zadania na koniec kolejki - nie zostało rozwiązane poprawnie
            const [first, ...rest] = taskQueue;
            const newQueue = [...rest, first];
            setTaskQueue(newQueue);
            setCurrentTask(newQueue[0]);

        }

    }

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