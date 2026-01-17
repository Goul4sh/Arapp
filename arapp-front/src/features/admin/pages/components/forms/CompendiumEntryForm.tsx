import type {MultiValue, StylesConfig} from "react-select";
import Select from "react-select";
import styles from "../../adminGlobalStyles.module.css";
import localStyles from "../../compendiumManagement.module.css";
import CompendiumContent from "../../../../writing/components/CompendiumContent.tsx";

interface CompendiumEntry {
    id: number;
    title: string;
    subtitle?: string;
    description: string;
    content: string;
    icon: string;
    requiredLessonId: number;
    tags: CompendiumTag[];
    isPublished: boolean;
}

interface CompendiumTag {
    name: string;
    displayName: string;
}

interface Option {
    value: string;
    label: string;
}

interface CompendiumEntryFormProps {
    formData: Partial<CompendiumEntry>;
    availableTags: Option[];
    onSave: () => void;
    onCancel: () => void;
    onChange: (field: keyof CompendiumEntry, value: string | number | CompendiumTag[]) => void;
}

const customSelectStyles: StylesConfig<Option, true> = {
    control: (provided, state) => ({
        ...provided,
        borderRadius: '8px',
        borderColor: state.isFocused ? '#4cae4f' : '#d1d5db',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(76, 174, 79, 0.1)' : 'none',
        padding: '2px',
        '&:hover': {borderColor: '#9ca3af'}
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
    }),
};

function CompendiumEntryForm({
                                 formData,
                                 availableTags,
                                 onSave,
                                 onCancel,
                                 onChange
                             }: CompendiumEntryFormProps) {

    const handleTagsChange = (newValue: MultiValue<Option>) => {
        const tags = newValue.map(option => ({
            name: option.value,
            displayName: option.label
        }));
        onChange('tags', tags);
    };

    const selectedTagOptions = availableTags.filter(tag =>
        formData.tags?.some(t => t.name === tag.value)
    );

    return (
        <div className={localStyles.expandedRow}>
            <div className={localStyles.editorColumn}>
                <h2 className={localStyles.columnTitle}>
                    {formData.id && formData.id > 0 ? 'Edycja wpisu' : 'Nowy wpis'}
                </h2>

                <div className={localStyles.formGroup}>
                    <label className={localStyles.formLabel}>Tytuł</label>
                    <input
                        type="text"
                        className={localStyles.formInput}
                        value={formData.title || ''}
                        onChange={(e) => onChange('title', e.target.value)}
                        placeholder="Tytuł wpisu"
                    />
                </div>

                <div className={localStyles.formGroup}>
                    <label className={localStyles.formLabel}>Podtytuł</label>
                    <input
                        type="text"
                        className={localStyles.formInput}
                        value={formData.subtitle || ''}
                        onChange={(e) => onChange('subtitle', e.target.value)}
                        placeholder="Arabski znak lub słowo"
                    />
                </div>

                <div className={localStyles.formGroup}>
                    <label className={localStyles.formLabel}>Opis</label>
                    <textarea
                        className={localStyles.formTextarea}
                        value={formData.description || ''}
                        onChange={(e) => onChange('description', e.target.value)}
                        rows={2}
                    />
                </div>

                <div className={localStyles.formGroup}>
                    <label className={localStyles.formLabel}>Treść (Markdown)</label>
                    <textarea
                        className={localStyles.formTextarea}
                        value={formData.content || ''}
                        onChange={(e) => onChange('content', e.target.value)}
                        rows={12}
                        style={{fontFamily: 'monospace'}}
                    />
                </div>

                <div className={localStyles.formRow}>
                    <div className={localStyles.formGroup}>
                        <label className={localStyles.formLabel}>Ikona</label>
                        <input
                            type="text"
                            className={localStyles.formInput}
                            value={formData.icon || ''}
                            onChange={(e) => onChange('icon', e.target.value)}
                        />
                    </div>
                    <div className={localStyles.formGroup}>
                        <label className={localStyles.formLabel}>Wymagana lekcja ID</label>
                        <input
                            type="number"
                            className={localStyles.formInput}
                            value={formData.requiredLessonId || 0}
                            onChange={(e) => onChange('requiredLessonId', Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className={localStyles.formGroup}>
                    <label className={localStyles.formLabel}>Tagi</label>
                    <Select
                        isMulti
                        options={availableTags}
                        value={selectedTagOptions}
                        onChange={handleTagsChange}
                        styles={customSelectStyles}
                        menuPlacement="top"
                    />
                </div>

                <div className={localStyles.formActions}>
                    <button className={styles.primaryButton} onClick={onSave}
                    disabled={!formData.title || !formData.content || (formData.tags && formData.tags.length === 0)}>
                        Zapisz
                    </button>
                    <button className={styles.secondaryButton} onClick={onCancel}>
                        Anuluj
                    </button>
                </div>
            </div>

            <div className={localStyles.previewColumn}>
                <h2 className={localStyles.columnTitle}>Podgląd</h2>
                <CompendiumContent
                    title={formData.title || 'Tytuł'}
                    subtitle={formData.subtitle}
                    content={formData.content || '*Brak treści*'}
                />
            </div>
        </div>
    );
}

export default CompendiumEntryForm;