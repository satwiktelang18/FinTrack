package com.satwik.expense_tracker.controller;

import com.satwik.expense_tracker.dto.AuthResponse;
import com.satwik.expense_tracker.dto.LoginRequest;
import com.satwik.expense_tracker.dto.RegisterRequest;
import com.satwik.expense_tracker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}