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
                        {/*TODO zmienic wyglad przyciskow */}
                        <li className={styles.listItem}><Link className={styles.link} to="/letters">literki</Link></li>
                        <li className={styles.listItem}><Link className={styles.link} to="/grammar">gramatyka </Link></li>
                        <li className={styles.listItem}><Link className={styles.link} to="/words">słówka</Link></li>
                        <li className={styles.listItem}><Link className={styles.link} to="/review">fiszki</Link></li>
                        <li className={styles.listItem}><Link className={styles.link} to="/quiz">quizy</Link></li>
                    </ul>

                </div>
                <div className={styles.user}>
                    <div className={styles.userPhoto}></div>
                    <div className={styles.userName}>
                        <Link to="/dashboard" className={styles.userLink}>
                            {name}</Link>
                    </div>
                </div>
            </div>

        </header>
    );
}

export default Header;