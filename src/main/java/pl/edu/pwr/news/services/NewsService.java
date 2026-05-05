package pl.edu.pwr.news.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import pl.edu.pwr.news.dto.NewsResponse;
import pl.edu.pwr.news.models.UserKeyword;
import pl.edu.pwr.news.models.User;
import pl.edu.pwr.news.repository.UserRepository;

import java.util.stream.Collectors;

@Service
public class NewsService {

    private final UserRepository userRepository;
    private final WebClient webClient;

    @Value("${newsapi.key}")
    private String apiKey;

    public NewsService(UserRepository userRepository, WebClient.Builder webClientBuilder) {
        this.userRepository = userRepository;
        this.webClient = webClientBuilder.baseUrl("https://newsapi.org/v2").build();
    }

    public NewsResponse getNewsForUser(int userId) {
        // 1. Pobierz użytkownika z bazy
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        // 2. Przygotuj słowa kluczowe (parametr 'q')
        String query = user.getKeywords().stream()
                .map(UserKeyword::getKeyword) // Zakładam, że Keyword ma metodę getName()
                .collect(Collectors.joining(" OR "));

        // 3. Pobierz kod języka (parametr 'language')
        String lang = (user.getLanguages() != null) ? user.getLanguages().get(0).getAbbreviation() : "en";

        // 4. Wyślij zapytanie do NewsAPI
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/everything")
                        .queryParam("q", query)
                        .queryParam("language", lang)
                        .queryParam("apiKey", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(NewsResponse.class)
                .block();
    }
}