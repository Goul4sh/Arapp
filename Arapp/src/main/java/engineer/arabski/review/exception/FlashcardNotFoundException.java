package engineer.arabski.review.exception;

public class FlashcardNotFoundException extends RuntimeException {
    public FlashcardNotFoundException(String message) {
        super(message);
    }
}