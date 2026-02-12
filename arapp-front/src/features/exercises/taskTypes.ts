
export interface BaseTask {
    id: number;
    type: string;
    description: string;
    references?: any;
}

export interface ChooseOneTaskType extends BaseTask {
    type: 'choose-one';
    decoyAnswers: string[];
    answer: string;
}

export interface MultipleChoiceTaskType extends BaseTask {
    type: 'multiple-choice';
    decoyAnswers: string[];
    answers: string[];
}

export interface FillInTheBlankTaskType extends BaseTask {
    type: 'fill-in-the-blank';
    translatedSentence: string;
    sentenceWithBlank: string;
    answer: string;
}

export interface MatchPairsTaskType extends BaseTask {
    type: 'match-pairs';
    pairs: Record<string, string>;
}

export interface TheoryTaskType extends BaseTask {
    type: 'theory';
    content: string;
    createCompendiumEntry?: boolean;
    compendiumTitle?: string;
    compendiumIcon?: string;
    tagNames?: string[];
    requiredLessonId?: number;
    existingCompendiumEntryId?: number;

}

export interface MorphologyPartsTaskType extends BaseTask {
    type: 'morphology-parts';
    question: string;
    correctOrder : string[];
    segments: MorphologySegment[];
    decoySegments: MorphologySegment[];
    referencedWordId?: number;
}

export interface MorphologySegment {
    id: string;
    content: string;
}

export interface MorphologyFormTaskType extends BaseTask {
    type: 'morphology-form';
    question: string;
    steps: MorphologyStep[];
    referencedWordId?: number;

}

export interface MorphologyStep {
    stepIndex: number;
    correctId: string;
    options: MorphologyOption[];
}

export interface MorphologyOption {
    id: string;
    content: string;
    isCorrect: boolean;
}


export interface AssistedWritingTaskType extends BaseTask{
    type: 'writing-assisted';
    description: string;
    svgPathStrokes: string[];
    viewBox: string;
}

export interface TranslateTaskType extends BaseTask {

    type: 'translate';
    textToTranslate: string;
    translatedText: string;
}

export type Task =
  (  ChooseOneTaskType
    | MultipleChoiceTaskType
    | FillInTheBlankTaskType
    | MatchPairsTaskType
    | MorphologyFormTaskType
    | MorphologyPartsTaskType
    | TheoryTaskType
    | AssistedWritingTaskType)
    | TranslateTaskType
    ;