import type { MultipleChoiceTaskType } from '../taskTypes.ts'


function MultipleChoiceTask ({task}: { task: MultipleChoiceTaskType }) {
    return (
        <div>
            <h2>{task.description}</h2>
            <ul>
                {task.options.map((option, index) => (
                    <li key={index}>{option}</li>
                ))}
            </ul>
        </div>
    );
}
export default MultipleChoiceTask;