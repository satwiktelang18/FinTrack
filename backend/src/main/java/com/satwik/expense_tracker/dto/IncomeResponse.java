package com.satwik.expense_tracker.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IncomeResponse {
    private Long id;
    private String source;
    private Double amount;
    private LocalDate date;
    private Long userId;
    private String userName;
}