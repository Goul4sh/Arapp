import type {FlashcardsGroup} from "../../reviewTypes.ts";
import {useMemo, useState} from "react";
import api from "../../../auth/api.ts";
import Modal from "../../Modal.tsx";

import styles from "./../../modal.module.css"
import localStyles from "./editGroupModal.module.css"
import FlashcardItemCard from "../FlashcardItem.tsx";

interface EditGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedGroup: FlashcardsGroup | null;
    defaultGroup: FlashcardsGroup | null;
    onGroupUpdated: (updatedGroup: FlashcardsGroup) => void;
    onGroupDeleted: (groupId: string) => void;
}

type TabType = 'edit' | 'addFlashcards';


function EditGroupModal({
                            isOpen,
                            onClose,
                            selectedGroup,
                            defaultGroup,
                            onGroupUpdated,
                            onGroupDeleted
                        }: EditGroupModalProps) {
    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
    const [editGroupData, setEditGroupData] = useState<{ name: string; category: string }>({
        name: '',
        category: ''
    });
    const [isDeleteGroupButtonClicked, setIsDeleteGroupButtonClicked] = useState(false);

    const [activeTab, setActiveTab] = useState<TabType>('edit');
    const [searchQuery, setSearchQuery] = useState("");


    const allFlashcardsWithStatus = useMemo(() => {
        if (!defaultGroup || !selectedGroup) return [];

        const selectedGroupIds = new Set(
            selectedGroup.flashcardItems.map(f => parseInt(f.id))
        );

        return defaultGroup.flashcardItems.map(flashcard => ({
            ...flashcard.word,
            id: flashcard.id,
            isInUserFlashcards: selectedGroupIds.has(flashcard.id)
        }));
    }, [defaultGroup, selectedGroup]);



    const filteredFlashcards = useMemo(() => {

        console.log("allFlashcardsWithStatus:", allFlashcardsWithStatus);


        if (!searchQuery.trim()) return allFlashcardsWithStatus;

        const query = searchQuery.toLowerCase();
        return allFlashcardsWithStatus.filter(flashcard =>
            flashcard.wordArabic?.toLowerCase().includes(query) ||
            flashcard.wordTranslation?.toLowerCase().includes(query) ||
            flashcard.Transliteration?.toLowerCase().includes(query)
        );
    }, [allFlashcardsWithStatus, searchQuery]);


    const handleAddFlashcardToGroup = async (flashcardId: number) => {
        if (!selectedGroup) return;

        try {
            await api.patch(
                `/api/flashcard-groups/${selectedGroup.id}/add-flashcards`,[flashcardId],
                {withCredentials: true}
            );

            const flashcardToAdd = defaultGroup?.flashcardItems.find(f => f.id === flashcardId);
            if (flashcardToAdd) {
                const updatedGroup = {
                    ...selectedGroup,
                    flashcardItems: [...selectedGroup.flashcardItems, flashcardToAdd]
                };
                onGroupUpdated(updatedGroup);
            }

        } catch (error) {
            console.error("Błąd podczas dodawania fiszki do grupy:", error);
            alert("Nie udało się dodać fiszki do grupy.");
        }
    };

    const handleRemoveFlashcardFromGroup = async (flashcardId: number) => {
        if (!selectedGroup) return;

        try {
            await api.patch(
                `/api/flashcard-groups/${selectedGroup.id}/remove-flashcards`,[flashcardId],
                {withCredentials: true}
            );

            const updatedGroup = {
                ...selectedGroup,
                flashcardItems: selectedGroup.flashcardItems.filter(f => parseInt(f.id) !== flashcardId)
            };
            onGroupUpdated(updatedGroup);

        } catch (error) {
            console.error("Błąd podczas usuwania fiszki z grupy:", error);
            alert("Nie udało się usunąć fiszki z grupy.");
        }
    };

    const startEditingGroup = () => {
        if (!selectedGroup) return;
        setEditingGroupId(selectedGroup.id);
        setEditGroupData({
            name: selectedGroup.name,
            category: selectedGroup.category
        });
    };

    const cancelEditingGroup = () => {
        setEditingGroupId(null);
        setEditGroupData({name: '', category: ''});
    };

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
            const updatedGroup = {
                ...selectedGroup!,
                name: editGroupData.name,
                category: editGroupData.category
            };

            onGroupUpdated(updatedGroup);

            await api.patch(`/api/flashcard-groups/${editingGroupId}`,
                {
                    name: editGroupData.name,
                    description: "",
                    category: editGroupData.category,
                    flashcardItem_Ids: []
                },
                {withCredentials: true}
            );

            cancelEditingGroup();
            onClose();

        } catch (error) {
            console.error("Błąd podczas edycji grupy:", error);
            alert("Nie udało się edytować grupy.");
        }
    };

    const handleDeleteGroupSubmit = async () => {
        if (!selectedGroup) return;

        try {
            await api.delete(`/api/flashcard-groups/${selectedGroup.id}`, {withCredentials: true});
            onGroupDeleted(selectedGroup.id);
            onClose();
            setIsDeleteGroupButtonClicked(false);

        } catch (error) {
            console.error("Błąd podczas usuwania grupy:", error);
            alert("Nie udało się usunąć grupy.");
        }
    };

    const handleClose = () => {
        cancelEditingGroup();
        setIsDeleteGroupButtonClicked(false);
        setActiveTab('edit');
        setSearchQuery("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Zarządzaj grupą fiszek"
        >
            <div>
                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'edit' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('edit')}
                    >
                        Edytuj grupę
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'addFlashcards' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('addFlashcards')}
                    >
                        Dodaj fiszki
                    </button>
                </div>

                {activeTab === 'edit' ? (
                    !isDeleteGroupButtonClicked ? (
                        <div className={styles.editGroupModalContent}>
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
                                            onClick={handleEditGroupSubmit}
                                        >
                                            Zapisz zmiany
                                        </button>
                                        <button
                                            className={styles.cancelButton}
                                            onClick={cancelEditingGroup}
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
                                        <p><strong>Liczba fiszek:</strong> {selectedGroup?.flashcardItems.length || 0}
                                        </p>
                                    </div>

                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.editButton}
                                            onClick={startEditingGroup}
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
                        </div>
                    ) : (
                        <div className={styles.deleteConfirmationModal}>
                            <h2>Jesteś pewien, że chcesz usunąć grupę?</h2>
                            <p>Ta akcja jest nieodwracalna. Wszystkie fiszki z tej grupy nadal pozostaną w twoim
                                zbiorze.</p>

                            <div className={styles.deleteConfirmationButtons}>
                                <button
                                    className={styles.confirmDeleteButton}
                                    onClick={handleDeleteGroupSubmit}
                                >
                                    Tak, usuń grupę
                                </button>
                                <button
                                    className={styles.cancelDeleteButton}
                                    onClick={() => setIsDeleteGroupButtonClicked(false)}
                                >
                                    Anuluj
                                </button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className={styles.addFlashcardsContent}>
                        <div className={styles.searchSection}>
                            <input
                                type="text"
                                placeholder="Szukaj fiszki..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.flashcardsGrid}>
                            {filteredFlashcards.length === 0 ? (
                                <div className={styles.emptyState}>
                                    Nie znaleziono fiszek
                                </div>
                            ) : (
                                filteredFlashcards.map((flashcard) => (

                                    <FlashcardItemCard
                                        key={flashcard.id}
                                        flashcard={flashcard}
                                        onAddToFlashcards={handleAddFlashcardToGroup}
                                        onRemoveFromFlashcards={handleRemoveFlashcardFromGroup}
                                        usage="group"
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default EditGroupModal;
