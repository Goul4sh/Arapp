package engineer.arabski.review.service;

import org.springframework.stereotype.Component;

@Component
public class Sm2Algorithm {

    public record Sm2Result(int intervalDays, int repetitions, double easeFactor) {}

    private static final double MIN_EASE_FACTOR = 1.3;

    public Sm2Result calculate(int quality, int prevRepetitions, int prevInterval, double prevEaseFactor) {
        int newRepetitions;
        int newInterval;
        double newEaseFactor;

        if (quality >= 3) {

            if (prevRepetitions == 0) {
                newInterval = 1;
            } else if (prevRepetitions == 1) {
                newInterval = 6;
            } else {
                newInterval = (int) Math.round(prevInterval * prevEaseFactor);
            }
            newRepetitions = prevRepetitions + 1;
        } else {

            newRepetitions = 0;
            newInterval = 1;
        }


        newEaseFactor = prevEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (newEaseFactor < MIN_EASE_FACTOR) {
            newEaseFactor = MIN_EASE_FACTOR;
        }

        return new Sm2Result(newInterval, newRepetitions, newEaseFactor);
    }

}
