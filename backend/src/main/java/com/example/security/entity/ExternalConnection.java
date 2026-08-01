package com.example.security.entity;

import com.example.security.Enumeration.ConnextionProvider;
import com.example.security.configuration.TokenAttributeConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExternalConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ConnextionProvider provider;

    @Convert(converter = TokenAttributeConverter.class)
    @Column(length = 2048)
    private String accessToken;


    @Column(length = 2048)
    private String refreshToken;

    private String externalUsername;
    private String externalUrl;

    private LocalDateTime connectedAt;
    private LocalDateTime lastSyncAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
}