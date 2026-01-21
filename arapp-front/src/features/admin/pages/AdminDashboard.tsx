import { type JSX } from "react";
import { Link } from "react-router-dom";
import styles from "./adminDashboard.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBook,
    faPuzzlePiece,
    faLayerGroup,
    faChevronRight, faPen
} from "@fortawesome/free-solid-svg-icons";

const adminModules = [
    {
        title: "Struktura kursu",
        link: "/admin/course",
        icon: faLayerGroup,
        color: "#48b910"
    },

    {
        title: "Kreator zawartości",
        link: "/admin/content",
        icon: faPuzzlePiece,
        color: "#f59e0b"
    },
    {
        title: "Kompendium wiedzy",
        link: "/admin/compendium",
        icon: faLayerGroup,
        color: "#10b981"
    },

    {
        title: "Grupy słów",
        link: "/admin/word-groups",
        icon: faBook,
        color: "#3b82f6"
    },
    {
        title: "Baza słownictwa",
        link: "/admin/word-bank",
        icon: faPen,
        color: "#8b5cf6"
    },

];

function AdminDashboard(): JSX.Element {
    return (
        <div className={styles.dashboardPage}>
            <div className={styles.welcomeContainer}>
                <h1 className={styles.welcomeText}>Panel administratora</h1>
                {/*<p className={styles.subtitle }>Wybierz moduł, aby zarządzać treścią.</p>*/}
            </div>

            <div className={styles.gridContainer}>
                {adminModules.map((module, index) => (
                    <Link to={module.link} key={index} className={styles.adminCard}>

                        <div
                            className={styles.iconBox}
                            style={{ backgroundColor: `${module.color}20`, color: module.color }}
                        >
                            <FontAwesomeIcon icon={module.icon} />
                        </div>

                        <div className={styles.cardContent}>
                            <h2 className={styles.cardTitle}>{module.title}</h2>
                        </div>

                        <div className={styles.arrowIcon}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;