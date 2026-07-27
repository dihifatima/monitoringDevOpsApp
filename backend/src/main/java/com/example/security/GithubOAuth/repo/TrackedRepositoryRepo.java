package com.example.security.GithubOAuth.repo;


import com.example.security.GithubOAuth.entity.TrackedRepo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrackedRepositoryRepo extends JpaRepository<TrackedRepo, Long> {
    List<TrackedRepo> findAllByClientId(Long clientId);
    Optional<TrackedRepo> findByClientIdAndExternalRepoId(Long clientId, Long externalRepoId);
    boolean existsByClientIdAndExternalRepoId(Long clientId, Long externalRepoId);
    Optional<TrackedRepo> findByFullName( String name);
}