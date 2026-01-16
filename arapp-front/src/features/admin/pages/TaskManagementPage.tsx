import styles from "./adminGlobalStyles.module.css"
import localStyles from "./taskManagement.module.css"
import * as TaskTypes from "../../exercises/taskTypes.ts"
import {useEffect, useState} from "react"
import api from "../../auth/api.ts";
import type {Chapter} from "../../writing/writingTypes.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronDown, faChevronRight,
    faListCheck, faPlus, faTrash,
} from "@fortawesome/free-solid-svg-icons";
import type {Task} from "../../exercises/taskTypes.ts";
import {TaskPreviewRenderer} from "./components/taskCreation/TaskPreviewRenderer.tsx";
import {TaskCreator} from "./components/taskCreation/TaskCreator.tsx"
import VocabularyModal from "./components/modals/VocabularyModal.tsx";

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

type VocabularyItem = {

    original: string;
    lemma: string,
    partOfSpeech: string,
    root: string,
    // diacritic: string,
    // String definition,
    wordId: number,
    translation: string
    isIncluded: boolean;

}

//
// type VocabularyItemToSave = {
//     original: string;
//     lemma: string,
//     partOfSpeech: string,
//     root: string,
//     wordId: number,
//     translation: string
//     endIndex: number;
//     startIndex: number;
//
// }


const AVAILABLE_TASK_TYPES = [
    {type: 'choose-one', label: 'Wybierz jedno'},
    {type: 'multiple-choice', label: 'Wielokrotny wybór'},
    {type: 'fill-in-the-blank', label: 'Uzupełnij lukę'},
    {type: 'match-pairs', label: 'Dopasuj pary'},
    {type: 'morphology-form', label: 'Morfologia - Formy liter'},
    {type: 'morphology-parts', label: 'Morfologia - Części słowa'},
    {type: 'theory', label: 'Teoria'},
    {type: 'translate', label: 'Tłumaczenie'},
    {type: 'writing-assisted', label: 'Pisanie wspomagane'}
];

