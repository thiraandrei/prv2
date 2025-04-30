package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.tuc.ds2020.entities.User;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find users by username.
     */
    Optional<User> findByUsername(String username);

    /**
     * Custom query to find users by role.
     */
    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findByRole(@Param("role") String role);

    /**
     * Find a user by email.
     */
    Optional<User> findByEmail(String email);

    /**
     * Custom query to find users with a specific role and whose first name starts with a given prefix.
     */
    @Query("SELECT u FROM User u WHERE u.firstName LIKE :prefix% AND u.role = :role")
    List<User> findByFirstNameStartingWithAndRole(@Param("prefix") String prefix, @Param("role") String role);
}
