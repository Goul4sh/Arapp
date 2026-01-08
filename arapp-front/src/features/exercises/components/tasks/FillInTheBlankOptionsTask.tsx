import type {FillInTheBlankTaskType} from '../../taskTypes.ts'
import styles from "../Tasks.module.css";
import {useContext, useState} from "react";
import {LessonContext} from "../LessonContext.tsx";


function FillInTheBlankOptionsTask({task}: { task: FillInTheBlankTaskType }) {

    const {submitAnswer} = useContext(LessonContext);
    const [userInput, setUserInput] = useState<string>('');


    const handleCheck = () => {
        const isCorrect = userInput.trim().toLowerCase() === task.answer.toLowerCase();
        submitAnswer(isCorrect);
    }


    const renderDescription = () => {
        const parts = task.sentenceWithBlank.split('__');

        return (
            <div className={styles.sentenceContainer}>
                {parts.map((part, index) => (
                    <span key={index}>
                        {part}
                        {index < parts.length - 1 && (
                            <input
                                type="text"
                                className={styles.gapInput}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder=""
                            />
                        )}
                    </span>
                ))}
            </div>
        );
    };


    return (
        <div className={styles.taskContainer}>
            <h2>{task.description}</h2>

            <div className={styles.fillTheGapContainer}>
                <div className={styles.fillTheGapTranslation}> Tłumaczenie tłumaczenie tłumaczenie</div>

                <div className={styles.separator}/>

                {renderDescription()}

            </div>
            <div className={styles.checkButtonContainer}>
                <button
                    className={styles.checkButton}
                    disabled={userInput.trim() === ''}
                    onClick={() => handleCheck()}>
                    Zatwierdź
                </button>
            </div>

        </div>
    );
}

export default FillInTheBlankOptionsTask