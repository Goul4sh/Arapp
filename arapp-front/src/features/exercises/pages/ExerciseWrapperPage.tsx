import styles from "./Renderer.module.css";
import ExerciseRenderer from "./ExerciseRenderer.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";


// Komponent opakowujący komponent ćwiczenia. Pobiera dane na podstawie ID z url.
// Możliwa zmiana w przyszłości - jeśli bedzięmy chcieli mieć kilka zadań po sobie.

function ExerciseWrapperPage() {

    const {id} = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => {
        api.get(`/api/exercises/${id}`, {withCredentials: true}).then(resp => setTask(resp.data));
    }, [id]);

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div>

            <div className={styles.exercisePage}>

                <div className={styles.topBar}>

                    <div className={styles.exitButton}>
                    </div>
                    <div className={styles.completionBar}></div>
                </div>

                <ExerciseRenderer currentTask={task}/>

            </div>

        </div>
    )
}

export default ExerciseWrapperPage;