import {useContext, useEffect, useMemo, useState} from "react";
import {LessonContext} from "../LessonContext.tsx";
import taskStyles from "../Tasks.module.css";
import localStyles from "./MorphologyForm.module.css";
import type {MorphologyFormTaskType, MorphologyOption} from "../../taskTypes.ts";



function MorphologyFormTask ({task}: { task: MorphologyFormTaskType }) {

    const { submitAnswer } = useContext(LessonContext);

    const [hasMistake, setHasMistake] = useState(false);

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [constructedWord, setConstructedWord] = useState<string[]>([]);
    const [errorId, setErrorId] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'correct'>('idle');


    const currentStep = task.steps[currentStepIndex];
    const isFinished = currentStepIndex >= task.steps.length;

    const currentOptions = useMemo(() => {
        if (!currentStep) return [];
        return [...currentStep.options].sort(() => Math.random() - 0.5);
    }, [currentStep]);

    useEffect(() => {
        if (isFinished && status === 'idle') {
            setStatus('correct');

            setTimeout(() => {
                submitAnswer(!hasMistake);
            }, 1500);
        }
    }, [hasMistake, isFinished, status, submitAnswer]);

    const handleOptionClick = (option: MorphologyOption) => {

        if (status !== 'idle' || errorId) return;

        if (option.isCorrect) {

            setConstructedWord((prev) => [...prev, option.content]);
            setCurrentStepIndex((prev) => prev + 1);
        } else {

            setHasMistake(true);
            setErrorId(option.id);
            setTimeout(() => setErrorId(null), 1000);

        }
    };

    const getButtonClass = (optionId: string) => {
        let className = `${taskStyles.answerButton} ${localStyles.arabicBtnFont}`;

        if (errorId === optionId) {
            className += ` ${taskStyles.wrong}`;
        }

        return className;
    };

    return (
        <div className={taskStyles.taskContainer}>
            <h2>Przetłumacz: "{task.question}"</h2>

            <div className={`${localStyles.wordDisplay} ${status === 'correct' ? taskStyles.correct : ''}`}>
                <div className={localStyles.arabicWrapper} dir="rtl">

                    {constructedWord.length === 0 && (
                        <span className={localStyles.placeholder}>Wybierz formę...</span>
                    )}

                    {constructedWord.map((segment, index) => (
                        <span key={index} className={localStyles.wordSegment}>
                            {segment}
                        </span>
                    ))}

                    {!isFinished && <span className={localStyles.cursor}>_</span>}
                </div>
            </div>

            <div className={taskStyles.buttonsContainer}>
                {!isFinished && currentOptions.map((option) => (
                    <button
                        key={option.id}
                        className={getButtonClass(option.id)}
                        onClick={() => handleOptionClick(option)}
                        disabled={!!errorId}
                    >
                        {option.content}
                    </button>
                ))}

                {status === 'correct' && (
                    <div style={{ color: '#4cae4f', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        Świetnie!
                    </div>
                )}
            </div>

            <div className={taskStyles.checkButtonContainer}></div>

        </div>
    );



}

export default MorphologyFormTask;