import styles from "./FlashcardItem.module.css";

import type {FlashcardItem} from "../reviewTypes.ts";


interface FlashcardItemProps {

    flashcard: FlashcardItem | Word;
    onAddToFlashcards?: (wordId: number) => void;
    onRemoveFromFlashcards?: (wordId: number) => void;
    usage?: 'group' | 'wordBank';

}

interface Word {
    id: number;
    wordArabic: string;
    Transliteration: string;
    wordTranslation: string;
    isInUserFlashcards: boolean;
}


function FlashcardItemCard({flashcard, onAddToFlashcards, onRemoveFromFlashcards, usage}: FlashcardItemProps) {
    const wordData = isFlashcardItem(flashcard) ? flashcard.word : flashcard;
    const isWord = 'isInUserFlashcards' in flashcard;


    const showActions = isWord && onAddToFlashcards && onRemoveFromFlashcards;

    function isFlashcardItem(item: FlashcardItem | Word): item is FlashcardItem {
        return 'word' in item;
    }

    // console.log ('FlashcardItemCard render:', flashcard);

    return (
        <div className={styles.flashcardItem}>
            <div className={styles.flashcardContent}>
                {showActions && (
                    <div className={styles.wordActions}>
                        {(flashcard as Word).isInUserFlashcards ? (
                            <button
                                className={styles.removeFlashcardBtn}
                                onClick={() => onRemoveFromFlashcards!(wordData.id)}
                            >
                                {usage === 'wordBank' ? 'Usuń z moich fiszek' :
                                'Usuń z grupy'}

                            </button>
                        ) : (
                            <button
                                className={styles.addFlashcardBtn}
                                onClick={() => onAddToFlashcards!(wordData.id)}
                            >
                                {usage === 'wordBank' ? 'Dodaj do moich fiszek' :
                                    'Dodaj do grupy'}
                            </button>
                        )}
                    </div>
                )}
                <div className={styles.flashcardText}>
                    <h1 lang="ar">{wordData.wordArabic}</h1>
                    <p className={styles.transliteration}>{wordData.Transliteration}</p>
                    <h2>{wordData.wordTranslation}</h2>
                </div>
            </div>
        </div>
    );
}

export default FlashcardItemCard;