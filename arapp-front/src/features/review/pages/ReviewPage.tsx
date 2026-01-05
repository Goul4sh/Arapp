import styles from './Review.module.css';
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import type {FlashcardItem, FlashcardsGroup, TemporaryWord} from "../reviewTypes.ts";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlus} from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal.tsx";

//TODO dodac wyswietlanie harakat
//TODO dodanie widoku  dodawani fiszek do grupy fiszek

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

    const [isDeleteGroupButtonClicked, setIsDeleteGroupButtonClicked] = useState(false);

    const [newGroupData, setNewGroupData] = useState<{ name: string; category: string }>({
        name: '',
        category: ''
    });

    const [editGroupData, setEditGroupData] = useState<{ name: string; category: string }>({
        name: '',
        category: ''
    });
    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

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


    const createAllFlashcardsGroup = (): FlashcardsGroup | null => {
        if (!flashcardGroups || flashcardGroups.length === 0) {
            return null
        }
        const allFlashcards = flashcardGroups.flatMap(group => group.flashcardItems);

        const uniqueFlashcardsMap = Array.from(
            new Map(allFlashcards.map(flashcard => [flashcard.id, flashcard])).values()
        )

        return {
            id: '0',
            name: 'Wszystkie fiszki',
            category: 'Zbiorcza',
            flashcardItems: uniqueFlashcardsMap
        } as FlashcardsGroup;
    }

    const allFlashcardsGroup = createAllFlashcardsGroup();

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

    const handleDeleteGroupSubmit = async () => {

        try {

            await api.delete(`/api/flashcard-groups/${selectedGroup?.id}`, {withCredentials: true});

            setFlashcardGroups(prev => prev.filter(g => g.id !== selectedGroup?.id));

            setSelectedGroup(null);
            setSelectedGroupIndex(null);
            setIsEditModalOpen(false);
            setIsDeleteGroupButtonClicked(false);

        } catch (error) {
            console.error("Błąd podczas usuwania grupy:", error);
            alert("Nie udało się usunąć grupy.");

        }

    }


    const startEditingGroup = () => {
        if (!selectedGroup) return;
        setEditingGroupId(selectedGroup.id);
        setEditGroupData({
            name: selectedGroup.name,
            category: selectedGroup.category
        });
    }

    const cancelEditingGroup = () => {
        setEditingGroupId(null);
        setEditGroupData({
            name: '',
            category: ''
        })
    }

    const handleEditGroupSubmit = async () => {
        if (!editingGroupId || !editGroupData) return;


        const isChanged =
            editGroupData.name !== selectedGroup?.name ||
            editGroupData.category !== selectedGroup?.category;

        if (!isChanged) {
            cancelEditingGroup();
            return;
        }

        if (editGroupData.category.trim() === "" || editGroupData.name.trim() === "") {
            alert("Nazwa i kategoria grupy nie mogą być puste.");
            return;
        }

        try {

            setFlashcardGroups(prev => prev.map(g =>
                g.id === editingGroupId
                    ? {...g, name: editGroupData.name, category: editGroupData.category}
                    : g));

            // if (selectedGroup.id === editingGroupId) {
            //     setSelectedGroup({
            //         ...selectedGroup,
            //         name: editingGroupData.name,
            //         category: editingGroupData.category
            //     });
            // }


            await api.patch(`/api/flashcard-groups/${editingGroupId}`,
                {
                    name: editGroupData.name,
                    description: "",
                    category: editGroupData.category,
                    flashcardItem_Ids: []
                    // dodawanie i odejmowanie fiszek z grupy nie jest obsługiwane tutaj
                }, {withCredentials: true}
            );

            cancelEditingGroup();
            setIsEditModalOpen(false)


        } catch (error) {


            console.error("Błąd podczas edycji grupy:", error);
            alert("Nie udało się edytować grupy.");
            const groupsResp = await api.get('/api/flashcard-groups/user', {withCredentials: true});
            setFlashcardGroups(groupsResp.data);

        }

    }

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

                        {allFlashcardsGroup && (
                            <div
                                className={`${styles.groupItem} ${selectedGroupIndex === -1 ? styles.selectedGroup : ''}`}
                                key={allFlashcardsGroup.id}
                                onClick={() => {
                                    setSelectedGroup(allFlashcardsGroup);
                                    setSelectedGroupIndex(-1);
                                }}
                            >
                                <div className={styles.groupInfo}>
                                    <p className={styles.groupName}> {allFlashcardsGroup.name} </p>
                                    <p className={styles.groupCategory}>{allFlashcardsGroup.category}</p>
                                </div>
                                <div className={styles.groupStats}>
                                    <div className={styles.statBox}>
                                        <h2 className={styles.statNumber}>{allFlashcardsGroup.flashcardItems.length}</h2>
                                        <p className={styles.statLabel}>Razem</p>
                                    </div>
                                    <div className={styles.statBox}>
                                        <h2 className={`${styles.statNumber} ${styles.greenText}`}>{allFlashcardsGroup.flashcardItems.filter(f => isFlashcardDue(f.nextReviewDate)).length}</h2>
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
                                                    <FontAwesomeIcon icon={faPencil} className={styles.editGroupIcon}
                                                                     onClick={() => handleGroupOptionClick()}></FontAwesomeIcon>)
                                                : ("")}
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


                   title={
                       selectedGroup?.id === '0'
                           ? 'Wszystkie fiszki'
                           : `Wszystkie fiszki w grupie: ${selectedGroup?.name}`
                   }

                   headerClassName={styles.modalTitleClass}
            >
                <div className={styles.allFlashcardsModalContent}>

                    {!selectedGroup || !selectedGroup.flashcardItems || selectedGroup.flashcardItems.length === 0 ? (
                        <div>Brak fiszek w tej grupie.</div>
                    ) : (
                        <div className={styles.modalCardsContainer}>

                            {selectedGroup.flashcardItems.map((flashcard: FlashcardItem, index) => (

                                <div className={styles.flashcardItem} key={index}>
                                    <div className={styles.flashcardContent}>
                                        <h1 lang="ar">{flashcard.word.wordArabic}</h1>
                                        <p className={styles.transliteration}>{flashcard.word.Transliteration}</p>
                                        <h2>{flashcard.word.wordTranslation}</h2>
                                    </div>
                                </div>
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

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setIsDeleteGroupButtonClicked(false)
                }}
                title={"Edytuj grupę fiszek"}>
                <div>
                    {/*TODO formularz edycji grupy fiszek*/}

                    {!isDeleteGroupButtonClicked ? (
                        <div className={styles.editGrouModalContent}>


                            {editingGroupId ? (
                                <div className={styles.editModeInputs}>
                                    <div>
                                        <label>Nazwa grupy</label>
                                        <input
                                            type="text"
                                            className={styles.inputField}
                                            value={editGroupData.name}
                                            onChange={e => setEditGroupData({
                                                ...editGroupData,
                                                name: e.target.value
                                            })}
                                            placeholder="Nazwa grupy"
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <label>Kategoria</label>
                                        <input
                                            type="text"
                                            className={styles.inputField}
                                            value={editGroupData.category}
                                            onChange={e => setEditGroupData({
                                                ...editGroupData,
                                                category: e.target.value
                                            })}
                                            placeholder="Kategoria"
                                        />
                                    </div>

                                    <div className={styles.editButtons}>
                                        <button
                                            className={styles.saveButton}
                                            onClick={() => handleEditGroupSubmit()}
                                        >
                                            Zapisz zmiany
                                        </button>
                                        <button
                                            className={styles.cancelButton}
                                            onClick={() => cancelEditingGroup()}
                                        >
                                            Anuluj
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.viewMode}>
                                    <div className={styles.groupDetails}>
                                        <p><strong>Nazwa:</strong> {selectedGroup?.name}</p>
                                        <p><strong>Kategoria:</strong> {selectedGroup?.category}</p>
                                    </div>

                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => startEditingGroup()}
                                        >
                                            Edytuj dane grupy
                                        </button>

                                        <button
                                            className={styles.deleteGroupButton}
                                            onClick={() => setIsDeleteGroupButtonClicked(true)}
                                        >
                                            Usuń grupę
                                        </button>
                                    </div>
                                </div>
                            )}


                            {/*<button className={styles.deleteGroupButton}*/}
                            {/*        onClick={() => setIsDeleteGroupButtonClicked(true)}>*/}
                            {/*    Usuń grupę*/}
                            {/*</button>*/}


                        </div>
                    ) : (

                        <div className={styles.deleteConfirmationModal}>

                            <h2> Jesteś pewien, że chcesz usunąć grupę?</h2>
                            <p> Ta akcja jest nieodwracalna. Wszystkie fiszki z tej grupy nadal pozostaną w twoim
                                zbiorze.</p>

                            <div className={styles.deleteConfirmationButtons}>
                                <button className={styles.confirmDeleteButton}
                                        onClick={() => handleDeleteGroupSubmit()}>
                                    Tak, usuń grupę
                                </button>
                                <button className={styles.cancelDeleteButton}
                                        onClick={() => setIsDeleteGroupButtonClicked(false)}>
                                    Anuluj
                                </button>
                            </div>
                        </div>
                    )

                    }

                </div>
            </Modal>


        </div>
    )
}

export default ReviewPage