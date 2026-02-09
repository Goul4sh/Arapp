package engineer.arabski.common.security.service;

import engineer.arabski.user.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
    public void sendVerificationEmail(String email, String token) {
        String link = backendUrl + "/api/auth/verify-email?token=" + token;

        try {
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Potwierdzenie rejestracji konta - Arappka");
            helper.setText(
                    "<html><body>" +
                            "<p>Aby potwierdzić adres e-mail oraz rejestrację konta kliknij w poniższy link:</p>" +
                            "<p><a href=\"" + link + "\">Potwierdź rejestrację</a></p>" +
                            "</body></html>",
                    true
            );
            sender.send(message);
            System.out.println("Email verification email sent to " + email);
        } catch (MessagingException e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {

        String link = frontendUrl + "/reset-password?token=" + token;
        try {
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Resetowanie hasła - Arappka");
            helper.setText(
                    "<html><body>" +
                            "<p>Do konta powiązanego z tym adresem e-mail została wysłana prośba o zresetowanie hasła.</p>" +
                            "<p><a href=\"" + link + "\">Kliknij tutaj, aby zresetować hasło</a></p>" +
                            "<p>Link jest ważny przez 15 minut.</p>" +
                            "<p>Jeśli to nie Ty wysłałeś prośbę, zignoruj tę wiadomość.</p>" +
                            "</body></html>",
                    true
            );

            sender.send(message);
            System.out.println("Password reset email sent to " + toEmail);
        } catch (MessagingException e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }
    }

}
