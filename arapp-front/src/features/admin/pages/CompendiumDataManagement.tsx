import styles from "./adminGlobalStyles.module.css";
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import {
    faBook,
    faChevronDown,
    faChevronRight,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import CompendiumEntryForm from "./components/forms/CompendiumEntryForm.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface CompendiumEntry {
    id: number;
    title: string;
    subtitle?: string;
    description: string;
    content: string;
    icon: string;
    requiredLessonId: number;
    tags: CompendiumTag[];
    isPublished: boolean;
}

interface CompendiumTag {
    name: string;
    displayName: string;
}

interface Option {
    value: string;
    label: string;
}

function CompendiumDataManagement() {
    const [entries, setEntries] = useState<CompendiumEntry[]>([]);
    const [availableTags, setAvailableTags] = useState<Option[]>([]);
    const [editingEntry, setEditingEntry] = useState<Partial<CompendiumEntry> | null>(null);
    const [expandedEntryId, setExpandedEntryId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [entriesResp, tagsResp] = await Promise.all([
                api.get<CompendiumEntry[]>('/api/compendium', {withCredentials: true}),
                api.get<CompendiumTag[]>('/api/compendium/tags', {withCredentials: true})
            ]);

            setEntries(entriesResp.data);

            console.log("Dane o entries", entriesResp.data);
            setAvailableTags(tagsResp.data.map(tag => ({
                value: tag.name,
                label: tag.displayName
            })));
        } catch (error) {
            console.error("Błąd podczas ładowania danych:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddEntry = () => {
        setEditingEntry({
            title: '',
            subtitle: '',
            description: '',
            content: '',
            icon: '',
            requiredLessonId: 0,
            tags: [],
            isPublished: false
        });
        setExpandedEntryId(0);
    };

    const handleEntryClick = async (entry: CompendiumEntry) => {
        if (expandedEntryId === entry.id) {
            setExpandedEntryId(null);
            setEditingEntry(null);
        } else {

            console.log(entry)

            entry.content = await fetchDetailedEntry(entry.id);
            setExpandedEntryId(entry.id);
            setEditingEntry(entry);

            console.log(editingEntry);
        }
    };

    const fetchDetailedEntry = async (id: number) => {

        try {
            const response = await api.get(`/api/compendium/${id}`, {withCredentials: true});

            console.log("Response:", response.data.content);

            return response.data.content;
        } catch (error) {
            console.error("Błąd podczas pobierania szczegółów wpisu:", error);
        }
    }

    const handleChange = (field: keyof CompendiumEntry, value: string | number | CompendiumTag[]) => {
        setEditingEntry(prev => prev ? {...prev, [field]: value} : null);
    };

    const handleSave = async () => {
        if (!editingEntry) return;

        let payload;

        try {
            const isUpdate = editingEntry.id && editingEntry.id > 0;

            payload = {
                content: editingEntry.content,
                title: editingEntry.title,
                subtitle: editingEntry.subtitle,
                description: editingEntry.description,
                requiredLessonId: editingEntry.requiredLessonId,
                tagNames: editingEntry.tags?.map(tag => tag.name) || [],
            };

            if (isUpdate) {


                await api.patch(`/api/compendium/${editingEntry.id}`, payload, {withCredentials: true});
                setEntries(prev => prev.map(e => e.id === editingEntry.id ? editingEntry as CompendiumEntry : e));
            } else {


                const response = await api.post('/api/compendium', payload, {withCredentials: true});
                setEntries(prev => [...prev, response.data]);
            }

            setEditingEntry(null);
            setExpandedEntryId(null);
            alert("Zapisano pomyślnie!");
        } catch (error) {
            console.error("Błąd podczas zapisywania:", error);
            alert("Wystąpił błąd podczas zapisywania.");
        }
    };

    const handleCancel = () => {
        setEditingEntry(null);
        setExpandedEntryId(null);
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Czy na pewno chcesz usunąć ten wpis?")) return;

        try {
            await api.delete(`/api/compendium/${id}`, {withCredentials: true});
            setEntries(prev => prev.filter(e => e.id !== id));
            alert("Usunięto pomyślnie!");
        } catch (error) {
            console.error("Błąd podczas usuwania:", error);
        }
    };

    const handleToggleVisibility = async (id: number, currentState: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.patch(`/api/compendium/${id}/publish/${!currentState}`, {withCredentials: true});
            setEntries(prev => prev.map(e => e.id === id ? {...e, isPublished: !currentState} : e));
        } catch (error) {
            console.error("Błąd podczas zmiany widoczności:", error);
        }
    };

    const formatTags = (tags: CompendiumTag[]) => {
        if (!tags || tags.length === 0) return '—';
        if (tags.length <= 2) return tags.map(t => t.displayName).join(', ');
        return `${tags[0].displayName}, ${tags[1].displayName} +${tags.length - 2}`;
    };

    if (isLoading) return <div className={styles.adminPageContainer}>Ładowanie...</div>;

    return (
        <div className={styles.adminPageContainer}>
            <div className={styles.courseContentContainer}>
                <div className={styles.headerSection}>
                    <h1 className={styles.pageTitle}>Zarządzanie kompendium</h1>
                    <div className={styles.headerButtons}>
                        <button
                            className={`${styles.createButton} ${styles.secondaryBtn}`}
                            onClick={handleAddEntry}
                        >
                            <FontAwesomeIcon icon={faBook}/> Nowy wpis
                        </button>
                    </div>
                </div>

                <div className={styles.listContainer}>
                    {expandedEntryId === 0 && (
                        <div className={styles.chapterCard}>
                            <div className={`${styles.chapterHeader} ${styles.active}`}>
                                <div className={styles.chapterTitleSection}>
                                <span className={styles.chevronIcon}>
                                    <FontAwesomeIcon icon={faChevronDown}/>
                                </span>
                                    <div className={styles.titleWrapper}>
                                        <div className={styles.chapterHeaderContent}>
                                            <h3 className={styles.chapterTitle}>Nowy wpis</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.lessonsList}>
                                <CompendiumEntryForm
                                    formData={editingEntry!}
                                    availableTags={availableTags}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    {entries.map((entry) => (
                        <div key={entry.id} className={styles.chapterCard}>
                            <div
                                className={`${styles.chapterHeader} ${expandedEntryId === entry.id ? styles.active : ''}`}
                                onClick={() => handleEntryClick(entry)}
                            >
                                <div className={styles.chapterTitleSection}>

                                    <div className={styles.lessonStatusIndicator}>
                                        <button
                                            className={styles.lessonStatusButton}
                                            onClick={(e) => handleToggleVisibility(entry.id, entry.isPublished, e)}
                                        >

                                            {entry.isPublished ? 'Ukryj' : 'Opublikuj'}
                                        </button>
                                        <div
                                            className={`${styles.dot} ${entry.isPublished ? styles.published : styles.draft}`}></div>
                                    </div>

                                    <span className={styles.chevronIcon}>
                                    <FontAwesomeIcon
                                        icon={expandedEntryId === entry.id ? faChevronDown : faChevronRight}
                                    />
                                </span>
                                    <div className={styles.titleWrapper}>
                                        <div className={styles.chapterHeaderContent}>
                                            <h3 className={styles.chapterTitle}>{entry.title}</h3>
                                            <div className={styles.chapterMeta}>
                                                <span>{entry.subtitle || '—'}</span>
                                                <span>Lekcja: {entry.requiredLessonId || '0 '}</span>
                                                <span>{formatTags(entry.tags)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.chapterActions}>

                                    <button
                                        className={`${styles.smallActionBtn} ${styles.delete}`}
                                        onClick={(e) => handleDelete(entry.id, e)}
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                            </div>

                            {expandedEntryId === entry.id && (
                                <div className={styles.lessonsList}>
                                    <CompendiumEntryForm
                                        formData={editingEntry!}
                                        availableTags={availableTags}
                                        onSave={handleSave}
                                        onCancel={handleCancel}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}

export default CompendiumDataManagement;
