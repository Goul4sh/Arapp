import Modal from "../../../../review/Modal.tsx";
import styles from "../../taskManagement.module.css"
import {useState} from "react";


export interface WordFormData {
    wordId: number;
    wordArabic: string;
    transliteration: string;
    translation: string;
    lemma: string;
    root: string;
    partOfSpeech: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (word: WordFormData) => void;

}

function AddWordModal({isOpen, onClose, onSave}: ModalProps) {
    const [formData, setFormData] = useState<WordFormData>({
        wordId: 0,
        wordArabic: '',
        transliteration: '',
        translation: '',
        lemma: '',
        root: '',
        partOfSpeech: ''
    });


    const handleChange = (field: keyof WordFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const handleSave = () => {
        if (!formData.wordArabic || !formData.translation) {
            alert("Pole 'Słowo (arabski)' i 'Tłumaczenie' są wymagane.");
            return;
        }

        onSave(formData);

        setFormData({
            wordId: 0,
            wordArabic: '',
            transliteration: '',
            translation: '',
            lemma: '',
            root: '',
            partOfSpeech: ''
        });

        onClose();
    }


    const handleClose = () => {
        setFormData({
            wordId: 0,
            wordArabic: '',
            transliteration: '',
            translation: '',
            lemma: '',
            root: '',
            partOfSpeech: ''
        });
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={"Dodaj nowe słowo do grupy"}>

            <div className={styles.vocabularyModalContainer}>
                <div>
                    <p> Wprowadź wymagane dane, aby dodać nowe słowo.</p>
                </div>


                <table className={styles.vocabularyTable}>
                    <tbody>
                    <tr>
                        <td><strong>Słowo arabskie *</strong></td>
                        <td>
                            <input
                                type="text"
                                value={formData.wordArabic}
                                onChange={(e) => handleChange('wordArabic', e.target.value)}
                                className={styles.translationInput}
                                lang="ar"
                                dir="rtl"
                                placeholder="أدخل الكلمة"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Transliteracja</strong></td>
                        <td>
                            <input
                                type="text"
                                value={formData.transliteration}
                                onChange={(e) => handleChange('transliteration', e.target.value)}
                                className={styles.translationInput}
                                placeholder="np. kalima"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Tłumaczenie *</strong></td>
                        <td>
                            <input
                                type="text"
                                value={formData.translation}
                                onChange={(e) => handleChange('translation', e.target.value)}
                                className={styles.translationInput}
                                placeholder="np. słowo"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Lemat</strong></td>
                        <td>
                            <input
                                type="text"
                                value={formData.lemma}
                                onChange={(e) => handleChange('lemma', e.target.value)}
                                className={styles.translationInput}
                                placeholder="np. كلمة"
                                lang="ar"
                                dir="rtl"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Rdzeń</strong></td>
                        <td>
                            <input
                                type="text"
                                value={formData.root}
                                onChange={(e) => handleChange('root', e.target.value)}
                                className={styles.translationInput}
                                placeholder="np. ك-ل-م"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Część mowy</strong></td>
                        <td>
                            <input
                                type="text"
                                value={formData.partOfSpeech}
                                onChange={(e) => handleChange('partOfSpeech', e.target.value)}
                                className={styles.translationInput}
                                placeholder="np. rzeczownik"
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className={styles.buttonsContainer}>
                    <button onClick={handleClose}>
                        Anuluj
                    </button>
                    <button onClick={handleSave}>
                        Dodaj słowo
                    </button>
                </div>


            </div>

        </Modal>
    )
}

export default AddWordModal;