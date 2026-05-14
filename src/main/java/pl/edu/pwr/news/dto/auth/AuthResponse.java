package pl.edu.pwr.news.dto.auth;

public class AuthResponse {
    private String token;
    private int userId;

    public AuthResponse() {
    }

    public AuthResponse(String token, int userId) {
        this.token = token;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;

    }
}