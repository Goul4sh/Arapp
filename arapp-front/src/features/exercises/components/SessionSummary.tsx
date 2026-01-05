import styles from './Tasks.module.css';

const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${seconds % 60}s`;
};

const SessionSummary = ({correct, incorrect, duration, onExit}: {
    correct: number,
    incorrect: number,
    duration: number,
    onExit: () => void
}) => {

    const total = correct + incorrect;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
        <div className={styles.summaryContainer}>

            <div className={styles.summaryContent}>

                <h2 className={styles.summaryTitle}>Lekcja ukończona!</h2>

                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <p className={styles.cardContent}>Poprawne odpowiedzi</p>
                        <h2 className={styles.cardContent} style={{color: 'green'}}>{correct}</h2>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statLabel}>Błędne odpowiedzi</p>
                        <h2 className={styles.statValue} style={{color: 'red'}}>{incorrect}</h2>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statLabel}>Skuteczność</p>
                        <h2 className={styles.statValue}>{accuracy}%</h2>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statLabel}>Czas</p>
                        <h2 className={styles.statValue}>{formatTime(duration)}</h2>
                    </div>
                </div>

                <button className={styles.finishButton} onClick={onExit}>
                    Kontynuuj
                </button>
            </div>


        </div>
    );
};

export default SessionSummary;