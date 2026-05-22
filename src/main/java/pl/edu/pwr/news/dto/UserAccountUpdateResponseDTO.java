package pl.edu.pwr.news.dto;

public class UserAccountUpdateResponseDTO {

    private String token;
    private UserResponseDTO user;

    public UserAccountUpdateResponseDTO() {
    }

    public UserAccountUpdateResponseDTO(String token, UserResponseDTO user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public UserResponseDTO getUser() {
        return user;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUser(UserResponseDTO user) {
        this.user = user;
    }
}