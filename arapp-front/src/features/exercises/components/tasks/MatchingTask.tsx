import type { MatchingTaskType } from '../../taskTypes.ts'


function MatchingTask({task}: { task: MatchingTaskType }) {
    return (<div>
        <h2>{task.description}</h2>
        <ul>
            {task.pairs.map((pair, index) => (
                <li key={index}>
                    {pair.left} - {pair.right}
                </li>
            ))}
        </ul>
    </div>
    );
}
export default MatchingTask;