package engineer.arabski.common.security.service;

import engineer.arabski.common.security.EmailVerificationToken;
import engineer.arabski.common.security.repository.EmailVerificationTokenRespository;
import engineer.arabski.user.model.User;
import engineer.arabski.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmailVerificationService {

    private final EmailVerificationTokenRespository emailRepository;


    public EmailVerificationService(EmailVerificationTokenRespository emailRepository) {
        this.emailRepository = emailRepository;
    }

    public EmailVerificationToken createToken(User user) {
        EmailVerificationToken token = new EmailVerificationToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(LocalDateTime.now().plusHours(24));
        return emailRepository.save(token);

    }

    public Optional<User> verify(String token) {

        try {

            EmailVerificationToken foundToken = emailRepository.findByToken(token);

            if (foundToken == null) return Optional.empty();

            System.out.println("Znaleziono token: " + foundToken.getToken() + ". Zmienianie statusu uzytkownika na aktywny.");

            User user = foundToken.getUser();
            user.setEnabled(true);
//            emailRepository.delete(foundToken);
            return Optional.of(user);

        } catch (Exception e) {
            System.err.println(e.getMessage());
            return Optional.empty();

        }


    }

}
