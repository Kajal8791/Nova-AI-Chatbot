
package com.example.chatbot.repository;

import com.example.chatbot.entity.Chat;
import com.example.chatbot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    List<Chat> findByUserOrderByCreatedAtDesc(User user);

    Optional<Chat> findByIdAndUser(Long id, User user);
}
