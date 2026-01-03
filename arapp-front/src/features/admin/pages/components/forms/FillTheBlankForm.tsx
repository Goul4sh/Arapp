import {useEffect, useState} from "react";
import type {FillInTheBlankFormType} from "./formTaskTypes.ts";
import localStyles from "./TaskForms.module.css";


const FillTheBlankForm = ({onDataChange}) => {
    const [formData, setFormData] = useState<FillInTheBlankFormType>({
        id: '',
        type: 'fill-in-the-blank',
        sentenceWithBlank: '',
        description: '',
        answer: '',
    })

    useEffect(() => {
        onDataChange(formData)
    }, [formData, onDataChange])


    return (

        <div className={localStyles.formSection}>
            <h3>Choose One Task</h3>
            <label>
                Description:
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter task description"
                />
            </label>

            <label>
                Correct Answer:
                <input
                    type="text"
                    value={formData.sentenceWithBlank}
                    onChange={(e) => setFormData({ ...formData, sentenceWithBlank: e.target.value })}
                    placeholder="Wpisz zdanie z luką."
                />
            </label>

            <label>
                Correct Answer:
                <input
                    type="text"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Podaj brakujące słowo lub frazę."
                />
            </label>

        </div>
    );




}
export default FillTheBlankForm;