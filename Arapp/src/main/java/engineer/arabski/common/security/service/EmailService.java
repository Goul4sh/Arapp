package engineer.arabski.common.security.service;

import engineer.arabski.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender sender;

    // TODO zmienic na zmienna srodowiskowa?
    public void sendVerificationEmail(User user, String token) {
        String link = "http://localhost:8080/api/auth/verify-email?token=" + token;

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(user.getEmail());
        msg.setSubject("Potwierdź swój email");
        msg.setText("Kliknij: " + link);

        sender.send(msg);
        System.out.println("Email verification email sent to " + user.getEmail());
    }
    //TODO zmienić wyglad wysylanego maila na troche bardziej normalny
}
