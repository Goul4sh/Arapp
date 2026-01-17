export interface FlashcardItem {

    id: string;
    word: Word;
    nextReviewDate: string;
}

// interface Word {
//     wordId: number;
//     // wordArabic: string;
//     transliteration: string;
//     translation: string;
//     lemma: string;
//     root: string;
//     partOfSpeech: string;
// }


export interface Word {
    id: number;
    wordArabic: string;
    Transliteration: string;
    wordTranslation: string;
    isInUserFlashcards: boolean;
}

// export interface TemporaryWord {
//
//     wordArabic: string;
//     wordTranslation: string;
//     Transliteration: string;
//
// }

export interface FlashcardsGroup {

    id: string
    name: string;
    category: string;
    flashcardItems: FlashcardItem[];
    isDefault: boolean;

}