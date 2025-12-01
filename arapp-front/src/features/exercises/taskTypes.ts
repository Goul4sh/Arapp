export interface BaseTask {
    id: string;
    type: string;
    question: string;
}


export interface ChooseOneTaskType extends BaseTask {
    type: 'choose-one';
    decoyAnswers: string[];
    correctAnswer: string;
}


export interface MultipleChoiceTaskType extends BaseTask {
    type: 'multiple-choice';
    options: string[];
    correctOption: number;
}

export interface FillInTheBlankTaskType extends BaseTask {
    type: 'fill-in-the-blank';
    correctAnswer: string;
}

export interface MatchingTaskType extends BaseTask {
    type: 'matching';
    pairs: { left: string; right: string }[];
}

export interface LetterFormSingleTaskType extends BaseTask {
    type: 'letter-form-single';
    letter: string;
}

export interface LetterDrawTaskType extends BaseTask {
    type: 'letter-draw';
    prompt: string;
}

export type Task = MultipleChoiceTaskType | FillInTheBlankTaskType | MatchingTaskType | LetterFormSingleTaskType | LetterDrawTaskType;