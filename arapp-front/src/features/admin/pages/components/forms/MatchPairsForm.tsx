import localStyles from "./TaskForms.module.css"
import {useEffect, useState} from "react";
import type {MatchPairsFormType} from "./formTaskTypes.ts";

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
        <div className={localStyles.formSection}>
            <h3>Match Pairs Task</h3>
            <label>
                Description:
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter task description"
                />
            </label>
            <div>
                <strong>Pairs to Match:</strong>
                {pairEntries.map((pair, index) => (
                    <div key={index} style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                        <input
                            type="text"
                            value={pair.key}
                            onChange={(e) => updatePair(index, 'key', e.target.value)}
                            placeholder="Left side (key)"
                        />
                        <input
                            type="text"
                            value={pair.value}
                            onChange={(e) => updatePair(index, 'value', e.target.value)}
                            placeholder="Right side (value)"
                        />
                        {pairEntries.length > 1 && (
                            <button onClick={() => removePair(index)}>Remove</button>
                        )}
                    </div>
                ))}
                <button onClick={addPair}>Add Pair</button>
            </div>
        </div>
    );
}
export default MatchPairsForm;