import type {TranslateTaskType} from '../../taskTypes.ts';
import styles from "../Tasks.module.css";
import {useContext, useEffect, useRef, useState} from "react";
import {LessonContext} from "../LessonContext.tsx";

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import InteractiveText from "../text/InteractiveText.tsx";

const ARABIC_LAYOUT = {
    default: [
        'ض ص ث ق ف غ ع ه خ ح ج د {bksp}',
        'ش س ي ب ل ا ت ن م ك ط',
        'ئ ء ؤ ر لا ى ة و ز ظ',
        '{space}'
    ]
};

function TranslateTask({task}: { task: TranslateTaskType }) {
    const {submitAnswer} = useContext(LessonContext);
    const [userInput, setUserInput] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const keyboardRef = useRef<any>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    const isAnswerArabic = /[\u0600-\u06FF]/.test(task.translatedText);

    const handleCheck = () => {
        if (userInput.trim() === '') return;

        const normalize = (str: string) => str.replace(/[أإآ]/g, 'ا').trim().toLowerCase();
        const isCorrect = normalize(userInput) === normalize(task.translatedText);

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
    }

    const onChange = (input: string) => {
        setUserInput(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleCheck();
        }
    };

    const textareaStyles = {
        direction: isAnswerArabic ? 'rtl' : 'ltr',
        textAlign: isAnswerArabic ? 'right' : 'left',
        fontFamily: isAnswerArabic ? '"Noto Sans Arabic", serif' : 'inherit',
        fontSize: isAnswerArabic ? '1.1rem' : '1rem'
    } as const;

    const getTextareaClassName = () => {
        let className = styles.translateInput;
        if (status === 'correct') className += ` ${styles.correct}`;
        if (status === 'wrong') className += ` ${styles.wrong}`;
        return className;
    };


    return (
        <div className={styles.taskContainer}>
            <h2>{task.description || 'Przetłumacz zdanie'}</h2>

            <div className={styles.translateSourceContainer}>
                <div className={styles.translateSource}>
                    {isAnswerArabic ? "Polski" : "Arabski"}:
                </div>

                {task.textToTranslate && task.references ? (

                    <InteractiveText
                        text={task.textToTranslate}
                        references={task.references}/>) : (
                    <div className={styles.translateSourceText}>
                        {task.textToTranslate}
                    </div>
                )}
            </div>

            <div className={styles.separator}/>

            <div className={styles.translateInputContainer}>
                <div className={styles.translateInput}>
                    {isAnswerArabic ? "Arabski" : "Polski"}:
                </div>
                <textarea
                    ref={textareaRef}
                    className={getTextareaClassName()}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Wpisz tłumaczenie..."
                    rows={3}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    style={textareaStyles}
                    disabled={status !== 'idle'}
                />

                {status === 'wrong' && (
                    <div className={styles.correctAnswer}>
                        Poprawna odpowiedź: {task.translatedText}
                    </div>
                )}

            </div>

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
                    disabled={userInput.trim() === '' || status !== 'idle'}
                    onClick={handleCheck}
                >
                    {status === 'idle' ? 'Zatwierdź' : (status === 'correct' ? 'Świetnie!' : 'Błąd!')}

                </button>
            </div>
        </div>
    );
}

export default TranslateTask;
