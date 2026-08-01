package com.example.security.entity;

import com.example.security.Enumeration.NotificationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
     @ManyToOne
     @JoinColumn( name= "client_id", nullable= false)
    private  Client client;

     @ManyToOne
     @JoinColumn(name= "tracked_repo_id", nullable = false)
    private TrackedRepo trackedRepo;
     @Enumerated(EnumType.STRING)
     private NotificationType type;

     private String message;
    private String commitsha;
   @Builder.Default
    private boolean read= true;
    private LocalDateTime createdAt;

   @PrePersist
    protected  void onCreate(){
       this.createdAt= LocalDateTime.now();
   }


 }
