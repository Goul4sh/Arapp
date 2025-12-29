package engineer.arabski.common;

import engineer.arabski.user.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final UserService userService;

    public DataInitializer(UserService userService) {

        this.userService = userService;
    }


    @PostConstruct
    public void init() {

        userService.createAdminUserIfNotExists();

    }


}
