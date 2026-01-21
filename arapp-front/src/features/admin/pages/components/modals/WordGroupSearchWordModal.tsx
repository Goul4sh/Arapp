import Modal from "../../../../review/Modal.tsx";
import {useEffect, useState} from "react";

import styles from "../../adminGlobalStyles.module.css"
import localStyles from "../../wordBankManagement.module.css"
import api from "../../../../auth/api.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

interface Word {
    wordId: number;
    transliteration: string;
    translation: string;
    lemma: string;
    root: string;
    partOfSpeech: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectWord: (word: Word) => void;
    alreadyAddedWordIds?: number[];
}


function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}


function WordGroupSearchWordModal({isOpen, onClose, onSelectWord, alreadyAddedWordIds}: ModalProps) {
    const [words, setWords] = useState<Word[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    const [AddedWordIds, setAddedWordIds] = useState<number[]>(alreadyAddedWordIds || []);
    const debouncedSearch = useDebounce(searchQuery, 600);


    useEffect(() => {
        if (isOpen) {
            setAddedWordIds(alreadyAddedWordIds || []);
            setSearchQuery("");
            setCurrentPage(0);
        } else {
            setAddedWordIds([])
        }
    }, [alreadyAddedWordIds, isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetchWords();
        }
    }, [currentPage, debouncedSearch, isOpen]);

    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearch]);


    const fetchWords = async () => {
        try {
            const response = await api.get('/api/admin/dictionary', {
                params: {
                    page: currentPage,
                    size: pageSize,
                    query: debouncedSearch
                },
                withCredentials: true
            });

            const fetched: Word[] = response.data.content || [];
            const currentBlockedIds = alreadyAddedWordIds || [];

            console.log("Aktualnie posaidane slowa w grupie to:", currentBlockedIds);
            console.log("Wszystkie pobrane slowa to", fetched);

            const filteredWords = fetched.filter((word: Word) => !currentBlockedIds.includes(word.wordId) && !AddedWordIds.includes(word.wordId));
            setWords(filteredWords);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching words:", error);
        }
    };

    const handleSelectWord = (word: Word) => {

        setAddedWordIds(prev => [...prev, word.wordId]);
        setWords(prev => prev.filter(w => w.wordId !== word.wordId));
        onSelectWord(word);
        onClose();
        setSearchQuery("");
        setCurrentPage(0);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Wyszukaj słowo w słowniku">

            <div className={localStyles.searchSection}>
                <div className={localStyles.searchBar}>
                    <input
                        type="text"
                        placeholder="Szukaj słowa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={localStyles.searchInput}
                    />
                </div>
            </div>

            <div className={localStyles.wordsTable}>
                <table>
                    <thead>
                    <tr>
                        <th>Lemat</th>
                        <th>Tłumaczenie</th>
                        <th>Transliteracja</th>
                        <th>Akcja</th>
                    </tr>
                    </thead>
                    <tbody>
                    {words.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{textAlign: 'center', padding: '20px'}}>
                                Brak słów do wyświetlenia
                            </td>
                        </tr>
                    ) : (
                        words.map((word) => (
                            <tr key={word.wordId}>
                                <td>
                                    <span lang="ar" dir="rtl">{word.lemma}</span>
                                </td>
                                <td>{word.translation || "Nie podano"}</td>
                                <td>{word.transliteration || "Nie podano"}</td>
                                <td>
                                    <button
                                        className={styles.actionBtnSave}
                                        onClick={() => handleSelectWord(word)}
                                        title="Wybierz słowo"
                                    >
                                        <FontAwesomeIcon icon={faCheck}/> Wybierz
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={localStyles.pagination}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                    >
                        Poprzednia
                    </button>
                    <span>Strona {currentPage + 1} z {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                    >
                        Następna
                    </button>
                </div>
            )}
        </Modal>
    );
}

export default WordGroupSearchWordModal;