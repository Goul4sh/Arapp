import Modal from "../../review/Modal.tsx";
import styles from "../pages/wordBank.module.css"
interface Word {
    id: string;
    wordArabic: string;
    transliteration: string;
    translation: string;
    isInUserFlashcards: boolean;
}

interface WordGroup {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    wordCount: number;
}

interface WordGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedGroup: WordGroup | null;
    groupWords: Word[];
    isLoadingWords: boolean;
}


function WordListModal({isOpen, onClose, selectedGroup, groupWords, isLoadingWords}: WordGroupModalProps) {


    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={"Słowa w grupie: " + (selectedGroup ? selectedGroup.name : "")}>

            <div className={styles.wordListModalContainer}>

                {isLoadingWords ? (
                    <div className={styles.wordListLoading}>Ładowanie słów...</div>
                ) : (
                    <div className={styles.modalWordsContainer}>
                        {groupWords.map((word, i) => (

                            <div key={i} className={styles.wordCard}>

                                <h2 lang="ar" dir="rtl">{word.wordArabic}</h2>
                                <p className={styles.transliteration}>{word.transliteration}</p>
                                <p className={styles.translation}>{word.translation}</p>
                                {word.isInUserFlashcards && (
                                    <span className={styles.flashcardBadge}>W fiszkach</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default WordListModal