import type {ChooseOneTaskType} from '../taskTypes.ts'
import styles from './Tasks.module.css'

function ChooseOneTask({task}: { task: ChooseOneTaskType }) {

    const options = [...task.decoyAnswers, task.answer].sort(() => Math.random() - 0.5);

    return (
        <div>
            <h2>{task.description}</h2>

            <div className={styles.buttonsContainer}>

                {options.map((option, index) => (
                    <div className={styles.answerButton}
                         key={index}>{option}</div>
                ))}

            </div>

        </div>
    );
}

export default ChooseOneTask;