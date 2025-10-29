import {type JSX} from "react";
import styles from './Dashboard.module.css'
import {useAuth} from "../../auth/auth";

function Dashboard(): JSX.Element {

    const {user, logout} = useAuth();
    const name = user?.name || 'Uzytkownik';
    const provider = 'System Arappkowego Logowania (SAL)';


    const handleLogout = async () => {
        logout();

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

    // return (
    //
    //
    //     <>
    //
    //         <div>
    //
    //
    //         </div>
    //
    //     </>
    //
    //
    // );

}

export default Dashboard;