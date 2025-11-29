package engineer.arabski.common.security;

import engineer.arabski.user.model.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;


public class CustomUserDetails implements UserDetails {

    @Getter
    private final Long id;
    private final String username; // here username == email
    @Getter
    private final String realUsername;
    private final String password;
    private final List<GrantedAuthority> authorities;
    private final boolean enabled;

    public CustomUserDetails(Long id, String username, String realUsername, String password, List<GrantedAuthority> authorities, boolean enabled) {
        this.id = id;
        this.username = username;
        this.realUsername = realUsername;
        this.password = password;
        this.authorities = authorities;
        this.enabled = enabled;
    }

    public static CustomUserDetails fromUser(User user) {

        String role = user.getRole();
        if (role == null || role.isEmpty()) {
            role = "USER";
            System.out.println("No role found for user " + user.getEmail() + ", assigning default role USER");
        }

        List<GrantedAuthority> auth = List.of(new SimpleGrantedAuthority(role));
        return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getPassword(),
                auth,
                true
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CustomUserDetails that = (CustomUserDetails) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
