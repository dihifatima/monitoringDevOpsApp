package com.example.security.security;

import com.example.security.user.User;
import com.example.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final BruteForceProtectionService bruteForceProtectionService;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String useremail) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(useremail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Débloque automatiquement si la durée de verrouillage est écoulée, AVANT que
        // Spring Security ne vérifie isAccountNonLocked() sur cet utilisateur.
        bruteForceProtectionService.autoUnlockIfExpired(user);

        return user;
    }
}