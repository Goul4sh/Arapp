import { useState } from 'react';
import api from "../auth/api.ts";

interface FlashcardWord {
    id: number;
    isInUserFlashcards?: boolean;
}

export const useFlashcardActions = <T extends FlashcardWord>(initialWords: T[]) => {
    const [words, setWords] = useState<T[]>(initialWords);

    const handleAddToFlashcards = async (wordId: number) => {
        setWords(prevWords =>
            prevWords.map(w =>
                w.id === wordId ? { ...w, isInUserFlashcards: true } : w
            ) as T[]
        );

        try {
            await api.post(`/api/flashcards`, { word_id: wordId }, { withCredentials: true });
            console.log(`Dodano słowo o ID ${wordId} do fiszek użytkownika.`);
        } catch (error) {
            console.error("Błąd podczas dodawania słowa do fiszek:", error);
            setWords(prevWords =>
                prevWords.map(w =>
                    w.id === wordId ? { ...w, isInUserFlashcards: false } : w
                ) as T[]
            );
        }
    };

    const handleRemoveFromFlashcards = async (wordId: number) => {
        setWords(prevWords =>
            prevWords.map(w =>
                w.id === wordId ? { ...w, isInUserFlashcards: false } : w
            ) as T[]
        );

        try {
            await api.delete(`/api/flashcards/${wordId}/word`, { withCredentials: true });
            console.log(`Usunięto słowo o ID ${wordId} z fiszek użytkownika.`);
        } catch (error) {
            console.error("Błąd podczas usuwania słowa z fiszek:", error);
            setWords(prevWords =>
                prevWords.map(w =>
                    w.id === wordId ? { ...w, isInUserFlashcards: true } : w
                ) as T[]
            );
        }
    };

    return {
        words,
        setWords,
        handleAddToFlashcards,
        handleRemoveFromFlashcards
    };
};
