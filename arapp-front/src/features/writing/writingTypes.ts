// TODO odpowiednio zmienic nazwy i atrybuty lekcji do tego co bedzie wyswietlane

export interface Lesson {
    id: string;
    title: string;
    icon: string; // np. "ب ت ث"
    description: string;
}

export interface ProcessedLesson extends Lesson {

    isLocked: boolean;
    isCompleted: boolean;

}

export interface Chapter {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
}

export interface ProcessedChapter extends Chapter {

    isLocked: boolean;
    lessons: ProcessedLesson[];
}

export interface CompendiumEntry {

    id: string;
    subtitle: string;
    title: string;
    description: string;
    requiredLessonId: number;
    tags: string[];


}

export interface CompendiumEntryFull extends  CompendiumEntry {

    content: string;

}

export interface CompendiumEntryDetailResponse {
    content: string;
}

export interface CompendiumTag {
    name: string;
    displayName: string;
}

