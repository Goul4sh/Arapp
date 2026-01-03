import { MockLessonWrapper } from "./MockLessonWrapper.tsx";
import * as TaskTypes from "../../../../exercises/taskTypes.ts";
import ChooseOneTask from "../../../../exercises/components/tasks/ChooseOneTask.tsx";
import MultipleChoiceTask from "../../../../exercises/components/tasks/MultipleChoiceTask.tsx";
import FillInTheBlankTask from "../../../../exercises/components/tasks/FillInTheBlankTask.tsx";
import MatchPairsTask from "../../../../exercises/components/tasks/MatchPairsTask.tsx";
import MorphologyFormTask from "../../../../exercises/components/tasks/MorphologyFormTask.tsx";
import MorphologyPartsTask from "../../../../exercises/components/tasks/MorphologyPartsTask.tsx";
import TheoryTask from "../../../../exercises/components/tasks/TheoryTask.tsx";


interface Props {
    taskType: string;
    taskData: Partial<TaskTypes.Task>;
}

export const TaskPreviewRenderer = ({ taskType, taskData }: Props) => {

    if (!taskData || !taskType) {
        return <div style={{ color: '#999', textAlign: 'center', marginTop: '50%' }}>Wybierz typ zadania, aby zobaczyć podgląd.</div>;
    }

    const renderContent = () => {
        switch (taskType) {
            case "choose-one":{

                const data = taskData as Partial<TaskTypes.ChooseOneTaskType>;

                 const chooseOneTask: TaskTypes.ChooseOneTaskType = {
                    id: 0,
                    type: "choose-one",
                    description: data.description || "Podgląd pytania...",
                    answer: data.answer || "Poprawna",
                    decoyAnswers: data.decoyAnswers?.filter((d: string) => d !== "") || ["Zmyłka 1", "Zmyłka 2"]
                };
                return <ChooseOneTask task={chooseOneTask} />; }

            case "multiple-choice":{
                const data = taskData as Partial<TaskTypes.MultipleChoiceTaskType>;

                const multipleChoiceTask: TaskTypes.MultipleChoiceTaskType = {
                    id: 0,
                    type: "multiple-choice",
                    description: data.description || "Podgląd pytania...",
                    answers: data.answers?.length ? data.answers.filter((a: string) => a !== "") : ["Poprawna 1", "Poprawna 2"],
                    decoyAnswers: data.decoyAnswers?.filter((d: string) => d !== "") || ["Zmyłka 1", "Zmyłka 2"]
                };
                return <MultipleChoiceTask task={multipleChoiceTask} />;}

            case 'fill-in-the-blank':{

                const data = taskData as Partial<TaskTypes.FillInTheBlankTaskType>;

                const fillInTheBlankTask: TaskTypes.FillInTheBlankTaskType = {
                    id: 0,
                    type: "fill-in-the-blank",
                    description: data.description || "Podgląd pytania...",
                    sentenceWithBlank: data.sentenceWithBlank || "",
                    answer: data.answer || "Poprawna odpowiedź"
                };

                return <FillInTheBlankTask task={fillInTheBlankTask}/>;}


            case 'match-pairs':{
                const data = taskData as Partial<TaskTypes.MatchPairsTaskType>;

                const matchPairsTask: TaskTypes.MatchPairsTaskType = {
                    id: 0,
                    type: "match-pairs",
                    description: data.description || "Podgląd pytania...",
                    pairs: data.pairs || { "Element 1": "Para 1", "Element 2": "Para 2" }
                };


                return <MatchPairsTask task={matchPairsTask}/>;}

            case "morphology-form":{
                const data = taskData as Partial<TaskTypes.MorphologyFormTaskType>;

                const morphologyFormTask: TaskTypes.MorphologyFormTaskType = {
                    id: 0,
                    type: "morphology-form",
                    description: data.description || "Podgląd pytania...",
                    question: data.question || "Ułóż formę morfologiczną z podanych części:",
                    steps: data.steps?.length ? data.steps : [
                        {
                            stepIndex: 0,
                            correctId: "option1",
                            options: [
                                { id: "option1", content: "كـ", isCorrect: true },
                                { id: "option2", content: "مـ", isCorrect: false }
                            ]
                        },
                        {
                            stepIndex: 1,
                            correctId: "option3",
                            options: [
                                { id: "option3", content: "تـ", isCorrect: true },
                                { id: "option4", content: "بـ", isCorrect: false }
                            ]
                        }
                    ]
                };


                return <MorphologyFormTask task={morphologyFormTask}/>;}

            case "morphology-parts":{
                const data = taskData as Partial<TaskTypes.MorphologyPartsTaskType>;

                const morphologyPartsTask: TaskTypes.MorphologyPartsTaskType = {
                    id: 0,
                    type: "morphology-parts",
                    question: data.question || "Ułóż części morfologiczne w poprawnej kolejności:",
                    description: data.description || "Podgląd pytania...",
                    correctOrder: data.correctOrder?.length ? data.correctOrder : ["segment1", "segment2", "segment3"],
                    segments: data.segments?.length ? data.segments : [
                        { id: "segment1", content: "كـ", form: "prefix" },
                        { id: "segment2", content: "تـ", form: "infix" },
                        { id: "segment3", content: "مـ", form: "suffix" }
                    ],
                    decoySegments: data.decoySegments?.length ? data.decoySegments : [
                        { id: "decoy1", content: "بـ", form: "prefix" },
                        { id: "decoy2", content: "دـ", form: "infix" }
                    ],

                };


                return <MorphologyPartsTask task={morphologyPartsTask}/>;}

            case "theory":{
                const data = taskData as Partial<TaskTypes.TheoryTaskType>;

                const theoryTask: TaskTypes.TheoryTaskType = {
                    id: 0,
                    type: "theory",
                    description: data.description || "Podgląd pytania...",
                    content: data.content || "<h2>Podgląd treści teoretycznej</h2><p>Tu znajduje się przykładowa treść teoretyczna zadania.</p>"
                };


                return <TheoryTask task={theoryTask}/>;}




            default:
                return <div>Nieznany typ zadania do podglądu</div>;
        }
    };

    return (
        <MockLessonWrapper>
            {renderContent()}
        </MockLessonWrapper>
    );
};