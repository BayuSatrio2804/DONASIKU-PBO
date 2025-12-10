package Donasiku.spring.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt adalah standar untuk hashing password di Spring Security
        return new BCryptPasswordEncoder(); 
    }

    // TODO: Tambahkan konfigurasi keamanan (HttpSecurity) di sini
}