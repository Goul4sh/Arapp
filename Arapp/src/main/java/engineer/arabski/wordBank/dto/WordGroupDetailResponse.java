package engineer.arabski.wordBank.dto;

import java.util.List;

public record WordGroupDetailResponse(
        Long id,
        List<WordGroupItemResponse> words

) {
}
