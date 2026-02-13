import {type JSX, useState} from "react";
import * as React from "react";
import styles from './Signup.module.css'
import api from "../api.ts";
import {Link, useNavigate} from "react-router-dom";
import GoogleLogo from "../../../assets/Google__G__logo.svg";
import PasswordRequirements from "../components/PasswordRequirements.tsx";

function Signup(): JSX.Element {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<boolean>(false);


    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const MIN_USERNAME_LENGTH = 3;
    const MAX_USERNAME_LENGTH = 20;
    const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;


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

    const validateForm = (): { isValid: boolean; error: string } => {
        if (!email.trim()) {
            return {isValid: false, error: 'Email jest wymagany'};
        }
        if (!EMAIL_REGEX.test(email)) {
            return {isValid: false, error: 'Nieprawidłowy format adresu email'};
        }
        if (!username.trim()) {
            return {isValid: false, error: 'Nazwa użytkownika jest wymagana'};
        }
        if (username.length < MIN_USERNAME_LENGTH) {
            return {isValid: false, error: `Minimalna wymagana liczba znaków w nazwie: ${MIN_USERNAME_LENGTH}`};
        }
        if (username.length > MAX_USERNAME_LENGTH) {
            return {isValid: false, error: `Maksymalna dopuszczalna liczba znaków w nazwie: ${MAX_USERNAME_LENGTH}`};
        }
        if (!USERNAME_REGEX.test(username)) {
            return {
                isValid: false,
                error: 'Nazwa użytkownika może zawierać tylko litery, cyfry, myślniki i podkreślenia'
            };
        }

        return {isValid: true, error: ''};

    }

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setErrorMessage(null);
        setSuccessMessage(false);


        const formValidation = validateForm();
        if (!formValidation.isValid) {
            setError(formValidation.error);
            return;
        }


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
            const resp = await api.post("/api/auth/register", {email, password, username}, {withCredentials: true});
            if (resp.status === 201) {
                setSuccessMessage(true)
                setTimeout(() => navigate("/login"), 10500);
            }

        } catch (error: unknown) {

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


                    {password && <PasswordRequirements password={password}/>}

                    <div className={styles.submitContainer}>

                        {errorMessage && (
                            <div className={styles.errorMessage}>
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

                {successMessage && (
                    <div className={styles.successMessage}>
                        <p>Link aktywacyjny został wysłany na adres {email}.</p>
                        <p>Sprawdź swoją skrzynkę pocztową i kliknij w link, aby aktywować konto.</p>
                        <p>Za chwilę zostaniesz przekierowany do strony logowania.</p>
                    </div>)
                }

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
