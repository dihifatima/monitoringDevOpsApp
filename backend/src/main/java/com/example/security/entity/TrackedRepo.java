package com.example.security.entity;

import com.example.security.Enumeration.ConnextionProvider;
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
    private ConnextionProvider provider;

    private Long externalRepoId;
    private String name;
    private String fullName;       // ex: "dihifatima/SmartFlow"
    private String url;
    private LocalDateTime trackedAt;
    private String sonarProjectKey;
    private String jenkinsJobName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
}