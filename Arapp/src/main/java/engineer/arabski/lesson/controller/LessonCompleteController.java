package engineer.arabski.lesson.controller;

import engineer.arabski.common.security.CustomUserDetails;
import engineer.arabski.lesson.dto.LessonPreviewResponse;
import engineer.arabski.lesson.service.UserLessonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/lessons/complete")
public class LessonCompleteController {


    private final UserLessonService userLessonService;

    public LessonCompleteController(UserLessonService userLessonService) {
        this.userLessonService = userLessonService;
    }

    @GetMapping
    public ResponseEntity<?> findById(@AuthenticationPrincipal CustomUserDetails customUserDetails) {

        return ResponseEntity.status(HttpStatus.OK).body(userLessonService.getCompletedLessonIds(customUserDetails.getId()));
    }

    @PostMapping("/{lessonId}")
    public ResponseEntity<?> completeLesson(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        userLessonService.markLessonAsCompleted(user.getId(), lessonId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/next")
    public ResponseEntity<?> getNextLessonToComplete(@AuthenticationPrincipal CustomUserDetails customUserDetails) {

        LessonPreviewResponse nextLessonPreview = userLessonService.getNextLessonToComplete(customUserDetails.getId());
        return ResponseEntity.status(HttpStatus.OK).body(nextLessonPreview);
    }

}
