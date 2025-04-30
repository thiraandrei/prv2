package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entities.Message;

import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
}
