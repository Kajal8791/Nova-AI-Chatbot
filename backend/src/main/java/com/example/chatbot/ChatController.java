package com.example.chatbot;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ChatController {

    private final OpenAIService openAIService;

    public ChatController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping("/api/chat")
    public Map<String, String> chat(
            @RequestBody Map<String, String> request) {

        String message = request.getOrDefault("message", "").trim();

        if (message.isEmpty()) {
            return Map.of("reply", "Please enter a message.");
        }

        String reply = openAIService.getAIResponse(message);

        return Map.of("reply", reply);
    }
}
