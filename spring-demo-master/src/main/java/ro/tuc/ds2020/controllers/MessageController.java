package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.MessageDTO;
import ro.tuc.ds2020.services.MessageService;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<UUID> createMessage(@RequestBody MessageDTO dto) {
        UUID id = messageService.insert(dto);
        return ResponseEntity.status(201).body(id);
    }

    @GetMapping
    public ResponseEntity<List<MessageDTO>> getAllMessages() {
        return ResponseEntity.ok(messageService.findAllMessages());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID id) {
        messageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
