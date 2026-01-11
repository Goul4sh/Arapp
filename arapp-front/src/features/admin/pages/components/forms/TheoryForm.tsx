import localStyles from "./TaskForms.module.css"
import type {TheoryFormExtendedType} from "./formTaskTypes.ts";
import {useEffect, useState} from "react";
import api from "../../../../auth/api.ts";
import type {MultiValue} from "react-select";
import Select from "react-select";


interface Props {
    onDataChange: (data: TheoryFormExtendedType) => void;
    initialData?: Partial<TheoryFormExtendedType>;
}

interface Option {
    value: string;
    label: string;
}

function TheoryForm({initialData, onDataChange}: Props) {


    const [formData, setFormData] = useState<TheoryFormExtendedType>(() => ({
        id: initialData?.id || 0,
        type: 'theory',
        description: initialData?.description || '',
        content: initialData?.content || '',

        createCompendiumEntry: initialData?.createCompendiumEntry || false,
        compendiumTitle: initialData?.compendiumTitle || '',
        compendiumIcon: initialData?.compendiumIcon || 'book',
        tagNames: initialData?.tagNames || []
    }));

    const [availableTags, setAvailableTags] = useState<Option[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState(false);


    useEffect(() => {
        const fetchTags = async () => {
            setIsLoadingTags(true);
            try {
                const response = await api.get('/api/compendium/tags', { withCredentials: true });
                const options = response.data.map((tag: { name : string, displayName: string }) => ({
                    value: tag.name,
                    label: tag.displayName
                }));
                setAvailableTags(options);
            } catch (error) {
                console.error("Nie udało się pobrać tagów", error);
            } finally {
                setIsLoadingTags(false);
            }
        };

        fetchTags();
    }, []);


    useEffect(() => {
        onDataChange(formData)
    }, [formData, onDataChange])

    const handleChange = (field: keyof TheoryFormExtendedType, value: string | boolean | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTagsChange = (newValue: MultiValue<Option>) => {
        const tagsArray = newValue.map(option => option.value);
        handleChange('tagNames', tagsArray);
    };

    const selectedOptions = availableTags.filter(tag => formData.tagNames.includes(tag.value));



    return (
        <div className={localStyles.formGroup}>
            <div className={localStyles.formContainer}>

                <h3> Zawartość zadania</h3>

                <label>Opis zadania</label>
                <input
                    type="text"
                    className={localStyles.formInput}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Wpisz opis zadania"
                />

                <label className={localStyles.formLabel}>Treść (Markdown)</label>
                <textarea
                    className={localStyles.formTextarea}
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Wpisz treść teoretyczną w formacie Markdown"
                    rows={12}
                />

            </div>
            <div className={`${localStyles.formContainer} ${localStyles.compendiumSettings}`}>
                <div className={localStyles.checkboxContainer}>
                    <input
                        type={'checkbox'}
                        id="createCompendiumEntry"
                        checked={formData.createCompendiumEntry}
                        onChange={(e) => handleChange('createCompendiumEntry', e.target.checked)}
                    />
                    <label htmlFor="createCompendiumEntry">Utwórz wpis w kompendium</label>
                </div>

                {formData.createCompendiumEntry && (
                    <div className={localStyles.expandedCompendiumSettings}>
                        <label>Tytuł wpisu w kompendium</label>
                        <input
                            type="text"
                            className={localStyles.formInput}
                            value={formData.compendiumTitle}
                            onChange={(e) => handleChange('compendiumTitle', e.target.value)}
                            placeholder="Wpisz tytuł wpisu w kompendium"
                        />

                        <label>Ikona wpisu w kompendium (nazwa z FontAwesome)</label>
                        <input
                            type="text"
                            className={localStyles.formInput}
                            value={formData.compendiumIcon}
                            onChange={(e) => handleChange('compendiumIcon', e.target.value)}
                            placeholder="np. book, flask, brain"
                        />

                        <label>Tagi (oddzielone przecinkami)</label>
                        <input
                            type="text"
                            className={localStyles.formInput}
                            value={formData.tagNames}
                            onChange={(e) => handleChange('tagNames', e.target.value)}
                            placeholder="np. gramatyka, słownictwo"
                        />

                        <div>
                            <label>Tagi</label>
                            <Select
                                isMulti
                                isLoading={isLoadingTags}
                                options={availableTags}
                                value={selectedOptions}
                                placeholder={"Wybierz tagi..."}
                                onChange={handleTagsChange}

                            />
                        </div>
                    </div>)}
            </div>
        </div>
    );
}

export default TheoryForm;