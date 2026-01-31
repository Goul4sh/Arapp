import styles from './interactiveText.module.css'
import {useMemo} from "react";
import InteractiveWord from "./InteractiveWord.tsx";


export interface WordReference {
    dictionaryWordId: number;
    startIndex: number;
    endIndex: number;
    dictionaryTranslation: string;
    contextualTranslation: string;
    transliteration: string;
    lemma: string;
    hasFlashcard?: boolean;

}

export interface InteractiveTextProps {
    text: string;
    references: WordReference[];
}

function InteractiveText({text, references} : InteractiveTextProps) {


    const parts = useMemo(() => {

        const result = [];
        let lastIndex = 0;

        const sortedReferences = [...references].sort((a, b) => a.startIndex - b.startIndex);

        sortedReferences.forEach((ref, i) => {
            if (ref.startIndex > lastIndex) {
                result.push(
                    <span key={`text-${lastIndex}`}>
                        {text.substring(lastIndex, ref.startIndex)}
                    </span>
                );
            }

            const wordContent = text.substring(ref.startIndex, ref.endIndex);

            result.push(
                <InteractiveWord
                    key={`word-${ref.dictionaryWordId}-${i}`}
                reference={ref}
                content={wordContent}
                />
            );

            lastIndex = ref.endIndex;
        });

        if (lastIndex < text.length)
        {
            result.push(
                <span key={`text-end`}>
                    {text.substring(lastIndex)}
                </span>
            );
        }

        return result;
    }, [text, references]);


    return (
        <div className={styles.interactiveTextContainer}>
            {parts}
        </div>
    )

}
export default InteractiveText