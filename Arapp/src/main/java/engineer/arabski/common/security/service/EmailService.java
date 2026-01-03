package engineer.arabski.common.security.service;

import engineer.arabski.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender sender;

    @Value("${app.backend.url}")
    private String backendUrl;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(User user, String token) {
        String link = backendUrl + "/api/auth/verify-email?token=" + token;

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(user.getEmail());
        msg.setSubject("Potwierdzenie rejestracji konta - ArAppka");
        msg.setText("Aby potwierdzić adres e-mail oraz rejestrację konta kliknij w podany link: " + link);

        sender.send(msg);
        System.out.println("Email verification email sent to " + user.getEmail());
    }
    //TODO zmienić wyglad wysylanego maila na troche bardziej normalny


    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {

        String link = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        msg.setSubject("Resetowanie hasła - ArAppka");
        msg.setText(
                "Do konta powiązanego z tym adresem e-mail została wysłana prośba o zresetowanie hasła.\n" +
                        "Kliknij w poniższy link, aby ustawić nowe hasło:\n\n" +
                        link + "\n\n" +
                        "Link jest ważny przez 15 minut.\n" +
                        "Jeśli to nie Ty wysłałeś prośbę, zignoruj tę wiadomość."
        );

        sender.send(msg);
        System.out.println("Password reset email sent to " + toEmail);
    }

}
