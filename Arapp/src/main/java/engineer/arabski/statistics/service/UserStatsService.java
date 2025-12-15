package engineer.arabski.statistics.service;

import engineer.arabski.statistics.dto.UserStatsAggregation;
import engineer.arabski.statistics.dto.UserStatsRequest;
import engineer.arabski.statistics.dto.UserStatsResponse;
import engineer.arabski.statistics.model.UserStats;
import engineer.arabski.statistics.repository.UserStatsRepository;
import engineer.arabski.user.model.User;
import engineer.arabski.user.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserStatsService {

    private final UserStatsRepository userStatsRepository;


    private final UserService userService;

    public UserStatsService(UserStatsRepository userStatsRepository, UserService userService) {
        this.userStatsRepository = userStatsRepository;
        this.userService = userService;
    }


    public UserStatsResponse addUserStats(UserStatsRequest userStatsRequest, Long userId) {


        User user = userService.getUserById(userId);

        System.out.println("Creating UserStats for user: " + user.getId());

        UserStats userStats = new UserStats(
                userStatsRequest.completedTasks(),
                userStatsRequest.correctAnswers(),
                userStatsRequest.incorrectAnswers(),
                userStatsRequest.durationSeconds(),
                user
        );

        userStatsRepository.save(userStats);


        return UserStatsResponse.fromEntity(userStats);
    }


    public UserStatsResponse getUserStats(Long userId) {
        UserStatsAggregation stats = userStatsRepository.getAggregatedStatsByUserId(userId);

        if (stats == null) {
            return new UserStatsResponse(0L, 0L, 0L, 0L);
        }

        return new UserStatsResponse(
                stats.getCompletedTasks(),
                stats.getCorrectAnswers(),
                stats.getIncorrectAnswers(),
                stats.getDurationSeconds()
        );
    }

}
