import type {MatchPairsTaskType} from '../../taskTypes.ts'
import {useContext, useState} from "react";
import {LessonContext} from "../LessonContext.tsx";
import styles from '../Tasks.module.css'

//TODO trzeba dodać submitAnswer w odpowiednich miejscah
// i dodatkowo zastanowic sie jak to bedzie dzialac w przypadku zliczania statystyk.

function MatchPairsTask({task}: { task: MatchPairsTaskType }) {

    const {submitAnswer} = useContext(LessonContext)
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

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
                submitAnswer( true);
            }
        } else {
            setSelectedLeft(null);
            setSelectedRight(null);
        }

    }

    return (<div>
            <h2>{task.description}</h2>

            <div className={styles.pairsContainer}>

                <div className={styles.column}>
                    {Object.keys(task.pairs).map((key, index) => (
                        <button
                            key={index}
                            className={`${styles.answerButton} ${selectedLeft === key ? styles.selected : ''}`}
                            onClick={() => handleClickLeft(key)}
                            disabled={matchedPairs.includes(key)}
                        >
                            {key}
                        </button>
                    ))}
                </div>

                <div className={styles.column}>
                    {Object.values(task.pairs).map((value, index) => (
                        <button
                            key={index}
                            className={`${styles.answerButton} ${selectedRight === value ? styles.selected : ''}`}
                            onClick={() => handleClickRight(value)}
                            disabled={matchedPairs.includes(value)}
                        >
                            {value}
                        </button>
                    ))}
                </div>


            </div>
        </div>
    );
}

export default MatchPairsTask;