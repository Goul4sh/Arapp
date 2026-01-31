package engineer.arabski.task.service;

import engineer.arabski.languageProcessing.dto.NewDictionaryWordRequest;
import engineer.arabski.languageProcessing.dto.SaveDictionaryWordWithReferenceRequest;
import engineer.arabski.languageProcessing.model.DictionaryWord;
import engineer.arabski.languageProcessing.service.DictionaryService;
import engineer.arabski.lesson.model.CompendiumEntry;
import engineer.arabski.lesson.model.CompendiumTag;
import engineer.arabski.lesson.repository.CompendiumRepository;
import engineer.arabski.lesson.service.CompendiumTagService;
import engineer.arabski.task.dto.*;
import engineer.arabski.task.dto.vocabulary.EnrichedTaskRequest;
import engineer.arabski.task.dto.vocabulary.LinkedVocabularyRequest;
import engineer.arabski.task.model.*;
import engineer.arabski.task.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final DictionaryService dictionaryService;
    private final CompendiumRepository compendiumRepository;
    private final CompendiumTagService compendiumTagService;


    public Task addTask(TaskData taskData) {
        Task task = new Task();
        task.setTaskData(taskData);

        return taskRepository.save(task);
    }

    public Optional<TaskData> findById(Long id) {
        return taskRepository.findById(id)
                .map(Task::getTaskData);
    }


//    @Transactional

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
    public TheoryCompendiumResponse addTheoryTask(CreateTheoryTaskCompendiumRequest theoryData) {
        Task task = new Task();
        task.setTaskType("theory");
        task.setDescription(theoryData.description());

        CompendiumEntry linkedEntry = null;

        if (theoryData.createCompendiumEntry()) {

            linkedEntry = new CompendiumEntry();
            linkedEntry.setTitle(theoryData.compendiumTitle());
            linkedEntry.setContent(theoryData.compendiumContent());
            linkedEntry.setIcon(theoryData.compendiumIcon());
            linkedEntry.setDescription(theoryData.description());
            linkedEntry.setRequiredLessonId(theoryData.requiredLessonId());

            if (theoryData.tagNames() != null && !theoryData.tagNames().isEmpty()) {
                Set<CompendiumTag> tags = compendiumTagService.getAllByName(theoryData.tagNames());
                linkedEntry.setTags(tags);
            }

            linkedEntry = compendiumRepository.save(linkedEntry);

        } else if (theoryData.existingCompendiumEntryId() != null) {
            linkedEntry = compendiumRepository.findById(theoryData.existingCompendiumEntryId())
                    .orElseThrow(() -> new IllegalArgumentException("Compendium entry not found with id: " + theoryData.existingCompendiumEntryId()));
        }

        task.setCompendiumEntry(linkedEntry);

        String contentForJson = (linkedEntry != null) ? null : theoryData.compendiumContent();
        Long linkedId = (linkedEntry != null) ? linkedEntry.getId() : null;

        task.setTaskData(
                new TheoryTaskData(
                        theoryData.description(),
                        contentForJson,
                        linkedId
                )
        );

        Task savedTask = taskRepository.save(task);

        return new TheoryCompendiumResponse(
                savedTask.getId(),
                savedTask.getTaskData()
        );
    }

    @Transactional
    public Task addTaskWithVocabReferences(TaskData taskData, Long wordId) {

        Task task = new Task();

        task.setTaskData(taskData);

        DictionaryWord dictionaryWord = dictionaryService.findByIdEntity(wordId);

        if (dictionaryWord == null) {
            throw new IllegalArgumentException("Dictionary word not found with id: " + wordId);
        }
        TaskWordReference reference = new TaskWordReference();
        reference.setTask(task);
        reference.setDictionaryWord(dictionaryWord);
        reference.setStartIndex(0);
        reference.setEndIndex(0);
        task.getWordReferences().add(reference);
        return taskRepository.save(task);
    }

    @Transactional
    public Task addTaskWithVocab(EnrichedTaskRequest data) {

        if (data.linkedVocabulary().words().isEmpty()) {
            return addTask(data.taskData());
        }

        Task task = new Task();

        TaskData taskData = data.taskData();
        LinkedVocabularyRequest vocabularyRequest = data.linkedVocabulary();

        task.setTaskData(taskData);

        for (SaveDictionaryWordWithReferenceRequest word : vocabularyRequest.words()) {

            DictionaryWord dictionaryWord = dictionaryService.saveOrGetDictionaryWord(
                    new NewDictionaryWordRequest(word.lemma(),
                            "",
                            word.root(),
                            word.partOfSpeech(),
                            word.translation())
            );

            TaskWordReference reference = new TaskWordReference();
            reference.setTask(task);
            reference.setDictionaryWord(dictionaryWord);

            reference.setStartIndex(word.startIndex());
            reference.setEndIndex(word.endIndex());

            task.getWordReferences().add(reference);

        }

        return taskRepository.save(task);
    }

}
