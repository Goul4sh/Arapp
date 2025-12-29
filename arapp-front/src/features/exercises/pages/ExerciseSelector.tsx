import styles from './Selector.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {faPlay, faBook} from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";

// Prototypowa strona do wybierania ćwiczeń

function ExerciseSelector() {
    return (<>

            <div className={styles.exercisePage}>


                <p> Exercise Selector Component </p>


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