import styles from './Review.module.css';
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import type {FlashcardItem, FlashcardsGroup, Word} from "../reviewTypes.ts";

import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlus} from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal.tsx";
import FlashcardItemCard from "../components/FlashcardItem.tsx";
import EditGroupModal from "../components/modals/EditGroupModal.tsx";
import {useFlashcardActions} from "../useFlashcardActions.ts";
import type {WordReference} from "../../exercises/components/text/InteractiveText.tsx";

//TODO dodac wyswietlanie harakat

const isFlashcardDue = (dateString: string | number | Date) => {
    return new Date(dateString) <= new Date();
};

function ReviewPage() {


    const [selectedGroup, setSelectedGroup] = useState<FlashcardsGroup | null>(null);
    const [flashcardGroups, setFlashcardGroups] = useState<FlashcardsGroup[]>([]);
    // const [recentlyEncounteredWords, setRecentlyEncounteredWords] = useState<Word[]>([]);
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Training mode oznacza, ćwiczone są wszystkie fiszki, a nie tylko te do powtórki
    const [isTrainingMode, setIsTrainingMode] = useState<boolean>(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isShowAllModalOpen, setIsShowAllModalOpen] = useState(false);
    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);


    const [newGroupData, setNewGroupData] = useState<{ name: string; category: string }>({
        name: '',
        category: ''
    });

    const dueFlashcards: FlashcardItem[] = selectedGroup?.flashcardItems?.filter(f => isFlashcardDue(f.nextReviewDate)) || [];

    const [initialRecentWords, setInitialRecentWords] = useState<Word[]>([]);

    const {
        words: recentWords,
        setWords: setRecentWords,
        handleAddToFlashcards,
        handleRemoveFromFlashcards
    } = useFlashcardActions(initialRecentWords);

    useEffect(() => {
        const fetchData = async () => {
            try {

                setIsLoading(true);

                const [groupsResp, wordsResp] = await Promise.all([
                    api.get('/api/flashcard-groups/user', {withCredentials: true}),
                    api.get('/api/words/recent', {withCredentials: true})
                ]);


                const userGroups = Array.isArray(groupsResp.data) ? groupsResp.data : [];

                console.log(userGroups);

                const defaultGroup: FlashcardsGroup = userGroups.find(g => g.isDefault);

                const customDefaultGroup = defaultGroup ? {
                    ...defaultGroup,
                    name: 'Wszystkie fiszki',
                    category: 'Zbiorcza'
                } : null;


                const filteredGroups = userGroups.filter(g => !g.isDefault);
                const finalGroups = customDefaultGroup
                    ? [customDefaultGroup, ...filteredGroups]
                    : filteredGroups;

                setFlashcardGroups(finalGroups);
                setSelectedGroup(finalGroups[0] || null);
                setSelectedGroupIndex(-1);


                const mappedWords = wordsResp.data.map((word: WordReference) => ({
                    id: word.dictionaryWordId,
                    wordArabic: word.lemma,
                    Transliteration: word.transliteration,
                    wordTranslation: word.dictionaryTranslation,
                    isInUserFlashcards: word.hasFlashcard
                }));

                setInitialRecentWords(mappedWords);
                setRecentWords(mappedWords);

            } catch (err) {
                console.error('Failed to fetch data:', err);

            } finally {
                setIsLoading(false);
            }

        };

        fetchData();

    }, []);

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
        setIsEditModalOpen(true);

    }

    const handleGroupAddClick = () => {
        setIsAddGroupModalOpen(true);

    }

    const handleAddGroupSubmit = async () => {
        try {

            const response = await api.post(`/api/flashcard-groups`,
                {
                    name: newGroupData.name,
                    description: "",
                    category: newGroupData.category,
                    flashcardItem_Ids: []
                }, {withCredentials: true}
            );

            const newGroup = response.data;

            setFlashcardGroups(prev => [...prev, newGroup]);

            setSelectedGroup(newGroup);
            setSelectedGroupIndex(flashcardGroups.length);

            setNewGroupData({name: '', category: ''});
            setIsAddGroupModalOpen(false);

        } catch (error) {
            console.error("Błąd podczas dodawania grupy:", error);
            alert("Nie udało się dodać grupy.");

        }

    }

    const handleGroupUpdated = (updatedGroup: FlashcardsGroup) => {
        setFlashcardGroups(prev => prev.map(g =>
            g.id === updatedGroup.id ? updatedGroup : g
        ));
        setSelectedGroup(updatedGroup);
    };

    const handleGroupDeleted = (groupId: string) => {
        setFlashcardGroups(prev => prev.filter(g => g.id !== groupId));
        setSelectedGroup(null);
        setSelectedGroupIndex(null);
    };


    const handleShowAllClick = () => {
        setIsShowAllModalOpen(true);
    }

    return (
        <div className={styles.pageContainer}>

            <div className={styles.reviewGrid}>

                <div className={styles.columnLeft}>
                    <div className={styles.sidebarHeader}>
                        <h2> Twoje grupy fiszek </h2>
                        <div className={styles.separator}></div>

                        {flashcardGroups[0]?.isDefault && (
                            <div
                                className={`${styles.groupItem} ${selectedGroupIndex === -1 ? styles.selectedGroup : ''}`}
                                key={flashcardGroups[0].id}
                                onClick={() => {
                                    setSelectedGroup(flashcardGroups[0]);
                                    setSelectedGroupIndex(-1);
                                }}
                            >
                                <div className={styles.groupInfo}>
                                    <p className={styles.groupName}> {flashcardGroups[0].name} </p>
                                    <p className={styles.groupCategory}>{flashcardGroups[0].category}</p>
                                </div>
                                <div className={styles.groupStats}>
                                    <div className={styles.statBox}>
                                        <h2 className={styles.statNumber}>{flashcardGroups[0].flashcardItems.length}</h2>
                                        <p className={styles.statLabel}>Razem</p>
                                    </div>
                                    <div className={styles.statBox}>
                                        <h2 className={`${styles.statNumber} ${styles.greenText}`}>{flashcardGroups[0].flashcardItems.filter(f => isFlashcardDue(f.nextReviewDate)).length}</h2>
                                        <p className={styles.statLabel}>Do powtórki</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.separator}></div>

                        <div className={styles.iconcontainer} title="Dodaj grupę fiszek"
                        ><FontAwesomeIcon icon={faPlus} className={styles.addGroupIcon}
                                          onClick={() => handleGroupAddClick()}></FontAwesomeIcon>
                        </div>
                    </div>
                    <div className={styles.flashcardGroupsSlider}>
                        {!flashcardGroups || !Array.isArray(flashcardGroups) || flashcardGroups.length === 0 ? (

                            <div className={styles.emptyMessage}>Brak grup fiszek</div>
                        ) : (
                            flashcardGroups.slice(1).map((group, index) => { // pomijamy wyswietlanie grupy ogolnej jeszcze raz.
                                const newIndex = index + 1;
                                const dueCount = group.flashcardItems.filter(f => isFlashcardDue(f.nextReviewDate)).length;
                                return (
                                    <div
                                        className={`${styles.groupItem} ${selectedGroupIndex === newIndex ? styles.selectedGroup : ''}`}
                                        key={group.id}
                                        onClick={() => handleGroupClick(group, newIndex)}
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
                                            {selectedGroupIndex === newIndex ? (
                                                <FontAwesomeIcon
                                                    icon={faPencil}
                                                    className={styles.editGroupIcon}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleGroupOptionClick();
                                                    }}
                                                />
                                            ) : null}
                                        </div>

                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                <div className={styles.columnCenter}>

                    <div className={styles.topRow}>
                        {dueFlashcards.length === 0 && !isTrainingMode ? (
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
                                    Powtórz
                                </Link>)
                        }
                    </div>

                    <div className={styles.middleRow}>

                        <div className={styles.middleRowHeader}>
                            <h2> Elementy do powtórki </h2>
                            <p className={styles.countBadge}>
                                {dueFlashcards.length !== 0 ? dueFlashcards.length : ""}
                            </p>

                            <div>
                                <input type="checkbox" onChange={handleCheckboxInput}/>
                                <label className={styles.checkboxLabel}>Tryb treningowy (cała zawartość grupy)</label>
                            </div>
                            <button
                                className={styles.linkButton}
                                onClick={handleShowAllClick}
                            >Zobacz wszystkie fiszki w grupie
                            </button>
                        </div>


                        <div className={styles.flashcardsSlider}>

                            {dueFlashcards.length === 0 ? (
                                selectedGroupIndex != null && selectedGroupIndex >= 0 ? (

                                    <div className={styles.emptySliderState}>
                                        Ta grupa jest pusta. <br/>Dodaj do niej fiszki spośród swoich fiszek, aby móc je
                                        tutaj powtarzać.
                                    </div>


                                ) : (
                                    <div className={styles.emptySliderState}>
                                        Wszystko powtórzone! <br/> Wróć później.
                                    </div>
                                )
                            ) : (
                                dueFlashcards.map((flashcard, index) => (
                                    <FlashcardItemCard
                                        key={flashcard.id || index}
                                        flashcard={flashcard}
                                    />
                                ))
                            )}

                        </div>

                    </div>

                    <div className={styles.bottomRow}>
                        <div className={styles.rowText}>
                            <h2> Ostatnio napotkane słowa </h2>
                        </div>
                        <div className={styles.flashcardsSlider}>

                            {!recentWords || recentWords.length === 0 ?
                                (<div className={styles.emptySliderState}>Brak ostatnio napotkanych słów</div>)
                                :
                                (recentWords.map((word, index) => (

                                        <FlashcardItemCard
                                            key={index}
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

                <div className={styles.columnRight}>

                </div>

            </div>


            <Modal isOpen={isShowAllModalOpen}
                   onClose={() => setIsShowAllModalOpen(false)}

                   title={
                       selectedGroup?.id === '0'
                           ? 'Wszystkie fiszki'
                           : `Wszystkie fiszki w grupie: ${selectedGroup?.name}`
                   }
                   headerClassName={styles.modalTitleClass}>

                <div className={styles.allFlashcardsModalContent}>
                    {!selectedGroup || !selectedGroup.flashcardItems || selectedGroup.flashcardItems.length === 0 ? (
                        <div>Brak fiszek w tej grupie.</div>
                    ) : (
                        <div className={styles.modalCardsContainer}>
                            {selectedGroup.flashcardItems.map((flashcard: FlashcardItem, index) => (
                                <FlashcardItemCard
                                    key={flashcard.id || index}
                                    flashcard={flashcard}
                                />
                            ))}
                        </div>

                    )}

                </div>
            </Modal>


            <Modal
                isOpen={isAddGroupModalOpen}
                onClose={() => setIsAddGroupModalOpen(false)}
                title={"Dodaj nową grupę fiszek"}>
                <div className={styles.addGroupModalContent}>
                    <div>
                        <label> Nazwa grupy </label>
                        <input
                            type={"text"}
                            placeholder={"Nazwa grupy"}
                            value={newGroupData.name}
                            onChange={(e) => setNewGroupData({...newGroupData, name: e.target.value})}
                            className={styles.inputField}
                        />
                    </div>

                    <div>

                        <label> Kategoria </label>
                        <input
                            type={"text"}
                            placeholder={"Kategoria"}
                            value={newGroupData.category}
                            onChange={(e) => setNewGroupData({...newGroupData, category: e.target.value})}
                            className={styles.inputField}
                        />
                    </div>

                    <button onClick={() => handleAddGroupSubmit()} className={styles.createGroupButton}>
                        Stwórz grupę
                    </button>

                </div>
            </Modal>

            <EditGroupModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                selectedGroup={selectedGroup}
                defaultGroup={flashcardGroups[0]}
                onGroupUpdated={handleGroupUpdated}
                onGroupDeleted={handleGroupDeleted}
            />

        </div>
    )
}

export default ReviewPage