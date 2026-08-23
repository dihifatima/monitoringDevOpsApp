package com.example.security.entity;


import com.example.security.Enumeration.NotificationFrequency;
import com.example.security.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "client")
public class Client extends User {

    private String profilePicture;
    private String jobTitle;
    private String company;

    @Builder.Default
    private boolean notificationsEnabled = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private NotificationFrequency notificationFrequency = NotificationFrequency.REALTIME;

    private LocalDateTime lastActiveAt;

    @Builder.Default
    private boolean onboardingCompleted = false;


    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExternalConnection> externalConnections;
}