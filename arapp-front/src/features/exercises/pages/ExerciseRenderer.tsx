import type {Task} from "../taskTypes.ts";

import styles from './Renderer.module.css';
import MultipleChoiceTask from "../components/tasks/MultipleChoiceTask.tsx";
import MatchPairsTask from "../components/tasks/MatchPairsTask.tsx";
import FillInTheBlankTask from "../components/tasks/FillInTheBlankTask.tsx";
import ChooseOneTask from "../components/tasks/ChooseOneTask.tsx";
import MorphologyFormTask from "../components/tasks/MorphologyFormTask.tsx";
import MorphologyPartsTask from "../components/tasks/MorphologyPartsTask.tsx";
import TheoryTask from "../components/tasks/TheoryTask.tsx";
import AssistedWritingTask from "../components/tasks/AssistedWritingTask.tsx";
import TranslateTask from "../components/tasks/TranslateTask.tsx";


// Komponent odpowiedzialny za wybór i renderowanie odpowiedniego typu zadania

interface ExerciseRendererProps {
    id?: number;
    data?: Task;
}

function ExerciseRenderer({currentTask, references}: { currentTask: ExerciseRendererProps | Task; references?: any }) {

console.log("Rzecz ktora dostalem do renderera zadan:", currentTask);

    const task: Task = 'data' in currentTask && currentTask.data
        ? currentTask.data
        : currentTask as Task;

    function TaskSelector({task}: { task: Task }) {

        console.log("Rzecz ktora dostalem do selectora zadan:", task);

        switch (task.type) {
            case 'multiple-choice':
                return <MultipleChoiceTask task={task}/>;
            case 'fill-in-the-blank':
                return <FillInTheBlankTask task={task}/>;
            case 'match-pairs':
                return <MatchPairsTask task={task}/>;
            case 'choose-one':
                return <ChooseOneTask task={task}/>;
            case "morphology-form":
                return <MorphologyFormTask task={task}/>;
            case "morphology-parts":
                return <MorphologyPartsTask task={task}/>;
            case "theory":
                return <TheoryTask task={task}/>;
            case "writing-assisted":
                return <AssistedWritingTask task={task}/>
            case "translate":
                return <TranslateTask task={task}/>

            default:
                return <div>Unknown task type</div>;

        }
    }

    return (<>

            <div className={styles.rendererContainer}>

                <TaskSelector task={task}/>

            </div>

        </>


    );

}

export default ExerciseRenderer