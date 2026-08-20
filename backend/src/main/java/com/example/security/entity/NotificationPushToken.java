package com.example.security.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "NotificationPushToken")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPushToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(nullable = false)
    private String expoPushToken;

    private LocalDateTime registeredAt;
}