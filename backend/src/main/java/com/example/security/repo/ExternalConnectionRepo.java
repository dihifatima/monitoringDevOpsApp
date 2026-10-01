package com.example.security.repo;


import com.example.security.enumeration.ConnextionProvider;
import com.example.security.entity.ExternalConnection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExternalConnectionRepo extends JpaRepository<ExternalConnection, Long> {
    Optional<ExternalConnection> findByClientIdAndProvider(Long clientId, ConnextionProvider provider);
}
