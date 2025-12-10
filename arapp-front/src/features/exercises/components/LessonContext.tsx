import {createContext} from "react";

export interface LessonContextType {

    submitAnswer: (answer: boolean) => void;

}

export const LessonContext = createContext<LessonContextType>({
    submitAnswer: () => {}
});