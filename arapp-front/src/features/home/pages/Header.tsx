import styles from './Header.module.css';
import {useAuth} from "../../auth/auth";
import {NavLink} from "react-router-dom";


function Header() {

    const {logout} = useAuth();
    // const name = user?.name || 'Uzytkownik';

    const handleLogout = async () => {
        logout();

    };

    const getLinkClassName = ({isActive}: { isActive: boolean }) => {
        return isActive ? `${styles.link} ${styles.active}` : styles.link;}

    return (
        <header className={styles.header}>
            <div className={styles.innerBox}>
                <div className={styles.placeholder}></div>

                <div className={styles.linksSegment}>
                    <ul className={styles.linksList}>
                        {/*TODO zmienic wyglad przyciskow */}
                        <li className={styles.listItem}><NavLink className={getLinkClassName} to="/letters">Lekcje</NavLink></li>
                        <li className={styles.listItem}><NavLink className={getLinkClassName} to="/words">Słownictwo</NavLink></li>
                        <li className={styles.listItem}><NavLink className={getLinkClassName} to="/dashboard">Panel
                            użytkownika</NavLink></li>
                        <li className={styles.listItem}><NavLink className={getLinkClassName} to="/review">Powtórki</NavLink></li>
                        <li className={styles.listItem}><NavLink className={getLinkClassName} to="/exercises">Ćwiczenia</NavLink>
                        </li>

                    </ul>

                </div>
                <div className={styles.user}>
                    {/*<div className={styles.userPhoto}></div>*/}
                    {/*<div className={styles.userName}>*/}
                    {/*    placeholder: {name}*/}
                    {/*</div>*/}
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        Wyloguj się
                    </button>

                </div>
            </div>

        </header>
    );
}

export default Header;