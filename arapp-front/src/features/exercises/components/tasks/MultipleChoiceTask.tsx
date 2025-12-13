import type { MultipleChoiceTaskType } from '../../taskTypes.ts'
import styles from "../Tasks.module.css";
import {useContext, useMemo, useState} from "react";
import {LessonContext} from "../LessonContext.tsx";


function MultipleChoiceTask ({task}: { task: MultipleChoiceTaskType }) {

    const {submitAnswer} = useContext(LessonContext)

    const options = useMemo(
        () => [...task.decoyAnswers, ...task.answers].sort(() => Math.random() - 0.5),
        [task.decoyAnswers, task.answers]);

    const [selectedOptions, setSelectedOptions] = useState<string[] | null>(null);

    const handleOptionClick = (option: string) => {

        if (selectedOptions?.includes(option)) {

            setSelectedOptions(selectedOptions.filter(o => o !== option));
        } else {
            const newSelectedOptions = selectedOptions ? [...selectedOptions, option] : [option];
            setSelectedOptions(newSelectedOptions);
        }

    }

    const handleCheck = () => {

        if (!selectedOptions || selectedOptions.length !== task.answers.length) {
            submitAnswer(false);
            return;
        }

        const isCorrect = task.answers.every(answer => selectedOptions.includes(answer));
        submitAnswer(isCorrect);
    }



    return (
        <div className={styles.taskContainer}>
            <h2>{task.description}</h2>

            <div className={styles.buttonsContainer}>

                {options.map((option, index) => (
                    <button
                        className={`${styles.answerButton} ${selectedOptions?.includes(option)  ? styles.selected : ''}`}
                        key={index}
                        onClick={() => handleOptionClick(option)}
                    >
                        {option}
                    </button>
                ))}

            </div>
            <div className={styles.checkButtonContainer}>
                <button
                    className={styles.checkButton}
                    disabled={selectedOptions === null}
                    onClick={() => handleCheck()}>
                    Zatwierdź
                </button>
            </div>

        </div>
    );
}
export default MultipleChoiceTask;