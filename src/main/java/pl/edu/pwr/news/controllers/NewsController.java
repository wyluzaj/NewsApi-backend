package pl.edu.pwr.news.controllers;

import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.news.dto.EverythingRequestDto;
import pl.edu.pwr.news.dto.NewsResponse;
import pl.edu.pwr.news.dto.TopHeadlinesRequestDto;
import pl.edu.pwr.news.services.NewsService;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    // 1. Everything dla usera po ID
    @GetMapping("/user/{userId}")
    public NewsResponse getUserNews(@PathVariable int userId) {
        return newsService.getNewsForUser(userId);
    }

    // 2. NOWY - Everything jako GET (Opcjonalne parametry w URL)
    @GetMapping("/search/everything")
    public NewsResponse searchEverything(EverythingRequestDto request) {
        return newsService.searchEverything(request);
    }

    // 3. NOWY - Top Headlines jako GET (Opcjonalne parametry w URL)
    @GetMapping("/search/top-headlines")
    public NewsResponse searchTopHeadlines(TopHeadlinesRequestDto request) {
        return newsService.searchTopHeadlines(request);
    }

    // 4. NOWY - Top Headlines dla usera (Tylko 1 keyword)
    @GetMapping("/user/{userId}/top-headlines")
    public NewsResponse getUserTopHeadlines(@PathVariable int userId) {
        return newsService.getTopHeadlinesForUser(userId);
    }

    // 5. NOWY - Everything dla usera posortowane po POPULARNOŚCI
    @GetMapping("/user/{userId}/popular")
    public NewsResponse getPopularUserNews(@PathVariable int userId) {
        return newsService.getPopularNewsForUser(userId);
    }
}