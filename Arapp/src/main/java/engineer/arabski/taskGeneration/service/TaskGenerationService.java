package engineer.arabski.taskGeneration.service;

import engineer.arabski.task.dto.*;
import engineer.arabski.task.dto.MorphologyFormTaskData;
import engineer.arabski.taskGeneration.TaskGenerationConfig;
import engineer.arabski.taskGeneration.dto.GeneratedTaskResponse;
import engineer.arabski.taskGeneration.dto.MorphologyRequest;
import engineer.arabski.taskGeneration.dto.TaskGenerationData;
import engineer.arabski.wordBank.model.WordGroup;
import engineer.arabski.wordBank.repository.WordGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskGenerationService {
    private final MorphologyTaskGenerator morphologyTaskGenerator;
    private final WordGroupRepository wordGroupRepository;

    public List<GeneratedTaskResponse> generateTasksForWordGroup(Long wordGroupId, int count) {

        WordGroup wordGroup = wordGroupRepository.findById(wordGroupId).orElse(null);
        if (wordGroup == null) {
            throw new IllegalArgumentException("Word group not found");
        }
        List<TaskGenerationData> words = wordGroup.getWords().stream()
                .map(item -> new TaskGenerationData(
                        item.getId(),
                        item.getLemma(),
                        item.getTranslation()

                ))
                .collect(Collectors.toList());

        if (words.isEmpty()) {
            throw new IllegalArgumentException("No words found in the group");
        }

        Collections.shuffle(words);

        TaskGenerationConfig config = TaskGenerationConfig.withDefaults(count);

        List<TaskData> generatedTasks = new ArrayList<>();

        int offset = 0;

        List<TaskGenerationData> chooseOneWords = getWordsSubset(words, offset, config.chooseOneTasks());
        offset += config.chooseOneTasks();
        generatedTasks.addAll(generateChooseOneTasksForWordGroup(chooseOneWords, config.chooseOneTasks()));


        List<TaskGenerationData> translationWords = getWordsSubset(words, offset, config.translationTasks());
        offset += config.translationTasks();
        generatedTasks.addAll(generateTranslationTasks(translationWords, config.translationTasks()));

        List<TaskGenerationData> matchingPairsWords = getWordsSubset(words, offset, config.matchingPairsTasks() * config.wordsPerMatchingTask());
        offset += config.matchingPairsTasks() * config.wordsPerMatchingTask();
        generatedTasks.addAll(generateMatchingPairsTasks(matchingPairsWords, config.matchingPairsTasks(), config.wordsPerMatchingTask()));

        List<TaskGenerationData> morphologyPartsWords = getWordsSubset(words, offset, config.morphologyPartsTasks());
        offset += config.morphologyPartsTasks();
        List<MorphologyRequest> morphologyPartsRequests = morphologyPartsWords.stream()
                .map(w -> new MorphologyRequest(w.wordArabic(), w.wordTranslation()))
                .toList();
        generatedTasks.addAll(generateMorphologyPartsTasks(morphologyPartsRequests, config.morphologyPartsTasks()));

        List<TaskGenerationData> morphologyFormsWords = getWordsSubset(words, offset, config.morphologyFormsTasks());
        offset += config.morphologyFormsTasks();
        List<MorphologyRequest> morphologyFormsRequests = morphologyFormsWords.stream()
                .map(w -> new MorphologyRequest(w.wordArabic(), w.wordTranslation()))
                .toList();
        generatedTasks.addAll(generateMorphologyFormsTasks(morphologyFormsRequests, config.morphologyFormsTasks()));

        Collections.shuffle(generatedTasks);

        return generatedTasks.stream()
                .map(GeneratedTaskResponse::new)
                .toList();
    }


    private List<TaskGenerationData> getWordsSubset(List<TaskGenerationData> words, int offset, int count) {
        if (offset >= words.size()) {
            return Collections.emptyList();
        }
        int end = Math.min(offset + count, words.size());
        return new ArrayList<>(words.subList(offset, end));
    }


    public List<TaskData> generateChooseOneTasksForWordGroup(List<TaskGenerationData> words, int count) {

        List<TaskGenerationData> mutableWords = new ArrayList<>(words);
        Collections.shuffle(mutableWords);
        List<TaskGenerationData> selectedWords = mutableWords.subList(0, Math.min(count, mutableWords.size()));

        List<TaskData> tasks = new ArrayList<>();

        for (TaskGenerationData correctAnswer : selectedWords) {

            Set<String> decoys = words.stream()
                    .filter(w -> !w.id().equals(correctAnswer.id()))
                    .map(TaskGenerationData::wordTranslation)
                    .collect(Collectors.collectingAndThen(Collectors.toList(), list -> {
                        Collections.shuffle(list);
                        return list.stream().limit(3).collect(Collectors.toSet());
                    }));

            TaskData taskData = new ChooseOneTaskData(
                    "Wybierz tłumaczenie słowa: " + correctAnswer.wordArabic(),
                    correctAnswer.wordTranslation(),
                    decoys
            );

            tasks.add(taskData);
        }

        return tasks;
    }

    public List<TaskData> generateMatchingPairsTasks(List<TaskGenerationData> words, int taskCount, int wordsPerTask) {
        List<TaskData> tasks = new ArrayList<>();

        for (int i = 0; i < taskCount; i++) {

            int startIndex = i * wordsPerTask;
            int endIndex = Math.min(startIndex + wordsPerTask, words.size());

            if (startIndex >= words.size()) {break;}
            List<TaskGenerationData> taskWords = words.subList(startIndex, endIndex);
            TaskData taskdata = new MatchPairsTaskData(
                    "Połącz pary słów z ich tłumaczeniami",
                    taskWords.stream().collect(Collectors.toMap(
                            TaskGenerationData::wordTranslation,
                            TaskGenerationData::wordArabic
                    ))
            );
            tasks.add(taskdata);
        }
        return tasks;
    }

    public List<TaskData> generateTranslationTasks(List<TaskGenerationData> words, int count) {

        List<TaskData> tasks = new ArrayList<>();
        List<TaskGenerationData> selectedWords = words.subList(0, Math.min(count, words.size()));
        for (TaskGenerationData word : selectedWords) {
            TaskData taskData = new TranslateTaskData(
                    "Przetłumacz podane słowo: ",
                    word.wordArabic(),
                    word.wordTranslation()
            );
            tasks.add(taskData);
        }
        return tasks;
    }


    //Działają na pojedynczych słowach, rozbijają je na kawałki

    public List<TaskData> generateMorphologyPartsTasks(List<MorphologyRequest> words, int count) {

        List<TaskData> tasks = new ArrayList<>();
        List<MorphologyRequest> selectedWords = words.subList(0, Math.min(count, words.size()));
        for (MorphologyRequest word : selectedWords) {
            MorphologyPartsTaskData taskData = morphologyTaskGenerator.generatePartsTask(word.wordTranslation(), word.wordArabic());
            tasks.add(taskData);
        }

        return tasks;
    }

    public List<TaskData> generateMorphologyFormsTasks(List<MorphologyRequest> words, int count) {

        List<TaskData> tasks = new ArrayList<>();
        List<MorphologyRequest> selectedWords = words.subList(0, Math.min(count, words.size()));
        for (MorphologyRequest word : selectedWords) {

            MorphologyFormTaskData taskData = morphologyTaskGenerator.generateFormsTask(word.wordTranslation(), word.wordArabic());
            tasks.add(taskData);
        }

        return tasks;
    }

}
