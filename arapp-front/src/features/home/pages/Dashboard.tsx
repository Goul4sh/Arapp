import {type JSX} from "react";
import styles from './Dashboard.module.css'
import {useAuth} from "../../auth/auth";
import api from "../../auth/api.ts";

function Dashboard(): JSX.Element {

    const {user} = useAuth();
    const name = user?.name || 'Uzytkownik';
    const provider = 'System Arappkowego Logowania (SAL)';


    const handleLogout = async () => {

        try {

            const resp = await api.post("/api/auth/logout",null, {withCredentials: true});
            if (resp.status === 200 || resp.status === 204) {
                localStorage.removeItem("user");
                window.location.reload();
            }

        } catch (error) {
            console.error('Logout failed:', error);
        }

    };


    return (

        <>
            <div className={styles.dashboardPage}>
                <div className={styles.welcomeContainer}>
                    <h1 className={styles.welcomeText}>Witam {name}!</h1>

                    <h2 className={styles.providerText}>Zalogowales sie przy pomocy: {provider}</h2>
                </div>

                <div className={styles.contentContainer}>

                    <button className={styles.logoutButton} onClick={handleLogout}>
                        Wyloguj się
                    </button>

                </div>
            </div>
        </>
    );
}

export default Dashboard;