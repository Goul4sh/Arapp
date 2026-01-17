import type {TheoryTaskType} from "../../taskTypes.ts";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import styles from "../Tasks.module.css"
import {useContext} from "react";
import {LessonContext} from "../LessonContext.tsx";

// import markdownStyles from "../theoryMarkdown.module.css"

const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

function TheoryTask({task}: { task: TheoryTaskType }) {

    const {submitAnswer} = useContext(LessonContext)


    const handleNext = () => {


        submitAnswer(true);
    }


    return (
        <div className={styles.theorTaskContainer}>

            <div className={styles.markdownContainer}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>

                    {task.content}

                </ReactMarkdown>


            </div>

            <div className={styles.checkButtonContainer}>

                <button
                    className={styles.checkButton}
                    onClick={() => handleNext()}>

                    Dalej

                </button>


            </div>


        </div>
    )
}

export default TheoryTask;