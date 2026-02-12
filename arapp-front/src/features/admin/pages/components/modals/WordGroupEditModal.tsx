import styles from "./wordGroupEditModal.module.css"
import cardStyles from "../../../../wordBank/pages/wordBank.module.css"
import Modal from "../../../../review/Modal.tsx";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import type {IconProp} from "@fortawesome/fontawesome-svg-core";
import IconSelector from "../forms/IconSelector.tsx";


interface WordGroup {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    wordsCount: number;
    icon: string;
}

interface WordGroupFormData {
    name: string;
    description: string;
    imageUrl: string;
    icon: string;
}

interface WordGroupEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (groupData: WordGroupFormData) => void;
    group: WordGroup | null;
}

function WordGroupEditModal({isOpen, onClose, onSave, group}: WordGroupEditModalProps) {

    const [formData, setFormData] = useState<WordGroupFormData>({
        name: '',
        description: '',
        imageUrl: '',
        icon: '',
    });

    useEffect(() => {
        if (isOpen && group) {
            setFormData({
                name: group.name,
                description: group.description,
                imageUrl: group.imageUrl || '',
                icon: group.icon || '',
            });

        }
    }, [isOpen, group]);


    const handleSave = () => {
        if (formData.name.trim() === '') {
            alert('Nazwa grupy nie może być pusta.');
            return;
        }

        onSave(formData);
        onClose();
    }

    const handleClose = () => {
        onClose();
    }


    return (


        <Modal isOpen={isOpen} onClose={onClose} title={"Edycja grupy słów"}>

            <div className={styles.groupEditModalContainer}>

                <div className={styles.formColumn}>

                    <div className={styles.formGroup}>
                        <label>Nazwa grupy</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Nazwa grupy"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Opis</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Opis grupy"
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>URL zdjęcia</label>
                        <input
                            type="text"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Ikona</label>

                        <IconSelector
                            selectedIcon={formData.icon}
                            onIconSelect={(iconName) => setFormData({
                                ...formData,
                                icon: iconName
                            })}
                            allowEmpty={true}

                        />

                    </div>

                    <div className={styles.buttonsContainer}>
                        <button onClick={handleClose} className={styles.cancelBtn}>
                            Anuluj
                        </button>
                        <button onClick={handleSave} className={styles.saveBtn}>
                            Zapisz
                        </button>
                    </div>

                </div>

                <div className={styles.previewColumn}>
                    <h2> Podgląd karty</h2>

                    <div
                        className={cardStyles.groupCard}>
                        <div className={cardStyles.wordCardBackground}>
                            {formData.imageUrl ?
                                <img
                                    src={formData.imageUrl}
                                    alt={formData.name}
                                    className={cardStyles.groupImage}
                                />
                                :
                                <div className={cardStyles.groupImagePlaceholder}>No Image</div>
                            }

                            <div className={cardStyles.groupIcon}>

                                { formData.icon ?

                                    (
                                        <FontAwesomeIcon
                                            icon={['fas', formData.icon] as IconProp}
                                        />

                                    ) : null
                                }

                            </div>

                        </div>

                        <div className={cardStyles.wordCardContent}>

                            <h3 className={cardStyles.groupName}>{formData.name}</h3>
                            <div className={cardStyles.wordCount}>
                                <span>0 słów</span>
                            </div>

                            <button>

                                Zobacz słówka

                            </button>

                        </div>
                    </div>


                </div>


            </div>


        </Modal>


    );
}

export default WordGroupEditModal;