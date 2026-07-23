package com.satwik.expense_tracker.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {
    private Double totalIncome;
    private Double totalExpense;
    private Double savings;
    private Map<String, Double> expenseByCategory;
    private List<ExpenseResponse> recentExpenses;
    private List<IncomeResponse> recentIncome;
}