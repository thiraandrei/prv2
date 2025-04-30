package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.dtos.UserDetailsDTO;
import ro.tuc.ds2020.dtos.builders.UserBuilder;
import ro.tuc.ds2020.entities.User;
import ro.tuc.ds2020.repositories.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDetailsDTO> findAllUsers() {
        List<User> userList = userRepository.findAll();
        return userList.stream()
                .map(UserBuilder::toUserDetailsDTO)
                .collect(Collectors.toList());
    }

    public UserDetailsDTO findUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (!userOptional.isPresent()) {
            LOGGER.error("User with username {} was not found in db", username);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with username: " + username);
        }
        return UserBuilder.toUserDetailsDTO(userOptional.get());
    }

    public void insert(UserDetailsDTO userDTO) {
        User user = UserBuilder.toEntity(userDTO);
        userRepository.save(user);
        LOGGER.debug("User with username {} was inserted in db", user.getUsername());
    }

    public UserDTO updateUser(String username, UserDetailsDTO userDTO) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (!userOptional.isPresent()) {
            LOGGER.error("User with username {} not found for update", username);
            return null;
        }

        User user = userRepository.findByUsername(userDTO.getUsername()).get();
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPhysicalAddress(userDTO.getPhysicalAddress());
        user.setRole(userDTO.getRole());
        user.setPassword(userDTO.getPassword());

        User updatedUser = userRepository.save(user);
        LOGGER.debug("User with username {} was updated in db", username);
        return UserBuilder.toUserDTO(updatedUser);
    }

    public boolean deleteUser(String username) {
        User user=userRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("Client not found."));
        userRepository.delete(user);
        return true;
    }
}
