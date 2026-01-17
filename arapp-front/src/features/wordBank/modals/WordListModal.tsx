import Modal from "../../review/Modal.tsx";
import styles from "../pages/wordBank.module.css"
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import FlashcardItem from "../../review/components/FlashcardItem.tsx";
import {useNavigate} from "react-router-dom";

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
    onFlashcardUpdate?: (wordId: number, isInFlashcards: boolean) => void;

}


function WordListModal({isOpen, onClose, selectedGroup, groupWords, isLoadingWords, onFlashcardUpdate}: WordGroupModalProps) {

    const [words, setWords] = useState<Word[]>(groupWords);
    const navigate = useNavigate();


    console.log(groupWords);

    useEffect(() => {
        setWords(groupWords);
    }, [groupWords]);


    const handleAddToFlashcards = async (wordId: number) => {

        setWords(
            words.map(w =>
                w.id === wordId ? {...w, isInUserFlashcards: true} : w)
        )

        try {
            await api.post(`/api/flashcards`, {word_id: wordId}, {withCredentials: true})
            onFlashcardUpdate?.(wordId, true);
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
            onFlashcardUpdate?.(wordId, false);
        } catch (error) {
            console.error("Błąd podczas usuwania słowa z fiszek:", error);
            setWords(prevWords =>
                prevWords.map(w =>
                    w.id === wordId ? {...w, isInUserFlashcards: true} : w)
            );
        }
        console.log(`Usunięto słowo o ID ${wordId} z fiszek użytkownika.`);
    }

    const handleStartPractice = () => {

        const groupId = selectedGroup ? selectedGroup.id : null;
        if (!groupId) return;

            navigate(`/words-practice/${groupId}`, {state: {source: 'word-group'}});
    }

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={"Słowa w grupie: " + (selectedGroup ? selectedGroup.name : "")}>

            <div className={styles.wordListModalContainer}>

                <div className={styles.practiceContainer}>

                    <button
                        className={styles.startPracticeButton}
                    onClick={handleStartPractice}>
                        Ćwicz teraz
                    </button>
                    <p> Ćwicz słówka zawarte w grupie dzięki automatycznie generowanym zadaniom. </p>
                </div>

                {isLoadingWords ? (
                    <div className={styles.wordListLoading}>Ładowanie słów...</div>
                ) : (<>
                        <div className={styles.modalWordsHeader}>
                            <h3>Liczba słów: {groupWords.length}</h3>
                        </div>

                        <div className={styles.modalWordsContainer}>
                            {groupWords.map((word, i) => (
                                <FlashcardItem
                                    key={word.id || i}
                                    flashcard={word}
                                    onAddToFlashcards={handleAddToFlashcards}
                                    onRemoveFromFlashcards={handleRemoveFromFlashcards}
                                    usage="wordBank"
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}

export default WordListModal