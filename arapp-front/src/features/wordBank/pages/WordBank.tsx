import {useEffect, useState} from "react";
import styles from "./wordBank.module.css"
import WordListModal from "../modals/WordListModal.tsx";
import api from "../../auth/api.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import type {IconProp} from "@fortawesome/fontawesome-svg-core";
// import cardStyles from "./wordBank.module.css";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import type {IconProp} from "@fortawesome/fontawesome-svg-core";

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
    transliteration: string;
    translation: string;
    isInUserFlashcards: boolean;

}

interface WordGroupDetails {
    id: number;
    words: Word[];

}

//TODO przetestować! front i endpointy backendu
function WordBank() {

    const [wordGroups, setWordGroups] = useState<WordGroup[]>([]);
    const [selectedGroupWords, setSelectedGroupWords] = useState<Word[]>([]);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [recentWords, setRecentWords] = useState<Word[]>([]);

    const [selectedGroup, setSelectedGroup] = useState<WordGroup | null>(null);
    const [showGroupModal, setShowGroupModal] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingWords, setIsLoadingWords] = useState(false);

    const [cachedGroupWords, setCachedGroupWords] = useState<Record<number, Word[]>>({});

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

            const response = await api.get('/api/words', {withCredentials: true})

            const fetchedWords = response.data as Word[];

            setRecentWords(fetchedWords);
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
                ({ ...prev, [groupId]: fetchedWords.words }));

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
                                                {/*<p className={styles.groupCategory}>{group.category}</p>*/}
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
                                    <div key={word.id} className={styles.wordCard}>

                                        <div className={styles.wordCardContainer}>

                                            <h2 className={styles.wordArabic} lang="ar" dir="rtl">{word.wordArabic}</h2>
                                            <p className={styles.transliteration}>{word.transliteration}</p>
                                            <p className={styles.translation}>{word.translation}</p>
                                            {word.isInUserFlashcards && (
                                                <span className={styles.flashcardBadge}>W fiszkach</span>
                                            )}

                                        </div>

                                    </div>
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
            />

        </div>


    )
}

export default WordBank;


{/*Do tego, jesli sie uda, dodac slowka napotkane ostatnio w lekcjach (na bazie ukończonych lekcji użytkownika)*/
}