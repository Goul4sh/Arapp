export interface FlashcardItem {

    id: string;
    word: Word;
    nextReviewDate: string;
}

export interface Word {
    id: number;
    wordArabic: string;
    Transliteration: string;
    wordTranslation: string;
    isInUserFlashcards: boolean;
}

export interface FlashcardsGroup {

    id: string
    name: string;
    category: string;
    flashcardItems: FlashcardItem[];
    isDefault: boolean;

}