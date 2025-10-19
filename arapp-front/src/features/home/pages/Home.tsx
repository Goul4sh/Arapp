import {Link} from "react-router-dom";
import styles from './Home.module.css'
import type { JSX } from "react";

function Home(): JSX.Element {
    return (
        <>
            <h1 className={styles.title}>ArAppka</h1>
            <div className={styles.welcomeContainer}>
                <h2 className={styles.welcomeText}>Aby rozpocząć przygodę z Arappką zaloguj się lub zarejestruj.</h2>
                <div className={styles.buttons}>
                    <Link className={styles.login} to="/login">
                        Logowanie
                    </Link>
                    <Link className={styles.signup} to="/signup">
                        Rejestracja
                    </Link>
                </div>
            </div>
        </>
    )
        ;
}

export default Home;
