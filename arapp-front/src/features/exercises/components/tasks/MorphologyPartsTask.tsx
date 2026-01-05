import type {MorphologyPartsTaskType, MorphologySegment} from "../../taskTypes.ts";
import {useContext, useEffect, useMemo, useState} from "react";
import {LessonContext} from "../LessonContext.tsx";
import taskStyles from "../Tasks.module.css";
import localStyles from "./MorphologyForm.module.css";


function MorphologyPartsTask({task}: { task: MorphologyPartsTaskType }) {

    const {submitAnswer} = useContext(LessonContext);

    const [hasMistake, setHasMistake] = useState(false);

    const [errorId, setErrorId] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'finished'>('idle');

    const [constructedWord, setConstructedWord] = useState<string[]>([]);

    const [usedSegmentIds, setUsedSegmentIds] = useState<string[]>([]);

    const allOptions = useMemo(() => {
        const combined = [...task.segments, ...task.decoySegments];
        return combined.sort(() => Math.random() - 0.5);
    }, [task.segments, task.decoySegments]);


    const [correctOrderQueue, setCorrectOrderQueue] = useState<string[]>(task.correctOrder)

    const isFinished = correctOrderQueue.length === 0;

    useEffect(() => {
        if (isFinished && status === 'idle') {
            setStatus('finished');

            setTimeout(() => {
                submitAnswer(!hasMistake);
            }, 1500);
        }
    }, [isFinished, status, submitAnswer, hasMistake]);


    const handleOptionClick = (segment: MorphologySegment) => {

        if (status !== 'idle' || errorId || usedSegmentIds.includes(segment.id)) return;

        if (segment.id === correctOrderQueue[0]) {

            setConstructedWord((prev) => [...prev, segment.content]);
            setCorrectOrderQueue((prev) => prev?.slice(1));

            setUsedSegmentIds((prev) => [...prev, segment.id]);
        } else {

            setHasMistake(true);

            setErrorId(segment.id);
            setTimeout(() => setErrorId(null), 1000);
            //TODO Cos mozna dodac pozniej - dzwiek?

        }
    };

    const getButtonClass = (optionId: string) => {
        let className = `${taskStyles.answerButton} ${localStyles.arabicBtnFont}`;

        if (errorId === optionId) {
            className += ` ${taskStyles.wrong}`;
        } else if (usedSegmentIds.includes(optionId)) {

            className += ` ${taskStyles.dimmed}`;
        }

        return className;
    };


    return (
        <div className={taskStyles.taskContainer}>
            <h2>Przetłumacz: "{task.question}"</h2>

            <div className={`${localStyles.wordDisplay} ${status === 'finished' ? taskStyles.correct : ''}`}>
                <div className={localStyles.arabicWrapper} dir="rtl">

                    {constructedWord.length === 0 && (
                        <span className={localStyles.placeholder}></span>
                    )}

                    {constructedWord.map((segment, index) => (
                        <span key={index} lang="ar" className={localStyles.wordSegment}>
                            {segment}
                        </span>
                    ))}

                    {!isFinished && <span className={localStyles.cursor}>_</span>}
                </div>
            </div>

            <div className={taskStyles.buttonsContainer}>
                {allOptions.map((option) => (
                    <button
                        lang="ar"
                        key={option.id}
                        className={getButtonClass(option.id)}
                        onClick={() => handleOptionClick(option)}
                        disabled={!!errorId}
                    >
                        {option.content}
                    </button>
                ))}

                {status === 'finished' && (
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