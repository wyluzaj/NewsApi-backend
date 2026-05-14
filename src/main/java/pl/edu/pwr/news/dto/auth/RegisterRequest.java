package pl.edu.pwr.news.dto.auth;

public class RegisterRequest {
    private String email;
    private String name;
    private String password;
    private String keyword;
    private String language;

    public RegisterRequest() {
    }

    public RegisterRequest(String email, String name, String password, String keyword, String language) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.keyword = keyword;
        this.language = language;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}