package engineer.arabski.taskGeneration.service;

import engineer.arabski.languageProcessing.model.DictionaryWord;
import engineer.arabski.task.dto.*;
import engineer.arabski.task.dto.MorphologyFormTaskData;
import engineer.arabski.task.model.Task;
import engineer.arabski.task.service.TaskService;
import engineer.arabski.taskGeneration.dto.GeneratedTaskResponse;
import engineer.arabski.taskGeneration.dto.MorphologyRequest;
import engineer.arabski.taskGeneration.dto.TaskGenerationData;
import engineer.arabski.wordBank.dto.WordGroupItemResponse;
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

    private final TaskService taskService;

    private final MorphologyTaskGenerator morphologyTaskGenerator;

    private final WordGroupRepository wordGroupRepository;


    public List<GeneratedTaskResponse> generateTasksForWordGroup(Long wordGroupId, int count) {

        WordGroup wordGroup = wordGroupRepository.findById(wordGroupId).orElse(null);
        if (wordGroup == null) {
            throw new IllegalArgumentException("Word group not found");
        }
        System.out.println("Jestem w generowaniu z " + wordGroup.getWords().size() + " słowami.");

        List<TaskGenerationData> words = wordGroup.getWords().stream()
                .map(item -> new TaskGenerationData(
                        item.getId(),
                        item.getLemma(),
                        item.getTranslation()

                ))
                .toList();

        int wordsPerTask = count / 4; // Zakładadmy na sztywno 4 typy zadań.

        List<TaskData> generatedTasks = new ArrayList<>();


        generatedTasks.addAll(generateChooseOneTasksForWordGroup(
                words.subList(0, Math.min(wordsPerTask, words.size())),
                wordsPerTask
        ));

        generatedTasks.addAll(generateTranslationTasks(
                words.subList(wordsPerTask, Math.min(wordsPerTask * 2, words.size())),
                wordsPerTask
        ));

        generatedTasks.addAll(generateMatchingPairsTasks(
                words.subList(wordsPerTask * 2, Math.min(wordsPerTask * 3, words.size())),
                1
        ));

        List<MorphologyRequest> morphologyWords = words.subList(
                        wordsPerTask * 3,
                        Math.min(wordsPerTask * 5, words.size())
                ).stream()
                .map(w -> new MorphologyRequest(w.wordArabic(), w.wordTranslation()))
                .toList();

        generatedTasks.addAll(generateMorphologyPartsTasks(
                morphologyWords.subList(0, Math.min(wordsPerTask, morphologyWords.size())),
                wordsPerTask
        ));

//        generatedTasks.addAll(generateMorphologyFormsTasks(
//                morphologyWords.subList(
//                        Math.min(wordsPerTask, morphologyWords.size()),
//                        morphologyWords.size()
//                ),
//                wordsPerTask
//        ));

        return generatedTasks.stream()
                .map(GeneratedTaskResponse::new)
                .toList();
    }


    public List<TaskData> generateChooseOneTasksForWordGroup(List<TaskGenerationData> words, int count) {

        System.out.println("Generuję Choose One z " + words.size() + " słowami.");
        System.out.println(words.getFirst().wordArabic());

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

    public List<TaskData> generateMatchingPairsTasks(List<TaskGenerationData> words, int count) {

        List<TaskData> tasks = new ArrayList<>();

        TaskData taskdata = new MatchPairsTaskData(
                "Połącz pary słów z ich tłumaczeniami",
                words.stream().limit(count).collect(Collectors.toMap(
                        TaskGenerationData::wordTranslation,
                        TaskGenerationData::wordArabic
                        ))
        );

        tasks.add(taskdata);

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

        for ( MorphologyRequest word : selectedWords ) {

            MorphologyPartsTaskData taskData = morphologyTaskGenerator.generatePartsTask(word.wordTranslation(), word.wordArabic());

            tasks.add(taskData);
        }

        return tasks;
    }

    public List<TaskData> generateMorphologyFormsTasks(List<MorphologyRequest> words, int count) {

        List<TaskData> tasks = new  ArrayList<>();

        List<MorphologyRequest> selectedWords = words.subList(0, Math.min(count, words.size()));


        for ( MorphologyRequest word : selectedWords ) {

            MorphologyFormTaskData taskData = morphologyTaskGenerator.generateFormsTask(word.wordTranslation(), word.wordArabic());

            tasks.add(taskData);
        }


        return tasks;
    }

}
