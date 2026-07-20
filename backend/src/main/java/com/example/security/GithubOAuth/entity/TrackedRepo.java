package com.example.security.GithubOAuth.entity;

import com.example.security.Enumeration.ConnextionProvider;
import com.example.security.entity.Client;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tracked_repository",
        uniqueConstraints = @UniqueConstraint(columnNames = {"client_id", "external_repo_id"}))
public class TrackedRepo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ConnextionProvider provider; // GITHUB pour l'instant

    private Long externalRepoId;   // l'id GitHub du repo (stable, ne change pas si renommé)
    private String name;           // ex: "SmartFlow"
    private String fullName;       // ex: "dihifatima/SmartFlow"
    private String url;

    private LocalDateTime trackedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
}