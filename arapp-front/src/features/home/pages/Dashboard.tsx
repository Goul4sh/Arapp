import {type JSX, useState} from "react";
import styles from './Dashboard.module.css'
import {useAuth} from "../../auth/auth";

function Dashboard(): JSX.Element {

    const {user, accessToken} = useAuth();
    const [name] = useState(user?.name || 'Uzytkownik');
    const [provider] = useState('System Arappkowego Logowania (SAL)');

// cos nie dziala looooooooooooooool

    return (

        <>
            <div className={styles.dashboardPage}>
                <div className={styles.welcomeContainer}>
                    <h1 className={styles.welcomeText}>Witam {name}!</h1>
                    <h1 className={styles.welcomeText}>Witam {accessToken}!</h1>

                    <h2 className={styles.providerText}>Zalogowales sie przy pomocy: {provider}</h2>
                </div>
            </div>
        </>
    );
}

export default Dashboard;