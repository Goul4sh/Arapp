
export interface BaseTask {
    id: number;
    type: string;
    description: string;
}

export interface ChooseOneFormType extends BaseTask {
    type: 'choose-one';
    decoyAnswers: string[];
    answer: string;
}

export interface MultipleChoiceFormType extends BaseTask {
    type: 'multiple-choice';
    decoyAnswers: string[];
    answers: string[];
}

export interface FillInTheBlankFormType extends BaseTask {
    type: 'fill-in-the-blank';
    sentenceWithBlank: string;
    answer: string;
}

export interface MatchPairsFormType extends BaseTask {
    type: 'match-pairs';
    pairs: Record<string, string>;
}

export interface TheoryFormType extends BaseTask {
    type: 'theory';
    content: string;

}

export interface TheoryFormExtendedType extends TheoryFormType{

    createCompendiumEntry: boolean;
    compendiumTitle?: string;
    compendiumIcon?: string;
    tagNames: string[];
    requiredLessonId?: number;
}

export interface MorphologyPartsFormType extends BaseTask {
    type: 'morphology-parts';
    question: string;
    correctOrder : string[];
    segments: MorphologySegment[];
    decoySegments: MorphologySegment[];
    referencedWordId?: number;

}

export interface MorphologySegment {
    id: string;
    content: string; // np. "كـ"
    form: string;
}

export interface MorphologyFormType extends BaseTask {
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
    content: string; // np. "كـ"
    isCorrect: boolean;
}

export interface TranslateFormType extends BaseTask{
    type: 'translate';
    textToTranslate: string;
    translatedText: string;
}

// export interface AssistedWritingTaskType {
//     type: 'writing-assisted';
//     description: string;
//     svgPathStrokes: string[];
//     viewBox: string;
// }
//
// // Work in progress!
//
// export interface FreehandWritingTaskType {
//     type: 'writing-freehand';
//     description: string;
//     strokes: Array<Array<{ x: number; y: number }>>;
// }

export type Task =
  (  ChooseOneFormType
    | MultipleChoiceFormType
    | FillInTheBlankFormType
    | MatchPairsFormType
    | MorphologyFormType
    | MorphologyPartsFormType
    | TheoryFormType
    // | AssistedWritingFormType
    // | FreehandWritingFormType
      )
