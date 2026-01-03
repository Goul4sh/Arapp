import {useState} from "react";
import api from "../api.ts";
import styles from "./Signup.module.css";
import * as React from "react";


function ForgotPasswordPage() {


    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [responseMessage, setResponseMessage] = useState<string | null>(null);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setStatus('loading');
        setResponseMessage('')
        try {

            await api.post("/api/auth/forgot-password", {email}, {withCredentials: true});
            setStatus("success");
            setResponseMessage("Jeśli konto istnieje, na podany adres e-mail został wysłany link do zresetowania hasła.");
            setEmail('');

        } catch (error) {
            setStatus("error");
            setResponseMessage("Wystąpił błąd podczas próby zresetowania hasła.");
        }

    }

    return (

        <>

            <div className={styles.signUpPage}>

                <h1 className={styles.signupTopText}>
                    Zapomniałem hasła</h1>

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

                    <div className={styles.submitContainer}>


                        <button
                            type="submit"
                            className={`${styles.button} ${styles.signup}`}
                            disabled={!email || status === 'loading' || status === 'success'}
                        >{status === 'loading' ? 'Wysyłanie...' : 'Zresetuj hasło'}
                        </button>

                        {responseMessage && (
                            <div style={{
                                color: status === 'success' ? 'green' : 'red',
                                marginBottom: '15px',
                                marginTop: '15px'
                            }}>
                                {responseMessage}
                            </div>
                        )}

                    </div>

                </form>

            </div>

        </>


    )
}


export default ForgotPasswordPage