import styles from "./Signup.module.css";

import { useState, type FormEvent } from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import api from "../api.ts";
import PasswordRequirements from "../components/PasswordRequirements.tsx";

function ResetPasswordPage() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token")

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    const passwordsMatch = password === confirmPassword;
    const passwordValidation = validatePassword(password);
    const isPasswordValid = passwordValidation.isValid;

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setErrorMessage(null);

        if (!passwordsMatch) {
            setErrorMessage('Podane hasła muszą być identyczne.');
            return;
        }

        const validation = validatePassword(password);
        if (!validation.isValid) {
            setErrorMessage(validation.errors.join(' '));
            return;
        }

        setStatus('loading');

        try {
            console.log('Signup form submitted');

            await api.post("/api/auth/reset-password", {
                token: token,
                newPassword: password
            }, {withCredentials: true});

            setStatus('success');
            setTimeout(() => navigate("/login"), 3000);

        } catch (error) {
            setStatus('error');

            if (error instanceof Error && 'response' in error) {
                const axiosError = error as { response?: { data?: unknown } };
                setErrorMessage(typeof axiosError.response?.data === 'string'
                    ? axiosError.response.data
                    : "Token jest nieprawidłowy lub wygasł.");

            } else {
                setErrorMessage("Wystąpił nieoczekiwany błąd.");
            }
        }

    }


    if (!token) return (
        <div className={styles.signUpPage}>
            <p className={styles.error}>Nieprawidłowy link.</p>
        </div>
    );

    if (status === "success") return (
        <div className={styles.signUpPage}>
            <h2 style={{color: '#4cae4f'}}> Sukces!</h2>
            <p>Hasło zostało zmienione.</p>
            <p>Zaraz zostaniesz przekierowany do strony logowania.</p>
        </div>
    );

    return (
        <>
            <div className={styles.signUpPage}>
                <h1 className={styles.signupTopText}>
                    Resetowanie hasła
                </h1>

                <form className={styles.signupForm} onSubmit={handleSubmit}>

                    <div className={styles.passwordContainer}>
                        <input type="password"
                               id="password"
                               name="password"
                               required
                               placeholder="Nowe hasło"
                               aria-label="Password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className={styles.confirmPasswordContainer}>
                        <input type="password"
                               id="confirmPassword"
                               name="confirmPassword"
                               required
                               placeholder="Potwierdź hasło"
                               aria-label="Confirm Password"
                               value={confirmPassword}
                               onChange={(e) => setConfirmPassword(e.target.value)}
                               className={confirmPassword && !passwordsMatch ? styles.invalid : ''}
                               disabled={status === 'loading'}
                        />
                    </div>

                    {password && <PasswordRequirements password={password}/> }

                    {errorMessage && (
                        <div style={{color: 'red', marginBottom: '15px', marginTop: '0px'}}>
                            {errorMessage}
                        </div>
                    )}

                    <div className={styles.submitContainer}>


                        <button
                            type="submit"
                            className={`${styles.button} ${styles.signup}`}
                            disabled={
                                !password ||
                                !confirmPassword ||
                                !passwordsMatch ||
                                !isPasswordValid ||
                                status === 'loading'
                            }
                        > {status === 'loading' ? 'Zapisywanie...' : 'Zresetuj hasło'}
                        </button>
                    </div>

                </form>

            </div>

        </>

    )
}

export default ResetPasswordPage