package engineer.arabski.task.dto;

import java.util.Set;

public record CreateTheoryTaskCompendiumRequest(

        String description,
        Long requiredLessonId,

        boolean createCompendiumEntry,
        Long existingCompendiumEntryId,
        String compendiumTitle,

        String compendiumContent,

        String compendiumIcon,
        Set<String> tagNames

) {
}
