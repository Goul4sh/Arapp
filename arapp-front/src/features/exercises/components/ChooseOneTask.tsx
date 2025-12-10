import type {ChooseOneTaskType} from '../taskTypes.ts'
import styles from './Tasks.module.css'
import {useContext, useMemo, useState} from "react";
import {LessonContext} from "./LessonContext.tsx";

function ChooseOneTask({task}: { task: ChooseOneTaskType }) {

    const {submitAnswer} = useContext(LessonContext)

    const options = useMemo(
            () => [...task.decoyAnswers, task.answer].sort(() => Math.random() - 0.5),
            [task.decoyAnswers, task.answer]);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
    }

    const handleCheck = () => {
        const isCorrect = selectedOption === task.answer;
        submitAnswer(isCorrect);
    }

    return (
        <div className={styles.taskContainer}>
            <h2>{task.description}</h2>

            <div className={styles.buttonsContainer}>

                {options.map((option, index) => (
                    <button
                        className={`${styles.answerButton} ${selectedOption === option ? styles.selected : ''}`}
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
                    disabled={selectedOption === null}
                    onClick={() => handleCheck()}>
                    Zatwierdź
                </button>
            </div>

        </div>
    );
}

export default ChooseOneTask;