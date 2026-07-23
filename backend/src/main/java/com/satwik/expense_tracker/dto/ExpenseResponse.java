package com.satwik.expense_tracker.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private String title;
    private Double amount;
    private LocalDate date;
    private String category;
    private String description;
    private Long userId;
    private String userName;
}