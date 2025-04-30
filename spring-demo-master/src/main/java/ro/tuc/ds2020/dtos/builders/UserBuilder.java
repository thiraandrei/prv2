package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.dtos.UserDetailsDTO;
import ro.tuc.ds2020.entities.User;

public class UserBuilder {

    private UserBuilder() {
    }

    public static UserDTO toUserDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhysicalAddress(),
                user.getRole()
        );
    }

    public static UserDetailsDTO toUserDetailsDTO(User user) {
        return new UserDetailsDTO(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhysicalAddress(),
                user.getPassword(),
                user.getRole()
        );
    }

    public static User toEntity(UserDetailsDTO userDetailsDTO) {
        User user = new User();
        user.setId(userDetailsDTO.getId());
        user.setUsername(userDetailsDTO.getUsername());
        user.setFirstName(userDetailsDTO.getFirstName());
        user.setLastName(userDetailsDTO.getLastName());
        user.setEmail(userDetailsDTO.getEmail());
        user.setPhysicalAddress(userDetailsDTO.getPhysicalAddress());
        user.setPassword(userDetailsDTO.getPassword());
        user.setRole(userDetailsDTO.getRole());
        return user;
    }
}
