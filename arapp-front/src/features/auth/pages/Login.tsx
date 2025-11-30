import {useState, type JSX} from "react";
import GoogleLogo from "../../../assets/Google__G__logo.svg"
import styles from './Login.module.css'
import * as React from "react";
import api from "../api";
import {useAuth} from "../auth";
import {Link, useNavigate} from "react-router-dom";
// TODO dodac komunikaty o bledach podczas logowania
function Login(): JSX.Element {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {setUser} = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const resp = await api.post("/api/auth/login", {email, password}, {withCredentials: true});

            const userData: { id: string; name: string; email: string; role: string } = {
                id: resp.data.user_id,
                name: resp.data.username,
                email: resp.data.email,
                role: resp.data.role
            };

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));

            navigate("/dashboard");


        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    const handleGoogleSignIn = () => {
        const backendURL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        window.location.href = `${backendURL}/oauth2/authorization/google`;
    };


    return (
        <>
            <div className={styles.loginPage}>
                <h1>Zaloguj się do Arappki </h1>
                <form className={styles.loginForm} onSubmit={handleSubmit}>

                    <div className={styles.emailContainer}>
                        {/*<label htmlFor="email">Email:</label>*/}

                        <input type="email"
                               id="email"
                               name="email"
                               required
                               placeholder="you@example.com"
                               aria-label="Adres email"
                               autoComplete="email"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className={styles.passwordContainer}>
                        {/*<label htmlFor="password">Hasło:</label>*/}
                        <input type="password"
                               id="password"
                               name="password"
                               required
                               placeholder="Twoje hasło"
                               aria-label="Password"
                               autoComplete="current-password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className={styles.submitContainer}>
                        <button type="submit" className={`${styles.button} ${styles.login}`}>Zaloguj się</button>
                    </div>

                </form>
                <div className={styles.forgotPassword}>
                    <a>Zapomniałeś hasła?</a>
                </div>
                <div className={styles.separator}></div>

                <button type="button" className={`${styles.button} ${styles.google}`} onClick={handleGoogleSignIn}>
                    <img className={styles.googleLogo} src={GoogleLogo} alt="Google Logo"/>
                    <span className={styles.googleText}>Zaloguj kontem Google</span>
                </button>

                <div className={styles.register}>
                     <p>Nie masz konta? </p> <Link to={"/signup"}>Zarejestruj się </Link>


                </div>
            </div>
        </>
    )
}

export default Login
