package engineer.arabski.statistics.controller;

import engineer.arabski.common.security.CustomUserDetails;
import engineer.arabski.statistics.dto.UserStatsRequest;
import engineer.arabski.statistics.dto.UserStatsResponse;
import engineer.arabski.statistics.service.UserStatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
public class UserStatsController {


    private final UserStatsService userStatsService;

    public UserStatsController(UserStatsService userStatsService) {
        this.userStatsService = userStatsService;
    }

    @GetMapping
    public ResponseEntity<?> getUserStats( @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        System.out.print(customUserDetails.getUsername());
        System.out.print(customUserDetails.getId());
        UserStatsResponse stats = (userStatsService.getUserStats(customUserDetails.getId()));


        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<?> addUserStats(@RequestBody UserStatsRequest request, @AuthenticationPrincipal CustomUserDetails customUserDetails
    ) {

        System.out.println("Jestem w addUserStats");
        System.out.println(request.toString());
        System.out.println(customUserDetails.getUsername());
        System.out.println(customUserDetails.getId());
        UserStatsResponse response= userStatsService.addUserStats(request, customUserDetails.getId());

        return ResponseEntity.ok("User stats added successfully. " + response );
    }
}
