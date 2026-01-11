import styles from "./adminGlobalStyles.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {
    faArrowDown,
    faArrowUp, faCheck,
    faChevronDown,
    faChevronRight,
    faFolderOpen, faLayerGroup, faListCheck, faPen,
    faPlus, faTimes, faTrash
} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import api from "../../auth/api.ts";

import type {Chapter, Lesson} from "../../writing/writingTypes.ts";
import Modal from "../../review/Modal.tsx";

interface LessonResponse {

    id: number;
    title: string;
    icon: string;
    description: string;
}

interface LocalLesson {
    id: number;
    title: string;
    icon: string
    description: string;
    taskCount: number;
    isPublished: boolean;
}

interface LocalChapter {
    id: number;
    title: string;
    description: string;
    orderIndex: number;
    lessons: LocalLesson[];
    isPublished: boolean;
}


function LessonManagement() {
    const [chapters, setChapters] = useState<LocalChapter[]>([]);

    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([101]));

    const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
    const [editingChapterData, setEditingChapterData] = useState({title: '', description: ''});


    const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
    const [editingLessonData, setEditingLessonData] = useState({title: '', description: ''});

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [deletingLesson, setDeletingLesson] = useState<{ chapterId: number; lessonId: number } | null>(null);
    const [deletingChapter, setDeletingChapter] = useState<number | null>(null);

    // const [isDeleteChapterModalOpen, setIsDeleteChapterModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        try {

            api.get<Chapter[]>('/api/chapters', {withCredentials: true})
                .then((resp) => {
                    const chaptersWithNumericIds: LocalChapter[] = resp.data.map(chapter => ({
                        ...chapter,
                        id: Number(chapter.id),
                        orderIndex: 0,
                        isPublished: false,
                        lessons: chapter.lessons.map(lesson => ({
                            id: Number(lesson.id),
                            title: lesson.title,
                            icon: lesson.icon || '',
                            description: lesson.description,
                            taskCount: lesson.taskCount || 0,
                            isPublished: lesson.isPublished || false
                        }))
                    }));

                    setChapters(chaptersWithNumericIds);
                });
        } catch (error) {
            console.error("Błąd podczas ładowania rozdziałów:", error);
        }


    }, []);


    const toggleChapter = (chapterId: number) => {
        setExpandedChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) newSet.delete(chapterId);
            else newSet.add(chapterId);
            return newSet;
        });
    };

    const startEditingChapter = (chapter: LocalChapter, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingChapterId(chapter.id)
        setEditingChapterData({title: chapter.title, description: chapter.description});
    }

    const cancelEditingChapter = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setEditingChapterId(null);
        setEditingChapterData({title: '', description: ''});
    }

    const editChapter = async (chapterId: number, e: React.MouseEvent) => {
        e?.stopPropagation()

        const originalChapter = chapters.find(c => c.id === chapterId);
        if (!originalChapter) return;

        const isChanged =
            originalChapter.title !== editingChapterData.title ||
            originalChapter.description !== editingChapterData.description;
        if (!isChanged) {
            cancelEditingChapter();
            return;
        }

        if (editingChapterData.title.trim() === '') {
            alert("Nazwa rozdziału nie może być pusta.");
            return;
        }

        const updatedChapters = chapters.map(ch =>
            ch.id === chapterId
                ? {...ch, title: editingChapterData.title, description: editingChapterData.description}
                : ch
        );
        setChapters(updatedChapters);
        setEditingChapterId(null);

        try {

            // Korzystamy z tego samego requesta co do tworzenia rozdziału, wiec trzeba uwzględnić lessonIds
            await api.patch(`/api/chapters/${chapterId}`, {
                title: editingChapterData.title,
                description: editingChapterData.description,
                lessonIds: []
            }, {withCredentials: true});

        } catch (error) {
            console.error("Błąd podczas aktualizacji rozdziału:", error);
        }


    }


    const startEditingLesson = (lesson: LocalLesson, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingLessonId(lesson.id);
        setEditingLessonData({title: lesson.title, description: lesson.description});
    };

    const cancelEditingLesson = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setEditingLessonId(null);
        setEditingLessonData({title: '', description: ''});
    };


    const editLesson = async (chapterId: number, lessonId: number, e: React.MouseEvent) => {
        e?.stopPropagation();

        const originalLesson = chapters
            .find(c => c.id === chapterId)
            ?.lessons.find(l => l.id === lessonId);
        if (!originalLesson) return;

        const isChanged =
            originalLesson.title !== editingLessonData.title ||
            originalLesson.description !== editingLessonData.description;
        if (!isChanged) {
            cancelEditingLesson();
            return;
        }

        if (editingLessonData.title.trim() === '') {
            alert("Nazwa lekcji nie może być pusta.");
            return;
        }

        const updatedChapters = chapters.map(ch => {
            if (ch.id !== chapterId) return ch;
            return {
                ...ch,
                lessons: ch.lessons.map(l =>
                    l.id === lessonId
                        ? {...l, title: editingLessonData.title, description: editingLessonData.description}
                        : l
                )
            };
        });
        setChapters(updatedChapters);
        setEditingLessonId(null);

        try {
            await api.patch(`/api/lessons/${lessonId}`, {
                title: editingLessonData.title,
                description: editingLessonData.description,
                icon: '',
                taskIds: []
            }, {withCredentials: true});
        } catch (error) {
            console.error("Błąd podczas aktualizacji lekcji:", error);
        }
    };

    const moveChapter = (index: number, direction: 'up' | 'down') => {
        const newChapters = [...chapters];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newChapters.length) {
            [newChapters[index], newChapters[targetIndex]] = [newChapters[targetIndex], newChapters[index]];
            setChapters(newChapters);
        }
    };

    const handleAddChapter = async () => {
        const newChapter: LocalChapter = {
            id: Date.now(),
            title: `Nowy Rozdział ${chapters.length + 1}`,
            description: "",
            orderIndex: chapters.length + 1,
            lessons: [],
            isPublished: false
        };

        const mockChapter: { title: string, description: string, lessons: Lesson[] } = {
            title: newChapter.title,
            description: newChapter.description,
            lessons: []
        };

        try {
            await api.post(`/api/chapters`, mockChapter, {withCredentials: true});

        } catch (error) {
            console.error("Błąd podczas dodawania rozdziału:", error);
        }


        setChapters(prev => [...prev, newChapter]);
        setExpandedChapters(prev => new Set(prev).add(newChapter.id));
    }

    const handleDeleteChapter = async (chapterId: number) => {
        setDeletingChapter(chapterId)
    }


    const confirmDeleteChapter = async () => {

        if (deletingChapter === null) return;
        setChapters(prev => prev.filter(ch => ch.id !== deletingChapter));

        try {

            await api.delete(`/api/chapters/${deletingChapter}`, {withCredentials: true});

        } catch (error) {
            console.error("Błąd podczas usuwania rozdziału:", error);
        }

    }

    const handleDeleteLesson = async (chapterId: number, lessonId: number) => {
        setDeletingLesson({chapterId, lessonId});
    };

    const confirmDeleteLesson = async () => {

        const {chapterId, lessonId} = deletingLesson!;

        if (!deletingLesson) return;
        setChapters(prev => prev.map(ch => {
            if (ch.id !== chapterId) return ch;
            return {...ch, lessons: ch.lessons.filter(l => l.id !== lessonId)};
        }));


        try {

            await api.delete(`/api/lessons/${lessonId}`, {withCredentials: true});

        } catch (error) {
            console.error("Błąd podczas usuwania lekcji:", error);
        }

    }


    const handleAddLesson = async (chapterId: number) => {

        try {
            const lessonData = {
                title: "Nowa lekcja",
                description: "Opis nowej lekcji",
                icon: "",
                taskIds: []
            };


            const response = await api.post('/api/lessons', lessonData, {withCredentials: true});
            const newLesson: LessonResponse = response.data;

            await api.patch(`/api/chapters/${chapterId}/lessons/${newLesson.id}`, {withCredentials: true});

            setChapters(prevChapters => prevChapters.map(chapter => {
                if (chapter.id === chapterId) {
                    return {
                        ...chapter,
                        lessons: [
                            ...chapter.lessons,
                            {
                                id: Number(newLesson.id),
                                title: newLesson.title,
                                icon: newLesson.icon || '',
                                description: newLesson.description,
                                taskCount: 0,
                                isPublished: false
                            }
                        ]
                    };
                }
                return chapter;
            }));

        } catch (error) {
            console.error("Błąd podczas dodawania lekcji:", error);

        }


    }

    const handleToggleLessonVisibility = async (chapterId: number, lessonId: number) => {
        const prevChapters = chapters;
        const currentLesson = prevChapters
            .find(c => c.id === chapterId)
            ?.lessons.find(l => l.id === lessonId);
        if (!currentLesson) return;

        const newStatus: boolean = !currentLesson.isPublished;

        const newState = prevChapters.map(ch => {
            if (ch.id !== chapterId) return ch;
            return {
                ...ch,
                lessons: ch.lessons.map(l => l.id === lessonId ? {...l, isPublished: newStatus} : l)
            };
        });
        setChapters(newState);

        try {
            await api.patch(`/api/lessons/${lessonId}/publish/${newStatus}`, {withCredentials: true});

        } catch (error) {
            console.error("Błąd podczas zmiany widoczności lekcji:", error);
        }


    }

    const handleGoToEditTasks = () => {
        setIsEditModalOpen(false);
        navigate(`/admin/content`);
    }


    return (
        <div className={styles.adminPageContainer}>
            <div className={styles.courseContentContainer}>

                <div className={styles.headerSection}>
                    <div>
                        <h1 className={styles.pageTitle}>Struktura Kursu</h1>
                    </div>
                    <div className={styles.headerButtons}>
                        <button className={`${styles.createButton} ${styles.secondaryBtn}`}
                                onClick={() => handleAddChapter()}
                        >
                            <FontAwesomeIcon icon={faFolderOpen}/> Nowy rozdział
                        </button>

                    </div>
                </div>

                <div className={styles.listContainer}>
                    {chapters.map((chapter, chIndex) => {
                            const isEditing = editingChapterId === chapter.id;
                            return (
                                <div key={chapter.id} className={styles.chapterCard}>

                                    <div
                                        className={`${styles.chapterHeader} ${expandedChapters.has(chapter.id) ? styles.active : ''}`}
                                        onClick={() => toggleChapter(chapter.id)}
                                    >
                                        <div className={styles.chapterTitleSection}>
                                            <span className={styles.chevronIcon}>
                                                <FontAwesomeIcon
                                                    icon={expandedChapters.has(chapter.id) ? faChevronDown : faChevronRight}/>
                                            </span>

                                            <div className={styles.titleWrapper}>
                                                {!isEditing ? (
                                                    <div className={styles.chapterHeaderContent}>
                                                        <div className={styles.chapterHeaderText}>
                                                            <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                                                            <span>{chapter.description}</span>
                                                        </div>
                                                        <span
                                                            className={styles.chapterMeta}>Liczba lekcji: {chapter.lessons.length}</span>
                                                    </div>

                                                ) : (

                                                    <div className={styles.editModeInputs}
                                                         onClick={e => e.stopPropagation()}>
                                                        <input
                                                            type="text"
                                                            className={styles.editInputTitle}
                                                            value={editingChapterData.title}
                                                            onChange={e => setEditingChapterData({
                                                                ...editingChapterData,
                                                                title: e.target.value
                                                            })}
                                                            placeholder="Tytuł rozdziału"
                                                            autoFocus
                                                        />
                                                        <input
                                                            type="text"
                                                            className={styles.editInputDesc}
                                                            value={editingChapterData.description}
                                                            onChange={e => setEditingChapterData({
                                                                ...editingChapterData,
                                                                description: e.target.value
                                                            })}
                                                            placeholder="Krótki opis"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.chapterActions} onClick={e => e.stopPropagation()}>

                                            {isEditing ?
                                                (
                                                    <>
                                                        <button
                                                            className={styles.actionBtnSave}
                                                            onClick={(e) => editChapter(chapter.id, e)}
                                                            title="Zapisz zmiany"
                                                        >
                                                            <FontAwesomeIcon icon={faCheck}/>
                                                        </button>
                                                        <button
                                                            className={styles.actionBtnCancel}
                                                            onClick={(e) => cancelEditingChapter(e)}
                                                            title="Anuluj"
                                                        >
                                                            <FontAwesomeIcon icon={faTimes}/>
                                                        </button>
                                                    </>

                                                ) : (

                                                    <>
                                                        <button onClick={() => moveChapter(chIndex, 'up')}
                                                                disabled={chIndex === 0}
                                                                className={styles.smallActionBtn}>
                                                            <FontAwesomeIcon icon={faArrowUp}/>
                                                        </button>
                                                        <button onClick={() => moveChapter(chIndex, 'down')}
                                                                disabled={chIndex === chapters.length - 1}
                                                                className={styles.smallActionBtn}>
                                                            <FontAwesomeIcon icon={faArrowDown}/>
                                                        </button>
                                                        <div className={styles.verticalDivider}></div>
                                                        <button onClick={(e) => startEditingChapter(chapter, e)}
                                                                className={styles.smallActionBtn}
                                                                title="Edytuj rozdział">
                                                            <FontAwesomeIcon icon={faPen}/></button>
                                                        <button className={styles.smallActionBtn}
                                                                onClick={() => handleDeleteChapter(chapter.id)}
                                                                title="Usuń Rozdział"><FontAwesomeIcon icon={faTrash}/>
                                                        </button>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>

                                    {expandedChapters.has(chapter.id) && (
                                        <div className={styles.lessonsList}>
                                            {chapter.lessons.length === 0 ? (
                                                <div></div>
                                            ) : (
                                                chapter.lessons.map((lesson, lIndex) => {
                                                    const isEditingLesson = editingLessonId === lesson.id;
                                                    return (
                                                        <div key={lesson.id} className={styles.lessonRow}>

                                                            <div className={styles.lessonStatusIndicator}>
                                                                <button
                                                                    className={styles.lessonStatusButton}
                                                                    onClick={() => handleToggleLessonVisibility(chapter.id, lesson.id)}
                                                                >

                                                                    {lesson.isPublished ? 'Ukryj' : 'Opublikuj'}
                                                                </button>
                                                                <div
                                                                    className={`${styles.dot} ${lesson.isPublished ? styles.published : styles.draft}`}></div>
                                                            </div>

                                                            <div className={styles.lessonInfo}>
                                                                {!isEditingLesson ? (
                                                                    <>
                                                                        <h4 className={styles.lessonTitle}>
                                                                            {lIndex + 1}. {lesson.title}
                                                                        </h4>
                                                                        <div className={styles.lessonMeta}>
                                                                            <span title="Liczba zadań"><FontAwesomeIcon
                                                                                icon={faListCheck}/> {lesson.taskCount}</span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className={styles.editModeInputs}
                                                                         onClick={e => e.stopPropagation()}>
                                                                        <input
                                                                            type="text"
                                                                            className={styles.editInputTitle}
                                                                            value={editingLessonData.title}
                                                                            onChange={e => setEditingLessonData({
                                                                                ...editingLessonData,
                                                                                title: e.target.value
                                                                            })}
                                                                            placeholder="Tytuł lekcji"
                                                                            autoFocus
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            className={styles.editInputDesc}
                                                                            value={editingLessonData.description}
                                                                            onChange={e => setEditingLessonData({
                                                                                ...editingLessonData,
                                                                                description: e.target.value
                                                                            })}
                                                                            placeholder="Krótki opis"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className={styles.lessonActions}>
                                                                {isEditingLesson ? (
                                                                    <>
                                                                        <button
                                                                            className={styles.actionBtnSave}
                                                                            onClick={(e) => editLesson(chapter.id, lesson.id, e)}
                                                                            title="Zapisz zmiany"
                                                                        >
                                                                            <FontAwesomeIcon icon={faCheck}/>
                                                                        </button>
                                                                        <button
                                                                            className={styles.actionBtnCancel}
                                                                            onClick={(e) => cancelEditingLesson(e)}
                                                                            title="Anuluj"
                                                                        >
                                                                            <FontAwesomeIcon icon={faTimes}/>
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            className={styles.smallActionBtn}
                                                                            title="Edytuj Zadania"
                                                                            onClick={() => setIsEditModalOpen(true)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faLayerGroup}/>
                                                                        </button>
                                                                        <button className={styles.smallActionBtn}
                                                                                title="Edytuj lekcję"
                                                                                onClick={(e) => startEditingLesson(lesson, e)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faPen}/>
                                                                        </button>
                                                                        <button
                                                                            className={`${styles.smallActionBtn} ${styles.delete}`}
                                                                            onClick={() => handleDeleteLesson(chapter.id, lesson.id)}>
                                                                            <FontAwesomeIcon icon={faTrash}/>
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>

                                                        </div>
                                                    );
                                                })
                                            )
                                            }

                                            <div className={styles.addLessonRow}>
                                                <button className={styles.addLessonBtnInner}
                                                        onClick={() => handleAddLesson(chapter.id)}>
                                                    <FontAwesomeIcon icon={faPlus}/> Dodaj lekcję do rozdziału
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        }
                    )
                    }

                </div>

            </div>

            <Modal
                isOpen={deletingChapter !== null}
                onClose={() => {
                    setDeletingChapter(null)
                }}
                title={"Usuń rozdział"}>
                <div>

                    <div className={styles.deleteConfirmationModal}>

                        <h2> Jesteś pewien, że chcesz usunąć rozdział?</h2>
                        <p> Ta akcja jest nieodwracalna. Wszystkie lekcje z tego rozdziału zostaną BEZPOWROTNIE
                            usunięte.</p>

                        <div className={styles.deleteConfirmationButtons}>
                            <button className={styles.confirmDeleteButton}
                                    onClick={() => confirmDeleteChapter()}>
                                Tak, usuń grupę
                            </button>
                            <button className={styles.cancelDeleteButton}
                                    onClick={() => setDeletingChapter(null)}>
                                Anuluj
                            </button>
                        </div>
                    </div>


                </div>
            </Modal>

            {/*TODO dodać stylowanie do modali*/}

            <Modal
                isOpen={deletingLesson !== null}
                onClose={() => {
                    setDeletingLesson(null)
                }}
                title={"Usuń lekcję"}>
                <div>
                    <div className={styles.deleteConfirmationModal}>
                        <h2> Jesteś pewien, że chcesz usunąć lekcję?</h2>
                        <p> Ta akcja jest nieodwracalna. Wszystkie zadania z tej lekcji zostaną BEZPOWROTNIE usunięte.</p>
                        <div className={styles.deleteConfirmationButtons}>
                            <button className={styles.confirmDeleteButton}
                                    onClick={confirmDeleteLesson}>
                                Tak, usuń lekcję
                            </button>
                            <button className={styles.cancelDeleteButton}
                                    onClick={() => setDeletingLesson(null)}>
                                Anuluj
                            </button>
                        </div>
                    </div>


                </div>
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                }}
                title={"Przejdź do edycji zadań"}>
                <div>

                    <div className={styles.deleteConfirmationModal}>

                        <h2> Jesteś pewien, że chcesz przejść do edycji zadań?</h2>

                        <div className={styles.deleteConfirmationButtons}>
                            <button className={styles.confirmDeleteButton}
                                    onClick={() => handleGoToEditTasks()}>
                                Tak, przejdź do edycji
                            </button>
                            <button className={styles.cancelDeleteButton}
                                    onClick={() => setIsEditModalOpen(false)}>
                                Anuluj
                            </button>
                        </div>
                    </div>


                </div>
            </Modal>


        </div>
    );
}

export default LessonManagement;