package engineer.arabski.task.dto.vocabulary;

public record WordData(

        String word,
        String translation,
        String lemma,
        boolean hasFlashcard
) {
}
