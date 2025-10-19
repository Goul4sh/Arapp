import {useState, type JSX} from "react";
import GoogleLogo from "../../../assets/Google__G__logo.svg"
// import './Login.css'
import styles from './Login.module.css'

function Login(): JSX.Element {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
    }

    const handleGoogleSignIn = () => {
        console.log('Google Sign-In clicked');
    }

    return (
        <>
            <div className={styles.loginPage}>
            <h1>Strona logowania</h1>
            <form className={styles.loginForm} onSubmit={handleSubmit}>

                <div className={styles.emailContainer}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" 
                            id="email" 
                            name="email" 
                            required 
                            onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className={styles.passwordContainer}>
                    <label htmlFor="password">Hasło:</label>
                    <input type="password" 
                           id="password" 
                           name="password" 
                           required
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className={styles.submitContainer}>
                    <button type="submit" className={`${styles.button} ${styles.login}`}>Zaloguj się</button>
                </div>

            </form>
            <div className={styles.separator}>lub</div>

            <button type="button" className={`${styles.button} ${styles.google}`} onClick={handleGoogleSignIn}>
                <img className={styles.googleLogo} src={GoogleLogo} alt="Google Logo"/>
                <span className={styles.googleText}>Zaloguj kontem Google</span>
            </button>
            <div>
                <a href="/forgot-password">Zapomniałeś hasła?</a>
            </div>
            </div>
        </>
    )
}

export default Login
