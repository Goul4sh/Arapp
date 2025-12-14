export interface BaseTask {
    id: string;
    type: string;
    description: string;
}
//Uwaga ! możliwe ze bedzie trzeba zmienic nazwy atrybutow, aby zgadzaly sie z jsonem z backendu

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
    sentenceWithBlank: string;
    answer: string;
}

export interface MatchPairsTaskType extends BaseTask {
    type: 'match-pairs';
    pairs: Record<string, string>;
}

export interface LetterFormSingleTaskType extends BaseTask {
    type: 'letter-form-single';
    letter: string;
}

export interface LetterDrawTaskType extends BaseTask {
    type: 'letter-draw';
    prompt: string;
}

export type Task = ChooseOneTaskType | MultipleChoiceTaskType | FillInTheBlankTaskType | MatchPairsTaskType | LetterFormSingleTaskType | LetterDrawTaskType;