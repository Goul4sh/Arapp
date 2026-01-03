import styles from './progressBar.module.css'


function ProgressBar ({ progress }: { progress: number }) {

    const calculatedProgress = Math.min(Math.max(progress, 0), 100);
    return (
    <div className={styles.progressBarContainer}>
      <div
        className={styles.progressBarFill}
        style={{ width: `${calculatedProgress}%` }}
      ></div>
    </div>
  )
}

export default ProgressBar