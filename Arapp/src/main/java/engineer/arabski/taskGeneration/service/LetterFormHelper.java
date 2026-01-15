package engineer.arabski.taskGeneration.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class LetterFormHelper {

    private static final Set<Character> NON_CONNECTORS = Set.of(
            'ا', 'أ', 'إ', 'آ', 'د', 'ذ', 'ر', 'ز', 'و', 'ؤ', 'ة'
    );

    private static final Map<Character, LetterForms> LETTER_FORMS = new HashMap<>();

    static {

        // Alif (2 formy)
        LETTER_FORMS.put('ا', new LetterForms("ا", "ا", "ـا", "ـا"));

        // Ba
        LETTER_FORMS.put('ب', new LetterForms("ب", "بـ", "ـبـ", "ـب"));

        // Ta
        LETTER_FORMS.put('ت', new LetterForms("ت", "تـ", "ـتـ", "ـت"));

        // Tha
        LETTER_FORMS.put('ث', new LetterForms("ث", "ثـ", "ـثـ", "ـث"));

        // Jim
        LETTER_FORMS.put('ج', new LetterForms("ج", "جـ", "ـجـ", "ـج"));

        // Ha
        LETTER_FORMS.put('ح', new LetterForms("ح", "حـ", "ـحـ", "ـح"));

        // Kha
        LETTER_FORMS.put('خ', new LetterForms("خ", "خـ", "ـخـ", "ـخ"));

        // Dal (2 formy)
        LETTER_FORMS.put('د', new LetterForms("د", "د", "ـد", "ـد"));

        // Dhal (2 formy)
        LETTER_FORMS.put('ذ', new LetterForms("ذ", "ذ", "ـذ", "ـذ"));

        // Ra (2 formy)
        LETTER_FORMS.put('ر', new LetterForms("ر", "ر", "ـر", "ـر"));

        // Zay (2 formy)
        LETTER_FORMS.put('ز', new LetterForms("ز", "ز", "ـز", "ـز"));

        // Sin
        LETTER_FORMS.put('س', new LetterForms("س", "سـ", "ـسـ", "ـس"));

        // Shin
        LETTER_FORMS.put('ش', new LetterForms("ش", "شـ", "ـشـ", "ـش"));

        // Sad
        LETTER_FORMS.put('ص', new LetterForms("ص", "صـ", "ـصـ", "ـص"));

        // Dad
        LETTER_FORMS.put('ض', new LetterForms("ض", "ضـ", "ـضـ", "ـض"));

        // Ta (emfatyczne)
        LETTER_FORMS.put('ط', new LetterForms("ط", "طـ", "ـطـ", "ـط"));

        // Dha
        LETTER_FORMS.put('ظ', new LetterForms("ظ", "ظـ", "ـظـ", "ـظ"));

        // Ayn
        LETTER_FORMS.put('ع', new LetterForms("ع", "عـ", "ـعـ", "ـع"));

        // Ghain
        LETTER_FORMS.put('غ', new LetterForms("غ", "غـ", "ـغـ", "ـغ"));

        // Fa
        LETTER_FORMS.put('ف', new LetterForms("ف", "فـ", "ـفـ", "ـف"));

        // Qaf
        LETTER_FORMS.put('ق', new LetterForms("ق", "قـ", "ـقـ", "ـق"));

        // Kaf
        LETTER_FORMS.put('ك', new LetterForms("ك", "كـ", "ـكـ", "ـك"));

        // Lam
        LETTER_FORMS.put('ل', new LetterForms("ل", "لـ", "ـلـ", "ـل"));

        // Mim
        LETTER_FORMS.put('م', new LetterForms("م", "مـ", "ـمـ", "ـم"));

        // Nun
        LETTER_FORMS.put('ن', new LetterForms("ن", "نـ", "ـنـ", "ـن"));

        // Ha (końcowe ه)
        LETTER_FORMS.put('ه', new LetterForms("ه", "هـ", "ـهـ", "ـه"));

        // Waw (2 formy)
        LETTER_FORMS.put('و', new LetterForms("و", "و", "ـو", "ـو"));

        // Ya
        LETTER_FORMS.put('ي', new LetterForms("ي", "يـ", "ـيـ", "ـي"));

    }

    public static boolean isNonConnector(char c) {
        return NON_CONNECTORS.contains(c);
    }

    public static LetterForms getForms(char c) {
        return LETTER_FORMS.getOrDefault(c, new LetterForms(String.valueOf(c), String.valueOf(c), String.valueOf(c), String.valueOf(c)));
    }

    public static Set<Character> getAllLetters() {
        return LETTER_FORMS.keySet();
    }

    public record LetterForms(String isolated, String initial, String medial, String finalForm) {
    }


}
