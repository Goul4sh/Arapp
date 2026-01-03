export interface GlobalDashboardData {
    totalCompletedTasks: number;
    totalCorrectAnswers: number;
    totalDurationSeconds: number;
    totalIncorrectAnswers: number;
    currentStreak: number;
    activityDates: string[];
}

export interface DailyDashboardData {
    completedTasks: number;
    correctAnswers: number;
    incorrectAnswers: number;
    durationSeconds: number;
}

export interface NextLessonData {
    id: string;
    title: string;
    icon: string;
    description: string;
    chapterTitle: string;
}

