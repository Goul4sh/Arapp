import styles from './Tasks.module.css';
import type {WordReference} from "./text/InteractiveText.tsx";
import FlashcardItemCard from "../../review/components/FlashcardItem.tsx";
import api from "../../auth/api.ts";
import {useState} from "react";

const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${seconds % 60}s`;
};

interface Word {
    id: number;
    wordArabic: string;
    Transliteration: string;
    wordTranslation: string;
    isInUserFlashcards: boolean;
}

const SessionSummary = ({
                            correct,
                            incorrect,
                            duration,
                            onExit,
                            taskReferences
                        }: {
    correct: number,
    incorrect: number,
    duration: number,
    onExit: () => void,
    taskReferences?: WordReference[],
}) => {

    const total = correct + incorrect;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const [words, setWords] = useState(
        taskReferences?.map(ref => ({
            id: ref.dictionaryWordId,
            wordArabic: ref.lemma,
            Transliteration: ref.contextualTranslation,
            wordTranslation: ref.dictionaryTranslation,
            isInUserFlashcards: ref.hasFlashcard
        })) || []
    );

    const handleAddToFlashcards = async (wordId: number) => {

        setWords(
            words.map(w =>
                w.id === wordId ? {...w, isInUserFlashcards: true} : w)
        )

        try {
            await api.post(`/api/flashcards`, {word_id: wordId}, {withCredentials: true})
            // onFlashcardUpdate?.(wordId, true);
            console.log(`Dodano słowo o ID ${wordId} do fiszek użytkownika.`);
        } catch (error) {
            console.error("Błąd podczas dodawania słowa do fiszek:", error);
        }

    }

    const handleRemoveFromFlashcards = async (wordId: number) => {

        setWords(
            words.map(w =>
                w.id === wordId ? {...w, isInUserFlashcards: false} : w)
        )

        try {
            await api.delete(`/api/flashcards/${wordId}/word`, {withCredentials: true})
            // onFlashcardUpdate?.(wordId, false);
        } catch (error) {
            console.error("Błąd podczas usuwania słowa z fiszek:", error);
            setWords(prevWords =>
                prevWords.map(w =>
                    w.id === wordId ? {...w, isInUserFlashcards: true} : w)
            );
        }
        console.log(`Usunięto słowo o ID ${wordId} z fiszek użytkownika.`);
    }
    return (
        <div className={styles.summaryContainer}>

            <div className={styles.wordReferences}>

                <h2 className={styles.summaryTitle}>Słowa napotkane w tej lekcji</h2>
                <div className={styles.referencesList}>
                    {words.length > 0  ? (
                        words.map((word, index: number) => (
                            <FlashcardItemCard
                                key={word.id || index}
                                flashcard={word}
                                onAddToFlashcards={handleAddToFlashcards}
                                onRemoveFromFlashcards={handleRemoveFromFlashcards}
                                usage="wordBank"
                            />
                        ))) : (

                        <div className={styles.emptySliderState}>
                        <p>Brak słów do wyświetlenia.</p>
                        </div>
                    )}
                </div>

            </div>

            <div className={styles.summaryContent}>

                <h2 className={styles.summaryTitle}>Lekcja ukończona!</h2>

                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <p className={styles.cardContent}>Poprawne odpowiedzi</p>
                        <h2 className={styles.cardContent} style={{color: 'green'}}>{correct}</h2>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statLabel}>Błędne odpowiedzi</p>
                        <h2 className={styles.statValue} style={{color: 'red'}}>{incorrect}</h2>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statLabel}>Skuteczność</p>
                        <h2 className={styles.statValue}>{accuracy}%</h2>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statLabel}>Czas</p>
                        <h2 className={styles.statValue}>{formatTime(duration)}</h2>
                    </div>
                </div>

                <button className={styles.finishButton} onClick={onExit}>
                    Kontynuuj
                </button>
            </div>


        </div>
    );
};

export default SessionSummary;