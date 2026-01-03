import {useEffect, useState} from "react";
import localStyles from "./TaskForms.module.css"
import type {MultipleChoiceFormType} from "./formTaskTypes.ts";


const MultipleChoiceForm = ({onDataChange}) => {

    const [formData, setFormData] = useState<MultipleChoiceFormType>({
        id: "",
        type: "multiple-choice",
        description: "",
        answers: [] as string[],
        decoyAnswers: [] as string[],
    })

    useEffect(() => {
        onDataChange(formData)
    }, [formData, onDataChange])


    const removeAnswer = (index: number) => {
        if (formData.answers.length > 1) {
            setFormData({
                ...formData,
                answers: formData.answers.filter((_, i) => i !== index)
            })
        }
    }

    const removeDecoyAnswer = (index: number) => {
        if (formData.decoyAnswers.length > 1) {
            setFormData({
                ...formData,
                decoyAnswers: formData.decoyAnswers.filter((_, i) => i !== index)
            })
        }
    }

    return (
        <div className={localStyles.formSection}>
            <h3>Multiple Choice Task</h3>
            <label>
                Description:
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter task description"
                />
            </label>
            <div>
                <strong>Correct Answers:</strong>
                {formData.answers.map((answer, index) => (
                    <div key={index}>
                        <input

                            type="text"
                            value={answer}
                            onChange={(e) => {
                                const newAnswers = [...formData.answers]
                                newAnswers[index] = e.target.value
                                setFormData({...formData, answers: newAnswers})
                            }}
                            placeholder={`Correct answer ${index + 1}`}
                        />
                        {formData.answers.length > 1 && (
                            <button onClick={() => removeAnswer(index)}>Remove</button>
                        )}

                    </div>
                ))}
                <button onClick={() => setFormData({
                    ...formData,
                    answers: [...formData.answers, '']
                })}>
                    Add Correct Answer
                </button>
            </div>
            <div>
                <strong>Decoy Answers:</strong>
                {formData.decoyAnswers.map((decoy, index) => (
                    <div key={index}>
                        <input

                            type="text"
                            value={decoy}
                            onChange={(e) => {
                                const newDecoys = [...formData.decoyAnswers]
                                newDecoys[index] = e.target.value
                                setFormData({...formData, decoyAnswers: newDecoys})
                            }}
                            placeholder={`Decoy answer ${index + 1}`}
                        />

                        {formData.decoyAnswers.length > 1 && (
                            <button onClick={() => removeDecoyAnswer(index)}> Remove decoy </button>)
                        }

                    </div>
                ))}
                <button onClick={() => setFormData({
                    ...formData,
                    decoyAnswers: [...formData.decoyAnswers, '']
                })}>
                    Add Decoy Answer
                </button>
            </div>
        </div>
    )
}
export default MultipleChoiceForm;