function TaskManagementPage() {
    const [selectedTaskType, setSelectedTaskType] = useState<string>("")
    const [taskData, setTaskData] = useState<Partial<TaskTypes.Task> | null>(null)
    const [chapters, setChapters] = useState<LocalChapter[]>([]);

    const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);

    const [lessonTasks, setLessonTasks] = useState<Record<number, TaskTypes.Task[]>>({});
    const [loadingTasks, setLoadingTasks] = useState<Set<number>>(new Set());

    const [selectedTaskByLesson, setSelectedTaskByLesson] = useState<Record<number, Task | null>>({});

    const [addingTaskToLessonId, setAddingTaskToLessonId] = useState<number | null>(null);

    const [isVocabAnalysisOpen, setIsVocabAnalysisOpen] = useState(false);
    const [taskVocabAnalysis, setTaskVocabAnalysis] = useState<VocabularyItem[] | []>([]);
    const [pendingTaskData, setPendingTaskData] = useState<Partial<TaskTypes.Task> | null>(null);


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
                            taskCount: lesson.taskCount,
                            isPublished: lesson.isPublished
                        }))
                    }));

                    setChapters(chaptersWithNumericIds);
                });
        } catch (error) {
            console.error("Błąd podczas ładowania rozdziałów:", error);
        }

    }, []);


    const fetchLessonTasks = async (lessonId: number) => {


        if (expandedLessonId === lessonId) {
            setExpandedLessonId(null);
            return;
        }

        if (lessonTasks[lessonId]) {
            setExpandedLessonId(lessonId);
            return;
        }

        setLoadingTasks(prev => new Set(prev).add(lessonId));

        try {

            const response = await
                api.get(`/api/lessons/${lessonId}`,
                    {withCredentials: true}).then()

            console.log("to dostałem z lekcji:", response.data);

            const flatData = response.data.tasks.map((item: { id: number; data?: Partial<TaskTypes.Task> }) => {
                if (!item.data) return {id: item.id};

                return {
                    ...item.data,
                    id: item.id
                };
            });

            console.log("Po zmianie", flatData)

            setLessonTasks(prev => ({
                ...prev,
                [lessonId]: flatData
            }));

            console.log("To otrzymałem o lekcji:", response.data.tasks);

            setExpandedLessonId(lessonId)

        } catch (error) {

            console.error(`Błąd podczas ładowania zadań dla lekcji ${lessonId}:`, error);
        } finally {

            setLoadingTasks(prev => {
                const newSet = new Set(prev);
                newSet.delete(lessonId);
                return newSet;

            });
        }
    }

    const handleCancelEdit = () => {
        const currentLessonId = expandedLessonId;
        if (!currentLessonId) return;

        setSelectedTaskByLesson(prev => ({...prev, [currentLessonId]: null}));
        setTaskData(null);
        setSelectedTaskType("");
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
            const newLesson: LocalLesson = response.data;

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
                                taskCount: newLesson.taskCount,
                                isPublished: newLesson.isPublished
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
    const handleAddTask = (lessonId: number, type: string) => {

        const newTask: Partial<TaskTypes.Task> = {
            id: 0,
            type: type,
            description: "",
        };

        setSelectedTaskByLesson(prev => ({...prev, [lessonId]: newTask as Task}));

        setTaskData(newTask);
        setSelectedTaskType(type);

        setAddingTaskToLessonId(null);
    }

    // const handleSaveTask = async (taskData: Partial<TaskTypes.Task>) => {
    //
    //     const currentLessonId = expandedLessonId;
    //     if (!currentLessonId || !taskData) return;
    //
    //
    //     try {
    //
    //         const isUpdate = taskData.id && true && taskData.id > 0;
    //
    //         if (isUpdate) {
    //
    //             console.log("Wysyłam do aktualizacji:", taskData);
    //
    //             // Aktualizacja istniejącego zadania
    //             const response = await api.patch(`/api/exercises/${taskData.id}`, taskData, {withCredentials: true});
    //             console.log("Zaktualizowano zadanie:", response.data);
    //
    //             const savedTask = response.data;
    //
    //             setLessonTasks(prev => ({
    //                 ...prev,
    //                 [currentLessonId]: prev[currentLessonId].map(t =>
    //                     t.id === savedTask.id ? savedTask : t
    //                 )
    //             }));
    //
    //         } else {
    //
    //             console.log("Wysylam do zapisu:", taskData);
    //
    //             const response = await api.post(`/api/exercises`, taskData, {withCredentials: true});
    //             console.log("To dostalem z backendu pododaniu taska nowego", response.data)
    //             const savedTask = response.data;
    //
    //             await api.patch(`/api/lessons/${currentLessonId}/exercises/${savedTask.id}`, {withCredentials: true});
    //
    //             const flatTask = savedTask.taskData ? {...savedTask.taskData, id: savedTask.id} : {id: savedTask.id};
    //
    //             setLessonTasks(prev => ({
    //                 ...prev,
    //                 [currentLessonId]: [...(prev[currentLessonId] || []), flatTask]
    //             }));
    //
    //         }
    //
    //
    //         setSelectedTaskByLesson(prev => ({...prev, [currentLessonId]: null}));
    //         setTaskData(null);
    //         setTaskVocabAnalysis([]);
    //         alert("Zapisano pomyślnie!");
    //
    //
    //     } catch (error) {
    //         console.error("Błąd podczas zapisywania zadania:", error);
    //
    //     }
    //
    // }


    // Funkcje do vocab modal

    const handleCloseVocabularyModal = () => {
        setIsVocabAnalysisOpen(false);
        setPendingTaskData(null);
        setTaskVocabAnalysis([]);
    }

    const extractTextForAnalysis = (taskData: Partial<TaskTypes.Task>): string => {
        if (!taskData.type) return taskData.description || "";

        switch (taskData.type) {
            case 'choose-one':
            case 'multiple-choice':
            case 'fill-in-the-blank': {
                const task = taskData as Partial<TaskTypes.FillInTheBlankTaskType>;
                return `${task.sentenceWithBlank || ''}`;
            }
            case 'match-pairs':
            case 'translate': {
                const task = taskData as Partial<TaskTypes.TranslateTaskType>;
                return `${task.textToTranslate || ''}`;
            }

            //TODO jesli reszta zadziala - dodać tu inne przypadki
            case 'writing-assisted':
            case 'theory':
            case 'morphology-form':
            case 'morphology-parts':
            default:
                return taskData.description || "";
        }
    };

    const analyzeVocabulary = async (taskData: Partial<TaskTypes.Task>) => {

        try {

            const textForAnalysis = extractTextForAnalysis(taskData);
            // const payload = {text: taskData.description || ""};
            const response = await
                api.post('/api/admin/dictionary/analyze', {text:textForAnalysis },
                    {withCredentials: true});

            console.log("Otrzymana analiza słownictwa:", response.data);
            // setTaskVocabAnalysis(response.data);
            return response.data;

        } catch (error) {
            console.error("Błąd podczas analizy słownictwa:", error);
        }
    }

    const handleAnalyzeVocabularyButtonClicked = async (taskData: Partial<TaskTypes.Task>) => {

        setPendingTaskData(taskData);
        const vocabulary = await analyzeVocabulary(taskData);
        setTaskVocabAnalysis(vocabulary)
        setIsVocabAnalysisOpen(true)

    }
    // Skopiowałem połowę funkcji z saveTask
    const handleVocabularyConfirmed = async (confirmedVocabulary: VocabularyItem[]) => {

        // console.log("Takie items otrzymalem z modal:", confirmedVocabulary);

        const currentLessonId = expandedLessonId;
        if (!currentLessonId || !pendingTaskData) return;

        const wordsToSave = confirmedVocabulary.filter(item => item.isIncluded);

        // console.log("Po przefiltrowaniu jedynie isIncluded zostały mi takie słowa do przesłania:", wordsToSave);

        const fullPayload = {
            taskData: pendingTaskData,
            linkedVocabulary: {
                words: wordsToSave
            }
        };

        try {

            console.log("Wysyłam pełny payload do zapisu:", fullPayload);

            const response = await api.post('/api/exercises/with-vocab', fullPayload, {withCredentials: true});


            alert("Zadanie i słownictwo zapisane!");
            console.log("To dostalem z backendu pododaniu taska nowego", response.data)
            const savedTask = response.data;

            await api.patch(`/api/lessons/${currentLessonId}/exercises/${savedTask.id}`, {withCredentials: true});

            const flatTask = savedTask.taskData ? {...savedTask.taskData, id: savedTask.id} : {id: savedTask.id};

            setLessonTasks(prev => ({
                ...prev,
                [currentLessonId]: [...(prev[currentLessonId] || []), flatTask]
            }));


            setIsVocabAnalysisOpen(false);
            setPendingTaskData(null);
            setTaskVocabAnalysis([]);

        } catch (error) {
            console.error("Błąd zapisu zadania ze słownictwem:", error);
            alert("Wystąpił błąd podczas zapisu.");
        }
    };

    const handleDeleteTask = async (lessonId: number, taskId: number) => {
//TODO tudaj dodac popup inny niz alertxd
        alert("Jesteś pewien, że chcesz usunąć to zadanie?");

        try {
            await api.delete(`/api/exercises/${taskId}`, {withCredentials: true});

            setLessonTasks(prev => ({
                ...prev,
                [lessonId]: prev[lessonId].filter(task => task.id !== taskId)
            }));

            setSelectedTaskByLesson(prev => ({
                ...prev,
                [lessonId]: null
            }));

            setTaskData(null);
            setSelectedTaskType("");

            alert("Zadanie usunięte pomyślnie!");
        } catch (error) {
            console.error("Błąd podczas usuwania zadania:", error);
        }
    }

    return (
        <div className={styles.adminPageContainer}>
            <div className={styles.courseContentContainer}>

                <div className={styles.headerSection}>
                    <div>
                        <h1 className={styles.pageTitle}>Kreator lekcji i zadań</h1>
                    </div>
                </div>

                <div className={styles.listContainer}>
                    {chapters.map((chapter) => (
                        <div key={chapter.id} className={styles.chapterCard}>

                            <div className={styles.chapterHeader}>
                                <div className={styles.chapterTitleSection}>
                                    <div className={styles.titleWrapper}>
                                        <div className={styles.chapterHeaderContent}>
                                            <div className={styles.chapterHeaderText}>
                                                <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                                                <span>{chapter.description}</span>
                                            </div>
                                            <span className={styles.chapterMeta}>
                                            Liczba lekcji: {chapter.lessons.length}
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lista lekcji */}
                            <div className={styles.lessonsList}>
                                {chapter.lessons.map((lesson, lIndex) => (
                                    <div key={lesson.id} className={localStyles.lessonContainer}>

                                        <div
                                            className={styles.lessonRow}
                                            onClick={() => fetchLessonTasks(lesson.id)}
                                        >
                                            <div className={styles.lessonStatusIndicator}>
                                            <span className={styles.chevronIcon}>
                                                <FontAwesomeIcon
                                                    icon={expandedLessonId === lesson.id ? faChevronDown : faChevronRight}
                                                />
                                            </span>
                                                <div
                                                    className={`${styles.dot} ${lesson.isPublished ? styles.published : styles.draft}`}
                                                />
                                            </div>

                                            <div className={styles.lessonInfo}>
                                                <h4 className={styles.lessonTitle}>
                                                    {lIndex + 1}. {lesson.title}
                                                </h4>
                                                <div className={styles.lessonMeta}>
                                                <span title="Liczba zadań">
                                                    <FontAwesomeIcon icon={faListCheck}/> {lesson.taskCount}
                                                </span>

                                                </div>
                                            </div>
                                        </div>

                                        {/*  3 kolumny pod lekcją */}
                                        {expandedLessonId === lesson.id && (
                                            <div className={localStyles.expandedLessonContent}>

                                                {/* Lista zadań */}
                                                <div className={localStyles.tasksColumn}>
                                                    {loadingTasks.has(lesson.id) ? (
                                                        <div className={localStyles.loadingTasks}>
                                                            Ładowanie zadań...
                                                        </div>
                                                    ) : lessonTasks[lesson.id]?.length === 0 ? (
                                                        <div className={localStyles.noTasks}>
                                                            Brak zadań w tej lekcji.
                                                        </div>
                                                    ) : (
                                                        lessonTasks[lesson.id]?.map((task, index) => {

                                                                return (

                                                                    <div
                                                                        key={task.id}
                                                                        className={`${localStyles.taskRow} ${
                                                                            selectedTaskByLesson[lesson.id]?.id === task.id
                                                                                ? localStyles.selected
                                                                                : ''
                                                                        }`}
                                                                        onClick={() => {
                                                                            setSelectedTaskByLesson(prev => ({
                                                                                ...prev,
                                                                                [lesson.id]: task
                                                                            }))
                                                                            setTaskData(task)
                                                                            setSelectedTaskType(task.type);
                                                                        }
                                                                        }
                                                                    >
                                                                        <div className={localStyles.taskInfo}>
                                                                <span className={localStyles.taskNumber}>
                                                                    {index + 1}.
                                                                </span>
                                                                            <span className={localStyles.taskType}>
                                                                    {task.type}
                                                                </span>
                                                                        </div>
                                                                        <div className={localStyles.taskActions}>
                                                                            <button
                                                                                className={styles.smallActionBtn}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleDeleteTask(lesson.id, task.id);
                                                                                    // TODO: Delete logic
                                                                                }}
                                                                            >
                                                                                <FontAwesomeIcon icon={faTrash}/>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        )
                                                    )}


                                                    {addingTaskToLessonId === lesson.id ? (
                                                        <div className={localStyles.typeSelectionContainer}>
                                                            <p className={localStyles.typeSelectionHeader}> Wybierz typ
                                                                zadania</p>
                                                            <div className={localStyles.typeButtonsContainer}>
                                                                {AVAILABLE_TASK_TYPES.map((item) => (
                                                                    <button
                                                                        key={item.type}
                                                                        className={localStyles.typeButton}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleAddTask(lesson.id, item.type);
                                                                        }}
                                                                    >
                                                                        {item.label}
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            <button
                                                                className={localStyles.cancelTypeSelectionBtn}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAddingTaskToLessonId(null);
                                                                }}
                                                            >
                                                                Anuluj
                                                            </button>
                                                        </div>

                                                    ) : (

                                                        <button className={styles.addLessonBtnInner}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAddingTaskToLessonId(lesson.id);
                                                                }}
                                                        >
                                                            <FontAwesomeIcon icon={faPlus}/> Dodaj zadanie
                                                        </button>

                                                    )}


                                                </div>

                                                {/*FORMULARZ*/}
                                                <div className={localStyles.editorColumn}>
                                                    {selectedTaskByLesson[lesson.id] ? (
                                                        <div className={localStyles.taskEditor}>

                                                            <TaskCreator
                                                                key={selectedTaskByLesson[lesson.id]?.id}
                                                                task={selectedTaskByLesson[lesson.id]!}


                                                                // onSave={handleSaveTask}
                                                                onSave={handleAnalyzeVocabularyButtonClicked}
                                                                onCancel={handleCancelEdit}
                                                                onDataChange={setTaskData}
                                                            />

                                                        </div>
                                                    ) : (
                                                        <div className={localStyles.emptyState}>
                                                            <p>Wybierz zadanie aby edytować</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/*PREVIEW*/}
                                                <div className={localStyles.previewColumn}>
                                                    {selectedTaskByLesson[lesson.id] ? (
                                                        <div className={styles.previewBox}>

                                                            <div className={styles.previewColumn}>

                                                                <div className={styles.previewBox}>

                                                                    {taskData && <TaskPreviewRenderer
                                                                        taskType={selectedTaskType}
                                                                        taskData={taskData}
                                                                    />}
                                                                </div>

                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={localStyles.emptyState}>
                                                            <p>Podgląd pojawi się po wybraniu zadania</p>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className={localStyles.addLessonRow}>
                                    <button className={styles.addLessonBtnInner}
                                            onClick={() => handleAddLesson(chapter.id)}>
                                        <FontAwesomeIcon icon={faPlus}/> Dodaj lekcję do rozdziału
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <VocabularyModal isOpen={isVocabAnalysisOpen}
                             onClose={handleCloseVocabularyModal}
                // onSave={handleSaveTask}
                             onSave={handleVocabularyConfirmed}
                             vocabularyItems={taskVocabAnalysis}/>

        </div>
    );

    //  Oprócz tego powinna byc możliwość zmienienia kolejności zadań w lekcji

}

export default TaskManagementPage