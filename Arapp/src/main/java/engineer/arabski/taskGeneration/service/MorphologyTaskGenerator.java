package engineer.arabski.taskGeneration.service;

import engineer.arabski.task.dto.MorphologyFormTaskData;
import engineer.arabski.task.dto.MorphologyFormsTask.MorphologyOption;
import engineer.arabski.task.dto.MorphologyFormsTask.MorphologyStep;
import engineer.arabski.task.dto.MorphologyPartsTaskData;
import engineer.arabski.task.dto.MorphologySegment;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MorphologyTaskGenerator {


    private String removeDiacritics(String input) {
        // Regex usuwający znaki diaktryczne, np. harakarty
        return input.replaceAll("[\\u064B-\\u065F\\u0670]", "");
    }


    public MorphologyPartsTaskData generatePartsTask(String translation, String arabicWord) {

        String trimmedWord = arabicWord.trim();

        List<String> correctOrder = new ArrayList<>();
        List<MorphologySegment> segments = new ArrayList<>();

        List<String> letterGroups = groupLettersWithDiacritics(trimmedWord);

        for (int i = 0; i < letterGroups.size(); i++) {
            String letterWithDiacritics = letterGroups.get(i);
            String id = "seg_" + i;

            correctOrder.add(id);
            segments.add(new MorphologySegment(id, letterWithDiacritics));
        }

        List<MorphologySegment> decoys = generateDecoySegments(letterGroups, 3);

        return new MorphologyPartsTaskData(
                "Ułóż litery w poprawnej kolejności, aby utworzyć tłumaczenie słowa: ",
                translation,
                correctOrder,
                segments,
                decoys
        );
    }

    private List<String> groupLettersWithDiacritics(String arabicText) {
        List<String> groups = new ArrayList<>();
        StringBuilder currentGroup = new StringBuilder();

        for (int i = 0; i < arabicText.length(); i++) {
            char c = arabicText.charAt(i);

            if (isDiacritic(c)) {
                currentGroup.append(c);
            } else {
                if (currentGroup.length() > 0) {
                    groups.add(currentGroup.toString());
                }
                currentGroup = new StringBuilder();
                currentGroup.append(c);
            }
        }

        if (currentGroup.length() > 0) {
            groups.add(currentGroup.toString());
        }

        return groups;
    }

    private boolean isDiacritic(char c) {
        return (c >= '\u064B' && c <= '\u065F') ||
                c == '\u0670' ||
                (c >= '\u0617' && c <= '\u061A') ||
                (c >= '\u06D6' && c <= '\u06ED');
    }


    private List<MorphologySegment> generateDecoySegments(List<String> letterGroups, int count) {
        // Wyciągamy litery bazowe (bez diakrytyków) do porównania
        Set<Character> usedBaseLetters = new HashSet<>();
        for (String group : letterGroups) {
            char baseChar = group.charAt(0); // pierwsza to litera bazowa
            usedBaseLetters.add(baseChar);
        }

        List<Character> allLetters = new ArrayList<>(LetterFormHelper.getAllLetters());
        allLetters.removeAll(usedBaseLetters);

        List<MorphologySegment> decoys = new ArrayList<>();

        for (int i = 0; i < Math.min(count, allLetters.size()); i++) {
            char decoyLetter = allLetters.get(i);
            String decoyContent = getRandomLetterForm(decoyLetter);

            decoys.add(new MorphologySegment(
                    "decoy_" + i,
                    decoyContent
            ));
        }

        return decoys;
    }

    private String getRandomLetterForm(char letter) {
        LetterFormHelper.LetterForms forms = LetterFormHelper.getForms(letter);
        List<String> allForms = List.of(
                forms.isolated(),
                forms.initial(),
                forms.medial(),
                forms.finalForm()
        );

        return allForms.get(new Random().nextInt(allForms.size()));
    }

    public MorphologyFormTaskData generateFormsTask(String translation, String arabicWord) {

        String trimmedWord = arabicWord.trim();
        String cleanWord = removeDiacritics(trimmedWord);
        List<MorphologyStep> steps = new ArrayList<>();
        boolean previousConnects = false;

        for (int i = 0; i < cleanWord.length(); i++) {
            char currentChar = cleanWord.charAt(i);
            boolean isLastLetter = (i == cleanWord.length() - 1);

            String correctFormContent;

            if (i == 0) {
                // Pierwsza litera
                correctFormContent = LetterFormHelper.getForms(currentChar).initial();
            } else if (isLastLetter) {
                // Ostatnia litera
                if (previousConnects) {
                    correctFormContent = LetterFormHelper.getForms(currentChar).finalForm();
                } else {
                    correctFormContent = LetterFormHelper.getForms(currentChar).isolated();
                }
            } else {
                // Środek słowa
                if (previousConnects) {
                    correctFormContent = LetterFormHelper.getForms(currentChar).medial();
                } else {
                    correctFormContent = LetterFormHelper.getForms(currentChar).initial();
                }
            }

            List<MorphologyOption> options = createOptionsForLetter(currentChar, correctFormContent);
            steps.add(new MorphologyStep(i, options));
            previousConnects = !LetterFormHelper.isNonConnector(currentChar);
        }

        return new MorphologyFormTaskData(
                "Wybierz poprawne formy liter, aby utworzyć tłumaczenie słowa: ",
                translation,
                steps
        );
    }

    private List<MorphologyOption> createOptionsForLetter(char c, String correctContent) {
        var forms = LetterFormHelper.getForms(c);

        // Zbieramy wszystkie możliwe wyglądy litery
        Set<String> allVariants = new HashSet<>();
        allVariants.add(forms.isolated());
        allVariants.add(forms.initial());
        allVariants.add(forms.medial());
        allVariants.add(forms.finalForm());

        List<MorphologyOption> options = new ArrayList<>();
        int idCounter = 1;

        for (String variant : allVariants) {
            boolean isCorrect = variant.equals(correctContent);

            options.add(new MorphologyOption(
                    String.valueOf(idCounter++),
                    variant,
                    isCorrect
            ));
        }

        Collections.shuffle(options);
        return options;
    }


}
