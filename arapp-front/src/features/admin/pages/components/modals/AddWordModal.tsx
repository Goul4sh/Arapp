import Modal from "../../../../review/Modal.tsx";
import styles from "../../taskManagement.module.css"
import {useEffect, useState} from "react";
import api from "../../../../auth/api.ts";


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

    const [analysisMessage, setAnalysisMessage] = useState<string>('');
    const [isWordInDatabase, setIsWordInDatabase] = useState<boolean>(false);
    const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
    const [formData, setFormData] = useState<WordFormData>({
        wordId: 0,
        wordArabic: '',
        transliteration: '',
        translation: '',
        lemma: '',
        root: '',
        partOfSpeech: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                wordId: 0,
                wordArabic: '',
                transliteration: '',
                translation: '',
                lemma: '',
                root: '',
                partOfSpeech: ''
            });
            setAnalysisMessage('');
            setIsWordInDatabase(false);
            setIsAnalyzed(false);
        }
    }, [isOpen]);

    const handleChange = (field: keyof WordFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const handleSave = () => {
        if (isWordInDatabase) {
            alert("Nie można dodać słowa, ponieważ już istnieje w bazie danych.");
            return;
        }

        if (!formData.lemma || !formData.translation) {
            alert("Pola 'Lemat' i 'Tłumaczenie' są wymagane.");
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

        setAnalysisMessage('');
        setIsWordInDatabase(false);
        setIsAnalyzed(false);

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

    const handleAnalyze = async () => {

        if (!formData.lemma.trim()) {
            alert("Pole 'Lemat' jest wymagane do analizy.");
            return;
        }

        try {
            console.log("To wysyłam do analizy słownictwa:", formData.lemma);

            const response = await
                api.post('/api/admin/dictionary/analyze',
                    {text: formData.lemma},
                    {withCredentials: true});

            console.log("Otrzymana analiza słownictwa:", response.data);

            const analyzedData = response.data;

            console.log("Przetworzone dane analizy słownictwa:", analyzedData);

            const wordExists = analyzedData.wordId !== null && analyzedData.wordId >= 0;

            setIsWordInDatabase(wordExists);
            setIsAnalyzed(true);

            if (wordExists) {
                setAnalysisMessage(`Słowo już istnieje w bazie. Dodanie tego słowa ponownie jest niemożliwe.`);
            } else {
                setAnalysisMessage('Analiza zakończona. System zwrócił prawdopodobny lemat oraz rdzeń tego słowa.');
            }

            setFormData(prev => ({
                ...prev,
                wordArabic: analyzedData.original || prev.wordArabic,
                lemma: analyzedData.lemma || prev.lemma,
                root: analyzedData.root || prev.root,
                partOfSpeech: analyzedData.partOfSpeech || prev.partOfSpeech,
                translation: analyzedData.translation || prev.translation,
                wordId: analyzedData.wordId ?? 0
            }));

            console.log(formData);

        } catch (error) {
            console.error("Błąd podczas analizy słownictwa:", error);
        }

    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={"Dodaj nowe słowo do grupy"}>

            <div className={styles.vocabularyModalContainer}>
                <div className={styles.vocabularyModalHeader}>
                    <p> Wprowadź wymagane dane, aby dodać nowe słowo.</p>
                    {analysisMessage && (
                        <p style={{
                            color: isWordInDatabase ? '#ef4444' : '#10b981',
                            backgroundColor: isWordInDatabase ? '#fee2e2' : '#d1fae5',
                            padding: '12px 16px',
                            borderRadius: '6px',
                            margin: '10px 0',
                            fontWeight: 500
                        }}>
                            {analysisMessage}
                        </p>
                    )}
                </div>


                <table className={styles.vocabularyTable}>
                    <tbody>

                    <tr>
                        <td><strong>Tłumaczenie *</strong></td>
                        <td>
                            <input
                                type="text"
                                value={formData.translation}
                                onChange={(e) => handleChange('translation', e.target.value)}
                                className={styles.translationInput}
                                placeholder="np. słowo"
                                dir="ltr"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Lemat *</strong></td>
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
                        <td><strong>Transliteracja</strong></td>
                        <td>
                            <input
                                type="text"
                                value={formData.transliteration}
                                onChange={(e) => handleChange('transliteration', e.target.value)}
                                className={styles.translationInput}
                                placeholder="np. kalima"
                                dir="ltr"

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
                                dir="ltr"

                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className={styles.buttonsContainer}>

                    <button onClick={handleClose}>
                        Anuluj
                    </button>

                    <button onClick={handleAnalyze}>
                        Wyślij do analizy
                    </button>

                    <button onClick={handleSave}
                            disabled={isWordInDatabase || !isAnalyzed}>
                        Dodaj słowo
                    </button>
                </div>


            </div>

        </Modal>
    )
}

export default AddWordModal;