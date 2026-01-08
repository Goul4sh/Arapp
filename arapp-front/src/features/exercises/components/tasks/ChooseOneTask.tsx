import type {ChooseOneTaskType} from '../../taskTypes.ts'
import styles from '../Tasks.module.css'
import {useContext, useMemo, useState} from "react";
import {LessonContext} from "../LessonContext.tsx";

function ChooseOneTask({task}: { task: ChooseOneTaskType }) {

    const {submitAnswer} = useContext(LessonContext)

    const options = useMemo(
            () => [...task.decoyAnswers, task.answer].sort(() => Math.random() - 0.5),
            [task.decoyAnswers, task.answer]);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');


    const handleOptionClick = (option: string) => {
        if (status !== "idle") return;
        setSelectedOption(option);
    }

    const handleCheck = () => {
        if (!selectedOption || status !== "idle") return;

        const isCorrect = selectedOption === task.answer;

        setStatus(isCorrect ? 'correct' : 'wrong');


        //TODO dodać dzwieki uzywajac use-sound i darmowych zrodel
        setTimeout(() => {
            submitAnswer(isCorrect);
            // const [playSuccess] = useSound(successSfx, { soundEnabled: !isMuted });
            setSelectedOption(null);
            setStatus('idle');
        }, 1500);

    }

    const buttonStyling = (option: string) => {
        let className = styles.answerButton;

        if (status === 'idle') {
            if (selectedOption === option) {
                className += ` ${styles.selected}`;
            }
        }
        else {
            if (option === task.answer) {
                className += ` ${styles.correct}`;
            }
            else if (selectedOption === option && status === 'wrong') {
                className += ` ${styles.wrong}`;
            }
            else {
                className += ` ${styles.dimmed}`;
            }
        }

        return className;
    };


    return (
        <div className={styles.taskContainer}>
            <h2>{task.description}</h2>

            <div className={styles.buttonsContainer}>

                {options.map((option, index) => (
                    <button
                        className={buttonStyling(option)}
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        disabled={status !== 'idle'}
                    >
                        {option}
                    </button>
                ))}

            </div>
            <div className={styles.checkButtonContainer}>
                <button
                    className={styles.checkButton}
                    disabled={selectedOption === null || status !== 'idle'}
                    onClick={() => handleCheck()}>
                    {status == 'idle' ?  'Zatwierdź' : (status == 'correct' ? 'Świetnie!' : 'Błąd!' )}
                </button>
            </div>

        </div>
    );
}

export default ChooseOneTask;