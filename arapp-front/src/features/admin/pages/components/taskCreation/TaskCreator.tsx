import {useState} from "react";
import ChooseOneForm from "../forms/ChooseOneForm.tsx";
import MultipleChoiceForm from "../forms/MultipleChoiceForm.tsx";
import FillTheBlankForm from "../forms/FillTheBlankForm.tsx";
import MatchPairsForm from "../forms/MatchPairsForm.tsx";
import * as TaskTypes from "../../../../exercises/taskTypes.ts"

import styles from "../../adminGlobalStyles.module.css"
import TheoryForm from "../forms/TheoryForm.tsx";
import TranslateTaskForm from "../forms/TranslateTaskForm.tsx";
import MorphologyFormsForm from "../forms/MorphologyFormsForm.tsx";
import MorphologyPartsForm from "../forms/MorphologyPartsForm.tsx";

interface Props {
    task: TaskTypes.Task | null;
    onDataChange: (taskData: Partial<TaskTypes.Task>) => void;
    onSave: (taskData: Partial<TaskTypes.Task>) => void;
    onCancel: () => void;
}

export const TaskCreator = ({task, onSave, onDataChange, onCancel}: Props) => {

    const [localTaskData, setLocalTaskData] = useState<Partial<TaskTypes.Task>>(task || {});


    const handleFormChange = (data) => {

        setLocalTaskData(data);
        onDataChange(data);

    }

    const handleSaveClick = () => {
        console.log("To otrzymalem z rodzica", task);

        console.log("Wysylam do zapisu z kreatora",localTaskData);
        onSave(localTaskData);
    }

    const handleCancelClick = () => {
        onCancel();
    }

    if (!task) {
        return (
            <div className={styles.noTaskState}>

                <p>Wybierz zadanie do edycji</p>

            </div>
        );
    }

    const renderTaskForm = () => {

        switch (task.type) {
            case "choose-one":
                return <ChooseOneForm onDataChange={handleFormChange} key={task.id} initialData={localTaskData}/>
            case "multiple-choice":
                return <MultipleChoiceForm onDataChange={handleFormChange} key={task.id} initialData={localTaskData}/>
            case "fill-in-the-blank":
                return <FillTheBlankForm onDataChange={handleFormChange} key={task.id} initialData={localTaskData}/>
            case "match-pairs":
                return <MatchPairsForm onDataChange={handleFormChange} key={task.id} initialData={localTaskData}/>
            case "morphology-parts":
                return <MorphologyPartsForm onDataChange={handleFormChange} key={task.id} initialData={localTaskData}/>
            case "morphology-form":
                return <MorphologyFormsForm onDataChange={handleFormChange} key={task.id} initialData={localTaskData}/>
            case "theory":
                return <TheoryForm onDataChange={handleFormChange} key={task.id} initialData={localTaskData}/>
            case "translate":
                return <TranslateTaskForm onDataChange={handleFormChange} key={task.id} initialData={localTaskData}/>

            default:
                return <div>Wybierz typ zadania do dodania</div>

        }

    }


    return (
        <div className={styles.taskEditorContainer}>
            {renderTaskForm()}
            <div className={styles.editorActions}>
                <button
                    className={styles.createButton}
                    onClick={handleSaveClick}
                >
                    Zapisz zmiany
                </button>
                <button
                    className={styles.cancelButton}
                    onClick={handleCancelClick}
                >
                    Anuluj
                </button>

            </div>
        </div>
    );


}