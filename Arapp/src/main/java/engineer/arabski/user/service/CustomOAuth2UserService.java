package engineer.arabski.user.service;

import engineer.arabski.user.model.User;
import engineer.arabski.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;

    public CustomOAuth2UserService(UserService userService) {

        this.userService = userService;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);


        ////
        Map<String, Object> attributes = oAuth2User.getAttributes();
        attributes.forEach((key, value) -> {
            System.out.println(key + " = " + value);
        });

        userService.processOAuthPostLogin(oAuth2User);
        ////

        return oAuth2User;
    }

}
