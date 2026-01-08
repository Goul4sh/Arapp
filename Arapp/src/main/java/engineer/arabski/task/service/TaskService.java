package engineer.arabski.task.service;

import engineer.arabski.languageProcessing.dto.SaveDictionaryWordRequest;
import engineer.arabski.languageProcessing.model.DictionaryWord;
import engineer.arabski.languageProcessing.service.DictionaryService;
import engineer.arabski.task.dto.*;
import engineer.arabski.task.dto.vocabulary.EnrichedTaskRequest;
import engineer.arabski.task.dto.vocabulary.LinkedVocabularyRequest;
import engineer.arabski.task.model.*;
import engineer.arabski.task.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final DictionaryService dictionaryService;


    public Optional<TaskData> findById(Long id) {
        return taskRepository.findById(id)
                .map(Task::getTaskData);
    }


    public Task findByIdEntity(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + id));
    }


    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public TaskData updateTask(Long taskId, TaskData newTaskData) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));

        task.setTaskData(newTaskData);

        Task updatedTask = taskRepository.save(task);
        return updatedTask.getTaskData();
    }

    @Transactional
    public Task addTask(TaskData taskData) {
        Task task = new Task();

        task.setTaskData(taskData);

        System.out.println("Adding task: " + task.getDescription() + " of type " + task.getTaskType());

        return taskRepository.save(task);
    }

    @Transactional
    public Task addTaskWithVocab(EnrichedTaskRequest data) {
        Task task = new Task();


        System.out.println("Jestem w addTaskWithVocab");

        TaskData taskData = data.taskData();
        LinkedVocabularyRequest vocabularyRequest = data.linkedVocabulary();

        System.out.println("Zawartość vocabularyRequest: " + vocabularyRequest);

        task.setTaskData(taskData);

        if (vocabularyRequest != null) {
            for (SaveDictionaryWordRequest word : vocabularyRequest.words()) {

                System.out.println("Przetwarzam słowo: " + word);

                DictionaryWord dictionaryWord = dictionaryService.saveOrGetDictionaryWord(
                        word.lemma(),
                        word.root(),
                        word.partOfSpeech(),
                        word.translation()
                );

                TaskWordReference reference = new TaskWordReference();
                reference.setTask(task);
                reference.setDictionaryWord(dictionaryWord);

                reference.setStartIndex(word.startIndex());
                reference.setEndIndex(word.endIndex());

                task.getWordReferences().add(reference);

            }

        }

        System.out.println("Adding task: " + task.getDescription() + " of type " + task.getTaskType());
        System.out.println("References count: " + task.getWordReferences().size());
        System.out.println("Referenced words: ");
        for (TaskWordReference ref : task.getWordReferences()) {
            System.out.println("- " + ref.getDictionaryWord().getLemma() + " (start: " + ref.getStartIndex() + ", end: " + ref.getEndIndex() + ")");
        }

        return taskRepository.save(task);
    }

}
