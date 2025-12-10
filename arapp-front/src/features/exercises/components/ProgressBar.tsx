import styles from './progressBar.module.css'


function ProgressBar ({ progress }: { progress: number }) {
  return (
    <div className={styles.progressBarContainer}>
      <div
        className={styles.progressBarFill}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}

export default ProgressBar