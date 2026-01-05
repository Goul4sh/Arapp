import type {MatchPairsTaskType} from '../../taskTypes.ts'
import {useContext, useMemo, useState} from "react";
import {LessonContext} from "../LessonContext.tsx";
import styles from '../Tasks.module.css'
import taskStyles from "../Tasks.module.css";
import localStyles from "./MorphologyForm.module.css";

function MatchPairsTask({task}: { task: MatchPairsTaskType }) {

    const {submitAnswer} = useContext(LessonContext)
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);


    const [errorIds, setErrorIds] = useState<string[] | null>(null);
    const [hasMistake, setHasMistake] = useState(false);
    const [status, setStatus] = useState<'idle' | 'finished'>('idle');


    const leftItems = useMemo(() => {
        return Object.keys(task.pairs).sort(() => Math.random() - 0.5);
    }, [task]);

    const rightItems = useMemo(() => {
        return Object.values(task.pairs).sort(() => Math.random() - 0.5);
    }, [task]);


    const handleClickLeft = (option: string) => {

        if (matchedPairs.includes(option)) return;

        if (selectedLeft === option) {
            setSelectedLeft(null);
        } else {
            setSelectedLeft(option);
            if (selectedRight) {
                checkMatch(option, selectedRight);
            }
        }
    }
    const handleClickRight = (option: string) => {
        if (matchedPairs.includes(option)) return;

        if (selectedRight === option) {
            setSelectedRight(null);
        } else {
            setSelectedRight(option);
            if (selectedLeft) {
                checkMatch(selectedLeft, option);
            }
        }
    }

    const checkMatch = (left: string, right: string) => {

        const isCorrect = task.pairs[left] === right;
        if (isCorrect) {
            const newMatchedPairs = [...matchedPairs, left, right];
            setMatchedPairs(newMatchedPairs);
            setSelectedLeft(null);
            setSelectedRight(null);
            if (newMatchedPairs.length === Object.keys(task.pairs).length * 2) {
                setStatus('finished')
                setTimeout(() => submitAnswer(!hasMistake), 1500);
            }
        } else {
            setHasMistake(true);
            setErrorIds([left, right]);
            setTimeout(() => setErrorIds(null), 1000);
            setSelectedLeft(null);
            setSelectedRight(null);
        }

    }

    const getButtonClass = (optionId: string) => {
        let className = `${taskStyles.answerButton} `;

        if (errorIds?.includes(optionId)) {
            className += ` ${taskStyles.wrong}`;
        } else if (matchedPairs.includes(optionId)) {

            className += ` ${taskStyles.dimmed}`;
        }

        return className;
    };

    return (<div>
            <h2>{task.description}</h2>

            <div className={styles.pairsContainer}>

                <div className={styles.column}>
                    {leftItems.map((key, index) => (
                        <button
                            key={index}
                            className={`${getButtonClass(key)} ${selectedLeft === key ? styles.selected : ''}`}
                            onClick={() => handleClickLeft(key)}
                            disabled={matchedPairs.includes(key)}
                        >
                            {key}
                        </button>
                    ))}
                </div>

                <div className={styles.column}>
                    {rightItems.map((value, index) => (
                        <button
                            key={index}
                            className={`${getButtonClass(value)} ${selectedRight === value ? styles.selected : ''} ${localStyles.arabicBtnFont}`}
                            onClick={() => handleClickRight(value)}
                            disabled={matchedPairs.includes(value)}
                        >
                            {value}
                        </button>
                    ))}
                </div>

            </div>

            {status === 'finished' && (
                <div style={{color: '#4cae4f', fontWeight: 'bold', fontSize: '1.5rem'}}>
                    Świetnie!
                </div>
            )}

        </div>
    );
}

export default MatchPairsTask;