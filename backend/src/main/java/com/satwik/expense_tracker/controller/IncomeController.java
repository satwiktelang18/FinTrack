package com.satwik.expense_tracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.satwik.expense_tracker.dto.IncomeRequest;
import com.satwik.expense_tracker.dto.IncomeResponse;
import com.satwik.expense_tracker.service.IncomeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @PostMapping
    public IncomeResponse createIncome(@Valid @RequestBody IncomeRequest request) {
        return incomeService.createIncome(request);
    }

    @GetMapping("/user/{userId}")
    public List<IncomeResponse> getIncomeByUser(@PathVariable Long userId) {
        return incomeService.getIncomeByUser(userId);
    }

    @PutMapping("/{id}")
    public IncomeResponse updateIncome(@PathVariable Long id, @Valid @RequestBody IncomeRequest request) {
        return incomeService.updateIncome(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
    }
}