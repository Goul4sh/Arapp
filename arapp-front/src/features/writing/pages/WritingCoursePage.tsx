import styles from '../writing.module.css'
import {useState} from "react";
import AlphabetPath from "../components/AlphabetPath.tsx";
import Compendium from "../components/Compendium.tsx";

function WritingCoursePage() {

    const [selectedSection, setSelectedSection] = useState<'learningPath' | 'compendium'>('learningPath')

    return (
        <div className={styles.writingPage}>

            <div className={styles.sectionsHeader}>

                <div className={`${styles.sectionContainer}`}>

                    <button
                        className={`${styles.headerButton} ${selectedSection === 'learningPath' ? styles.selectedHeaderButton : ''}`}
                        onClick={() => {
                            setSelectedSection('learningPath')
                        }}>
                        Ścieżka nauki
                    </button>

                    <button
                        className={`${styles.headerButton} ${selectedSection === 'compendium' ? styles.selectedHeaderButton : ''}`}
                        onClick={() => {
                            setSelectedSection('compendium')
                        }}>
                        Kompendium wiedzy
                    </button>

                </div>

            </div>

            <div className={styles.sectionWrapper}>


                {selectedSection === 'learningPath' ? (<AlphabetPath/>) : (<Compendium/>)}


            </div>


        </div>
    )
}

export default WritingCoursePage;