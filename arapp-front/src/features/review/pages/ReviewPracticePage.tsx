import type {FlashcardItem} from "../reviewTypes.ts";
import {useEffect, useState} from "react";
import api from "../../auth/api.ts";
import ProgressBar from "../../exercises/components/ProgressBar.tsx";

import styles from './ReviewPage.module.css'
import {Link, useNavigate, useParams} from "react-router-dom";

//TODO dodac kiedys klawiature do wpisywania odpowiedzi

function ReviewPracticePage() {

    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const {groupId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        api.get(`/api/flashcards/group/${groupId}`, {withCredentials: true})
            .then(resp => {
                setFlashcards(resp.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });


    }, []);

    if (loading) return <div>Ładowanie...</div>;
    if (flashcards.length === 0) return <div>Brak fiszek do powtórki</div>;


    function sendAnswer(quality: number, id: string) {

        api.post(`/api/flashcards/review/${id}?quality=${quality}`, "", {withCredentials: true}).then(r => console.log(r));

    }

    const handleCheckAnswer = () => {
        setShowAnswer(true);
    }

    const handleNext = (quality: number) => {
        sendAnswer(quality, flashcards[currentFlashcardIndex].id);
        const nextIndex = currentFlashcardIndex + 1;


        if (nextIndex >= flashcards.length) {
            alert("Wszystkie fiszki powtorzone!")

            navigate("/review");
            return;
        }

        setCurrentFlashcardIndex(nextIndex % flashcards.length);
        setShowAnswer(false);
    }

    return (
        <div className={styles.practicePage}>

            <div className={styles.progressBarContainer}>


                <div className={styles.flashcardCounter}>

                    <Link to="/review">EXIT</Link>


                    <p>{currentFlashcardIndex + 1} / {flashcards.length}</p>

                </div>


                <ProgressBar progress={(currentFlashcardIndex / flashcards.length) * 100}/>

            </div>
            <div className={styles.flashcardContainer}>

                {!showAnswer ? (
                    <div className={styles.flashcardItem}>
                        <div className={styles.flashcardText}>
                            <h1> {flashcards[currentFlashcardIndex].word.wordArabic}</h1>
                            <p> {flashcards[currentFlashcardIndex].word.Transliteration}</p>

                        </div>
                    </div>
                ) : (
                    <div className={styles.flashcardItem}>
                        <p className={styles.flashcardText}>
                            <h2>  {flashcards[currentFlashcardIndex].word.wordTranslation} </h2>
                        </p>
                    </div>
                )

                }

            </div>

            <div className={styles.buttonsContainer}>

                {!showAnswer ? (
                    <button className={styles.showButton} onClick={handleCheckAnswer}>Pokaż odpowiedź</button>
                ) : (

                    <div className={styles.qualityButtonsContainer}>
                        <button className={styles.whiteButton} onClick={() => handleNext(0)}>Nie pamiętam</button>
                        <button className={styles.mildButton} onClick={() => handleNext(3)}>Trudno</button>
                        <button className={styles.hotButton} onClick={() => handleNext(5)}>Pamiętam</button>
                    </div>
                )
                }

            </div>

        </div>
    )

}

export default ReviewPracticePage;