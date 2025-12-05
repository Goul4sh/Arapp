import type { FillInTheBlankTaskType } from '../taskTypes.ts'


function FillInTheBlankTask ({task} : { task: FillInTheBlankTaskType }) {
  return (
    <div>
      <h2>Fill in the Blanks Task</h2>

        <h3>{task.description}</h3>
        <input type="text" placeholder="Your answer here" />

    </div>
  )
}

export default FillInTheBlankTask