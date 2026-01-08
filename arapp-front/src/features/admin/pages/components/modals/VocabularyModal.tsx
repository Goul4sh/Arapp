import Modal from "../../../../review/Modal.tsx";
import {useEffect, useState} from "react";
import styles from "../../taskManagement.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faX} from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (items: VocabularyItem[]) => void;
    vocabularyItems: VocabularyItem[];

}

type VocabularyItem = {

    original: string;
    lemma: string,
    partOfSpeech: string,
    root: string,
    // diacritic: string,
    // String definition,
    wordId: number,
    translation: string
    isIncluded: boolean;

}

function VocabularyModal({isOpen, onClose, onSave, vocabularyItems}: ModalProps) {

    const [items, setItems] = useState<VocabularyItem[]>(vocabularyItems || []);

    useEffect(() => {
        if (isOpen) {
            setItems(vocabularyItems || []);
        }
    }, [isOpen, vocabularyItems]);

    const handleTranslationChange = (index: number, value: string) => {
        const updatedItems = [...items];
        updatedItems[index].translation = value;
        setItems(updatedItems);
    }

    const handleCheckboxChange = (index: number) => {
        const updatedItems = [...items];
        updatedItems[index].isIncluded = !updatedItems[index].isIncluded;
        setItems(updatedItems);

        console.log("Updated Items:", updatedItems);
    }


    const handleSave = () => {
        onSave(items);
        onClose();
    }


    const handleClose = () => {
        onClose();
    }

    return (

        <Modal isOpen={isOpen} onClose={onClose} title={"Analiza słownictwa"}>

            <div className={styles.vocabularyModalContainer}>

                <div>
                    <p> Zaznacz słowa, które mają być zawarte w referencji do zadania.</p>
                    <p> Jezeli słowo nie znajduje się w bazie, dodanie go jako referencji spowoduje jednoczesne dodanie go do bazy.</p>


                </div>

                <table className={styles.vocabularyTable}>
                    <thead>
                    <tr>
                        <th>Uwzględnij</th>
                        <th>Lemat</th>
                        <th>Rdzeń</th>
                        <th>Wykryte słowo</th>
                        <th>Tłumaczenie lematu</th>
                        <th>Wykryto w bazie</th>
                    </tr>
                    </thead>

                    <tbody>
                    {items.map((item, index) => (

                        <tr key={index}>

                            <td>
                                <input
                                    type="checkbox"
                                    checked={item.isIncluded}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                            </td>
                            <td>{item.lemma}</td>
                            <td>{item.root}</td>
                            <td>{item.original}</td>
                            <td>
                                <input
                                    type="text"
                                    value={item.translation}
                                    onChange={(e) => handleTranslationChange(index, e.target.value)}
                                    className={styles.translationInput}
                                />
                            </td>
                            <td>
                                {/*//TODO poprawic na kolory ktorych gdzies uzywam*/}
                                <div className={styles.tableIcon}>

                                    {item.wordId > 0 ? (<FontAwesomeIcon icon={faCheck} style={{color:"green"}} />) : (<FontAwesomeIcon icon={faX} style={{color:"red"}}/>)}
                                </div>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className={styles.buttonsContainer}>
                    <button onClick={() => handleClose()}>
                        Anuluj
                    </button>
                    <button onClick={() => handleSave()}>
                        Zapisz słownictwo
                    </button>

                </div>

            </div>


        </Modal>


    )


}

export default VocabularyModal