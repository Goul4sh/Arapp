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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

            console.log("Jestem wynikiem logowania: " + JSON.stringify(userData));

            localStorage.setItem("user", JSON.stringify(userData));


            if (userData.role === "ADMIN") {
                navigate("/admin/dashboard");
                return;
            } else {
                navigate("/dashboard");
            }


        } catch (error: any) {

            if (error.response) {

                const backendMessage = error.response.data?.message;

                if (backendMessage) {
                    setErrorMessage(backendMessage);
                } else if (error.response.status === 401) {
                    setErrorMessage("Nieprawidłowe dane logowania.");
                } else {
                    setErrorMessage("Wystąpił błąd logowania.");
                }
            } else if (error.request) {

                setErrorMessage("Brak połączenia z serwerem.");
            } else {
                setErrorMessage("Wystąpił nieoczekiwany błąd.");
            }

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

                        {errorMessage && (
                            <div style={{color: 'red', marginBottom: '15px', marginTop: '0px'}}>
                                {errorMessage}
                            </div>
                        )}

                        <button type="submit" className={`${styles.button} ${styles.login}`}>Zaloguj się</button>
                    </div>

                </form>
                <div className={styles.register}>
                    <Link to={"/forgot-password"}>Zapomniałeś hasła?</Link>
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
