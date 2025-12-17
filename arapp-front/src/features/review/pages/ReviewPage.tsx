import styles from './Review.module.css';


function ReviewPage() {

    const flashcards = ['słowo1', 'słowo2', 'słowo3', 'słowo4', 'słowo5', 'słowo6', 'słowo7', 'słowo8'];


    return (
        <div>

            <div className={styles.reviewPage}>

                <div className={styles.columnLeft}>

                    <div className={styles.topText}>
                        <p> Twoje grupy fiszek </p>
                    </div>


                    <div className={styles.separator}></div>

                    <div className={styles.flashcardGroupsContainer}>


                        <div className={styles.flashcardGroupsSlider}>


                        </div>


                    </div>

                </div>


                <div className={styles.columnCenter}>

                    <div className={styles.topRow}>

                        <button className={styles.startPracticeButton} onClick={() => {
                        }}
                        >Trenuj
                        </button>


                    </div>

                    <div className={styles.middleRow}>

                        <div className={styles.rowText}>
                            <h2> Fiszunie do powtórki </h2>
                        </div>

                        <div className={styles.flashcardsSlider}>


                            {flashcards.map((flashcard, index) => (
                                <div
                                    className={styles.flashcardItem}
                                    key={index}
                                    // onClick={() => handleOptionClick(option)}
                                >
                                    {flashcard}
                                </div>
                            ))}



                        </div>

                    </div>


                    <div className={styles.bottomRow}>

                        <div className={styles.rowText}>
                            <h2> Ostatnio napotkane słowa </h2>
                        </div>

                        <div className={styles.flashcardsSlider}>


                        </div>

                    </div>


                </div>

                <div className={styles.columnRight}>

                </div>


            </div>


        </div>
    )
}

export default ReviewPage