import {useEffect, useState} from "react";
import localStyles from "./TaskForms.module.css"
import type {ChooseOneFormType} from "./formTaskTypes.ts";


const ChooseOneForm = ({onDataChange}) => {
    const [formData, setFormData] = useState<ChooseOneFormType>({
        id: '',
        type: 'choose-one',
        description: '',
        answer: '',
        decoyAnswers: ['']
    })

    useEffect(() => {
        onDataChange(formData)
    }, [formData, onDataChange])


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
            <h3>Choose One Task</h3>
            <label>
                Description:
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter task description"
                />
            </label>
            <label>
                Correct Answer:
                <input
                    type="text"
                    value={formData.answer}
                    onChange={(e) => setFormData({...formData, answer: e.target.value})}
                    placeholder="Enter correct answer"
                />
            </label>
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
                            <button onClick={() => removeDecoyAnswer(index)}>Remove</button>
                        )}

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
export default ChooseOneForm;