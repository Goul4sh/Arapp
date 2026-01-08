import type {FillInTheBlankTaskType} from '../../taskTypes.ts'
import styles from "../Tasks.module.css";
import {useContext, useEffect, useRef, useState} from "react";
import {LessonContext} from "../LessonContext.tsx";


const REAL_ARABIC_KEYBOARD = [
    'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ',
    'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
    'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
    'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي',
    'ة', 'ء', 'أ', 'إ', 'آ', 'ؤ', 'ئ'
];

function FillInTheBlankTask({task}: { task: FillInTheBlankTaskType }) {

    const {submitAnswer} = useContext(LessonContext);
    const [userInput, setUserInput] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const isAnswerArabic = /[\u0600-\u06FF]/.test(task.answer);

    const handleCheck = () => {

        if (userInput.trim() === '') return;


        const normalize = (str: string) => str.replace(/[أإآ]/g, 'ا');
        const isCorrect = normalize(userInput.trim()) === normalize(task.answer);

        // const isCorrect = userInput.trim().toLowerCase() === task.answer.toLowerCase();

        submitAnswer(isCorrect);
    }

    const handleVirtualKeyClick = (char: string) => {
        setUserInput(prev => prev + char);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCheck();
        }
    };

    const renderSentence = () => {

        // const inputWidth = `${Math.max(task.answer.length + 2, 4)}ch`;


        const parts = task.sentenceWithBlank.split('__');

        if (parts.length === 1) {
            return <span>{task.sentenceWithBlank}</span>
        }


        const inputStyles = {
            width: `${Math.max(task.answer.length + 2, 4)}ch`,
            direction: isAnswerArabic ? 'rtl' : 'ltr',
            textAlign: isAnswerArabic ? 'right' : 'left',
            fontFamily: isAnswerArabic ? '"Noto Sans Arabic", serif' : 'inherit',
            fontSize: isAnswerArabic ? '1.2rem' : '1rem'
        } as const;

        return (
            <div className={styles.sentenceContainer}>
                <span> {parts[0]}</span>

                <input
                    ref={inputRef}
                    type="text"
                    className={styles.gapInput}
                    // style={{width: inputWidth, minWidth: '4ch'}}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="..."
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    style={inputStyles}

                />

                {parts[1] && <span>{parts[1]}</span>}
            </div>
        );
    };


    return (
        <div className={styles.taskContainer}>
            <h2>{task.description}</h2>
            <div className={styles.fillTheGapTranslation}> Tłumaczenie tłumaczenie tłumaczenie</div>

            <div className={styles.separator}/>

            <div className={styles.fillTheGapContainer}>
                {renderSentence()}
            </div>
            {isAnswerArabic && (
                <div className={styles.virtualKeyboard}>
                    {REAL_ARABIC_KEYBOARD.map((char) => (
                        <button
                            key={char}
                            className={styles.virtualKey}
                            onClick={() => handleVirtualKeyClick(char)}>
                            {char}
                        </button>
                    ))}

                    <button
                        onClick={() => setUserInput(prev => prev.slice(0, -1))}
                        className={`${styles.keyButton} ${styles.actionKey}`}
                    >
                        ⌫
                    </button>

                    <button
                        className={styles.virtualKey}
                        onClick={() => setUserInput('')}>
                        ⟲
                    </button>
                </div>
            )}


            <div className={styles.checkButtonContainer}>
                <button
                    className={styles.checkButton}
                    disabled={userInput.trim() === ''}
                    onClick={() => handleCheck()}>
                    Zatwierdź
                </button>
            </div>

        </div>
    );
}

export default FillInTheBlankTask