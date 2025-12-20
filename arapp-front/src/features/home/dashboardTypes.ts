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