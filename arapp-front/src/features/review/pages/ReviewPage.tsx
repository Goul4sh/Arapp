import styles from './Review.module.css';
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import type {FlashcardItem, FlashcardsGroup, TemporaryWord} from "../reviewTypes.ts";
import {Link} from "react-router-dom";


//TODO dodanie widoku dodawania grupy i edycji / dodawani fiszek
//TODO wyczyszczenie bazy i dodanie nowych fiszek zeby nie robic sprawdzania typow co chwile

function ReviewPage() {


    const [selectedGroup, setSelectedGroup] = useState<FlashcardsGroup | null>(null);
    const [selectedFlashcards, setSelectedFlashcards] = useState<FlashcardItem[] | null>(null);
    const [flashcardGroups, setFlashcardGroups] = useState<FlashcardsGroup[]>([]);
    const [flashcardsToReview, setFlashcardsToReview] = useState<FlashcardItem[] | null>(null);
    const [recentlyEncounteredWords, setRecentlyEncounteredWords] = useState<TemporaryWord[]>([]);
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);


    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {


        const fetchData = async () => {
            try {

                setIsLoading(true);
                // setError(null);

                const [groupsResp, wordsResp] = await Promise.all([
                    api.get('/api/flashcard-groups/user', {withCredentials: true}),
                    api.get('/api/words', {withCredentials: true})
                ]);

                const [firstGroup] = groupsResp.data;
                const flashcardsToReview = firstGroup?.flashcardItems.filter(
                    (f: { nextReviewDate: string | number | Date; }) => new Date(f.nextReviewDate) <= new Date()
                ).length || 0;

                setFlashcardGroups(groupsResp.data);
                setSelectedGroup(firstGroup);
                setSelectedGroupIndex(0);
                setSelectedFlashcards(firstGroup?.flashcardItems || []);
                setFlashcardsToReview(flashcardsToReview);


                setRecentlyEncounteredWords(wordsResp.data);

                console.log(groupsResp.data);
                console.log(wordsResp.data);

            } catch (err) {

                // setError('Błąd w pobieraniu danych');
                console.error('Failed to fetch data:', err);

            } finally {
                setIsLoading(false);
            }

        };


        fetchData();

    }, []);

    //TODO co sie dzieje kiedy fiszka nie jest w zadnej grupie? trzeba ja jakos wyswietlic.
    //kiedy tablica grup jest pust ato aplikacja nie dziala

    const handleGroupClick = (group: FlashcardsGroup, index: number) => {

        setSelectedGroup(group);
        setSelectedGroupIndex(index);

        setSelectedFlashcards(group.flashcardItems);
    }


    if (isLoading) {
        return <div className={styles.message}>Ładowanie...</div>;
    }

    // if (error) {
    //     return <div className={styles.error}>{error}</div>;
    //
    // }


    return (
        <div>

            <div className={styles.reviewPage}>

                <div className={styles.columnLeft}>

                    <div className={styles.topText}>
                        <p> Twoje grupy fiszek </p>
                    </div>

                    <div className={styles.separator}></div>

                    <div className={styles.flashcardGroupsContainer}>

                        <div className={styles.flashcardGroupsSlider}>

                            {!flashcardGroups || flashcardGroups.length === 0 ? (
                                <div className={styles.emptyMessage}
                                >Brak grup fiszek</div>
                            ) : (

                                flashcardGroups.map((group, index) => (
                                    <div

                                        className={`${styles.groupItem} ${selectedGroupIndex === index ? styles.selectedGroup : ''}`}
                                        key={index}
                                        onClick={() => handleGroupClick(group, index)}
                                    >

                                        <div className={styles.textContainer}>
                                            <p> {group.name} </p>
                                            <p>{group.category}</p>
                                        </div>

                                        <div className={styles.statsContainer}>
                                            <div className={styles.numberContainer}>
                                                <h2>{group.flashcardItems.length}</h2>
                                                <p>łącznie</p>
                                            </div>
                                            <div className={styles.numberContainer}>
                                                <h2>{group.flashcardItems.filter(f => new Date(f.nextReviewDate) <= new Date()).length}</h2>
                                                <p>do powtórki</p>
                                            </div>
                                        </div>

                                        <div className={styles.optionsButtons}>
                                        </div>

                                    </div>
                                ))


                            )}


                        </div>


                    </div>

                </div>


                <div className={styles.columnCenter}>

                    <div className={styles.topRow}>


                        <Link to={`/review/${selectedGroup?.id}`}
                        className ={styles.startPracticeButton}
                        >Trenuj
                        </Link>

                    </div>

                    <div className={styles.middleRow}>

                        <div className={styles.rowText}>
                            <h2> Fiszunie do powtórki ( {selectedGroup?.flashcardItems.filter(f => new Date(f.nextReviewDate) <= new Date()).length} ) </h2>
                            <p> Zobacz wszystkie fiszki</p>
                        </div>

                        <div className={styles.flashcardsSlider}>

                            {selectedGroup?.flashcardItems.filter(f => new Date(f.nextReviewDate) <= new Date())
                                .map((flashcard, index)  => (
                                <div
                                    className={styles.flashcardItem}
                                    key={index}
                                    // onClick={() => handleOptionClick(option)}
                                >
                                    <h1>{flashcard.word.wordArabic}</h1>
                                    <p>{flashcard.word.Transliteration}</p>
                                    <h2>{flashcard.word.wordTranslation}</h2>
                                </div>
                            ))
                            }

                        </div>

                    </div>

                    <div className={styles.bottomRow}>

                        <div className={styles.rowText}>
                            <h2> Ostatnio napotkane słowa </h2>
                        </div>

                        <div className={styles.flashcardsSlider}>

                            {!recentlyEncounteredWords || recentlyEncounteredWords.length === 0 ?

                                (<div className={styles.emptyWordSliderMessage}>Brak ostatnio napotkanych słów</div>)
                                :
                                (recentlyEncounteredWords.map((word, index) => (
                                        <div
                                            className={styles.flashcardItem}
                                            key={index}
                                            // onClick={() => handleOptionClick(option)}
                                        >

                                            <h1>{word.wordArabic}</h1>
                                            <p>{word.Transliteration}</p>
                                            <h2>{word.wordTranslation}</h2>
                                        </div>
                                    ))
                                )}


                        </div>

                    </div>


                </div>

                <div className={styles.columnRight}>

                </div>


            </div>


        </div>
    )
}

export default ReviewPage