import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import styles from "./adminGlobalStyles.module.css"
import localStyles from "./wordBankManagement.module.css";

import Modal from "../../review/Modal.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPen, faPlus, faTimes, faTrash} from "@fortawesome/free-solid-svg-icons";
import AddWordModal from "./components/modals/AddWordModal.tsx";

interface Word {
    wordId: number;
    transliteration: string;
    translation: string;
    lemma: string;
    root: string;
    partOfSpeech: string;
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

function WordBankManagementPage() {

    const [words, setWords] = useState<Word[]>([]);

    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 20;
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const [deletingWordId, setDeletingWordId] = useState<number | null>(null);

    const [editingWordId, setEditingWordId] = useState<number | null>(null);
    const [editingWordData, setEditingWordData] = useState<Omit<Word, 'wordId'>>({
        transliteration: '',
        translation: '',
        lemma: '',
        root: '',
        partOfSpeech: ''
    });

    const debouncedSearch = useDebounce(searchQuery, 600);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);


    useEffect(() => {
        fetchWords()
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearch]);


    const fetchWords = async () => {
        try {
            const response = await api.get('/api/admin/dictionary', {
                params: {
                    page: currentPage,
                    size: 20,
                    query: debouncedSearch
                },
                withCredentials: true
            });

            console.log("Takie slowa pobrano:", response.data);

            setWords(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching words:", error);
        } finally {
        }
    }

    const startEditingWord = (word: Word) => {
        setEditingWordId(word.wordId);
        setEditingWordData({
            transliteration: word.transliteration || '',
            translation: word.translation || '',
            lemma: word.lemma || '',
            root: word.root || '',
            partOfSpeech: word.partOfSpeech || ''
        });
    }

    const cancelEditingWord = () => {
        setEditingWordId(null);
        setEditingWordData({
            transliteration: '',
            translation: '',
            lemma: '',
            root: '',
            partOfSpeech: ''
        });
    }

    const handleAddWord = () => {
        setIsAddModalOpen(true);
    }

    const handleConfirmAddWord = async (newWord: Omit<Word, 'id'>) => {


        try {

            await api.post('/api/admin/dictionary/add-word', newWord, {withCredentials: true});

            setCurrentPage(0);
            setSearchQuery('');
            setIsAddModalOpen(false);

            fetchWords();

        } catch (error) {
            console.error("Error adding new word:", error);
        }
    }

    const handleEditWord = async (wordId: number) => {

        console.log("Edytowane dane:", editingWordData);

        const originalWord = words.find(word => word.wordId === wordId);
        if (!originalWord) return;

        const isDataChanged =
            originalWord.transliteration !== editingWordData.transliteration ||
            originalWord.translation !== editingWordData.translation ||
            originalWord.lemma !== editingWordData.lemma ||
            originalWord.root !== editingWordData.root ||
            originalWord.partOfSpeech !== editingWordData.partOfSpeech;

        if (!isDataChanged) {
            cancelEditingWord();
            return;
        }


        const isEditedWordDataValid =
            editingWordData.lemma.trim() !== '' &&
            editingWordData.translation.trim() !== '';

        if (!isEditedWordDataValid) {
            alert("Słowo arabskie i tłumaczenie nie mogą być puste.");
            return;
        }

        try {


            console.log("Wysyłam dane edytowanego słowa:", editingWordData);

            setWords(prevWords => prevWords.map(word =>
                word.wordId === wordId ? {...word, ...editingWordData} : word));

            cancelEditingWord();

            await api.patch(`/api/admin/dictionary/${wordId}`,
                editingWordData, {withCredentials: true});

        } catch (error) {
            console.error("Error editing word:", error);
        }
    }

    const handleDeleteWord = (wordId: number) => {
        setDeletingWordId(wordId);
    }

    const confirmDeleteWord = async () => {
        if (!deletingWordId) return;

        setWords(prevWords => prevWords.filter(word =>
            word.wordId !== deletingWordId));


        try {
            await api.delete(`/api/admin/dictionary/${deletingWordId}`, {withCredentials: true});
            setWords(prevWords => prevWords.filter(word => word.wordId !== deletingWordId));
            setDeletingWordId(null);
        } catch (error) {
            console.error("Error deleting word:", error);
        }
    }

    return (
        <div className={styles.adminPageContainer}>
            <div className={styles.courseContentContainer}>

                <div className={styles.headerSection}>
                    <div>
                        <h1 className={styles.pageTitle}>Baza słownictwa</h1>
                    </div>
                    <div className={styles.headerButtons}>
                        <button
                            className={`${styles.createButton} ${styles.secondaryBtn}`}
                            onClick={handleAddWord}
                        >
                            <FontAwesomeIcon icon={faPlus}/> Dodaj słowo
                        </button>
                    </div>
                </div>

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
                            <th>Lp.</th>
                            <th>Tłumaczenie</th>
                            <th>Transliteracja</th>
                            <th>Lemat</th>
                            <th>Rdzeń</th>
                            <th>Część mowy</th>
                            <th>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {words.map((word, index) => {
                            const isEditing = editingWordId === word.wordId;

                            return (
                                <tr key={word.wordId}>
                                    <td>{currentPage * pageSize + index + 1}</td>

                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editingWordData.translation}
                                                onChange={e => setEditingWordData({
                                                    ...editingWordData,
                                                    translation: e.target.value
                                                })}
                                            />
                                        ) : (
                                            word.translation || "Nie podano"
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editingWordData.transliteration}
                                                onChange={e => setEditingWordData({
                                                    ...editingWordData,
                                                    transliteration: e.target.value
                                                })}
                                            />
                                        ) : (
                                            word.transliteration || "Nie podano"
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editingWordData.lemma}
                                                onChange={e => setEditingWordData({
                                                    ...editingWordData,
                                                    lemma: e.target.value
                                                })}
                                                lang="ar"
                                                dir="rtl"
                                            />
                                        ) : (
                                            <span lang="ar" dir="rtl">{word.lemma}</span>
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editingWordData.root}
                                                onChange={e => setEditingWordData({
                                                    ...editingWordData,
                                                    root: e.target.value
                                                })}
                                                lang="ar"
                                                dir="rtl"

                                            />
                                        ) : (

                                            <span lang="ar" dir="rtl">{word.root}</span>
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editingWordData.partOfSpeech}
                                                onChange={e => setEditingWordData({
                                                    ...editingWordData,
                                                    partOfSpeech: e.target.value
                                                })}
                                            />
                                        ) : (
                                            word.partOfSpeech || "Nie podano"
                                        )}
                                    </td>
                                    <td>
                                        <div className={localStyles.actionButtons}>
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        className={styles.actionBtnSave}
                                                        onClick={() => handleEditWord(word.wordId)}
                                                        title="Zapisz"
                                                    >
                                                        <FontAwesomeIcon icon={faCheck}/>
                                                    </button>
                                                    <button
                                                        className={styles.actionBtnCancel}
                                                        onClick={cancelEditingWord}
                                                        title="Anuluj"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes}/>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className={styles.smallActionBtn}
                                                        onClick={() => startEditingWord(word)}
                                                        title="Edytuj"
                                                    >
                                                        <FontAwesomeIcon icon={faPen}/>
                                                    </button>
                                                    <button
                                                        className={`${styles.smallActionBtn} ${styles.delete}`}
                                                        onClick={() => handleDeleteWord(word.wordId)}
                                                        title="Usuń"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash}/>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                <div className={localStyles.pagination}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                    >
                        Poprzednia
                    </button>
                    <span>Strona {currentPage + 1} z {totalPages || 1}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                    >
                        Następna
                    </button>
                </div>
            </div>

            <Modal
                isOpen={deletingWordId !== null}
                onClose={() => setDeletingWordId(null)}
                title="Usuń słowo"
            >
                <div className={styles.deleteConfirmationModal}>
                    <h2>Jesteś pewien, że chcesz usunąć to słowo ze słownika?</h2>
                    <p>Referencje do tego słowa w zadaniach oraz powiązane fiszki przestaną istnieć.</p>
                    <div className={styles.deleteConfirmationButtons}>
                        <button
                            className={styles.confirmDeleteButton}
                            onClick={confirmDeleteWord}
                        >
                            Tak, usuń słowo
                        </button>
                        <button
                            className={styles.cancelDeleteButton}
                            onClick={() => setDeletingWordId(null)}
                        >
                            Anuluj
                        </button>
                    </div>
                </div>
            </Modal>

            <AddWordModal isOpen={isAddModalOpen}
                          onClose={() => setIsAddModalOpen(false)}
                          onSave={handleConfirmAddWord}/>

        </div>

    )

}

export default WordBankManagementPage;