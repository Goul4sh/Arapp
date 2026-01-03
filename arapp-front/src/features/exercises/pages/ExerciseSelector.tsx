import styles from './Selector.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {faPlay, faBook} from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";
import {useState} from "react";

// Prototypowa strona do wybierania ćwiczeń

// Ta strona powinna zostac ostatecznie przeksztalcona w modul tworzenia skladanek cwiczen,
// ktory w swojej funkcjonalnosci bedzie bardzo zblizony do kreatora zadan z widoku admina.
// Bedzie mozna wybierac typy zadan dostepne w aplikacji i na bazie dostepnych zasobow tworzyc kolejki zadan.
// Na przyklad tylko zadania na dopasowywanie lub zaznaczanie poprawnych odpowiedzi (kilku)

// Skoro bierze pod uwage moduł słownictwa, a nawet przed wprowadzeniem ogólnej listy słów, mozna dodac rozdzielanie
// dostepnych slow do formatu wymaganego przez zadanie zwiazane z zadaniami morfologicznymi.
// Dodatkowo jesli kazde slowo z fiszki ma swoje tlumaczenie, to mozna je dynamicznie dodawac do zadan typu choose one, albo match pair


function ExerciseSelector() {

    const [exerciseId, setExerciseId] = useState('8');


    return (<>

            <div className={styles.exercisePage}>


                {/*<p> Exercise Selector Component </p>*/}


                <div className={styles.cardsContainer}>

                    <div className={styles.exerciseCard}>

                        <FontAwesomeIcon icon={faBook}/>
                        <p> Kliknij aby rozpocząć ćwiczenie</p>
                        <p style={{color: "green"}}> Fill in the blank </p>

                        <Link to={"/exercises/3"} className={styles.startLink}>
                            <button className={styles.startButton}>
                                <FontAwesomeIcon icon={faPlay}/> Start
                            </button>

                        </Link>

                    </div>

                    <div className={styles.exerciseCard}>

                        <FontAwesomeIcon icon={faBook}/>
                        <p> Kliknij aby rozpocząć ćwiczenie</p>
                        <p style={{color: "rosybrown"}}> Multiple choice </p>

                        <Link to={"/exercises/2"} className={styles.startLink}>
                            <button className={styles.startButton}>
                                <FontAwesomeIcon icon={faPlay}/> Start
                            </button>

                        </Link>

                    </div>

                    <div className={styles.exerciseCard}>

                        <FontAwesomeIcon icon={faBook}/>
                        <p> Kliknij aby rozpocząć ćwiczenie</p>
                        <p style={{color: "pink"}}> Matching </p>

                        <Link to={"/exercises/4"} className={styles.startLink}>
                            <button className={styles.startButton}>
                                <FontAwesomeIcon icon={faPlay}/> Start
                            </button>

                        </Link>

                    </div>

                    <div className={styles.exerciseCard}>

                        <FontAwesomeIcon icon={faBook}/>
                        <p> Kliknij aby rozpocząć ćwiczenie</p>
                        <p style={{color: "red"}}> Choose one </p>

                        <Link to={"/exercises/1"} className={styles.startLink}>
                            <button className={styles.startButton}>
                                <FontAwesomeIcon icon={faPlay}/> Start
                            </button>

                        </Link>

                    </div>


                    <div className={styles.exerciseCard}>

                        <FontAwesomeIcon icon={faBook}/>
                        <p> Kliknij aby rozpocząć ćwiczenie</p>
                        <p style={{color: "red"}}> Morphology form </p>

                        <Link to={"/exercises/2"} className={styles.startLink}>
                            <button className={styles.startButton}>
                                <FontAwesomeIcon icon={faPlay}/> Start
                            </button>

                        </Link>

                    </div>

                    <div className={styles.exerciseCard}>

                        <FontAwesomeIcon icon={faBook}/>
                        <p> Kliknij aby rozpocząć ćwiczenie</p>
                        <p style={{color: "red"}}> Morphology parts </p>

                        <Link to={"/exercises/3"} className={styles.startLink}>
                            <button className={styles.startButton}>
                                <FontAwesomeIcon icon={faPlay}/> Start
                            </button>

                        </Link>

                    </div>

                    <div className={styles.exerciseCard}>

                        <FontAwesomeIcon icon={faBook}/>
                        <p> Kliknij aby rozpocząć ćwiczenie</p>
                        <p style={{color: "cadetblue"}}> Assisted writing </p>

                        <Link to={"/exercises/8"} className={styles.startLink}>
                            <button className={styles.startButton}>
                                <FontAwesomeIcon icon={faPlay}/> Start
                            </button>

                        </Link>

                    </div>


                    <div className={styles.exerciseCard}>

                        <FontAwesomeIcon icon={faBook}/>
                        <p> Kliknij aby rozpocząć ćwiczenie</p>
                        <p style={{color: "cadetblue"}}> Wpisz id </p>

                        <input
                            type="number"
                            value={exerciseId}
                            onChange={(e) => setExerciseId(e.target.value)}
                            placeholder="Numer ćwiczenia"
                            className={styles.exerciseInput}
                            min="1"
                        />

                        <Link to={`/exercises/${exerciseId}`} className={styles.startLink}>
                            <button className={styles.startButton}>
                                <FontAwesomeIcon icon={faPlay}/> Start
                            </button>

                        </Link>

                    </div>

                    <div className={styles.exerciseCard}>

                        <FontAwesomeIcon icon={faBook}/>
                        <p> Kliknij aby rozpocząć lekcję!</p>
                        <p style={{color: "blueviolet"}}> Lekcja </p>

                        <Link to={"/lessons/50"} className={styles.startLink}>
                            <button className={styles.startButton}>
                                <FontAwesomeIcon icon={faPlay}/> Start
                            </button>

                        </Link>

                    </div>

                </div>


            </div>

        </>
    );
}

export default ExerciseSelector;