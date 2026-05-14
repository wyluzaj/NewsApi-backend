package pl.edu.pwr.news.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pwr.news.models.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
}