import type {MorphologyPartsTaskType, MorphologySegment} from "../../taskTypes.ts";
import {useContext, useEffect, useState} from "react";
import {LessonContext} from "../LessonContext.tsx";
import taskStyles from "../Tasks.module.css";
import localStyles from "./MorphologyForm.module.css";


function MorphologyPartsTask({task}: { task: MorphologyPartsTaskType }) {

    const {submitAnswer} = useContext(LessonContext);

    const [errorId, setErrorId] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'correct'>('idle');

    const [constructedWord, setConstructedWord] = useState<string[]>([]);

    const [visibleOptions, setVisibleOptions] = useState<MorphologySegment[]>(
        () => {
            const combined = [...task.segments, ...task.decoySegments];
            return combined.sort(() => Math.random() - 0.5);
        }
    );

    const [correctOrderQueue, setCorrectOrderQueue] = useState<string[]>(task.correctOrder)

    const isFinished = correctOrderQueue.length === 0;

    useEffect(() => {
        if (isFinished && status === 'idle') {
            setStatus('correct');

            setTimeout(() => {
                submitAnswer(true);
            }, 1500);
        }
    }, [isFinished, status, submitAnswer]);


    const handleOptionClick = (segment: MorphologySegment) => {

        if (status !== 'idle' || errorId) return;

        if (segment.id === correctOrderQueue[0]) {

            setConstructedWord((prev) => [...prev, segment.content]);

            setCorrectOrderQueue((prev) => prev?.slice(1));

            setVisibleOptions((prev) => prev.filter(opt => opt.id !== segment.id));

        } else {

            setErrorId(segment.id);
            setTimeout(() => setErrorId(null), 1500);
            //TODO Cos mozna dodac pozniej - dzwiek?

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
                        <span className={localStyles.placeholder}>Wybierz część.</span>
                    )}

                    {constructedWord.map((segment, index) => (
                        <span key={index} className={localStyles.wordSegment}>
                            {segment}
                        </span>
                    ))}

                    {!isFinished && <span className={localStyles.cursor}>_</span>}
                </div>
            </div>

            {/* TODO Zamiast znikania ustawic wygaszanie wykorzystanych czesci?*/}

            <div className={taskStyles.buttonsContainer}>
                {visibleOptions.map((option) => (
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
                    <div style={{color: '#4cae4f', fontWeight: 'bold', fontSize: '1.5rem'}}>
                        Świetnie!
                    </div>
                )}
            </div>

            <div className={taskStyles.checkButtonContainer}></div>

        </div>
    );

}


export default MorphologyPartsTask