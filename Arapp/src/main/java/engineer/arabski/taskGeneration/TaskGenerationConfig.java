package engineer.arabski.taskGeneration;

public record TaskGenerationConfig(
        int totalTasks,
        int chooseOneTasks,
        int translationTasks,
        int matchingPairsTasks,
        int morphologyPartsTasks,
        int morphologyFormsTasks,
        int wordsPerMatchingTask,
        int decoysPerChooseOne
) {
    public static TaskGenerationConfig withDefaults(int totalTasks) {
        return new TaskGenerationConfig(
                totalTasks,
                totalTasks / 5,
                totalTasks / 5,
                totalTasks / 5,
                totalTasks / 5,
                totalTasks / 5,
                5,
                3);
    }
}
