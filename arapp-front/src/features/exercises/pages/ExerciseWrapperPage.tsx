import styles from "./Renderer.module.css";
import ExerciseRenderer from "./ExerciseRenderer.tsx";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import type {Task} from "../taskTypes.ts";
import ProgressBar from "../components/ProgressBar.tsx";
import {LessonContext} from "../components/LessonContext.tsx";


// Komponent opakowujący komponent ćwiczenia. Pobiera dane na podstawie ID z url.
// Możliwa zmiana w przyszłości - jeśli bedzięmy chcieli mieć kilka zadań po sobie.

function ExerciseWrapperPage() {

    const {id} = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setLoading(true);
        api.get(`/api/exercises/${id}`, {withCredentials: true})
            .then(resp => {

                setTask(resp.data)
                setLoading(false);

            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!task) {
        return <div>Task not found</div>;
    }

    function submitAnswer(answer: boolean) {
        alert("witam  " + answer);
        if (answer) {setProgress(100);}
        else {setProgress( Math.random() * (25) );}
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

                    <ExerciseRenderer currentTask={task}/>
                </LessonContext.Provider>

            </div>

        </div>
    )
}

export default ExerciseWrapperPage;