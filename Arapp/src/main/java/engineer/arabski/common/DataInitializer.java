package engineer.arabski.common;

import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.lesson.service.LessonService;
import engineer.arabski.task.dto.ChooseOneTaskData;
import engineer.arabski.task.dto.FillInTheBlankTaskData;
import engineer.arabski.task.dto.MatchPairsTaskData;
import engineer.arabski.task.dto.MultipleChoiceTaskData;
import engineer.arabski.task.service.TaskService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class DataInitializer {

    private final TaskService taskService;

    private final LessonService lessonService;

    public DataInitializer(TaskService taskService, LessonService lessonService) {
        this.taskService = taskService;
        this.lessonService = lessonService;
    }


    @PostConstruct
    public void init() {
        taskService.addTask(new ChooseOneTaskData(
                "Jaka jest stolica Syrii?",
                "Damaszek",
                Set.of("Ankara", "Kair", "Astana")
        ));

        taskService.addTask(new MultipleChoiceTaskData(

                "Select A and C",
                Set.of("Option A", "Option C"),
                Set.of("Option B", "Option D")

        ));

        taskService.addTask(new FillInTheBlankTaskData(
                "Uzupełnij lukę.",
                "Słońce",
                "Największa gwiazda w układzie słonecznym to __."
        ));


        Lesson lesson = new Lesson();
        lessonService.addLesson(List.of(155L, 156L, 157L), lesson);

        
        taskService.addTask(new MatchPairsTaskData(
                "Dopasuj pary",
                Map.of(
                        "Polska", "Warszawa",
                        "Niemcy", "Berlin",
                        "Francja", "Paryż"
                )
        ));


    }


}
