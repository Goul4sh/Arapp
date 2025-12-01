import type {Task} from "../taskTypes.ts";

import styles from './Renderer.module.css';
import MultipleChoiceTask from "../components/MultipleChoiceTask.tsx";
import MatchingTask from "../components/MatchingTask.tsx";
import FillInTheBlankTask from "../components/FillInTheBlankTask.tsx";


// Komponent odpowiedzialny za wybór i renderowanie odpowiedniego typu zadania
// na podstawie przekazanego obiektu zadania (currentTask).

function ExerciseRenderer({currentTask}: { currentTask: Task }) {


    function TaskSelector({task}: { task: Task }) {


        switch (task.type) {
            case 'multiple-choice':
                return <MultipleChoiceTask task={task}/>;
            case 'fill-in-the-blank':
                return <FillInTheBlankTask task={task}/>;
            case 'matching':
                return <MatchingTask task={task}/>;
            default:
                return <div>Unknown task type</div>;

        }
    }

    return (<>


            <div className={styles.rendererContainer}>

                <TaskSelector task={currentTask}/>

            </div>


        </>


    );

}

export default ExerciseRenderer