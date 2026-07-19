package com.example.security.repo;

import com.example.security.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ClientRepo extends JpaRepository<Client,Long> {
}
