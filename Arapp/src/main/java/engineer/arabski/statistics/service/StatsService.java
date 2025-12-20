package engineer.arabski.statistics.service;

import engineer.arabski.statistics.dto.GlobalStatsResponse;
import engineer.arabski.statistics.dto.UserStatsAggregation;
import engineer.arabski.statistics.dto.UserStatsRequest;
import engineer.arabski.statistics.dto.UserStatsResponse;
import engineer.arabski.statistics.model.DailyUserStats;
import engineer.arabski.statistics.model.GlobalUserStats;
import engineer.arabski.statistics.model.UserStats;
import engineer.arabski.statistics.repository.DailyUserStatsRepository;
import engineer.arabski.statistics.repository.GlobalUserStatsRepository;
import engineer.arabski.statistics.repository.UserStatsRepository;
import engineer.arabski.user.model.User;
import engineer.arabski.user.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StatsService {

    private final UserStatsRepository userStatsRepository;
    private final DailyUserStatsRepository dailyUserStatsRepository;
    private final GlobalUserStatsRepository globalUserStatsRepository;

    private final UserService userService;

    public StatsService(UserStatsRepository userStatsRepository, DailyUserStatsRepository dailyUserStatsRepository, GlobalUserStatsRepository globalUserStatsRepository, UserService userService) {
        this.userStatsRepository = userStatsRepository;
        this.dailyUserStatsRepository = dailyUserStatsRepository;
        this.globalUserStatsRepository = globalUserStatsRepository;
        this.userService = userService;
    }

    // wykorzystuje stare userstats do zapisywania nowych, malo optymalne rozwiązanie
    public UserStatsResponse addUserStats(UserStatsRequest userStatsRequest, Long userId) {

        User user = userService.getUserById(userId);

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

    // wykorzystuje stare userstats do zapisywania nowych, malo optymalne rozwiązanie
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

    public UserStatsResponse getDailyUserStats(Long userId, LocalDate date) {
        DailyUserStats dailyStats = dailyUserStatsRepository.findByUserIdAndDate(userId, date)
                .orElse(new DailyUserStats(null, null, date, 0L, 0L, 0L, 0L));

        return new UserStatsResponse(
                dailyStats.getDailyCompletedTasks(),
                dailyStats.getDailyCorrectAnswers(),
                dailyStats.getDailyIncorrectAnswers(),
                dailyStats.getDailyLearningTime()
        );
    }

    @Transactional
    public GlobalStatsResponse getUserDashboardStats(Long userId) {

        GlobalUserStats overall = globalUserStatsRepository.findById(userId).orElse(new GlobalUserStats());

        List<LocalDate> dates = dailyUserStatsRepository.findActivityDatesByUserId(userId);


        int currentStreak = overall.getCurrentStreak();
        LocalDate lastActivityDate = overall.getLastActivityDate();
        LocalDate today = LocalDate.now();

        if (lastActivityDate == null) {
            currentStreak = 0;
        } else {

            if (lastActivityDate.isBefore(today.minusDays(1))) {
                currentStreak = 0;
            }

        }

        List<String> dateStrings = dates.stream()
                .map(LocalDate::toString)
                .toList();

        return new GlobalStatsResponse(
                overall.getTotalTasksCompleted(),
                overall.getTotalCorrectAnswers(),
                overall.getTotalIncorrectAnswers(),
                overall.getTotalDurationSeconds(),
                dateStrings,
                (long) currentStreak
        );
    }

    @Transactional
    public void saveSessionStats(Long userId, UserStatsRequest request) {
        User user = userService.getUserById(userId);

        UserStats sessionLog = new UserStats(
                request.completedTasks(),
                request.correctAnswers(),
                request.incorrectAnswers(),
                request.durationSeconds(),
                user
        );
        userStatsRepository.save(sessionLog);


        LocalDate today = LocalDate.now();

        DailyUserStats dailyStat = dailyUserStatsRepository.findByUserIdAndDate(userId, today)
                .orElse(new DailyUserStats(null, user, today, 0L, 0L, 0L, 0L));

        dailyStat.setDailyCompletedTasks(dailyStat.getDailyCompletedTasks() + request.completedTasks());
        dailyStat.setDailyCorrectAnswers(dailyStat.getDailyCorrectAnswers() + request.correctAnswers());
        dailyStat.setDailyIncorrectAnswers(dailyStat.getDailyIncorrectAnswers() + request.incorrectAnswers());
        dailyStat.setDailyLearningTime(dailyStat.getDailyLearningTime() + request.durationSeconds());

        dailyUserStatsRepository.save(dailyStat);

        GlobalUserStats globalStats = globalUserStatsRepository.findById(userId)
                .orElse(new GlobalUserStats(null, user, 0L, 0L, 0L, 0L, 0, null));

        LocalDate lastDate = globalStats.getLastActivityDate();

        // obliczanie serii dni
        if (lastDate == null) {
            globalStats.setCurrentStreak(1);

        } else if (lastDate.isEqual(today)) {

        } else if (lastDate.isEqual(today.minusDays(1))) {
            globalStats.setCurrentStreak(globalStats.getCurrentStreak() + 1);

        } else {

            globalStats.setCurrentStreak(1);
        }

        globalStats.setLastActivityDate(today);

        globalStats.setTotalTasksCompleted(globalStats.getTotalTasksCompleted() + request.completedTasks());
        globalStats.setTotalCorrectAnswers(globalStats.getTotalCorrectAnswers() + request.correctAnswers());
        globalStats.setTotalIncorrectAnswers(globalStats.getTotalIncorrectAnswers() + request.incorrectAnswers());
        globalStats.setTotalDurationSeconds(globalStats.getTotalDurationSeconds() + request.durationSeconds());

        globalUserStatsRepository.save(globalStats);
    }


}
