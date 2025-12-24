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
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');


    const handleOptionClick = (option: string) => {

        if (selectedOptions?.includes(option)) {

            setSelectedOptions(selectedOptions.filter(o => o !== option));
        } else {
            const newSelectedOptions = selectedOptions ? [...selectedOptions, option] : [option];
            setSelectedOptions(newSelectedOptions);
        }

    }

    const handleCheck = () => {
        if (!selectedOptions || status !== "idle") return;

        if (!selectedOptions || selectedOptions.length !== task.answers.length) {
            setStatus( 'wrong');

            setTimeout(() => {
                submitAnswer(false);
                setSelectedOptions(null);
                setStatus('idle');
            }, 1500);
            return;
        }

        const isCorrect = task.answers.every(answer => selectedOptions.includes(answer));
        setStatus(isCorrect ? 'correct' : 'wrong');

        setTimeout(() => {
            submitAnswer(isCorrect);
            setSelectedOptions(null);
            setStatus('idle');
        }, 1500);


    }


    const buttonStyling = (option: string) => {
        let className = styles.answerButton;

        if (status === 'idle') {
            if (selectedOptions?.includes(option)) {
                className += ` ${styles.selected}`;
            }
        }
        else {
            if (task.answers?.includes(option)) {
                className += ` ${styles.correct}`;
            }
            else if (selectedOptions?.includes(option) && status === 'wrong') {
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
                    disabled={selectedOptions === null || status !== 'idle'}
                    onClick={() => handleCheck()}>
                    {status == 'idle' ?  'Zatwierdź' : (status == 'correct' ? 'Świetnie!' : 'Błąd!' )}
                </button>
            </div>

        </div>
    );
}
export default MultipleChoiceTask;