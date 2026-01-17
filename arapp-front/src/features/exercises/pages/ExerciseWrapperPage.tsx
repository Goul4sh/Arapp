import styles from "./Renderer.module.css";
import progressBarStyles from "../components/progressBar.module.css"
import ExerciseRenderer from "./ExerciseRenderer.tsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import type {Task} from "../taskTypes.ts";
import ProgressBar from "../components/ProgressBar.tsx";
import {LessonContext} from "../components/LessonContext.tsx";
import SessionSummary from "../components/SessionSummary.tsx";
import ExitModal from "../components/ExitModal.tsx";

type TaskWithId = Task & { id: number };

// Komponent opakowujący komponent ćwiczenia. Pobiera dane na podstawie ID z url.

function ExerciseWrapperPage() {

    const {id, lesson_id, groupId} = useParams();
    const [taskQueue, setTaskQueue] = useState<TaskWithId[]>([]);
    const [currentTask, setCurrentTask] = useState<TaskWithId | null>(null);
    const [totalTasks, setTotalTasks] = useState<number>(0);
    const [completedTasks, setCompletedTasks] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);
    const [mistakeTaskIds, setMistakeTaskIds] = useState<Set<string | number>>(new Set());

    const [taskReferences, setTaskReferences] = useState<any>(null);

    const navigate = useNavigate();

    const location = useLocation();

    const source = location.state?.source || 'unknown';


    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const workingMode = lesson_id
        ? 'lesson-path'
        : groupId
            ? 'word-group'
            : 'exercise';

    const [isExitModalOpen, setIsExitModalOpen] = useState(false);

    const [sessionStats, setSessionStats] = useState({
        correctAnswers: 0,
        incorrectAnswers: 0,
        startTime: Date.now(),
        finalDuration: 0,
        completedTasksCount: 0
    });

    useEffect(() => {
        setLoading(true);

        console.log('Źródło:', source);
        console.log('Tryb:', workingMode);

        if (source === 'lesson-path') {
            api.get(`/api/lessons/${lesson_id}?includeFlashcardInfo=true`, {withCredentials: true})
                .then(resp => {

                    const tasks = resp.data.tasks.map((taskWrapper: any, index: number) => ({
                        ...taskWrapper.data,
                        id: index,
                        references: taskWrapper.references,
                    }));

                    console.log("Oto są nowe taski z lekcji:", tasks);
                    setTaskQueue(tasks);
                    setCurrentTask(tasks[0]);
                    setTotalTasks(tasks.length);
                    const references = resp.data.tasks.map((taskWrapper: any) => taskWrapper.references).flat();
                    setTaskReferences(references);
                    setLoading(false);

                });


        } else if (source === 'word-group') {

            api.get(`/api/task-generation/groups/${groupId}`, {withCredentials: true})
                .then(resp => {

                    const tasks = resp.data;

                    console.log("Taski ktore dostalem to", tasks);


                    const tasksWithIds = tasks.map((task: Task, index: number) => ({
                        ...task,
                        id: index
                    }));

                    console.log("Taski z id to ", tasksWithIds);
                    setTaskQueue(tasksWithIds);
                    setCurrentTask(tasksWithIds[0]);

                    console.log("Obecny task to", tasksWithIds[0]);

                    setTotalTasks(tasksWithIds.length);
                    setLoading(false);

                });

        } else {

            if (!id) return;

            api.get(`/api/exercises/${id}`, {withCredentials: true})
                .then(resp => {

                    const rawTask = resp.data;
                    const taskWithId = {...rawTask, id: 0};

                    setTaskQueue([taskWithId]);
                    setCurrentTask(taskWithId);
                    setTotalTasks(1);
                    setLoading(false);

                });
        }
    }, [groupId, id, lesson_id, source, workingMode]);

    function submitAnswer(answer: boolean) {
        if (!currentTask) return;

        const taskId = currentTask.id;

        if (answer) {

            const previousMistake = mistakeTaskIds.has(taskId);

            const newCorrectAnswers = previousMistake
                ? sessionStats.correctAnswers
                : sessionStats.correctAnswers + 1;

            const newCompletedCount = sessionStats.completedTasksCount + 1;

            setSessionStats(prev => ({
                ...prev,
                correctAnswers: newCorrectAnswers,
                completedTasksCount: newCompletedCount
            }));


            const newQueue = taskQueue.slice(1);
            setTaskQueue(newQueue);
            setCompletedTasks(prev => prev + 1);

            if (newQueue.length > 0) {
                setCurrentTask(newQueue[0]);

            } else {

                finishSession(newCompletedCount, newCorrectAnswers, sessionStats.incorrectAnswers);
            }

        } else {

            const newIncorrectAnswers = sessionStats.incorrectAnswers + 1;


            setSessionStats(prev => ({
                ...prev,
                incorrectAnswers: newIncorrectAnswers
            }));

            setMistakeTaskIds(prev => {
                const newSet = new Set(prev);
                newSet.add(taskId);
                return newSet;
            });

            const [first, ...rest] = taskQueue;
            const newQueue = [...rest, first];
            setTaskQueue(newQueue);
            setCurrentTask(newQueue[0]);

        }

    }


    const finishSession = (completedCount: number, correctAnswers: number, incorrectAnswers: number) => {
        const duration = Math.floor((Date.now() - sessionStats.startTime) / 1000);

        setSessionStats(prev => ({...prev, finalDuration: duration}));

        submitSessionStats(completedCount, correctAnswers, incorrectAnswers, duration);

        setIsSessionFinished(true);
    };


    const submitSessionStats = async (completedCount: number, correctAnswers: number, incorrectAnswers: number, duration: number) => {

        try {
            await Promise.all([
                api.post('/api/statistics', {
                    completedTasks: completedCount,
                    correctAnswers: correctAnswers,
                    incorrectAnswers: incorrectAnswers,
                    durationSeconds: duration,
                    flashcardsReviewed : 0

                }, {withCredentials: true}),

                api.post(`/api/lessons/complete/${lesson_id}`, {}, {withCredentials: true})
            ]);
        } catch (error) {
            console.error('Failed to submit stats:', error);
        }

    };


    const handleExitClick = () => {
        setIsExitModalOpen(true);

    }

    const handleExitCancel = () => {
        setIsExitModalOpen(false);
    }

    const handleExitConfirm = () => {
        setIsExitModalOpen(false);

        switch (source) {
            case 'lesson-path':
                navigate(`/letters`, {replace: true});
                break;
            case 'word-group':
                navigate(`/words`, {replace: true});
                break;
            default:
                navigate("/exercises", {replace: true});

        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isSessionFinished) {
        return (
            <div className={styles.exercisePage}>
                <SessionSummary
                    correct={sessionStats.correctAnswers}
                    incorrect={sessionStats.incorrectAnswers}
                    duration={sessionStats.finalDuration}
                    onExit={handleExitConfirm}
                    taskReferences={taskReferences}
                />
            </div>
        );
    }

    if (!currentTask) {
        return <div>Task not found. Error</div>;
    }


    return (
        <div>

            <div className={styles.exercisePage}>

                <div className={progressBarStyles.topBar}>

                    <div className={progressBarStyles.exitButton}>
                        <button onClick={handleExitClick}>
                            X
                        </button>
                    </div>

                    <ProgressBar progress={progress}/>

                </div>

                <div className={styles.exerciseContainer}>
                    <LessonContext.Provider value={{submitAnswer}}>

                        <ExerciseRenderer currentTask={currentTask}/>
                    </LessonContext.Provider>
                </div>

            </div>

            <ExitModal isOpen={isExitModalOpen}
                       onClose={handleExitCancel}
                       onConfirm={handleExitConfirm}/>

        </div>
    )
}

export default ExerciseWrapperPage;