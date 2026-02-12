import type {FillInTheBlankTaskType} from '../../taskTypes.ts'
import styles from "../Tasks.module.css";
import {useContext, useEffect, useRef, useState} from "react";
import {LessonContext} from "../LessonContext.tsx";

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const ARABIC_LAYOUT = {
    default: [
        'ض ص ث ق ف غ ع ه خ ح ج د {bksp}',
        'ش س ي ب ل ا ت ن م ك ط',
        'ئ ء ؤ ر لا ى ة و ز ظ',
        '{space}'
    ]
};

function FillInTheBlankTask({task}: { task: FillInTheBlankTaskType }) {

    const {submitAnswer} = useContext(LessonContext);
    const [userInput, setUserInput] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
    const inputRef = useRef<HTMLInputElement>(null);
    const keyboardRef = useRef<any>(null);

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

        setStatus(isCorrect ? 'correct' : 'wrong');

        setTimeout(() => {
            submitAnswer(isCorrect);
            setUserInput('');
            setStatus('idle');
        }, 1500);
    };

    const onKeyPress = (button: string) => {
        if (button === "{bksp}") {
            setUserInput((prev) => prev.slice(0, -1));
        } else if (button === "{space}") {
            setUserInput((prev) => prev + " ");
        } else {
            setUserInput((prev) => prev + button);
        }
    };

    const onChange = (input: string) => {
        setUserInput(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCheck();
        }
    };

    const renderSentence = () => {
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

        const getInputClassName = () => {
            let className = styles.gapInput;
            if (status === 'correct') className += ` ${styles.correct}`;
            if (status === 'wrong') className += ` ${styles.wrong}`;
            return className;
        };

        return (
            <div className={styles.sentenceContainer}>
                <span> {parts[0]}</span>
                <input
                    ref={inputRef}
                    type="text"
                    className={getInputClassName()}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="..."
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    style={inputStyles}
                    disabled={status !== 'idle'}
                />
                {parts[1] && <span>{parts[1]}</span>}
            </div>
        );
    };


    return (
        <div className={styles.taskContainer}>
            <h2>{task.description}</h2>
            <div className={styles.fillTheGapTranslation}>
                {task.translatedSentence}
            </div>

            <div className={styles.separator}/>

            <div className={styles.fillTheGapContainer}>
                {renderSentence()}
            </div>

            {status === 'wrong' && (
                <div className={styles.correctAnswer}>
                    Poprawna odpowiedź: {task.answer}
                </div>
            )}

            {isAnswerArabic && (
                <div className={styles.keyboardWrapper}>
                    <Keyboard
                        keyboardRef={(r: any) => (keyboardRef.current = r)}
                        layout={ARABIC_LAYOUT}
                        onChange={onChange}
                        onKeyPress={onKeyPress}
                        theme="hg-theme-default hg-layout-default"
                        rtl={true}
                    />
                </div>
            )}

            <div className={styles.checkButtonContainer}>
                <button
                    className={styles.checkButton}
                    disabled={userInput.trim() === ''}
                    onClick={() => handleCheck()}
                >
                    {status === 'idle' ? 'Zatwierdź' : (status === 'correct' ? 'Świetnie!' : 'Błąd!')}
                </button>
            </div>

        </div>
    );
}

export default FillInTheBlankTask