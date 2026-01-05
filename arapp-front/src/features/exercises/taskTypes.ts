
export interface BaseTask {
    // id: string;
    id: number;
    type: string;
    description: string;
}

//Uwaga ! możliwe ze bedzie trzeba zmienic nazwy atrybutow, aby zgadzaly sie z jsonem z backendu

export interface ChooseOneTaskType extends BaseTask {
    // id: number;
    type: 'choose-one';
    decoyAnswers: string[];
    answer: string;
}

export interface MultipleChoiceTaskType extends BaseTask {
    // id: number;

    type: 'multiple-choice';
    decoyAnswers: string[];
    answers: string[];
}

export interface FillInTheBlankTaskType extends BaseTask {
    // id: number;

    type: 'fill-in-the-blank';
    sentenceWithBlank: string;
    answer: string;
}

export interface MatchPairsTaskType extends BaseTask {
    // id: number;

    type: 'match-pairs';
    pairs: Record<string, string>;
}

export interface TheoryTaskType extends BaseTask {
    // id: number;

    type: 'theory';
    content: string;
}

export interface MorphologyPartsTaskType extends BaseTask {
    // id: number;

    type: 'morphology-parts';
    question: string;
    correctOrder : string[];
    segments: MorphologySegment[];
    decoySegments: MorphologySegment[];
}

export interface MorphologySegment {
    id: string;
    content: string; // np. "كـ"
    form: string;
}

export interface MorphologyFormTaskType extends BaseTask {
    // id: number;

    type: 'morphology-form';
    question: string;
    steps: MorphologyStep[];
}

export interface MorphologyStep {
    stepIndex: number;
    correctId: string;
    options: MorphologyOption[];
}

export interface MorphologyOption {
    id: string;
    content: string; // np. "كـ"
    isCorrect: boolean;
}


export interface AssistedWritingTaskType extends BaseTask{
    // id: number;

    type: 'writing-assisted';
    description: string;
    svgPathStrokes: string[];
    viewBox: string;
}

// Work in progress!

export interface FreehandWritingTaskType extends BaseTask{
    // id: number;

    type: 'writing-freehand';
    description: string;
    strokes: Array<Array<{ x: number; y: number }>>;
}

export type Task =
  (  ChooseOneTaskType
    | MultipleChoiceTaskType
    | FillInTheBlankTaskType
    | MatchPairsTaskType
    | MorphologyFormTaskType
    | MorphologyPartsTaskType
    | TheoryTaskType
    | AssistedWritingTaskType
    | FreehandWritingTaskType)
    // & { id: number }
    ;