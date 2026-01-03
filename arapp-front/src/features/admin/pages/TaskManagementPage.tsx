import styles from "./adminGlobalStyles.module.css"
import localStyles from "./taskManagement.module.css"
import * as TaskTypes from "../../exercises/taskTypes.ts"
import {useCallback, useState} from "react"
import ChooseOneForm from "./components/forms/ChooseOneForm.tsx";
import MultipleChoiceForm from "./components/forms/MultipleChoiceForm.tsx";
import {TaskPreviewRenderer} from "./components/taskCreation/TaskPreviewRenderer.tsx";
import FillTheBlankForm from "./components/forms/FillTheBlankForm.tsx";
import MatchPairsForm from "./components/forms/MatchPairsForm.tsx";
import api from "../../auth/api.ts";

type TaskWithoutId = Omit<TaskTypes.Task, 'id'>;


function TaskManagementPage() {
    const [selectedTaskType, setSelectedTaskType] = useState<string>("")
    const [taskData, setTaskData] = useState<Partial<TaskWithoutId> | null>(null)


    const taskTypes = [
        {value: "choose-one", label: "Choose One"},
        {value: "multiple-choice", label: "Multiple Choice"},
        {value: "fill-in-the-blank", label: "Fill in the Blank"},
        {value: "match-pairs", label: "Match Pairs"},
        {value: "morphology-parts", label: "Morphology Parts - TODO"},
        {value: "morphology-form", label: "Morphology Form - TODO"},
        {value: "theory", label: "Theory"}

    ]

    const handleDataChange = useCallback((data: Partial<TaskTypes.Task>) => {
        setTaskData(data)
    }, [])

    const renderTaskForm = (taskType: string) => {


        switch (taskType) {
            case "choose-one":
                return <ChooseOneForm onDataChange={handleDataChange}/>
            case "multiple-choice":
                return <MultipleChoiceForm onDataChange={handleDataChange}/>
            case "fill-in-the-blank":
                //Nie wyswietla miejsca na input
                return <FillTheBlankForm onDataChange={handleDataChange}/>
            case "match-pairs":
                return <MatchPairsForm onDataChange={handleDataChange}/>
            case "morphology-parts":
                return <div>Morphology Parts Form (TODO)</div>
            case "morphology-form":
                return <div>Morphology Form Form (TODO)</div>
            case "theory":
                return <div>Theory Form (TODO)</div>

            default:
                return <div>Wybierz typ zadania do dodania</div>

        }

    }


    const handleTaskPost = async () => {
        if (!selectedTaskType || !taskData) return;

        try {

            const { id, ...taskDataWithoutId } = taskData as any;


            console.log("Wysylam dane zadania:", taskDataWithoutId);

            await api.post(`/api/exercises`, taskDataWithoutId, {withCredentials: true});

            console.log('Task submitted successfully');
            setTaskData(null);
            setSelectedTaskType("");
        } catch (error) {
            console.error('Failed to submit stats:', error);
        }

    };


    return (
        <div className={styles.adminPageContainer}>
{/*    Oprocz tego nalezy gdzies dodac mozliwosc przegladania dostepnych juz zadan i mozliwe filtrowanie ich po zawartosci?*/}

            <div className={styles.taskContainer}>


                <h2>Task Management Page</h2>

                <div className={styles.taskTypeSelector}>
                    <label htmlFor="taskTypeSelect">
                        <strong>Wybierz typ zadania</strong>
                    </label>
                    <select
                        id="taskTypeSelect"
                        value={selectedTaskType}
                        onChange={(e) => setSelectedTaskType(e.target.value)}
                        className={styles.taskTypeDropdown}
                    >
                        <option value="">Wybierz typ zadania</option>
                        {taskTypes.map((taskType) => (
                            <option key={taskType.value} value={taskType.value}>
                                {taskType.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={localStyles.taskCreationArea}>

                    <div className={styles.formsColumn}>


                        <div className={styles.taskForm}>
                            {renderTaskForm(selectedTaskType)}
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.createButton} onClick={() => handleTaskPost()}>
                                Zapisz Zadanie
                            </button>
                        </div>
                    </div>


                    <div className={styles.previewColumn}>

                        <div className={styles.previewBox}>

                            {taskData && <TaskPreviewRenderer
                                taskType={selectedTaskType}
                                taskData={taskData}
                            />}
                        </div>

                    </div>

                </div>


            </div>


        </div>)
}

export default TaskManagementPage