package pl.edu.pwr.news.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import pl.edu.pwr.news.dto.EverythingRequestDto;
import pl.edu.pwr.news.dto.NewsResponse;
import pl.edu.pwr.news.dto.TopHeadlinesRequestDto;
import pl.edu.pwr.news.models.UserKeyword;
import pl.edu.pwr.news.models.User;
import pl.edu.pwr.news.repository.UserRepository;

import java.util.Objects;
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

    // 1. Everything dla usera
    public NewsResponse getNewsForUser(int userId) {
        User user = getUserOrThrow(userId);
        String query = buildQueryFromKeywords(user);
        String lang = getLanguage(user);

        return fetchFromEverything(query, lang, "publishedAt");
    }

    // 2. Everything z opcjonalnymi parametrami GET
    public NewsResponse searchEverything(EverythingRequestDto req) {
        User user = getUserOrThrow(req.userId);
        String query = buildQueryFromKeywords(user);

        return webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/everything").queryParam("apiKey", apiKey);
                    if (req.q != null && !req.q.isBlank()) uriBuilder.queryParam("q", req.q);
                    else uriBuilder.queryParam("q", query);
                    if (req.sources != null && !req.sources.isBlank()) uriBuilder.queryParam("sources", req.sources);
                    if (req.domains != null && !req.domains.isBlank()) uriBuilder.queryParam("domains", req.domains);
                    if (req.excludeDomains != null && !req.excludeDomains.isBlank()) uriBuilder.queryParam("excludeDomains", req.excludeDomains);
                    if (req.from != null && !req.from.isBlank()) uriBuilder.queryParam("from", req.from);
                    if (req.to != null && !req.to.isBlank()) uriBuilder.queryParam("to", req.to);
                    if (req.language != null && !req.language.isBlank()) uriBuilder.queryParam("language", req.language);
                    if (req.sortBy != null && !req.sortBy.isBlank()) uriBuilder.queryParam("sortBy", req.sortBy);
                    if (req.pageSize != null) uriBuilder.queryParam("pageSize", req.pageSize);
                    if (req.page != null) uriBuilder.queryParam("page", req.page);
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(NewsResponse.class)
                .block();
    }

    // 3. Top Headlines z opcjonalnymi parametrami GET
    public NewsResponse searchTopHeadlines(TopHeadlinesRequestDto req) {
        User user = getUserOrThrow(req.getUserId());
        String lang = getLanguage(user);
        String firstKeyword = null;
        if (user.getKeywords() != null && !user.getKeywords().isEmpty()) {
            firstKeyword = user.getKeywords().get(0).getKeyword();
        }

        final String finalKeyword = firstKeyword;
        return webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/top-headlines").queryParam("apiKey", apiKey);
                    if (req.category != null && !req.category.isBlank()) uriBuilder.queryParam("category", req.category);
                    if (req.q != null && !req.q.isBlank()) uriBuilder.queryParam("q", req.q);
                    else if(req.category == null || req.category.isBlank()) uriBuilder.queryParam("q", finalKeyword);
                    if (Objects.equals(lang, "en")) uriBuilder.queryParam("language", lang);
                    if (req.pageSize != null) uriBuilder.queryParam("pageSize", req.pageSize);
                    if (req.page != null) uriBuilder.queryParam("page", req.page);
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(NewsResponse.class)
                .block();
    }

    // 4. Top Headlines dla usera (Tylko pierwsze słowo kluczowe, brak domyślnych wartości)
    public NewsResponse getTopHeadlinesForUser(int userId) {
        User user = getUserOrThrow(userId);

        String firstKeyword = null;
        if (user.getKeywords() != null && !user.getKeywords().isEmpty()) {
            firstKeyword = user.getKeywords().get(0).getKeyword();
        }

        String lang = getLanguage(user);
        final String finalKeyword = firstKeyword; 

        return webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/top-headlines").queryParam("apiKey", apiKey);
                    if (finalKeyword != null && !finalKeyword.isBlank()) uriBuilder.queryParam("q", finalKeyword);
                    if (Objects.equals(lang, "en")) uriBuilder.queryParam("language", lang);
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(NewsResponse.class)
                .block();
    }

    // 5. Everything dla usera posortowane po popularity
    public NewsResponse getPopularNewsForUser(int userId) {
        User user = getUserOrThrow(userId);
        String query = buildQueryFromKeywords(user);
        String lang = getLanguage(user);

        return fetchFromEverything(query, lang, "popularity");
    }

    //  --- METODY POMOCNICZE ---

    private User getUserOrThrow(int userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));
    }

    private String buildQueryFromKeywords(User user) {
        if (user.getKeywords() == null || user.getKeywords().isEmpty()) {
            return null; 
        }
        return user.getKeywords().stream()
                .map(UserKeyword::getKeyword)
                .collect(Collectors.joining(" OR "));
    }

    private String getLanguage(User user) {
        if (user.getLanguages() != null && !user.getLanguages().isEmpty()) {
            return user.getLanguages().get(0).getAbbreviation();
        }
        return null; 
    }

    private NewsResponse fetchFromEverything(String query, String lang, String sortBy) {
        return webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/everything").queryParam("apiKey", apiKey);
                    if (query != null && !query.isBlank()) uriBuilder.queryParam("q", query);
                    if (lang != null && !lang.isBlank()) uriBuilder.queryParam("language", lang);
                    if (sortBy != null && !sortBy.isBlank()) uriBuilder.queryParam("sortBy", sortBy);
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(NewsResponse.class)
                .block();
    }
}
