import type {WordReference} from "./InteractiveText.tsx";
import styles from "./interactiveText.module.css"
import {useState} from "react";
import api from "../../../auth/api.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPlus} from "@fortawesome/free-solid-svg-icons";

function InteractiveWord({reference, content}: { reference: WordReference, content: string }) {

    const [isInFlashcards, setIsInFlashcards] = useState<boolean>(reference.hasFlashcard || false);

    const handleAddToFlashcards = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isInFlashcards) return;

        const wordId = reference.dictionaryWordId;
        setIsInFlashcards(true);

        try {
            await api.post(`/api/flashcards`, {word_id: wordId}, {withCredentials: true})
            console.log(`Dodano słowo o ID ${wordId} do fiszek użytkownika.`);
        } catch (error) {
            console.error("Błąd podczas dodawania słowa do fiszek:", error);
            setIsInFlashcards(false);
        }

    }

    return (
        <span className={styles.wordWrapper}>
            <span className={styles.highlightableWord}>
                {content}
            </span>

            <div className={styles.tooltip}>
                <div className={styles.tooltipHeader}>
                    <span className={styles.translation}>{reference.dictionaryTranslation}</span>
                </div>

                <div className={styles.tooltipLemma}>
                    Lemat:
                    <div className={styles.arabicLemma}>
                    {reference.lemma}
                </div>
                    </div>

                <button
                    onClick={handleAddToFlashcards}
                    className={`${styles.addBtn} ${isInFlashcards ? styles.added : ''}`}>
                    <FontAwesomeIcon icon={isInFlashcards ? faCheck : faPlus}/>
                    {isInFlashcards ? 'W fiszkach' : 'Dodaj do fiszek'}

                </button>
            </div>
        </span>

    );
}

export default InteractiveWord;