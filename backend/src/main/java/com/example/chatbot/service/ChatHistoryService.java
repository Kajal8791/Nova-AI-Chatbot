
package com.example.chatbot.service;

import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.ChatMessage;
import com.example.chatbot.entity.User;
import com.example.chatbot.repository.ChatMessageRepository;
import com.example.chatbot.repository.ChatRepository;
import com.example.chatbot.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatHistoryService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;

    public ChatHistoryService(
            ChatRepository chatRepository,
            ChatMessageRepository messageRepository,
            UserRepository userRepository) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));
    }

    public List<Chat> getUserChats(String email) {
        User user = getUser(email);
        return chatRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional
    public Chat createChat(String email, String title) {
        User user = getUser(email);

        Chat chat = new Chat();
        chat.setTitle(title);
        chat.setUser(user);

        return chatRepository.save(chat);
    }

    @Transactional
    public ChatMessage addMessage(
            String email, Long chatId, String content, String role) {

        User user = getUser(email);

        Chat chat = chatRepository.findByIdAndUser(chatId, user)
                .orElseThrow(() ->
                        new AccessDeniedException("Chat not found or access denied"));

        ChatMessage message = new ChatMessage();
        message.setChat(chat);
        message.setContent(content);
        message.setRole(role);

        return messageRepository.save(message);
    }

    public List<ChatMessage> getMessages(String email, Long chatId) {
        User user = getUser(email);

        Chat chat = chatRepository.findByIdAndUser(chatId, user)
                .orElseThrow(() ->
                        new AccessDeniedException("Chat not found or access denied"));

        return messageRepository.findByChatOrderByCreatedAtAsc(chat);
    }

    @Transactional
    public void deleteChat(String email, Long chatId) {
        User user = getUser(email);

        Chat chat = chatRepository.findByIdAndUser(chatId, user)
                .orElseThrow(() ->
                        new AccessDeniedException("Chat not found or access denied"));

        chatRepository.delete(chat);
    }
}
