import styles from "./TaskForms.module.css";

import type {MorphologyFormType} from "./formTaskTypes.ts";
import {useEffect, useState} from "react";
import api from "../../../../auth/api.ts";
import WordGroupSearchWordModal from "../modals/WordGroupSearchWordModal.tsx";

interface Props {
    onDataChange: (data: MorphologyFormType) => void;
    initialData?: Partial<MorphologyFormType>;
}

interface MorphologyRequest {
    wordArabic: string;
    wordTranslation: string;
}

const MorphologyFormsForm = ({onDataChange, initialData}: Props) => {


    const [isWordListOpen, setIsWordListOpen] = useState(false);
    const [selectedWord, setSelectedWord] = useState<{
        wordId: number;
        lemma: string;
        translation: string
    } | null>(null);


    const [formData, setFormData] = useState<MorphologyFormType>(() => ({
        id: initialData?.id || 0,
        type: 'morphology-form',
        question: initialData?.question || '',
        description: initialData?.description || '',
        steps: initialData?.steps || [],
    }));


    useEffect(() => {
        onDataChange(formData)
    }, [formData, onDataChange])


    const handleWordListClick = () => {
        setIsWordListOpen(true)
    }

    const handleSendWordToProcess = async (word: { wordId: number; lemma?: string; translation?: string }) => {

        try {
            if (!word.lemma || !word.translation) {
                return;
            }
            const payload: MorphologyRequest = {
                wordArabic: word.lemma,
                wordTranslation: word.translation};

            setSelectedWord({wordId: word.wordId, lemma: word.lemma, translation: word.translation});
            const response = await api.post(`/api/task-generation/morphology-forms`,
                payload, {withCredentials: true});

            const receivedData = response.data;

            setFormData(prev => ({
                ...prev,
                question: receivedData.question || prev.question,
                steps: receivedData.steps || prev.steps,
                referencedWordId : word.wordId
            }));

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={styles.formContainer}>

            <div className={styles.formSection}>

                <label className={styles.formLabel}>
                    Treść pytania do wykonania
                </label>
                <textarea
                    className={styles.formTextarea}
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    placeholder="Np.Przetłumacz słowo 'Kot'"
                    rows={1}
                    disabled={formData.id > 0}
                />
            </div>

            <div className={styles.formSection}>
                <label className={styles.formLabel}>
                    Wybierz słowo, które umieścisz w zadaniu </label>

                {formData.id > 0 ? (
                    <div className={styles.formSection}>
                      Tego zadania nie można już edytować.
                    W razie potrzeby możesz je usunąć i stworzyć nowe.</div>

                ) : (<button className={styles.formButton}
                             onClick={handleWordListClick}>
                    Wybierz słowo
                </button>)
                }

            </div>

            <div className={styles.formSection}>

            </div>

            <WordGroupSearchWordModal
                isOpen={isWordListOpen}
                onClose={() => {
                    setIsWordListOpen(false);
                }}
                onSelectWord={handleSendWordToProcess}
            />

        </div>
    );
}

export default MorphologyFormsForm;