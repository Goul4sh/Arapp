import type {FlashcardItem} from "../reviewTypes.ts";
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import ProgressBar from "../../exercises/components/ProgressBar.tsx";

import styles from './ReviewPractice.module.css'
import {useNavigate, useParams} from "react-router-dom";
import progressBarStyles from "../../exercises/components/progressBar.module.css";

function ReviewPracticePage() {

    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const {groupId} = useParams();
    const navigate = useNavigate();

    const [answeredFlashcardsIds, setAnsweredFlashcardsIds] = useState<Set<string>>(new Set());

    const [searchParams] = useState(new URLSearchParams(window.location.search));
    const isTrainingMode = searchParams.get("training") === "true";

    const [isFinished, setIsFinished] = useState(false);

    const [originalFlashcardsCount, setOriginalFlashcardsCount] = useState(0);
    const [correctlyAnsweredCount, setCorrectlyAnsweredCount] = useState(0);

    const [showArabic, setShowArabic] = useState(false);

    useEffect(() => {

        if (isTrainingMode) {

            api.get(`/api/flashcards/group/${groupId}/all`, {withCredentials: true})
                .then(resp => {
                    setFlashcards(resp.data);
                    setOriginalFlashcardsCount(resp.data.length);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });

        } else {

            api.get(`/api/flashcards/group/${groupId}`, {withCredentials: true})
                .then(resp => {
                    setFlashcards(resp.data);
                    setOriginalFlashcardsCount(resp.data.length);
                    setLoading(false);

                    console.log(resp.data);

                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }

    }, []);

    if (loading) return <div>Ładowanie...</div>;
    if (flashcards.length === 0) return <div>Brak fiszek do powtórki</div>;


    function sendAnswer(quality: number, id: string) {

        if (isTrainingMode) return;

        api.post(`/api/flashcards/review/${id}?quality=${quality}`, "", {withCredentials: true}).then(r => console.log(r));

    }

    const handleCheckAnswer = () => {
        setShowAnswer(true);
    }

    const handleNext = (quality: number) => {
        const currentCard = flashcards[currentFlashcardIndex];

        if (quality >= 3) {
            setCorrectlyAnsweredCount(prev => prev + 1);
        }

        if (quality === 0) {
            setFlashcards(prev => [...prev, currentCard]);
        }

        if (!isTrainingMode) {

            if (!answeredFlashcardsIds.has(currentCard.id)) {
                sendAnswer(quality, currentCard.id);
                setAnsweredFlashcardsIds(prev => {
                    const newSet = new Set(prev);
                    newSet.add(currentCard.id);
                    return newSet;
                });
            }

        }

        const nextIndex = currentFlashcardIndex + 1;
        const currentLength = flashcards.length + (quality === 0 ? 1 : 0);

        setCurrentFlashcardIndex(nextIndex % flashcards.length);
        setShowAnswer(false);
        setShowArabic(false);

        if (nextIndex >= currentLength) {
            setIsFinished(true);
            return

        }
    }

    if (isFinished) {
        return (
            <div className={styles.flashcardsFinishedScreen}>
                <div>
                    <h2>Gratulacje! Wszystkie fiszki zostały powtórzone.</h2>
                    <button onClick={() => navigate("/review")}>Powrót do przeglądu fiszek</button>
                </div>
            </div>
        );
    }

    const handleExitClick = () => {
        navigate(`/review`, {replace: true});
    }


    return (
        <div className={styles.practicePage}>
            <div className={progressBarStyles.topBar}>

                <div className={progressBarStyles.exitButton}>
                    <button onClick={handleExitClick}>
                        X
                    </button>
                </div>

                <ProgressBar progress={(correctlyAnsweredCount / originalFlashcardsCount) * 100}/>

                <div className={styles.flashcardCounter}>
                    <p>{correctlyAnsweredCount} / {originalFlashcardsCount}</p>
                </div>

            </div>
            <div className={styles.flashcardContainer}>

                {!showAnswer ? (
                    <div className={styles.flashcardItem}>
                        <div className={styles.flashcardContent}>
                            <h1 lang="ar"> {flashcards[currentFlashcardIndex].word.wordArabic}</h1>
                            <p className={styles.transliteration}>
                                {flashcards[currentFlashcardIndex].word.Transliteration || "Nie podano"}</p>

                        </div>
                    </div>
                ) : (
                    <div
                        className={styles.flashcardItem}
                        onClick={() => setShowArabic(prev => !prev)}
                        style={{cursor: 'pointer'}}
                    >
                        <div className={styles.flashcardContent}>
                            {showArabic ? (
                                <>
                                    <h1 lang="ar"> {flashcards[currentFlashcardIndex].word.wordArabic}</h1>
                                    <p className={styles.transliteration}> {flashcards[currentFlashcardIndex].word.Transliteration || "Nie podano"}</p>
                                </>
                            ) : (
                                <h2> {flashcards[currentFlashcardIndex].word.wordTranslation} </h2>
                            )}
                        </div>
                    </div>
                )
                }

                <div className={styles.buttonsContainer}>
                    {!showAnswer ? (
                        <button className={styles.showButton} onClick={handleCheckAnswer}>Pokaż odpowiedź</button>
                    ) : (
                        <div className={styles.qualityButtonsContainer}>
                            <button className={styles.hotButton} onClick={() => handleNext(0)}>Nie pamiętam</button>
                            <button className={styles.mildButton} onClick={() => handleNext(3)}>Trudno</button>
                            <button className={styles.whiteButton} onClick={() => handleNext(5)}>Pamiętam</button>
                        </div>
                    )
                    }

                </div>
            </div>

        </div>
    )

}

export default ReviewPracticePage;