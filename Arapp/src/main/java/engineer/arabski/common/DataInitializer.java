package engineer.arabski.common;

import engineer.arabski.lesson.service.CompendiumTagService;
import engineer.arabski.user.service.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final UserService userService;

    private final CompendiumTagService compendiumTagService;

    @PostConstruct
    public void init() {

        userService.createAdminUserIfNotExists();
        compendiumTagService.createDefaultTagsIfNotExist();

    }




}
