
package com.example.chatbot.controller;

import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.ChatMessage;
import com.example.chatbot.service.ChatHistoryService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatHistoryController {

    private final ChatHistoryService chatHistoryService;

    public ChatHistoryController(ChatHistoryService chatHistoryService) {
        this.chatHistoryService = chatHistoryService;
    }

    @GetMapping
    public List<ChatSummary> getChats(Authentication authentication) {
            return chatHistoryService.getUserChats(authentication.getName())
                .stream()
                .map(chat -> new ChatSummary(
                        chat.getId(),
                        chat.getTitle(),
                        chat.getCreatedAt()
                ))
                .toList();
    }

    @PostMapping
    public ResponseEntity<ChatSummary> createChat(
            Authentication authentication,
            @RequestBody CreateChatRequest request) {

        Chat chat = chatHistoryService.createChat(
                authentication.getName(),
                request.title
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ChatSummary(
                        chat.getId(),
                        chat.getTitle(),
                        chat.getCreatedAt()
                ));
    }

    @GetMapping("/{chatId}/messages")
    public List<MessageResponse> getMessages(
            Authentication authentication,
            @PathVariable Long chatId) {

        return chatHistoryService.getMessages(
                authentication.getName(), chatId
        ).stream()
         .map(message -> new MessageResponse(
                 message.getId(),
                 message.getContent(),
                 message.getRole(),
                 message.getCreatedAt()
         ))
         .toList();
    }

    @PostMapping("/{chatId}/messages")
    public ResponseEntity<MessageResponse> addMessage(
            Authentication authentication,
            @PathVariable Long chatId,
            @RequestBody MessageRequest request) {

        if (request.role == null ||
                !(request.role.equals("user") ||
                  request.role.equals("assistant"))) {
            return ResponseEntity.badRequest().build();
        }

        ChatMessage message = chatHistoryService.addMessage(
                authentication.getName(),
                chatId,
                request.content,
                request.role
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse(
                        message.getId(),
                        message.getContent(),
                        message.getRole(),
                        message.getCreatedAt()
                ));
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<Void> deleteChat(
            Authentication authentication,
            @PathVariable Long chatId) {

        chatHistoryService.deleteChat(
                authentication.getName(), chatId
        );

        return ResponseEntity.noContent().build();
    }

    public record CreateChatRequest(String title) {}

    public record MessageRequest(String content, String role) {}

    public record ChatSummary(
            Long id,
            String title,
            LocalDateTime createdAt
    ) {}

    public record MessageResponse(
            Long id,
            String content,
            String role,
            LocalDateTime createdAt
    ) {}
}
