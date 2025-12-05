import styles from "./Renderer.module.css";
import ExerciseRenderer from "./ExerciseRenderer.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import type {Task} from "../taskTypes.ts";


// Komponent opakowujący komponent ćwiczenia. Pobiera dane na podstawie ID z url.
// Możliwa zmiana w przyszłości - jeśli bedzięmy chcieli mieć kilka zadań po sobie.

function ExerciseWrapperPage() {

    const {id} = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // console.log(id);
        setLoading(true);
        api.get(`/api/exercises/${id}`, {withCredentials: true})
            .then(resp => {
                
                setTask(resp.data)
                // console.log(resp.data);
                setLoading(false);
                
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!task) {
        return <div>Task not found</div>;
    }

    return (
        <div>

            <div className={styles.exercisePage}>

                <div className={styles.topBar}>

                    <div className={styles.exitButton}>
                    </div>
                    <div className={styles.completionBar}>


                        BAR BAR BAR BAR BAR ABR BAR BAR BAR BAR BAR ABR BAR BAR BAR BAR BAR ABR BAR BAR BAR BAR BAR ABR


                    </div>
                </div>

                <ExerciseRenderer currentTask={task}/>

            </div>

        </div>
    )
}

export default ExerciseWrapperPage;