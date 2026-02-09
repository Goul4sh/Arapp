import {type JSX, useState} from "react";
import * as React from "react";
import styles from './Signup.module.css'
import api from "../api.ts";
import {Link, useNavigate} from "react-router-dom";
import GoogleLogo from "../../../assets/Google__G__logo.svg";

function Signup(): JSX.Element {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    // const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    const validatePassword = (pwd: string): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (pwd.length < 8) {
            errors.push('Hasło musi mieć co najmniej 8 znaków');
        }
        if (!/[A-Z]/.test(pwd)) {
            errors.push('Hasło musi zawierać przynajmniej jedną wielką literę');
        }
        if (!/[a-z]/.test(pwd)) {
            errors.push('Hasło musi zawierać przynajmniej jedną małą literę');
        }
        if (!/[0-9]/.test(pwd)) {
            errors.push('Hasło musi zawierać przynajmniej jedną cyfrę');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
            errors.push('Hasło musi zawierać przynajmniej jeden znak specjalny');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setErrorMessage(null);


        if (password !== confirmPassword) {
            setError('Podane hasła muszą być identyczne.');
            return;
        }

        const validation = validatePassword(password);
        if (!validation.isValid) {
            setError(validation.errors.join(' '));
            return;
        }

        try {
            console.log('Signup form submitted');

            const resp = await api.post("/api/auth/register", {email, password, username}, {withCredentials: true});

            if (resp.status === 201) {
                console.log("User created successfully");

                navigate("/login");

            }

        } catch (error : unknown) {

            if (error instanceof Error && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
                const backendMessage = axiosError.response?.data?.message;

                if (backendMessage) {
                    setErrorMessage(backendMessage);
                } else if (axiosError.response?.status === 409) {
                    setErrorMessage("Konto z podanym adresem email już istnieje.");
                } else {
                    setErrorMessage("Wystąpił błąd rejestracji.");
                }
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


                    {password && (
                        <div className={styles.passwordRequirements}>
                            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: '#666' }}>
                                Wymagania dotyczące hasła:
                            </p>
                            <ul style={{ fontSize: '0.8rem', margin: 0, paddingLeft: '1.5rem' }}>
                                <li style={{ color: password.length >= 8 ? '#4cae4f' : '#e74c3c' }}>
                                    Co najmniej 8 znaków
                                </li>
                                <li style={{ color: /[A-Z]/.test(password) ? '#4cae4f' : '#e74c3c' }}>
                                    Przynajmniej jedna wielka litera
                                </li>
                                <li style={{ color: /[a-z]/.test(password) ? '#4cae4f' : '#e74c3c' }}>
                                    Przynajmniej jedna mała litera
                                </li>
                                <li style={{ color: /[0-9]/.test(password) ? '#4cae4f' : '#e74c3c' }}>
                                    Przynajmniej jedna cyfra
                                </li>
                                <li style={{ color: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? '#4cae4f' : '#e74c3c' }}>
                                    Przynajmniej jeden znak specjalny (!@#$%^&*...)
                                </li>
                            </ul>
                        </div>
                    )}

                    <div className={styles.submitContainer}>

                        {errorMessage && (
                            <div style={{ color: 'red', marginBottom: '15px',marginTop: '0px' }}>
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`${styles.button} ${styles.signup}`}
                            disabled={!password || !confirmPassword || password !== confirmPassword || !validatePassword(password).isValid}
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
