import styles from "./TaskForms.module.css"
import {useEffect, useState} from "react";
import type {MatchPairsFormType} from "./formTaskTypes.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";

interface Props {
    onDataChange: (data: MatchPairsFormType) => void;
    initialData?: Partial<MatchPairsFormType>;
}

const MatchPairsForm = ({onDataChange, initialData}: Props) => {

    const pairsToArray = (pairs: Record<string, string> | undefined) => {
        if (!pairs) return [{key: '', value: ''}];
        const entries = Object.entries(pairs).map(([k, v]) => ({key: k, value: v}));
        return entries.length > 0 ? entries : [{key: '', value: ''}];
    };

    const [formData, setFormData] = useState<MatchPairsFormType>(() => ({
        id: initialData?.id || 0,
        type: 'match-pairs',
        description: initialData?.description || '',
        pairs: initialData?.pairs || {}
    }));

    const [pairEntries, setPairEntries] = useState<Array<{ key: string, value: string }>>(() =>
        pairsToArray(initialData?.pairs)
    );


    useEffect(() => {
        const pairsRecord = pairEntries.reduce((acc, pair) => {
            if (pair.key) {
                acc[pair.key] = pair.value
            }
            return acc
        }, {} as Record<string, string>)

        setFormData(prev => ({...prev, pairs: pairsRecord}))
    }, [pairEntries])


    useEffect(() => {
        onDataChange(formData)
    }, [formData, onDataChange])


    const updatePair = (index: number, field: 'key' | 'value', value: string) => {
        const newPairs = [...pairEntries]
        newPairs[index][field] = value
        setPairEntries(newPairs)
    }

    const addPair = () => {
        setPairEntries([...pairEntries, {key: '', value: ''}])
    }

    const removePair = (index: number) => {
        setPairEntries(pairEntries.filter((_, i) => i !== index))
    }


    return (
        <div className={styles.formContainer}>

            <div className={styles.formSection}>
                <label className={styles.formLabel}>
                    Polecenie / Opis zadania
                </label>
                <textarea
                    className={styles.formTextarea}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Połącz słowa z ich definicjami"
                    rows={3}
                />
            </div>

            <div className={styles.formSection}>
                <label className={styles.formLabel}>
                    Pary do połączenia
                </label>

                <div className={styles.dynamicList}>
                    {pairEntries.map((pair, index) => (
                        <div key={index} className={styles.listItem}>

                            <div className={styles.listItemContent} style={{ alignItems: 'center' }}>

                                <input
                                    className={styles.formInput}
                                    type="text"
                                    value={pair.key}
                                    onChange={(e) => updatePair(index, 'key', e.target.value)}
                                    placeholder="Lewa strona"
                                    // style={{ flex: 1 }}
                                />

                                <input
                                    className={styles.formInput}
                                    type="text"
                                    value={pair.value}
                                    onChange={(e) => updatePair(index, 'value', e.target.value)}
                                    placeholder="Prawa strona (Po arabsku)"
                                    // style={{ flex: 1 }}
                                    dir={"rtl"}
                                    lang={"ar"}
                                />

                            </div>

                            <div className={styles.listItemActions}>
                                <button
                                    className={styles.iconButton}
                                    onClick={() => removePair(index)}
                                    disabled={pairEntries.length <= 1}
                                    title="Usuń parę"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className={styles.addButton}
                    onClick={addPair}
                >
                    <FontAwesomeIcon icon={faPlus} /> Dodaj kolejną parę
                </button>
            </div>
        </div>
    );
}
export default MatchPairsForm;