import styles from './Selector.module.css'

// Prototypowa strona do wybierania ćwiczeń

// Ta strona powinna zostac ostatecznie przeksztalcona w modul tworzenia skladanek cwiczen,
// ktory w swojej funkcjonalnosci bedzie bardzo zblizony do kreatora zadan z widoku admina.
// Bedzie mozna wybierac typy zadan dostepne w aplikacji i na bazie dostepnych zasobow tworzyc kolejki zadan.
// Na przyklad tylko zadania na dopasowywanie lub zaznaczanie poprawnych odpowiedzi (kilku)

// Skoro bierze pod uwage moduł słownictwa, a nawet przed wprowadzeniem ogólnej listy słów, mozna dodac rozdzielanie
// dostepnych slow do formatu wymaganego przez zadanie zwiazane z zadaniami morfologicznymi.
// Dodatkowo jesli kazde slowo z fiszki ma swoje tlumaczenie, to mozna je dynamicznie dodawac do zadan typu choose one, albo match pair


function ExercisePlaylist() {

    return (

        <div className={styles.exercisePage}>

            <div className={styles.leftColumn}>

                <div className={styles.savesContainer}></div>

            </div>


            <div className={styles.centerColumn}>

                <div className={styles.beginButtonRow}></div>
                <div className={styles.contentManagementRow}>
                    <div className={styles.taskPreviewContainer}>
                        <div className={styles.taskPreviewHeader}>Podgląd zadania</div>
                        <div className={styles.taskPreviewBox}>Tutaj będzie podgląd zadania</div>
                    </div>
                    <div className={styles.optionsContainer}></div>
                    <div className={styles.dataSourceContainer}>

                        <div className={styles.headerBox}>
                            <div className={styles.headerTitle}>Źródła danych</div>
                            <div className={styles.headerButtonsContainer}>
                                <button className={styles.headerButton}>Baza</button>
                                <button className={styles.headerButton}>Fiszki</button>
                            </div>
                        </div>
                        <div className={styles.columnSlider}>
                            <div className={styles.dataSourceItem}>Źródło 1</div>
                            <div className={styles.dataSourceItem}>Źródło 2</div>
                            <div className={styles.dataSourceItem}>Źródło 3</div>
                        </div>

                    </div>
                </div>
                <div className={styles.playlistTimelineRow}></div>
            </div>


            <div className={styles.rightColumn}>

            </div>

        </div>


    );
}

export default ExercisePlaylist;