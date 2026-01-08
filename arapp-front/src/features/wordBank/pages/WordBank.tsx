import {useEffect, useState} from "react";
import styles from "./wordBank.module.css"
import WordListModal from "../modals/WordListModal.tsx";
import api from "../../auth/api.ts";

interface WordGroup {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    wordCount: number;
    category: string;
    icon: string;
}


interface Word {
    id: string;
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

    useEffect(() => {
        fetchWordGroups();
        fetchRecentWords();
    }, []);


    const fetchWordGroups = async () => {
        try {
            setIsLoading(true);

            const response = await api.get('/api/flashcard-groups/user', {withCredentials: true});

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

            const response = await api.get(`/api/word-groups/${groupId}`, {withCredentials: true});

            const fetchedWords = response.data as WordGroupDetails;

            setSelectedGroupWords(fetchedWords.words);
        } catch (error) {
            console.error("Błąd podczas pobierania słówek z grupy:", error);
        } finally {
            setIsLoadingWords(false);
        }
    }

    const handleGroupClick = async (group: WordGroup) => {
        await fetchSelectedGroupWords(group.id);

        setSelectedGroup(group);
        setShowGroupModal(true);
    }

    const handleCloseModal = () => {
        setShowGroupModal(false);
        setSelectedGroup(null);
    }


    if (error)
        return <div className={styles.wordBankContainer}>
            <p className={styles.errorMessage}>Wystąpił błąd podczas ładowania danych. ${error}</p>
        </div>

    return (<div className={styles.wordBankContainer}>

            <div className={styles.contentColumn}>
                <div className={styles.sectionHeader}>
                    <h2>Grupy tematyczne słówek</h2>
                </div>

                <div className={styles.groupsGrid}>

                    {isLoading ? (
                        <p>Ładowanie grup słówek...</p>
                    ) : (

                        <div>
                            {
                                wordGroups.map(group => (
                                    <div
                                        key={group.id}
                                        className={styles.groupCard}
                                        onClick={() => handleGroupClick(group)}
                                    >
                                        <div className={styles.groupIcon}>
                                            {group.icon || '📚'}
                                        </div>
                                        <h3 className={styles.groupName}>{group.name}</h3>
                                        <p className={styles.groupCategory}>{group.category}</p>
                                        <div className={styles.wordCount}>
                                            <span>{group.wordCount} słów</span>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>

                    )

                    }

                </div>
            </div>

            <div className={styles.separator}></div>

            <div className={styles.sideColumn}>
                <div className={styles.sectionHeader}>
                    <h2>Ostatnio napotkane słówka</h2>
                </div>

                <div className={styles.recentWordsSlider}>
                    {recentWords.length === 0 ? (
                        <p className={styles.emptyMessage}>
                            Brak ostatnio napotkanych słówek
                        </p>
                    ) : (
                        recentWords.map(word => (
                            <div key={word.id} className={styles.wordCard}>
                                <h2 lang="ar" dir="rtl">{word.wordArabic}</h2>
                                <p className={styles.transliteration}>{word.transliteration}</p>
                                <p className={styles.translation}>{word.translation}</p>
                                {word.isInUserFlashcards && (
                                    <span className={styles.flashcardBadge}>W fiszkach</span>
                                )}
                            </div>
                        ))
                    )}
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


{/*Obecnie widok planowo ma zawierac listy slowkek do nauki, pogrupowanych tematycznie.*/
}
{/*Widok cos na podobe widoku z wpisami kompendium. Tutaj bedzie integracja z fiszkami uzytkownika. Bedzie widzial, czy slowko jest juz w jego fiszkach.*/
}

{/*Karta z jedną grupą słówek przykladowo moze skladac sie ze znaku graficznego - zdjecia, lub emotki takiej*/
}
{/*jak w reszcie aplikajci - liczby zawartej w niej slowek,*/
}

{/*Do tego, jesli sie uda, dodac slowka napotkane ostatnio w lekcjach (na bazie ukończonych lekcji użytkownika)*/
}