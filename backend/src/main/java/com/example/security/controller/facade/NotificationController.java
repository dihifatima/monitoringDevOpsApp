package com.example.security.controller.facade;

import com.example.security.entity.Client;
import com.example.security.entity.Notification;
import com.example.security.repo.NotificationRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationRepo notificationRepo;
    public NotificationController(NotificationRepo notificationRepo){
        this.notificationRepo=notificationRepo;
    }
    @GetMapping
    public ResponseEntity<List<Notification>> getNotification(Authentication authentication){
        Client client= (Client) authentication.getPrincipal();
        List<Notification> notificationList = notificationRepo.findByClient_IdOrderByCreatedAtDesc(client.getId());
        return ResponseEntity.ok(notificationList);
    }

    @GetMapping("unread-count")
    public ResponseEntity<List<Notification>> getUnreadCountNotification( Authentication authentication){
        Client client = (Client) authentication.getPrincipal();
        List<Notification> UnreadCountNotificationList = notificationRepo.findByClient_IdAndReadFalseOrderByCreatedAtDesc(client.getId());
        return  ResponseEntity.ok(UnreadCountNotificationList) ;
    }

    @PatchMapping("/{id}/read")
    public  ResponseEntity<String> markAsRead(@PathVariable Long id,Authentication authentication ){
        Client client = (Client) authentication.getPrincipal();
        Notification notification = notificationRepo.findById(id).orElse(null);

        if (notification == null) {
            return ResponseEntity.status(404).body("Notification introuvable");
        }

        if (!client.getId().equals(notification.getClient().getId())) {
            return ResponseEntity.status(403).body("Accès refusé");
        }

        notification.setRead(true);
        notificationRepo.save(notification);
        return ResponseEntity.ok("Notification marquée comme lue");
    }


}
