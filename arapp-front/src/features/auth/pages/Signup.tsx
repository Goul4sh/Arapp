import {type JSX} from "react";
import * as React from "react";
import styles from './Signup.module.css'
import api from "../api.ts";
import {Link, useNavigate} from "react-router-dom";
import GoogleLogo from "../../../assets/Google__G__logo.svg";

// TODO dodac komunikaty o bledach podczas rejestracji


function Signup(): JSX.Element {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Podane hasła muszą być identyczne.');
            return;
        }

        try {
            console.log('Signup form submitted');

            const resp = await api.post("/api/auth/register", {email, password, username}, {withCredentials: true});

            if (resp.status === 201) {
                console.log("User created successfully");


                navigate("/login");

            }

        } catch (error) {
            console.error('Signup failed:', error);
        }

    }

    const handleGoogleSignIn = () => {
        const backendURL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        window.location.href = `${backendURL}/oauth2/authorization/google`;
    };

    return (
        <>

            <div className={styles.signUpPage}>


                <h1 className={styles.signupTopText}>
                    Zarejestruj się</h1>

                <form className={styles.signupForm} onSubmit={handleSubmit}>

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

                    <div className={styles.usernameContainer}>
                        {/*<label htmlFor="username">Nazwa użytkownika:</label>*/}
                        <input type="text"
                               id="username"
                               name="username"
                               required
                               placeholder="Nazwa użytkownika"
                               aria-label="Nazwa użytkownika"
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}/>
                    </div>

                    <div className={styles.passwordContainer}>
                        {/*<label htmlFor="password">Hasło:</label>*/}
                        <input type="password"
                               id="password"
                               name="password"
                               required
                               placeholder="Hasło"
                               aria-label="Password"
                               autoComplete="current-password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.confirmPasswordContainer}>
                        {/*<label htmlFor="confirmPassword">Potwierdź Hasło:</label>*/}
                        <input type="password"
                               id="confirmPassword"
                               name="confirmPassword"
                               required
                               placeholder="Potwierdź hasło"
                               aria-label="Confirm Password"
                               value={confirmPassword}
                               onChange={(e) => setConfirmPassword(e.target.value)}
                               className={confirmPassword && password !== confirmPassword ? styles.invalid : ''}
                        />
                    </div>

                    <div className={styles.submitContainer}>
                        <button
                            type="submit"
                            className={`${styles.button} ${styles.signup}`}
                            disabled={!password || !confirmPassword || password !== confirmPassword}
                        >Zarejestruj się
                        </button>
                    </div>

                </form>

                <div className={styles.separator}></div>

                <button type="button" className={`${styles.button} ${styles.google}`} onClick={handleGoogleSignIn}>
                    <img className={styles.googleLogo} src={GoogleLogo} alt="Google Logo"/>
                    <span className={styles.googleText}>Zaloguj kontem Google</span>
                </button>

                <div className={styles.register}>
                    <p>Masz już konto? </p> <Link to={"/login"}>Zaloguj się </Link>


                </div>

            </div>

        </>
    )
}

export default Signup
