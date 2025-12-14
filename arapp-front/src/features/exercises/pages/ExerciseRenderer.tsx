import type {Task} from "../taskTypes.ts";

import styles from './Renderer.module.css';
import MultipleChoiceTask from "../components/tasks/MultipleChoiceTask.tsx";
import MatchPairsTask from "../components/tasks/MatchPairsTask.tsx";
import FillInTheBlankTask from "../components/tasks/FillInTheBlankTask.tsx";
import ChooseOneTask from "../components/tasks/ChooseOneTask.tsx";


// Komponent odpowiedzialny za wybór i renderowanie odpowiedniego typu zadania
// na podstawie przekazanego obiektu zadania (currentTask).

function ExerciseRenderer({currentTask}: { currentTask: Task }) {


    function TaskSelector({task}: { task: Task }) {


        switch (task.type) {
            case 'multiple-choice':
                return <MultipleChoiceTask task={task}/>;
            case 'fill-in-the-blank':
                return <FillInTheBlankTask task={task}/>;
            case 'match-pairs':
                return <MatchPairsTask task={task}/>;
            case 'choose-one':
                return <ChooseOneTask task={task}/>;

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