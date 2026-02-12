import styles from './Header.module.css';
import {useAuth} from "../../auth/auth";
import {NavLink, useNavigate} from "react-router-dom";


function Header() {

    const {logout} = useAuth();
    const {user} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        logout();
        navigate("/login");
    };

    const getLinkClassName = ({isActive}: { isActive: boolean }) => {
        return isActive ? `${styles.link} ${styles.active}` : styles.link;
    }

    return (
        <header className={styles.header}>
            <div className={styles.innerBox}>
                <div className={styles.placeholder}></div>
                <div className={styles.linksSegment}>
                    <ul className={styles.linksList}>
                        {user?.role === 'ADMIN' ? (
                            <>
                            </>
                        ) : (
                            <>
                                <li className={styles.listItem}><NavLink className={getLinkClassName}
                                                                         to="/letters">Lekcje</NavLink></li>
                                <li className={styles.listItem}><NavLink className={getLinkClassName}
                                                                         to="/words">Słownictwo</NavLink></li>
                                <li className={styles.listItem}><NavLink className={getLinkClassName} to="/dashboard">Panel
                                    użytkownika</NavLink></li>
                                <li className={styles.listItem}><NavLink className={getLinkClassName}
                                                                         to="/review">Powtórki</NavLink></li>
                            </>
                        )
                        }

                    </ul>
                </div>
                <div className={styles.user}>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        Wyloguj się
                    </button>

                </div>
            </div>

        </header>
    );
}

export default Header;