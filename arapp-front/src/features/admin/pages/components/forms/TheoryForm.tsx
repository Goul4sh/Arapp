import {useEffect, useState} from "react";
import styles from "./TaskForms.module.css";
import localStyles from "./TheoryForm.module.css"
import type {TheoryFormExtendedType} from "./formTaskTypes.ts";
import api from "../../../../auth/api.ts";
import type {MultiValue, StylesConfig} from "react-select";
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faInfoCircle} from "@fortawesome/free-solid-svg-icons";

interface Props {
    onDataChange: (data: TheoryFormExtendedType) => void;
    initialData?: Partial<TheoryFormExtendedType>;
}

interface Option {
    value: string;
    label: string;
}

const customSelectStyles: StylesConfig<Option, true> = {
    control: (provided, state) => ({
        ...provided,
        borderRadius: '8px',
        borderColor: state.isFocused ? '#4cae4f' : '#d1d5db',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(76, 174, 79, 0.1)' : 'none',
        padding: '2px',
        '&:hover': {
            borderColor: '#9ca3af'
        }
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
    }),
};

function TheoryForm({initialData, onDataChange}: Props) {

    console.log("Inicjalne dane w TheoryForm:", initialData);

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
                const response = await api.get('/api/compendium/tags', {withCredentials: true});
                const options = response.data.map((tag: { name: string, displayName: string }) => ({
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
        onDataChange(formData);
    }, [formData, onDataChange]);

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
        <div className={styles.formContainer}>

            <div className={styles.formSection}>

                <div className={styles.formSection}>
                    <label className={`${styles.formLabel} ${localStyles.contentLabel}`}>
                        Treść teoretyczna lekcji
                    </label>
                    <textarea
                        className={`${styles.formTextarea} ${localStyles.contentTextarea}`}
                        value={formData.content}
                        onChange={(e) => handleChange('content', e.target.value)}
                        placeholder="# Nagłówek&#10;Treść lekcji...&#10;**pogrubienie**"
                        rows={12}
                    />
                    <p className={styles.helperText}>Możesz używać składni Markdown do formatowania tekstu.</p>
                </div>
            </div>

            {formData.compendiumEntryId > 0 && (
                <div className={styles.formSection}>

                    <label className={localStyles.compendiumNoticeLabel}>
                        <FontAwesomeIcon icon={faBook} className={localStyles.compendiumIcon}/>
                        To zadanie jest powiązane z wpisem w Kompendium Wiedzy. <br/>
                        Id tego wpisu: {formData.id}
                    </label>

                </div>
            )
            }

            {formData.id == 0 && (<div className={styles.formSection}>
                    <div
                        className={`${styles.listItem} ${localStyles.compendiumCheckboxItem} ${
                            formData.createCompendiumEntry
                                ? localStyles.compendiumCheckboxItemActive
                                : `${localStyles.compendiumCheckboxItemInactive} ${localStyles.compendiumCheckboxItemClosed}`
                        }`}
                        onClick={() => handleChange('createCompendiumEntry', !formData.createCompendiumEntry)}
                    >
                        <input
                            type="checkbox"
                            className={styles.formCheckbox}
                            id="createCompendiumEntry"
                            checked={formData.createCompendiumEntry}
                            onChange={(e) => handleChange('createCompendiumEntry', e.target.checked)}
                        />
                        <label
                            htmlFor="createCompendiumEntry"
                            className={styles.checkboxLabel}
                        >
                            <FontAwesomeIcon icon={faBook}
                                             className={`${localStyles.compendiumCheckboxIcon} ${
                                                 formData.createCompendiumEntry
                                                     ? localStyles.compendiumCheckboxIconActive
                                                     : localStyles.compendiumCheckboxIconInactive
                                             }`}
                            />
                            Utwórz automatycznie wpis w Kompendium wiedzy
                        </label>
                    </div>

                    {formData.createCompendiumEntry && (
                        <div className={localStyles.compendiumSection}>
                            <div className={localStyles.entryHeader}>
                                <label className={styles.formLabel}>Tytuł wpisu</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={formData.compendiumTitle}
                                    onChange={(e) => handleChange('compendiumTitle', e.target.value)}
                                    placeholder="Tytuł widoczny w spisie treści"
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={localStyles.tagSelectWrapper}>
                                    <label className={styles.formLabel}>Tagi / Kategorie</label>
                                    <div style={{position: 'relative'}}>
                                        <Select
                                            isMulti
                                            isLoading={isLoadingTags}
                                            options={availableTags}
                                            value={selectedOptions}
                                            placeholder="Wybierz tagi..."
                                            onChange={handleTagsChange}
                                            styles={customSelectStyles}
                                            noOptionsMessage={() => "Brak tagów"}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.infoBox} >
                                <FontAwesomeIcon icon={faInfoCircle} style={{marginRight: '5px'}}/>
                                Wpis zostanie powiązany z tym zdaniem i będzie widoczny w edytorze kompendium.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TheoryForm;