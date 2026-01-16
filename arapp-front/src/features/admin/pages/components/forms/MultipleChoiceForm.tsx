import {useEffect, useState} from "react";
import styles from "./TaskForms.module.css"
import type {MultipleChoiceFormType} from "./formTaskTypes.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";

interface Props {
    onDataChange: (data: MultipleChoiceFormType) => void;
    initialData?: Partial<MultipleChoiceFormType>;
}

const MultipleChoiceForm = ({onDataChange, initialData}: Props) => {

    const [formData, setFormData] = useState<MultipleChoiceFormType>(() => ({
        id: initialData?.id || 0,
        type: "multiple-choice",
        description: initialData?.description || '',
        answers: initialData?.answers || [''],
        decoyAnswers: initialData?.decoyAnswers || [''],
    }));

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


    const addAnswer = () => {
        setFormData({ ...formData, answers: [...formData.answers, ''] });
    };

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...formData.answers];
        newAnswers[index] = value;
        setFormData({ ...formData, answers: newAnswers });
    };

    const handleDecoyChange = (index: number, value: string) => {
        const newDecoys = [...formData.decoyAnswers];
        newDecoys[index] = value;
        setFormData({ ...formData, decoyAnswers: newDecoys });
    };

    const addDecoyAnswer = () => {
        setFormData({ ...formData, decoyAnswers: [...formData.decoyAnswers, ''] });
    };


    return (
        <div className={styles.formContainer}>

            <div className={styles.formSection}>
                <label className={styles.formLabel}>
                    Treść pytania / zadania
                </label>
                <textarea
                    className={styles.formTextarea}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Które z poniższych słów są rzeczownikami?"
                    rows={3}
                />
            </div>

            <div className={styles.formSection}>
                <label className={styles.formLabel}>
                    Poprawne odpowiedzi
                </label>


                <div className={styles.dynamicList}>
                    {formData.answers.map((answer, index) => (
                        <div key={index} className={styles.listItem}>
                            <div className={styles.listItemContent}>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    value={answer}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    placeholder={`Poprawna opcja #${index + 1}`}
                                />
                            </div>
                            <div className={styles.listItemActions}>
                                <button
                                    className={styles.iconButton}
                                    onClick={() => removeAnswer(index)}
                                    disabled={formData.answers.length <= 1}
                                    title="Usuń poprawną odpowiedź"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className={styles.addButton}
                    onClick={addAnswer}>
                    <FontAwesomeIcon icon={faPlus} /> Dodaj poprawną odpowiedź
                </button>
            </div>

            <div className={styles.formSection}>
                <label className={styles.formLabel}>
                    Błędne odpowiedzi
                </label>

                <div className={styles.dynamicList}>
                    {formData.decoyAnswers.map((decoy, index) => (
                        <div key={index} className={styles.listItem}>
                            <div className={styles.listItemContent}>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    value={decoy}
                                    onChange={(e) => handleDecoyChange(index, e.target.value)}
                                    placeholder={`Błędna opcja #${index + 1}`}
                                />
                            </div>

                            <div className={styles.listItemActions}>
                                <button
                                    className={styles.iconButton}
                                    onClick={() => removeDecoyAnswer(index)}
                                    disabled={formData.decoyAnswers.length <= 1}
                                    title="Usuń zmyłkę"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className={`${styles.addButton} ${styles.decoyButton}`}
                    onClick={addDecoyAnswer}
                >
                    <FontAwesomeIcon icon={faPlus} /> Dodaj zmyłkę
                </button>
            </div>

        </div>
    );

}
export default MultipleChoiceForm;