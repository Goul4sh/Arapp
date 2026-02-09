import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import type {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {
    faBook, faGraduationCap, faLightbulb, faPuzzlePiece,
    faRocket, faStar, faTrophy, faHeart, faCog, faFlag
} from "@fortawesome/free-solid-svg-icons";
import {useState, useRef, useEffect} from "react";
import styles from "./IconSelector.module.css";

interface IconSelectorProps {
    selectedIcon: string;
    onIconSelect: (iconName: string | null) => void;
    allowEmpty? : boolean;
}

const availableIcons: { name: string; icon: IconDefinition }[] = [
    {name: 'book', icon: faBook},
    {name: 'graduation-cap', icon: faGraduationCap},
    {name: 'lightbulb', icon: faLightbulb},
    {name: 'puzzle-piece', icon: faPuzzlePiece},
    {name: 'rocket', icon: faRocket},
    {name: 'star', icon: faStar},
    {name: 'trophy', icon: faTrophy},
    {name: 'heart', icon: faHeart},
    {name: 'cog', icon: faCog},
    {name: 'flag', icon: faFlag}
];

function IconSelector({selectedIcon, onIconSelect, allowEmpty = false}: IconSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedIconObj = selectedIcon
        ? availableIcons.find(i => i.name === selectedIcon)
        : null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);




    return (
        <div className={styles.iconSelectorContainer} ref={dropdownRef}>
            <div className={styles.dropdownWrapper}>
                <button
                    type="button"
                    className={styles.dropdownButton}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className={styles.selectedIcon}>
                        {selectedIconObj ? (
                            <>
                                <FontAwesomeIcon icon={selectedIconObj.icon}/>
                                <span>{selectedIconObj.name}</span>
                            </>
                        ) : (
                            <span>{allowEmpty && !selectedIcon ? 'Brak ikony' : 'Wybierz ikonę'}</span>
                        )}
                    </div>
                </button>

                {isOpen && (
                    <div className={styles.dropdownMenu}>
                        {allowEmpty && (
                            <button
                                type="button"
                                className={`${styles.iconOption} ${selectedIcon === null ? styles.selected : ''}`}
                                onClick={() => {
                                    onIconSelect(null);
                                    setIsOpen(false);
                                }}
                            >
                                <span className={styles.noIcon}>Brak ikony</span>
                            </button>
                        )}
                        {availableIcons.map(({name, icon}) => (
                            <button
                                key={name}
                                type="button"
                                className={`${styles.iconOption} ${selectedIcon === name ? styles.selected : ''}`}
                                onClick={() => {
                                    onIconSelect(name);
                                    setIsOpen(false);
                                }}
                            >
                                <FontAwesomeIcon icon={icon}/>
                                <span>{name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default IconSelector;
