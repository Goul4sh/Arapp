export interface Lesson {
    id: string;
    title: string;
    description: string;
    icon: string; // np. "ب ت ث"
    isPublished: boolean;
    taskCount: number;
    orderIndex: number;
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
    orderIndex: number;
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
    tags: CompendiumTag[];


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

