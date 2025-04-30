package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.MessageDTO;
import ro.tuc.ds2020.entities.Message;

public class MessageBuilder {

    public static MessageDTO toMessageDTO(Message message) {
        return new MessageDTO(message.getId(), message.getName(), message.getEmail(), message.getContent());
    }

    public static Message toEntity(MessageDTO dto) {
        return new Message(dto.getName(), dto.getEmail(), dto.getContent());
    }
}
