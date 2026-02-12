package engineer.arabski.statistics.controller;

import engineer.arabski.common.security.CustomUserDetails;
import engineer.arabski.statistics.dto.GlobalStatsResponse;
import engineer.arabski.statistics.dto.UserStatsRequest;
import engineer.arabski.statistics.dto.UserStatsResponse;
import engineer.arabski.statistics.service.StatsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/statistics")
public class UserStatsController {

    private final StatsService statsService;

    public UserStatsController(StatsService statsService) {
        this.statsService = statsService;
    }


    @GetMapping
    public ResponseEntity<?> getDashboardUserStats(@AuthenticationPrincipal CustomUserDetails customUserDetails) {

        System.out.print(customUserDetails.getId());
        GlobalStatsResponse stats = statsService.getUserDashboardStats(customUserDetails.getId());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/daily")
    public ResponseEntity<?> getDailyUserStats( @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        System.out.print(customUserDetails.getId());
        UserStatsResponse stats = statsService.getDailyUserStats(customUserDetails.getId(), LocalDate.now());

        return ResponseEntity.ok(stats);
    }

    // format to YYYY-MM-DD
    @GetMapping("/history/{date}")
    public ResponseEntity<?> getHistoryUserStats(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date , @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        System.out.print(customUserDetails.getId());
        UserStatsResponse stats = statsService.getDailyUserStats(customUserDetails.getId(), date);

        return ResponseEntity.ok(stats);
    }


    @PostMapping
    public ResponseEntity<?> saveSessionStats(@RequestBody UserStatsRequest request, @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {

        statsService.saveSessionStats(customUserDetails.getId(), request);

        return ResponseEntity.ok("Statystyki sesji zapisane pomyślnie.");
    }

}
