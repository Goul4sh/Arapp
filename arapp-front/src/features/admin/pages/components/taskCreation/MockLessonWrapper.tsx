import type {ReactNode} from "react";
import { LessonContext } from "../../../../exercises/components/LessonContext.tsx";

export const MockLessonWrapper = ({ children }: { children: ReactNode }) => {

    const mockSubmitAnswer = (isCorrect: boolean) => {
        console.log(`[PREVIEW] Użytkownik odpowiedział: ${isCorrect ? "POPRAWNIE" : "BŁĘDNIE"}`);
    };

    return (
        <LessonContext.Provider value={{ submitAnswer: mockSubmitAnswer }}>
            {children}
        </LessonContext.Provider>
    );
};