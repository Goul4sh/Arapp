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


const taskComponentMap: Record<string, React.FC<{ task: any }>> = {
    "multiple-choice": MultipleChoiceTask,
    "fill-in-the-blank": FillInTheBlankTask,
    "match-pairs": MatchPairsTask,
    "choose-one": ChooseOneTask,
    "morphology-form": MorphologyFormTask,
    "morphology-parts": MorphologyPartsTask,
    "theory": TheoryTask,
    "writing-assisted": AssistedWritingTask,
    "translate": TranslateTask,
} as const;

function ExerciseRenderer({currentTask}: { currentTask: ExerciseRendererProps | Task; }) {

    const task: Task = 'data' in currentTask && currentTask.data
        ? currentTask.data
        : currentTask as Task;


    const TaskComponent = taskComponentMap[task.type];

    if (!TaskComponent) {
        return <div>Unknown task type</div>;
    }

    return (<>
            <div className={styles.rendererContainer}>
                <TaskComponent task={task}/>
            </div>
        </>
    );

}

export default ExerciseRenderer