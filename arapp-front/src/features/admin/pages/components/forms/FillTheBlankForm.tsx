import {useEffect, useState} from "react";
import type {FillInTheBlankFormType} from "./formTaskTypes.ts";
import styles from "./TaskForms.module.css";

interface Props {
    onDataChange: (data: FillInTheBlankFormType) => void;
    initialData?: Partial<FillInTheBlankFormType>;
}


const FillTheBlankForm = ({onDataChange, initialData}: Props) => {
    const [formData, setFormData] = useState<FillInTheBlankFormType>(() => ({
        id: initialData?.id || 0,
        type: 'fill-in-the-blank',
        sentenceWithBlank: initialData?.sentenceWithBlank || '',
        description: initialData?.description || '',
        answer: initialData?.answer || '',
    }));

    useEffect(() => {
        onDataChange(formData)
    }, [formData, onDataChange])

    return (
        <div className={styles.formContainer}>

            <div className={styles.formSection}>
                <label className={styles.formLabel}>
                    Polecenie / Opis zadania
                </label>
                <textarea
                    className={styles.formTextarea}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Uzupełnij zdanie odpowiednim słowem."
                    rows={2}
                />
            </div>

            <div className={styles.formSection}>
                <div className={styles.infoBox}>
                    Wpisz zdanie, używając symbolu <strong>__</strong> (dwa podkreślniki) w miejscu luki.
                </div>

                <label className={styles.formLabel}>
                    Zdanie z luką (Kontekst)
                </label>


                <div style={{position: 'relative'}}>
                    <input
                        className={styles.formInput}
                        type="text"
                        value={formData.sentenceWithBlank}
                        onChange={(e) => setFormData({...formData, sentenceWithBlank: e.target.value})}
                        placeholder="Np. The cat ___ on the mat."
                        dir="auto"
                    />

                </div>
            </div>

            <div className={styles.formSection}>
                <label className={styles.formLabel}>
                    Brakujące słowo (Poprawna odpowiedź)
                </label>
                <div>
                    <input
                        className={styles.formInput}
                        type="text"
                        value={formData.answer}
                        onChange={(e) => setFormData({...formData, answer: e.target.value})}
                        placeholder="Np. sat"

                    />
                </div>
            </div>

        </div>
    );


}
export default FillTheBlankForm;