package com.example.security.repo;

import com.example.security.entity.NotificationPushToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationPushTokenRepo extends JpaRepository<NotificationPushToken, Long> {
    List<NotificationPushToken> findAllByClientId(Long clientId);
    Optional<NotificationPushToken> findByExpoPushToken(String token);
}
