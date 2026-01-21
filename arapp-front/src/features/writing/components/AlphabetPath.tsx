import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import styles from "../writing.module.css"
import type {Chapter, ProcessedChapter, ProcessedLesson} from "../writingTypes.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faX} from "@fortawesome/free-solid-svg-icons";
import api from "../../auth/api.ts";


//TODO dokonczyc widok
function AlphabetPath() {

    const navigate = useNavigate();

    const [activeChapter, setActiveChapter] = useState<ProcessedChapter | null>(null);
    const [chaptersData, setChaptersData] = useState<ProcessedChapter[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const [chaptersResp, completeResp] = await Promise.all([
                    api.get<Chapter[]>('/api/chapters/published', {withCredentials: true}),
                    api.get<number[]>('/api/lessons/complete', {withCredentials: true})

                ]);
                console.log(chaptersResp.data);
                console.log(completeResp.data);

                const rawChapterData = chaptersResp.data.filter(ch => Array.isArray(ch.lessons) && ch.lessons.length > 0);
                const completedIds = completeResp.data;

                let previousLessonCompleted = true;

                const processedChapters: ProcessedChapter[] = rawChapterData.map((chapter) => {

                    const processedLessons: ProcessedLesson[] = chapter.lessons
                        .map((lesson) => {
                            const orderIndex = Number(lesson.orderIndex ?? 0);
                            const isCompleted = completedIds.includes(Number(lesson.id));
                            const isLocked = !previousLessonCompleted;

                            if (!isCompleted) {
                                previousLessonCompleted = false;
                            }

                            return {
                                ...lesson,
                                orderIndex,
                                isCompleted,
                                isLocked
                            };
                        })
                        .sort((a, b) => a.orderIndex - b.orderIndex);

                    const chapterOrderIndex = Number(chapter.orderIndex ?? 0);
                    const isChapterLocked = processedLessons.length > 0 && processedLessons[0].isLocked;

                    return {
                        ...chapter,
                        orderIndex: chapterOrderIndex,
                        lessons: processedLessons,
                        isLocked: isChapterLocked
                    };
                });

                processedChapters.sort((a, b) => a.orderIndex - b.orderIndex);

                setChaptersData(processedChapters);

                if (activeChapter) {
                    const found = processedChapters.find(c => c.id === activeChapter.id);
                    setActiveChapter(found || processedChapters[0]);
                } else {
                    setActiveChapter(processedChapters[0]);
                }

            } catch (error) {
                console.error("Błąd pobierania lekcji", error);
                setChaptersData([]);

            } finally {
                setIsLoading(false);
            }

        };
        fetchLessons();
    }, []);


    if (isLoading) return <div className={styles.loading}>Ładowanie...</div>;

    const handleChapterSelect = (chapter: ProcessedChapter) => {
        if (!chapter.isLocked) {
            setActiveChapter(chapter);
        }
    }

    const handleLessonStart = (lesson: ProcessedLesson) => {
        if (!lesson.isLocked) {
            navigate(`/lessons/${lesson.id}`, {state: {source: 'lesson-path'}}
            );
        }
    };


    if (!activeChapter) {


        return <div className={styles.loading}>Ładowanie rozdziałów...</div>;
    }

    return (
        <div className={styles.pathContainer}>


            <div className={styles.pathLeftColumn}>
                <h2 className={styles.listTitle}> Mapa nauki</h2>
                <div className={styles.chapterList}>

                    {chaptersData.map((chap) => (
                        <div
                            key={chap.id}
                            className={`
                                ${styles.chapterItem} 
                                ${activeChapter.id === chap.id ? styles.selectedChapterItem : ''} 
                                ${chap.isLocked ? styles.lockedChapterItem : ''}`}
                            onClick={() => handleChapterSelect(chap)}
                        >
                            <div className={styles.chapterInfo}>
                                <h3 className={styles.chapterTitle}>{chap.title} {chap.isLocked &&
                                    <FontAwesomeIcon icon={faX}/>}</h3>
                                <p className={styles.chapterDescription}>{chap.description}</p>
                            </div>
                        </div>)
                    )}
                </div>
            </div>

            <div className={styles.separator}></div>


            <div className={styles.pathRightColumn}>

                <div className={styles.stickyContentHeader}>

                    <div className={styles.spacerHeader}></div>

                    <div className={styles.stickyContent}>
                        <h1>{activeChapter.title}</h1>
                        <p>{activeChapter.description}</p>
                        <p className={styles.progressText}>
                            Ukończone
                            lekcje: {activeChapter.lessons.filter(l => l.isCompleted).length}/{activeChapter.lessons.length}
                        </p>
                    </div>

                </div>

                {/*Lista lekcji*/}
                <div className={styles.scrollableLessonList}>

                    {activeChapter.lessons.map((lesson, index) => {

                        const isLastLesson = index === activeChapter.lessons.length - 1;

                        return (
                            <div key={lesson.id} className={`${styles.lessonRow}`}>

                                <div
                                    className={`
                                ${styles.dotColumn}
                                ${(lesson.isCompleted && !isLastLesson) ? styles.dotColumnCompleted : ''}
                                ${isLastLesson ? styles.noLine : ''}
                                `}>

                                    <div className={`
                                    ${styles.lessonDot}
                                    ${lesson.isCompleted ? styles.dotCompleted : ''}
                                    ${!lesson.isLocked && !lesson.isCompleted ? styles.dotActive : ''}
                                `}>
                                        {lesson.isCompleted ? <FontAwesomeIcon icon={faCheck}/>
                                            : (index + 1)}
                                    </div>
                                </div>

                                <div className={styles.cardColumn}>
                                    <div
                                        className={`
                                        ${styles.lessonCard}
                                        ${lesson.isLocked ? styles.cardLocked : ''}
                                        ${lesson.isCompleted ? styles.cardCompleted : ''}
                                    `}
                                    >
                                        <div className={styles.lessonLetters}>{lesson.icon}</div>
                                        <div className={styles.lessonDetails}>
                                            <h4>{lesson.title}</h4>
                                            <p>{lesson.description}</p>
                                        </div>
                                        <div className={styles.cardAction}>
                                            {!lesson.isLocked ? (
                                                <button className={styles.lessonButton}
                                                        onClick={() => handleLessonStart(lesson)}>
                                                    {lesson.isCompleted ? 'Powtórz' : 'Start'}

                                                </button>
                                            ) : (
                                                <button className={` ${styles.lessonButton} ${styles.buttonLocked}`}
                                                        disabled={lesson.isLocked}
                                                >Zablokowane
                                                </button>

                                            )}


                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <div className={styles.bottomSpacer}></div>
                </div>

            </div>
        </div>
    )
}

export default AlphabetPath;