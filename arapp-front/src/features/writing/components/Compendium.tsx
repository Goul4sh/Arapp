import styles from "../writing.module.css"
import {useEffect, useState} from "react";
import {
    type CompendiumEntry, type CompendiumEntryDetailResponse, type CompendiumEntryFull,
    type CompendiumTag
} from "../writingTypes.ts";
import api from "../../auth/api.ts";
import CompendiumContent from "./CompendiumContent.tsx";


function Compendium() {


    const [allEntries, setAllEntries] = useState<CompendiumEntry[]>([]);
    const [allTags, setAllTags] = useState<CompendiumTag[]>([]);
    const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);

    const [activeTag, setActiveTag] = useState<string>("all");
    const [selectedItem, setSelectedItem] = useState<CompendiumEntryFull | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    // const [isLoadingDetail, setIsLoadingDetail] = useState(true);


    useEffect(() => {
        const fetchCompendiumData = async () => {
            try {

                const [completeResp, compendiumEntriesResp, compendiumTagsResp] = await Promise.all([
                    api.get<number[]>('/api/lessons/complete', {withCredentials: true}),
                    api.get<CompendiumEntry[]>('/api/compendium/published', {withCredentials: true}),
                    api.get<CompendiumTag[]>('/api/compendium/tags', {withCredentials: true}),

                ]);

                console.log("Wszystkie tagi:", compendiumTagsResp.data);
                console.log("Wpisy do kompendium:", compendiumEntriesResp.data);

                setAllEntries(compendiumEntriesResp.data);
                setAllTags(compendiumTagsResp.data);
                setCompletedLessonIds(completeResp.data);

            } catch (error) {
                console.error("Błąd pobierania danych", error);
                setAllEntries([]);
                setAllTags([]);
                setCompletedLessonIds([]);

            } finally {
                setIsLoading(false);
            }
        };
        fetchCompendiumData();
    }, []);


    const isUnlocked = (item: CompendiumEntry) => {

        if (item.requiredLessonId === 0) return true;
        return completedLessonIds.includes(item.requiredLessonId);

    };

    const handleEntryClick = async (entry: CompendiumEntry) => {

        if (!isUnlocked(entry)) return;

        // setIsLoadingDetail(true);
        try {
            const response =
                await api.get<CompendiumEntryDetailResponse>(`/api/compendium/${entry.id}`,
                    {withCredentials: true});

            const fullEntry: CompendiumEntryFull = {
                ...entry, content: response.data.content
            };

            setSelectedItem(fullEntry);
        } catch (error) {
            console.error("Błąd pobierania szczegółów wpisu", error);
        } finally {
            // setIsLoadingDetail(false);
        }
    }

    const filteredEntries = allEntries.filter(entry => {
        if (activeTag === 'all') return true;
        return entry.tags.some(tag => tag.name === activeTag);
    });

    const activeTagName = activeTag === 'all'
        ? "Wszystkie wpisy"
        : allTags.find(t => t.name === activeTag)?.displayName;


    if (isLoading) return <div className={styles.loading}>Ładowanie...</div>;

    return (

        <div className={styles.compendiumContainer}>

            <div className={styles.categoriesColumn}>
                <h2 className={styles.headerTitle}>Kategorie</h2>
                <div className={styles.categoriesList}>

                    <div
                        className={`${styles.categoryItem} ${activeTag === 'all' ? styles.selectedCategoryItem : ''}`}
                        onClick={() => {
                            setActiveTag('all');
                            setSelectedItem(null);
                        }}
                    >
                        <h3>Wszystkie</h3>
                    </div>

                    {allTags.map(tag => (
                        <div
                            key={tag.name}
                            className={`${styles.categoryItem} ${activeTag === tag.name ? styles.selectedCategoryItem : ''}`}
                            onClick={() => {
                                setActiveTag(tag.name);
                                setSelectedItem(null);
                            }}
                        >
                            <h3>{tag.displayName}</h3>
                        </div>
                    ))}
                </div>
            </div>


            <div className={styles.separator}></div>

            <div className={styles.contentColumn}>

                {selectedItem ? (
                    <div className={styles.detailView}>
                        <button className={styles.backButton} onClick={() => setSelectedItem(null)}>
                            ← Powrót do listy
                        </button>

                        <CompendiumContent
                            title={selectedItem.title}
                            subtitle={selectedItem.subtitle}
                            content={selectedItem.content}
                        />


                    </div>
                ) : (

                    <div className={styles.gridContainer}>
                        <div className={styles.categoryHeader}>
                            <h2>{activeTagName}</h2>

                        </div>

                        {/*{isLoadingDetail && <div className={styles.loadingOverlay}>Pobieranie wpisów...</div>}*/}

                        <div className={styles.itemsGrid}>
                            {filteredEntries.map(item => {
                                const unlocked = isUnlocked(item);
                                return (
                                    <div
                                        key={item.id}
                                        className={`${styles.gridItem} ${!unlocked ? styles.locked : ''}`}
                                        onClick={() => handleEntryClick(item)}
                                    >
                                        <div className={styles.itemHeader}>
                                            <span className={styles.itemTitle}>{item.title}</span>
                                            {unlocked &&
                                                <span className={styles.itemSubtitle}>{item.subtitle}</span>}
                                        </div>

                                        <p className={styles.itemDesc}>
                                            {unlocked ? item.description : "Ukończ lekcję, aby odblokować."}
                                        </p>

                                        {!unlocked && (
                                            <div className={styles.lockOverlay}>
                                                <small>Wymaga ukończenia lekcji {item.requiredLessonId}</small>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {filteredEntries.length === 0 && (
                                <p style={{gridColumn: '1/-1', textAlign: 'center', color: '#9ca3af', marginTop: '2rem'}}>
                                    Brak wpisów w tej kategorii.
                                </p>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Compendium;