import styles from './Header.module.css';
import {useAuth} from "../../auth/auth";
import {Link} from "react-router-dom";


function Header() {

    const {user} = useAuth();
    const name = user?.name || 'Uzytkownik';


    return (
        <header className={styles.header}>
            <div className={styles.innerBox}>
                <div className={styles.linksSegment}>
                    <ul className={styles.linksList}>
                        <li className={styles.listItem}><Link className={styles.link} to="">literki</Link></li>
                        <li className={styles.listItem}><Link className={styles.link} to="">gramatyka </Link></li>
                        <li className={styles.listItem}><Link className={styles.link} to="#">słówka</Link></li>
                        <li className={styles.listItem}><Link className={styles.link} to="">fiszki</Link></li>
                        <li className={styles.listItem}><Link className={styles.link} to="/dashboard">quizy</Link></li>
                    </ul>

                </div>
                <div className={styles.user}>
                    <div className={styles.userPhoto}></div>
                    <div className={styles.userName}>{name}</div>
                </div>
            </div>

        </header>
    );
}

export default Header;