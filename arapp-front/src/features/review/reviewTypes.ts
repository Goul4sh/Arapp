export interface FlashcardItem {

    id: string;
    word: TemporaryWord;
    nextReviewDate: string;
}


export interface TemporaryWord {

    wordArabic: string;
    wordTranslation: string;
    Transliteration: string;

}

export interface FlashcardsGroup {

    id: string
    name: string;
    description: string;
    category: string;
    flashcardItems: FlashcardItem[];

}