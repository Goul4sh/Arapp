import styles from './Review.module.css';
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import type {FlashcardItem, FlashcardsGroup, TemporaryWord} from "../reviewTypes.ts";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlus} from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal.tsx";


//TODO dodanie widoku dodawania grupy i edycji / dodawani fiszek
//TODO Dodanie mozliwosci powtarzania wszystkich fiszek w grupie, nie tylko tych do powtorzenia


const isFlashcardDue = (dateString: string | number | Date) => {
    return new Date(dateString) <= new Date();
};

function ReviewPage() {


    const [selectedGroup, setSelectedGroup] = useState<FlashcardsGroup | null>(null);
    const [flashcardGroups, setFlashcardGroups] = useState<FlashcardsGroup[]>([]);
    const [recentlyEncounteredWords, setRecentlyEncounteredWords] = useState<TemporaryWord[]>([]);
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Training mode oznacza, ćwiczone są wszystkie fiszki, a nie tylko te do powtórki
    const [isTrainingMode, setIsTrainingMode] = useState<boolean>(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isShowAllModalOpen, setIsShowAllModalOpen] = useState(false);
    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);



    const dueFlashcards: FlashcardItem[] = selectedGroup?.flashcardItems?.filter(f => isFlashcardDue(f.nextReviewDate)) || [];

    useEffect(() => {
        const fetchData = async () => {
            try {

                setIsLoading(true);

                const [groupsResp, wordsResp] = await Promise.all([
                    api.get('/api/flashcard-groups/user', {withCredentials: true}),
                    api.get('/api/words', {withCredentials: true})
                ]);

                setFlashcardGroups(Array.isArray(groupsResp.data) ? groupsResp.data : []);

                const firstGroup = groupsResp.data[0] || null;
                setSelectedGroup(firstGroup);
                setSelectedGroupIndex(0);

                setRecentlyEncounteredWords(wordsResp.data);

            } catch (err) {
                console.error('Failed to fetch data:', err);

            } finally {
                setIsLoading(false);
            }

        };


        fetchData();

    }, []);


    //TODO co sie dzieje kiedy fiszka nie jest w zadnej grupie? trzeba ja jakos wyswietlic.

    const handleGroupClick = (group: FlashcardsGroup, index: number) => {
        setSelectedGroup(group);
        setSelectedGroupIndex(index);
    }

    if (isLoading) {
        return <div className={styles.loadingPage}>Ładowanie...</div>;
    }

    const handleCheckboxInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsTrainingMode(event.target.checked);
    }

    const handleGroupOptionClick = () => {
// TODO niech wyskakuje male okienko obok przycisku z opcjami grupy
    setIsEditModalOpen(true);

    }

    const handleGroupAddClick = () => {
// TODO niech wyskakuje male okienko do dodania nowej grupy
    setIsAddGroupModalOpen(true);

    }

    const handleShowAllClick = () => {
// TODO niech wyskakuje okienko z wszystkimi fiszkami w grupie
        setIsShowAllModalOpen(true);
    }

    return (
        <div className={styles.pageContainer}>

            <div className={styles.reviewGrid}>

                <div className={styles.columnLeft}>
                    <div className={styles.sidebarHeader}>
                        <h2> Twoje grupy fiszek </h2>
                        <div className={styles.separator}></div>

                        <div className={styles.iconcontainer} title="Dodaj grupę fiszek"
                        >

                            <FontAwesomeIcon icon={faPlus}
                                             className={styles.addGroupIcon}
                                             onClick={() => handleGroupAddClick()}></FontAwesomeIcon>
                        </div>
                    </div>
                    <div className={styles.flashcardGroupsSlider}>
                        {!flashcardGroups || !Array.isArray(flashcardGroups) || flashcardGroups.length === 0 ? (

                            <div className={styles.emptyMessage}>Brak grup fiszek</div>
                        ) : (
                            flashcardGroups.map((group, index) => {
                                const dueCount = group.flashcardItems.filter(f => isFlashcardDue(f.nextReviewDate)).length;
                                return (
                                    <div
                                        className={`${styles.groupItem} ${selectedGroupIndex === index ? styles.selectedGroup : ''}`}
                                        key={index}
                                        onClick={() => handleGroupClick(group, index)}
                                    >
                                        <div className={styles.groupInfo}>
                                            <p className={styles.groupName}> {group.name} </p>
                                            <p className={styles.groupCategory}>{group.category}</p>
                                        </div>
                                        <div className={styles.groupStats}>
                                            <div className={styles.statBox}>
                                                <h2 className={styles.statNumber}>{group.flashcardItems.length}</h2>
                                                <p className={styles.statLabel}>Razem</p>
                                            </div>
                                            <div className={styles.statBox}>
                                                <h2 className={`${styles.statNumber} ${styles.greenText}`}>{dueCount}</h2>
                                                <p className={styles.statLabel}>Do powtórki</p>
                                            </div>
                                        </div>

                                        <div className={styles.optionsButtons}>

                                        {selectedGroupIndex === index ? (
                                                    <FontAwesomeIcon icon={faPencil}
                                                                     className={styles.editGroupIcon}
                                                                     onClick={() => handleGroupOptionClick()}></FontAwesomeIcon>

                                            ) :
                                            ("")
                                        }

                                        </div>

                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                <div className={styles.columnCenter}>

                    <div className={styles.topRow}>
                        {dueFlashcards.length === 0 ? (
                                <button
                                    className={`${styles.startPracticeButton}`}
                                    disabled
                                >
                                    Trenuj
                                </button>
                            ) :

                            isTrainingMode ? (

                                <Link
                                    to={`/review/${selectedGroup?.id}?training=true`}
                                    className={styles.startPracticeButton}
                                >
                                    Trenuj
                                </Link>

                            ) : (

                                <Link
                                    to={`/review/${selectedGroup?.id}`}
                                    className={styles.startPracticeButton}
                                >
                                    Trenuj
                                </Link>)
                        }
                    </div>

                    <div className={styles.middleRow}>

                        <div className={styles.middleRowHeader}>
                            <h2> Fiszunie do powtórki </h2>
                            <p className={styles.countBadge}>
                                {dueFlashcards.length !== 0 ? dueFlashcards.length : ""}
                            </p>
                            <input type="checkbox" onChange={handleCheckboxInput}/>
                            <button
                                className={styles.linkButton}
                                onClick={handleShowAllClick}
                            >Zobacz wszystkie fiszki w grupie</button>
                        </div>








                        <div className={styles.flashcardsSlider}>

                            {dueFlashcards.length === 0 ?
                                (<div className={styles.emptySliderState}>
                                        Wszystko powtórzone! <br/> Wróć później.
                                    </div>
                                ) : (dueFlashcards.map((flashcard, index) =>
                                        (
                                            <div className={styles.flashcardItem} key={index}
                                                // onClick={() => handleOptionClick(option)}
                                            >
                                                <div className={styles.flashcardContent}>
                                                    <h1 lang="ar">{flashcard.word.wordArabic}</h1>
                                                    <p className={styles.transliteration}>{flashcard.word.Transliteration}</p>
                                                    <h2>{flashcard.word.wordTranslation}</h2>
                                                </div>
                                            </div>
                                        ))
                                )}

                        </div>

                    </div>

                    <div className={styles.bottomRow}>
                        <div className={styles.rowText}>
                            <h2> Ostatnio napotkane słowa </h2>
                        </div>
                        <div className={styles.flashcardsSlider}>

                            {!recentlyEncounteredWords || recentlyEncounteredWords.length === 0 ?
                                (<div className={styles.emptySliderState}>Brak ostatnio napotkanych słów</div>)
                                :
                                (recentlyEncounteredWords.map((word, index) => (

                                        <div className={styles.flashcardItem} key={index}
                                            // onClick={() => handleOptionClick(option)}
                                        >
                                            <div className={styles.flashcardContent}>
                                                <h1 lang="ar">{word.wordArabic}</h1>
                                                <p className={styles.transliteration}>{word.Transliteration}</p>
                                                <h2>{word.wordTranslation}</h2>
                                            </div>
                                        </div>
                                    ))
                                )}

                        </div>

                    </div>

                </div>

                <div className={styles.columnRight}>

                </div>

            </div>


            <Modal isOpen={isShowAllModalOpen}
                   onClose={() => setIsShowAllModalOpen(false)}
                   title={"Wszystkie fiszki w grupie"}>
                <div className={styles.allFlashcardsModalContent}>

                    {!selectedGroup || !selectedGroup.flashcardItems || selectedGroup.flashcardItems.length === 0 ? (
                        <div>Brak fiszek w tej grupie.</div>
                    ) : (
                        selectedGroup.flashcardItems.map((flashcard, index) => (
                            <div className={styles.flashcardItem} key={index}>
                                <div className={styles.flashcardContent}>
                                    <h1 lang="ar">{flashcard.word.wordArabic}</h1>
                                    <p className={styles.transliteration}>{flashcard.word.Transliteration}</p>
                                    <h2>{flashcard.word.wordTranslation}</h2>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </Modal>


            <Modal
                isOpen={isAddGroupModalOpen}
                onClose={() => setIsAddGroupModalOpen(false)}
                title={"Dodaj nową grupę fiszek"}>
                <div>
                    {/*TODO formularz dodawania grupy fiszek*/}
                    Formularz dodawania grupy fiszek - w budowie
                </div>
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={"Edytuj grupę fiszek"}>
                <div>
                    {/*TODO formularz edycji grupy fiszek*/}
                    Formularz edycji grupy fiszek - w budowie
                </div>
            </Modal>



        </div>
    )
}

export default ReviewPage