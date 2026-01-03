import styles from "./adminGlobalStyles.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {
    faArrowDown,
    faArrowUp,
    faChevronDown,
    faChevronRight,
    faFolderOpen, faLayerGroup, faListCheck, faPen,
    faPlus, faTrash
} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";


interface Lesson {
    id: number;
    title: string;
    description: string;
    taskCount: number;
    isPublished: boolean;
}

interface Chapter {
    id: number;
    title: string;
    description: string;
    orderIndex: number;
    lessons: Lesson[]; // Zagnieżdżone lekcje
}

const MOCK_CHAPTERS: Chapter[] = [
    {
        id: 101,
        title: "Rozdział 1: Podstawy Pisma",
        description: "Nauka alfabetu i łączenia liter.",
        orderIndex: 1,
        lessons: [
            {id: 1, title: "Litera Alif i Ba", description: "Wstęp do liter.", taskCount: 5, isPublished: true},
            {id: 2, title: "Litera Ta i Tha", description: "Kropki mają znaczenie.", taskCount: 8, isPublished: true},
        ]
    },
    {
        id: 102,
        title: "Rozdział 2: Rodzina",
        description: "Słownictwo domowe.",
        orderIndex: 2,
        lessons: [
            {id: 3, title: "Członkowie rodziny", description: "Mama, Tata, Brat.", taskCount: 12, isPublished: false},
        ]
    }
];

function LessonManagement() {
    const [chapters, setChapters] = useState<Chapter[]>(MOCK_CHAPTERS);

    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([101]));


    const toggleChapter = (chapterId: number) => {
        setExpandedChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) newSet.delete(chapterId);
            else newSet.add(chapterId);
            return newSet;
        });
    };

    const deleteChapter = (id: number) => {
        if (window.confirm("Uwaga! Usunięcie rozdziału spowoduje usunięcie wszystkich jego lekcji. Kontynuować?")) {
            setChapters(prev => prev.filter(c => c.id !== id));
        }
    };

    const deleteLesson = (chapterId: number, lessonId: number) => {
        if (window.confirm("Usunąć lekcję?")) {
            setChapters(prev => prev.map(ch => {
                if (ch.id !== chapterId) return ch;
                return {...ch, lessons: ch.lessons.filter(l => l.id !== lessonId)};
            }));
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

    return (
        <div className={styles.adminPageContainer}>
            <div className={styles.courseContentContainer}>

                <div className={styles.headerSection}>
                    <div>
                        <h1 className={styles.pageTitle}>Struktura Kursu</h1>
                        <p className={styles.pageSubtitle}>Zarządzaj rozdziałami i lekcjami.</p>
                    </div>
                    <div className={styles.headerButtons}>
                        <button className={`${styles.createButton} ${styles.secondaryBtn}`}>
                            <FontAwesomeIcon icon={faFolderOpen}/> Nowy Rozdział
                        </button>
                        {/*<button className={styles.createButton}>*/}
                        {/*    <FontAwesomeIcon icon={faPlus}/> Nowa Lekcja*/}
                        {/*</button>*/}
                    </div>
                </div>

                <div className={styles.listContainer}>

                    {chapters.map((chapter, chIndex) => (
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
                                    <div>
                                        <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                                        <span className={styles.chapterMeta}>Liczba lekcji: {chapter.lessons.length}</span>
                                    </div>
                                </div>

                                <div className={styles.chapterActions} onClick={e => e.stopPropagation()}>
                                    <button onClick={() => moveChapter(chIndex, 'up')} disabled={chIndex === 0}
                                            className={styles.iconBtn}>
                                        <FontAwesomeIcon icon={faArrowUp}/>
                                    </button>
                                    <button onClick={() => moveChapter(chIndex, 'down')}
                                            disabled={chIndex === chapters.length - 1} className={styles.iconBtn}>
                                        <FontAwesomeIcon icon={faArrowDown}/>
                                    </button>
                                    <div className={styles.verticalDivider}></div>
                                    <button className={styles.actionBtnSecondary} title="Edytuj rozdział">
                                        <FontAwesomeIcon icon={faPen}/></button>
                                    <button className={styles.actionBtnDelete} onClick={() => deleteChapter(chapter.id)}
                                            title="Usuń Rozdział"><FontAwesomeIcon icon={faTrash}/></button>
                                </div>
                            </div>

                            {expandedChapters.has(chapter.id) && (
                                <div className={styles.lessonsList}>
                                    {chapter.lessons.length === 0 ? (
                                        <div className={styles.emptyChapter}>Ten rozdział jest pusty. Dodaj pierwszą
                                            lekcję.</div>
                                    ) : (
                                        chapter.lessons.map((lesson, lIndex) => (
                                            <div key={lesson.id} className={styles.lessonRow}>

                                                <div className={styles.lessonStatusIndicator}>
                                                    <div
                                                        className={`${styles.dot} ${lesson.isPublished ? styles.published : styles.draft}`}></div>
                                                </div>

                                                <div className={styles.lessonInfo}>
                                                    <h4 className={styles.lessonTitle}>
                                                        {lIndex + 1}. {lesson.title}
                                                    </h4>
                                                    <div className={styles.lessonMeta}>
                                                        <span title="Liczba zadań"><FontAwesomeIcon
                                                            icon={faListCheck}/> {lesson.taskCount}</span>
                                                        {!lesson.isPublished &&
                                                            <span className={styles.draftTag}>SZKIC</span>}
                                                    </div>
                                                </div>

                                                <div className={styles.lessonActions}>
                                                    <Link to={`/admin/lessons/${lesson.id}/tasks`}
                                                          className={styles.smallActionBtn} title="Edytuj Zadania">
                                                        <FontAwesomeIcon icon={faLayerGroup}/>
                                                    </Link>
                                                    <button className={styles.smallActionBtn} title="Edytuj lekcję">
                                                        <FontAwesomeIcon icon={faPen}/>
                                                    </button>
                                                    <button className={`${styles.smallActionBtn} ${styles.delete}`}
                                                            onClick={() => deleteLesson(chapter.id, lesson.id)}>
                                                        <FontAwesomeIcon icon={faTrash}/>
                                                    </button>
                                                </div>

                                            </div>
                                        ))
                                    )}

                                    <div className={styles.addLessonRow}>
                                        <button className={styles.addLessonBtnInner}>
                                            <FontAwesomeIcon icon={faPlus}/> Dodaj lekcję do rozdziału
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}

export default LessonManagement;