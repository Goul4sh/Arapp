//             {/*TODO*/}
//             {/*Mozliwosc dodania zdjecia lub grafiki do slowka poprzez umieszczenie linku do obrazka - to zdjecie bedzie*/}
//             {/*wyswietlac sie dodatkowo w fiszce lub podczas przchodzenia przez zadania ze slownicwa*/}
//


import styles from "./adminGlobalStyles.module.css";
import localStyles from "./wordBankManagement.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {
    faBook,
    faChevronDown,
    faChevronRight,
    faPlus,
    faTrash,
    faPen
} from "@fortawesome/free-solid-svg-icons";
import api from "../../auth/api.ts";
import Modal from "../../review/Modal.tsx";
import WordGroupEditModal from "./components/modals/WordGroupEditModal.tsx";
import WordGroupSearchWordModal from "./components/modals/WordGroupSearchWordModal.tsx";

 interface Word {
    id: number;
    wordArabic: string;
    Transliteration: string;
    wordTranslation: string;
}

 interface WordGroup {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    icon: string;
    wordsCount: number;
    isPublished: boolean;
    words?: Word[];
}

// interface WordGroupDetailResponse {
//     id: number;
//     words: Word[];
// }

function WordGroupManagement() {
    const [wordGroups, setWordGroups] = useState<WordGroup[]>([]);
    const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);

    const [deletingGroup, setDeletingGroup] = useState<number | null>(null);
    const [deletingWord, setDeletingWord] = useState<{ groupId: number; wordId: number } | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<WordGroup | null>(null);

    const [searchWordModalOpen, setSearchWordModalOpen] = useState(false);

    const [loadedGroupWords, setLoadedGroupWords] = useState<Set<number>>(new Set());


    useEffect(() => {
        fetchWordGroups();
    }, []);

    const fetchWordGroups = async () => {
        try {
            const response = await api.get<WordGroup[]>('/api/word-groups', {withCredentials: true});
            setWordGroups(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Błąd podczas ładowania grup słówek:", error);
        }
    };


    const refreshGroupData = async (groupId: number) => {
        try {
            const response = await api.get(`/api/word-groups/${groupId}`, {withCredentials: true});
            const groupDetails = response.data;

            setWordGroups(prevGroups => prevGroups.map(g => {
                if (g.id === groupId) {
                    return {
                        ...g,
                        words: groupDetails.words,
                        wordCount: groupDetails.words.length
                    };
                }
                return g;
            }));
            setLoadedGroupWords(prev => new Set(prev).add(groupId));

        } catch (error) {
            console.error(`Błąd odświeżania grupy ${groupId}:`, error);
        }
    };

    const toggleGroup = async (groupId: number) => {
        const isCurrentlyExpanded = expandedGroupId === groupId;
        const isExpanding = !isCurrentlyExpanded;

        setExpandedGroupId(isExpanding ? groupId : null);

        if (isExpanding && !loadedGroupWords.has(groupId)) {
            await refreshGroupData(groupId);
        }
    };

    const startEditingGroup = (group: WordGroup, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingGroup(group);
        setIsEditModalOpen(true);
    };

    const cancelEditingGroup = () => {
        setIsEditModalOpen(false);
        setEditingGroup(null);
    };

    const editGroup = async (groupData: {
        name: string;
        description: string;
        imageUrl: string;
        icon: string;
    }) => {
        if (!editingGroup) return;

        const isChanged =
            groupData.name !== editingGroup.name ||
            groupData.description !== editingGroup.description ||
            groupData.imageUrl !== editingGroup.imageUrl ||
            groupData.icon !== editingGroup.icon;

        if (!isChanged) {
            cancelEditingGroup();
            return;
        }


        const updatedGroups = wordGroups.map(g =>
            g.id === editingGroup.id
                ? {...g, ...groupData}
                : g
        );
        setWordGroups(updatedGroups);

        try {
            await api.patch(`/api/word-groups/${editingGroup.id}`, {
                ...groupData,
                wordIds: []
            }, {withCredentials: true});

            console.log("Poprawnie zaktualizowano grupę słówek.");
        } catch (error) {
            console.error("Błąd podczas aktualizacji grupy:", error);
        }
    };


    const handleAddGroup = async () => {
        try {
            const response = await api.post('/api/word-groups', {
                name: "Nowa grupa słówek",
                description: "",
                imageUrl: "",
                icon: ""
            }, {withCredentials: true});

            const newGroup = response.data;
            setWordGroups(prev => [...prev, newGroup]);
            setExpandedGroupId(newGroup.id);
        } catch (error) {
            console.error("Błąd podczas dodawania grupy:", error);
        }
    };

    const handleDeleteGroup = (groupId: number) => {
        setDeletingGroup(groupId);
    };

    const confirmDeleteGroup = async () => {
        if (deletingGroup === null) return;

        try {
            console.log("Usuwam grupe o id:", deletingGroup);

            await api.delete(`/api/word-groups/${deletingGroup}`, {withCredentials: true});
            setWordGroups(prev => prev.filter(g => g.id !== deletingGroup));
            setDeletingGroup(null);
        } catch (error) {
            console.error("Błąd podczas usuwania grupy:", error);
        }
    };

    const handleAddWordToGroup = async (groupId: number) => {
        setSearchWordModalOpen(true);
        setEditingGroup(wordGroups.find(g => g.id === groupId) || null);

    };

    const handleDeleteWord = (groupId: number, wordId: number) => {
        setDeletingWord({groupId, wordId});

    };

    const confirmDeleteWord = async () => {
        if (!deletingWord) return;

        const {groupId, wordId} = deletingWord;

        try {
            await api.patch(`/api/word-groups/${groupId}/remove-words`, [wordId], {withCredentials: true});

            setWordGroups(prevGroups => prevGroups.map(g => {
                if (g.id === groupId && g.words) {

                    const currentWords = g.words || [];
                    const updatedWords = currentWords.filter(w => w.id !== wordId);

                    return {
                        ...g,
                        words: updatedWords,
                        wordCount: updatedWords.length
                    };
                }
                return g;
            }));

            setDeletingWord(null);

        } catch (error) {
            console.error("Błąd podczas usuwania słowa z grupy:", error);
        }
    }


    const handleSelectWordForGroup = async (word: { wordId: number; lemma?: string; translation?: string }) => {
        if (!editingGroup) return;

        try {
            await api.patch(`/api/word-groups/${editingGroup.id}/add-words`,
                [word.wordId], {withCredentials: true});

            await refreshGroupData(editingGroup.id);
            setSearchWordModalOpen(false);
            setEditingGroup(null);

        } catch (error) {
            console.error("Błąd podczas dodawania słowa do grupy:", error);
        }
    }


    const handleToggleGroupVisibility = async (groupId: number, e: React.MouseEvent) => {

        e.stopPropagation();

        const prevGroups = wordGroups;
        const currentGroup = prevGroups.find(g => g.id === groupId);
        if (!currentGroup) return;

        const newStatus: boolean = !currentGroup.isPublished;

        const newState = prevGroups.map(g => g.id === groupId ? {...g, isPublished: newStatus} : g);

        setWordGroups(newState);

        try {
            await api.patch(`/api/word-groups/${groupId}/publish/${newStatus}`, {withCredentials: true});

        } catch (error) {
            console.error("Błąd podczas zmiany widoczności grupy słów:", error);
        }

    }


    return (
        <div className={styles.adminPageContainer}>
            <div className={styles.courseContentContainer}>

                <div className={styles.headerSection}>
                    <div>
                        <h1 className={styles.pageTitle}>Zarządzanie grupami słów</h1>
                    </div>
                    <div className={styles.headerButtons}>
                        <button
                            className={`${styles.createButton} ${styles.secondaryBtn}`}
                            onClick={handleAddGroup}
                        >
                            <FontAwesomeIcon icon={faBook}/> Nowa grupa słówek
                        </button>
                    </div>
                </div>

                <div className={styles.listContainer}>
                    {wordGroups.map((group) => {
                        return (
                            <div key={group.id} className={styles.chapterCard}>

                                <div
                                    className={`${styles.chapterHeader} ${expandedGroupId == group.id ? styles.active : ''}`}
                                    onClick={() => toggleGroup(group.id)}
                                >
                                    <div className={styles.chapterTitleSection}>
                                        <span className={styles.chevronIcon}>
                                            <FontAwesomeIcon
                                                icon={expandedGroupId == group.id ? faChevronDown : faChevronRight}
                                            />
                                        </span>

                                        <div className={styles.titleWrapper}>

                                            <div className={styles.chapterHeaderContent}>
                                                <div className={styles.lessonStatusIndicator}>
                                                    <button
                                                        className={styles.lessonStatusButton}
                                                        onClick={(e) => handleToggleGroupVisibility(group.id, e)}
                                                    >

                                                        {group.isPublished ? 'Ukryj' : 'Opublikuj'}
                                                    </button>
                                                    <div
                                                        className={`${styles.dot} ${group.isPublished ? styles.published : styles.draft}`}></div>
                                                </div>
                                                <div className={styles.chapterHeaderText}>
                                                    <h3 className={styles.chapterTitle}>{group.name}</h3>
                                                    <span>{group.description}</span>
                                                </div>
                                                <span className={styles.chapterMeta}>
                                                        Liczba słówek: {group.wordsCount || 0}
                                                    </span>
                                            </div>

                                        </div>
                                    </div>

                                    <div className={styles.chapterActions} onClick={e => e.stopPropagation()}>

                                        <button
                                            onClick={(e) => startEditingGroup(group, e)}
                                            className={styles.smallActionBtn}
                                            title="Edytuj szczegóły grupy"
                                        >
                                            <FontAwesomeIcon icon={faPen}/>
                                        </button>
                                        <button
                                            className={styles.smallActionBtn}
                                            onClick={() => handleDeleteGroup(group.id)}
                                            title="Usuń grupę"
                                        >
                                            <FontAwesomeIcon icon={faTrash}/>
                                        </button>

                                    </div>
                                </div>

                                {expandedGroupId == group.id && (
                                    <div className={styles.lessonsList}>
                                        {group.words?.length === 0 ? (
                                            <div className={styles.emptyChapter}>
                                                Brak słówek w tej grupie
                                            </div>
                                        ) : (
                                            group.words?.map((word, wIndex) => {
                                                return (
                                                    <div key={word.id} className={styles.lessonRow}>

                                                        <div className={localStyles.wordNumber}>
                                                            {wIndex + 1}.
                                                        </div>

                                                        <div className={styles.lessonInfo}>
                                                            <h4 className={styles.lessonTitle} lang="ar"
                                                                dir="rtl">
                                                                {word.wordArabic}
                                                            </h4>
                                                            <div className={styles.lessonMeta}>
                                                                <span>{word.wordTranslation}</span>
                                                                <span>{word.Transliteration}</span>
                                                            </div>
                                                        </div>

                                                        <div className={styles.lessonActions}>

                                                            <button
                                                                className={`${styles.smallActionBtn} ${styles.delete}`}
                                                                onClick={() => handleDeleteWord(group.id, word.id)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash}/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}

                                        <div className={localStyles.addLessonRow}>
                                            <button
                                                className={styles.addLessonBtnInner}
                                                onClick={() => handleAddWordToGroup(group.id)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}/> Dodaj słówko do grupy
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <Modal
                isOpen={deletingGroup !== null}
                onClose={() => setDeletingGroup(null)}
                title="Usuń grupę słówek"
            >
                <div className={styles.deleteConfirmationModal}>
                    <h2>Jesteś pewien, że chcesz usunąć grupę?</h2>
                    <p>Ta akcja jest nieodwracalna. Wszystkie słówka z tej grupy zostaną usunięte.</p>
                    <div className={styles.deleteConfirmationButtons}>
                        <button
                            className={styles.confirmDeleteButton}
                            onClick={confirmDeleteGroup}
                        >
                            Tak, usuń grupę
                        </button>
                        <button
                            className={styles.cancelDeleteButton}
                            onClick={() => setDeletingGroup(null)}
                        >
                            Anuluj
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={deletingWord !== null}
                onClose={() => setDeletingWord(null)}
                title="Usuń słowo"
            >
                <div className={styles.deleteConfirmationModal}>
                    <h2>Jesteś pewien, że chcesz usunąć słowo z tej grupy?</h2>
                    <p>To słowo dalej będzie dostępne w słowniku.</p>
                    <div className={styles.deleteConfirmationButtons}>
                        <button
                            className={styles.confirmDeleteButton}
                            onClick={confirmDeleteWord}
                        >
                            Tak, usuń słowo
                        </button>
                        <button
                            className={styles.cancelDeleteButton}
                            onClick={() => setDeletingWord(null)}
                        >
                            Anuluj
                        </button>
                    </div>
                </div>
            </Modal>

            <WordGroupEditModal isOpen={isEditModalOpen}
                                onClose={() => {
                                    setIsEditModalOpen(false);
                                    setEditingGroup(null)
                                }}
                                onSave={editGroup}
                                group={editingGroup}/>

            <WordGroupSearchWordModal
                isOpen={searchWordModalOpen}
                onClose={() => {
                    setSearchWordModalOpen(false);
                    setEditingGroup(null);
                }}
                onSelectWord={handleSelectWordForGroup}
                alreadyAddedWordIds={editingGroup?.words?.map(w => w.id) || []}
            />


        </div>
    );
}

export default WordGroupManagement;
