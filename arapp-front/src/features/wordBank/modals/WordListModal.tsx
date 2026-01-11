import Modal from "../../review/Modal.tsx";
import styles from "../pages/wordBank.module.css"
import {useState} from "react";
import api from "../../auth/api.ts";

interface Word {
    id: number;
    wordArabic: string;
    Transliteration: string;
    wordTranslation: string;
    isInUserFlashcards: boolean;
}

interface WordGroup {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    wordsCount: number;
}

interface WordGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedGroup: WordGroup | null;
    groupWords: Word[];
    isLoadingWords: boolean;
}


function WordListModal({isOpen, onClose, selectedGroup, groupWords, isLoadingWords}: WordGroupModalProps) {

    const [words, setWords] = useState<Word[]>(groupWords);

    console.log(groupWords);

    const handleAddToFlashcards = async (wordId: number) => {

        setWords(
            words.map(w =>
                w.id === wordId ? {...w, isInUserFlashcards: true} : w)
        )

        console.log("na takie id wysylam", wordId);

        try {
            await api.post(`/api/flashcards`, {word_id: wordId}, {withCredentials: true})

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
        } catch (error) {
            console.error("Błąd podczas usuwania słowa z fiszek:", error);
        }

        console.log(`Usunięto słowo o ID ${wordId} z fiszek użytkownika.`);
    }


    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={"Słowa w grupie: " + (selectedGroup ? selectedGroup.name : "")}>

            <div className={styles.wordListModalContainer}>

                {isLoadingWords ? (
                    <div className={styles.wordListLoading}>Ładowanie słów...</div>
                ) : (<>
                        <div className={styles.modalWordsHeader}>
                            <h3>Liczba słów: {groupWords.length}</h3>
                        </div>

                        <div className={styles.modalWordsContainer}>
                            {groupWords.map((word, i) => (

                                <div key={i} className={styles.wordCard}>
                                    <div className={styles.wordActions}>
                                        {word.isInUserFlashcards ? (
                                            <button className={styles.removeFlashcardBtn}
                                                    onClick={() => handleRemoveFromFlashcards(word.id)}
                                            >
                                                Usuń z fiszek
                                            </button>
                                        ) : (
                                            <button className={styles.addFlashcardBtn}
                                                    onClick={() => handleAddToFlashcards(word.id)}
                                            >
                                                Dodaj do fiszek
                                            </button>
                                        )}

                                    </div>

                                    <h2 lang="ar" dir="rtl">{word.wordArabic}</h2>
                                    <p className={styles.transliteration}>{word.Transliteration}</p>
                                    <p className={styles.translation}>{word.wordTranslation}</p>

                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}

export default WordListModal