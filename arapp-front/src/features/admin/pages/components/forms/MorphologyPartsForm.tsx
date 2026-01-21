// src/features/admin/pages/components/forms/MorphologyPartsForm.tsx
import styles from "./TaskForms.module.css";
import type {MorphologyPartsFormType} from "./formTaskTypes.ts";
import {useEffect, useState} from "react";
import api from "../../../../auth/api.ts";
import WordGroupSearchWordModal from "../modals/WordGroupSearchWordModal.tsx";

interface Props {
    onDataChange: (data: MorphologyPartsFormType) => void;
    initialData?: Partial<MorphologyPartsFormType>;
}

interface MorphologyRequest {
    wordArabic: string;
    wordTranslation: string;
}

const MorphologyPartsForm = ({onDataChange, initialData}: Props) => {
    const [isWordListOpen, setIsWordListOpen] = useState(false);
    const [selectedWord, setSelectedWord] = useState<{
        wordId: number;
        lemma: string;
        translation: string
    } | null>(null);

    const [formData, setFormData] = useState<MorphologyPartsFormType>(() => ({
        id: initialData?.id || 0,
        type: 'morphology-parts',
        description: initialData?.description || '',
        question: initialData?.question || '',
        correctOrder: initialData?.correctOrder || [],
        segments: initialData?.segments || [],
        decoySegments: initialData?.decoySegments || [],
        referencedWordId: initialData?.referencedWordId ?? undefined
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
                wordTranslation: word.translation
            };

            setSelectedWord({wordId: word.wordId, lemma: word.lemma, translation: word.translation});
            const response = await api.post(`/api/task-generation/morphology-parts`,
                payload, {withCredentials: true});

            const receivedData = response.data;

            setFormData(prev => ({
                ...prev,
                question: receivedData.question || prev.question,
                correctOrder: receivedData.correctOrder || prev.correctOrder,
                segments: receivedData.segments || prev.segments,
                decoySegments: receivedData.decoySegments || prev.decoySegments,
                referencedWordId: word.wordId
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
                    placeholder="Np. Wybierz poprawne części morfologiczne słowa"
                    rows={1}
                    disabled={formData.id > 0}
                />
            </div>

            <div className={styles.formSection}>
                <label className={styles.formLabel}>
                    Wybierz słowo, które umieścisz w zadaniu
                </label>

                {formData.id > 0 ? (
                    <div className={styles.formSection}>
                        Tego zadania nie można już edytować.
                        W razie potrzeby możesz je usunąć i stworzyć nowe.
                    </div>
                ) : (
                    <button className={styles.formButton}
                            onClick={handleWordListClick}>
                        Wybierz słowo
                    </button>
                )}
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

export default MorphologyPartsForm;
