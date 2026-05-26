package pl.edu.pwr.news.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.edu.pwr.news.dto.auth.AuthResponse;
import pl.edu.pwr.news.dto.auth.LoginRequest;
import pl.edu.pwr.news.dto.auth.RegisterRequest;
import pl.edu.pwr.news.models.UserKeyword;
import pl.edu.pwr.news.models.UserLanguage;
import pl.edu.pwr.news.models.User;
import pl.edu.pwr.news.repository.UserKeywordRepository;
import pl.edu.pwr.news.repository.UserLanguageRepository;
import pl.edu.pwr.news.repository.UserRepository;
import pl.edu.pwr.news.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserKeywordRepository keywordRepository;
    private final UserLanguageRepository languageRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Użytkownik już istnieje!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        if (request.getKeyword() != null && !request.getKeyword().isBlank()) {
            UserKeyword keyword = new UserKeyword();
            keyword.setKeyword(request.getKeyword());
            keyword.setUser(savedUser);
            keywordRepository.save(keyword);
        }

        if (request.getLanguage() != null && !request.getLanguage().isBlank()) {
            UserLanguage language = new UserLanguage();
            language.setAbbreviation(request.getLanguage());
            language.setUser(savedUser);
            languageRepository.save(language);
        }


        String jwtToken = jwtService.generateToken(savedUser);
        return new AuthResponse(jwtToken, savedUser.getId());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));

        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken, user.getId());
    }
}
