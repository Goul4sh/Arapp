package engineer.arabski.common.security.repository;

import engineer.arabski.common.security.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationTokenRespository  extends JpaRepository<EmailVerificationToken,Integer> {

    EmailVerificationToken findByToken(String token);

}
