package com.example.security.repo;

import com.example.security.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
//[countBy | findBy | existsBy | deleteBy] + NomDuChamp + [Condition] + [And/Or + AutreChamp] + [OrderBy + Champ + Asc/Desc]
public interface NotificationRepo  extends JpaRepository<Notification,Long> {
    List<Notification> findByClient_IdOrderByCreatedAtDesc(Long clientId);
    long countByClient_IdAndReadFalse(Long clientId);
    boolean existsByCommitsha(String commitSha);
    List<Notification> findByClient_IdAndReadFalseOrderByCreatedAtDesc(Long clientId);
    List<Notification> findByTrackedRepo_IdOrderByCreatedAtDesc(Long trackedRepoId);
    List<Notification> findTop5ByClient_IdOrderByCreatedAtDesc(Long clientId);
}
