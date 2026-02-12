import {useEffect, useState} from "react";
import styles from "./wordBank.module.css"
import WordListModal from "../modals/WordListModal.tsx";
import api from "../../auth/api.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import type {IconProp} from "@fortawesome/fontawesome-svg-core";
import FlashcardItemCard from "../../review/components/FlashcardItem.tsx";
import {useFlashcardActions} from "../../review/useFlashcardActions.ts";

interface WordGroup {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    wordsCount: number;
    category: string;
    icon: string;
}


interface Word {
    id: number;
    wordArabic: string;
    Transliteration: string;
    wordTranslation: string;
    isInUserFlashcards: boolean;
}


interface WordGroupDetails {
    id: number;
    words: Word[];

}

function WordBank() {

    const [wordGroups, setWordGroups] = useState<WordGroup[]>([]);
    const [selectedGroupWords, setSelectedGroupWords] = useState<Word[]>([]);
    const [error, setError] = useState(false);

    const [initialRecentWords, setInitialRecentWords] = useState<Word[]>([]);

    const [selectedGroup, setSelectedGroup] = useState<WordGroup | null>(null);
    const [showGroupModal, setShowGroupModal] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingWords, setIsLoadingWords] = useState(false);

    const [cachedGroupWords, setCachedGroupWords] = useState<Record<number, Word[]>>({});

    const {
        words: recentWords,
        setWords: setRecentWords,
        handleAddToFlashcards,
        handleRemoveFromFlashcards
    } = useFlashcardActions(initialRecentWords);


    useEffect(() => {
        fetchWordGroups();
        fetchRecentWords();
    }, []);


    const fetchWordGroups = async () => {
        try {
            setIsLoading(true);

            const response = await api.get('/api/word-groups/published', {withCredentials: true});

            const fetchedGroups = response.data as WordGroup[];

            setWordGroups(fetchedGroups);
            setIsLoading(false);
        } catch (error) {
            console.error("Błąd podczas pobierania grup słówek:", error);
            setError(true);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecentWords = async () => {
        try {

            const response = await api.get('/api/words/recent', {withCredentials: true})


            if (!response.data || !Array.isArray(response.data)) {
                setInitialRecentWords([]);
                setRecentWords([]);
                setIsLoading(false);
                return;
            }

            const mappedWords = response.data.map((word: any) => ({
                id: word.dictionaryWordId,
                wordArabic: word.lemma,
                Transliteration: word.transliteration,
                wordTranslation: word.dictionaryTranslation,
                isInUserFlashcards: word.hasFlashcard
            }));

            setInitialRecentWords(mappedWords);
            setRecentWords(mappedWords);
            setIsLoading(false);
        } catch (error) {
            console.error("Błąd podczas pobierania ostatnio napotkanych słówek:", error);
            setError(true);
            setIsLoading(false);
        }
    };

    const fetchSelectedGroupWords = async (groupId: number) => {
        try {
            setIsLoadingWords(true);

            const response = await api.get(`/api/word-groups/${groupId}/with-flashcard-info`, {withCredentials: true});
            const fetchedWords = response.data as WordGroupDetails;

            setSelectedGroupWords(fetchedWords.words);

            setCachedGroupWords(prev =>
                ({...prev, [groupId]: fetchedWords.words}));

        } catch (error) {
            console.error("Błąd podczas pobierania słówek z grupy:", error);
        } finally {
            setIsLoadingWords(false);
        }
    }

    const handleGroupClick = async (group: WordGroup) => {

        if (cachedGroupWords[group.id]) {
            setSelectedGroupWords(cachedGroupWords[group.id]);

        } else {
            await fetchSelectedGroupWords(group.id);
        }

        setSelectedGroup(group);
        setShowGroupModal(true);
    }

    const handleCloseModal = () => {
        setShowGroupModal(false);
        setSelectedGroup(null);
    }

    const handleFlashcardUpdate = (wordId: number, isInFlashcards: boolean) => {
        if (selectedGroup) {
            setCachedGroupWords(prev => ({
                ...prev,
                [selectedGroup.id]: prev[selectedGroup.id]?.map(w =>
                    w.id === wordId ? {...w, isInUserFlashcards: isInFlashcards} : w
                ) || []
            }));

            setSelectedGroupWords(prev =>
                prev.map(w =>
                    w.id === wordId ? {...w, isInUserFlashcards: isInFlashcards} : w
                )
            );
        }
    };


    if (error)
        return <div className={styles.wordBankContainer}>
            <p className={styles.errorMessage}>Wystąpił błąd podczas ładowania danych. {error}</p>
        </div>

    return (<div className={styles.wordBankContainer}>

            <div className={styles.wordBankContent}>


                <div className={styles.contentColumn}>
                    <div className={styles.sectionHeader}>
                        <h2>Grupy tematyczne słówek</h2>
                    </div>

                    <div className={styles.groupsGrid}>

                        {isLoading ? (
                            <p>Ładowanie grup słówek...</p>
                        ) : (

                            <>
                                {
                                    wordGroups.map(group => (
                                        <div
                                            key={group.id}
                                            className={styles.groupCard}>
                                            <div className={styles.wordCardBackground}>
                                                {group.imageUrl ?
                                                    <img
                                                        src={group.imageUrl}
                                                        alt={group.name}
                                                        className={styles.groupImage}
                                                    />
                                                    :
                                                    <div className={styles.groupImagePlaceholder}>No Image</div>
                                                }


                                                {group.icon ?

                                                    (
                                                        <div className={styles.groupIcon}>
                                                            <FontAwesomeIcon icon={['fas', group.icon] as IconProp}/>
                                                        </div>
                                                    ) : null
                                                }

                                            </div>

                                            <div className={styles.wordCardContent}>

                                                <h3 className={styles.groupName}>{group.name}</h3>
                                                <div className={styles.wordCount}>
                                                    <span>{group.wordsCount || 0} słów</span>
                                                </div>

                                                <button
                                                    onClick={() => handleGroupClick(group)}>
                                                    Zobacz słówka
                                                </button>

                                            </div>
                                        </div>
                                    ))
                                }

                            </>

                        )

                        }

                    </div>
                </div>

                <div className={styles.separator}></div>

                <div className={styles.sideColumn}>
                    <div className={styles.sectionHeader}>
                        <h2>Słówka z ostatnich lekcji</h2>
                    </div>
                    <div className={styles.recentWordsSlider}>
                        {!recentWords || recentWords.length === 0 ?
                            (<p className={styles.emptySliderState}>Brak ostatnio napotkanych słówek</p>)
                            :
                            (recentWords.map(word => (

                                    <FlashcardItemCard
                                        key={word.id}
                                        flashcard={word}
                                        onAddToFlashcards={handleAddToFlashcards}
                                        onRemoveFromFlashcards={handleRemoveFromFlashcards}
                                        usage="wordBank"
                                    />

                                ))
                            )}
                    </div>
                </div>

            </div>

            <WordListModal
                isOpen={showGroupModal}
                onClose={handleCloseModal}
                selectedGroup={selectedGroup}
                groupWords={selectedGroupWords}
                isLoadingWords={isLoadingWords}
                onFlashcardUpdate={handleFlashcardUpdate}
            />

        </div>


    )
}

export default WordBank;

