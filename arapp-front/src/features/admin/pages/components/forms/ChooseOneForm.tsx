import {useEffect, useState} from "react";
import styles from "./TaskForms.module.css"
import type {ChooseOneFormType} from "./formTaskTypes.ts";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Props {
    onDataChange: (data: ChooseOneFormType) => void;
    initialData?: Partial<ChooseOneFormType>;
}

const ChooseOneForm = ({onDataChange, initialData}: Props) => {

    const [formData, setFormData] = useState<ChooseOneFormType>(() => ({
        id: initialData?.id || 0,
        type: 'choose-one',
        description: initialData?.description || '',
        answer: initialData?.answer || '',
        decoyAnswers: initialData?.decoyAnswers || ['']
    }));


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

    const handleDecoyChange = (index: number, value: string) => {
        const newDecoys = [...formData.decoyAnswers];
        newDecoys[index] = value;
        setFormData({ ...formData, decoyAnswers: newDecoys });
    };

    const addDecoyAnswer = () => {
        setFormData({
            ...formData,
            decoyAnswers: [...formData.decoyAnswers, '']
        });
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
                    placeholder="Np. Wybierz poprawne tłumaczenie słowa 'Kot'"
                    rows={3}
                />
            </div>

            <div className={styles.formSection}>
                <label className={styles.formLabel}>
                    Poprawna odpowiedź
                </label>
                <input
                    className={`${styles.formInput} ${styles.correctAnswerInput}`}
                    type="text"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Wpisz poprawną odpowiedź"
                />
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
                                    title="Usuń opcję"
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
                    <FontAwesomeIcon icon={faPlus} /> Dodaj kolejną zmyłkę
                </button>
            </div>

        </div>
    );

}
export default ChooseOneForm;