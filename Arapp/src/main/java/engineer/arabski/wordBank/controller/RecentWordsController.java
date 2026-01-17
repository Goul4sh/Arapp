package engineer.arabski.wordBank.controller;

import engineer.arabski.common.security.CustomUserDetails;
import engineer.arabski.task.dto.vocabulary.WordReferenceResponse;
import engineer.arabski.wordBank.service.RecentWordsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
public class RecentWordsController {

    private final RecentWordsService recentWordsService;

    @GetMapping("/recent")
    public ResponseEntity<?> getWordsFromRecentLessons(@AuthenticationPrincipal CustomUserDetails customUserDetails) {

        List<WordReferenceResponse> response = recentWordsService.getWordReferencesForRecentWords(customUserDetails.getId());

        return ResponseEntity.status(HttpStatus.OK).body(response);


    }


}
