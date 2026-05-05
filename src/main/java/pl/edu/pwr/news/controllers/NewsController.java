package pl.edu.pwr.news.controllers;

import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.news.dto.NewsResponse;
import pl.edu.pwr.news.services.NewsService;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/user/{userId}")
    public NewsResponse getUserNews(@PathVariable int userId) {
        return newsService.getNewsForUser(userId);
    }
}