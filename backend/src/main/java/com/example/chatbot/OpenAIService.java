
package com.example.chatbot;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    private final WebClient webClient;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.api.model}")
    private String model;

    public OpenAIService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getAIResponse(String message) {

        try {
            String systemPrompt = """
                You are Nova AI, an intelligent, friendly and
                versatile AI assistant.

                YOUR PURPOSE:
                Help users with almost any general topic,
                just like a general-purpose AI assistant.

                TOPICS YOU CAN HANDLE:
                1. Education and academic learning.
                2. Science, mathematics and technology.
                3. History, geography and general knowledge.
                4. Programming and software development.
                5. Java, Python, JavaScript, HTML, CSS and React.
                6. Writing, essays, emails and applications.
                7. Creative ideas, stories and video scripts.
                8. Career guidance and interview preparation.
                9. Everyday questions and problem solving.

                LANGUAGE RULES:
                - Understand Hindi, English and Hinglish.
                - Reply in the language used by the user.
                - Use simple and understandable language.
                - Explain difficult topics step by step.

                ANSWER RULES:
                - Give relevant, accurate and useful answers.
                - Understand the complete question before answering.
                - Do not give unrelated or unnecessary information.
                - Use headings and bullet points when useful.
                - Give examples when they help understanding.
                - If you are unsure, clearly say so.
                - Never invent facts, sources or information.
                - Ask a short clarification if the question is unclear.

                CODING RULES:
                - Provide complete and properly formatted code.
                - Explain where the code should be placed.
                - Mention required dependencies when necessary.
                - Help identify and fix programming errors.
                - Never claim code has been tested unless it has.

                WRITING RULES:
                - Create original scripts, articles, letters
                  and other written content.
                - Follow the user's requested tone and format.

                Be respectful, helpful, clear and professional.
                Your name is Nova AI.
                """;

            Map<String, Object> request = Map.of(
                "model", model,
                "messages", List.of(
                    Map.of(
                        "role", "system",
                        "content", systemPrompt
                    ),
                    Map.of(
                        "role", "user",
                        "content", message
                    )
                ),
                "temperature", 0.7,
                "max_tokens", 2048
            );

            JsonNode response = webClient.post()
                    .uri(apiUrl)
                    .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + apiKey.trim()
                    )
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            if (response == null) {
                return "Nova AI could not receive a response. Please try again.";
            }

            String reply = response
                    .path("choices")
                    .path(0)
                    .path("message")
                    .path("content")
                    .asText("");

            if (reply.isBlank()) {
                return "Nova AI received an empty response. Please try again.";
            }

            return reply.trim();

        } catch (WebClientResponseException e) {

            System.err.println(
                "Groq API error: " + e.getStatusCode()
            );

            if (e.getStatusCode().value() == 401) {
                return "API authentication failed. Please check your Groq API configuration.";
            }

            if (e.getStatusCode().value() == 429) {
                return "Groq API usage limit reached. Please try again later.";
            }

            return "Groq API could not process your request. Please try again.";

        } catch (Exception e) {

            System.err.println(
                "Groq connection error: " + e.getMessage()
            );

            return "Sorry, Nova AI could not connect to Groq. Please try again.";
        }
    }
}
