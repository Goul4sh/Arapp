import { useEffect, useState } from "react";
import styles from "./TaskForms.module.css"
import type { TranslateFormType } from "./formTaskTypes.ts";

interface Props {
    onDataChange: (data: TranslateFormType) => void;
    initialData?: Partial<TranslateFormType>;
}

const TranslateTaskForm = ({ onDataChange, initialData }: Props) => {

    const [formData, setFormData] = useState<TranslateFormType>(() => ({
        id: initialData?.id || 0,
        type: 'translate',
        description: initialData?.description || 'Przetłumacz podane słowo: ',
        textToTranslate: initialData?.textToTranslate || '',
        translatedText: initialData?.translatedText || ''
    }));

    useEffect(() => {
        onDataChange(formData);
    }, [formData, onDataChange]);

    return (
        <div className={styles.formContainer}>

            <div className={styles.formSection}>
                <label className={styles.formLabel}>
                    Polecenie / Opis zadania
                </label>
                <textarea
                    className={styles.formTextarea}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Przetłumacz podane słowo na język polski"
                    rows={2}
                />
            </div>

            <div className={styles.formSection}>

                <div>
                    <label className={styles.formLabel}>
                        Tekst do przetłumaczenia
                    </label>
                    <input
                        className={styles.formInput}
                        type="text"
                        value={formData.textToTranslate}
                        onChange={(e) => setFormData({ ...formData, textToTranslate: e.target.value })}
                        placeholder="Słowo po arabsku"
                        dir="auto"
                    />
                </div>

                <div>
                    <label className={styles.formLabel}>
                        Poprawne tłumaczenie
                    </label>
                    <input
                        className={`${styles.formInput} ${styles.correctAnswerInput}`}
                        type="text"
                        value={formData.translatedText}
                        onChange={(e) => setFormData({ ...formData, translatedText: e.target.value })}
                        placeholder="Tłumaczenie po polsku"
                    />
                </div>
            </div>
        </div>
    );
}

export default TranslateTaskForm;
