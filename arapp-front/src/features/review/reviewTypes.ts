export interface FlashcardItem {

    word: TemporaryWord;
    nextReviewDate: string;
}


export interface TemporaryWord {

    wordArabic: string;
    wordTranslation: string;
    Transliteration: string;

}

export interface FlashcardsGroup {

    name: string;
    description: string;
    category: string;
    flashcardItems: FlashcardItem[];

}