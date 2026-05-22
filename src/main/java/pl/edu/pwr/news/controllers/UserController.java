package pl.edu.pwr.news.controllers;

import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.news.mapper.Mapper;
import pl.edu.pwr.news.models.User;
import pl.edu.pwr.news.repository.UserRepository;
import pl.edu.pwr.news.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import pl.edu.pwr.news.security.JwtService;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @GetMapping("/full")
    public List<UserResponseDTO> getFullAll() {
        return userRepository.findAll().stream()
                .map(Mapper::toUserDTO)
                .toList();
    }

    @GetMapping("/full/{id}")
    public UserResponseDTO getFullOne(@PathVariable int id) {
        User user = userRepository.findById(id).orElseThrow();
        return Mapper.toUserDTO(user);
    }

    @GetMapping
    public List<UserGet> getAll() {
        return userRepository.findAll().stream()
                .map(Mapper::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public UserGet getOne(@PathVariable int id) {
        User user = userRepository.findById(id).orElseThrow();
        return Mapper.toDTO(user);
    }

    @PostMapping
    public UserResponseDTO create(@RequestBody UserCreateDTO dto) {
        User user = new User();

        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setName(dto.getName());

        return Mapper.toUserDTO(userRepository.save(user));
    }

    @PutMapping("/{id}")
    public UserResponseDTO update(@PathVariable int id, @RequestBody UserCreateDTO dto) {
        User user = userRepository.findById(id).orElseThrow();

        user.setEmail(dto.getEmail());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        user.setName(dto.getName());

        return Mapper.toUserDTO(userRepository.save(user));
    }

    @PutMapping("/{id}/account")
    public UserAccountUpdateResponseDTO updateAccount(
            @PathVariable int id,
            @RequestBody UserAccountUpdateDTO dto
    ) {
        User user = userRepository.findById(id).orElseThrow();

        if (dto.getOldPassword() == null || dto.getOldPassword().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Stare hasło jest wymagane."
            );
        }

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Stare hasło jest niepoprawne."
            );
        }

        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName());
        }

        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            user.setEmail(dto.getEmail());
        }

        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        User savedUser = userRepository.save(user);
        String newToken = jwtService.generateToken(savedUser);

        return new UserAccountUpdateResponseDTO(
                newToken,
                Mapper.toUserDTO(savedUser)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        userRepository.deleteById(id);
    }
}