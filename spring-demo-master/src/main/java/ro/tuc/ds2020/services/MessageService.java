package ro.tuc.ds2020.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.MessageDTO;
import ro.tuc.ds2020.dtos.builders.MessageBuilder;
import ro.tuc.ds2020.entities.Message;
import ro.tuc.ds2020.repositories.MessageRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public UUID insert(MessageDTO dto) {
        Message message = MessageBuilder.toEntity(dto);
        message = messageRepository.save(message);
        return message.getId();
    }

    public List<MessageDTO> findAllMessages() {
        return messageRepository.findAll().stream()
                .map(MessageBuilder::toMessageDTO)
                .collect(Collectors.toList());
    }

    public void delete(UUID id) {
        messageRepository.deleteById(id);
    }
}
