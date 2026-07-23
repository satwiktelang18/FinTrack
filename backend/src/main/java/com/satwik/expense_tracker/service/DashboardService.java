package com.satwik.expense_tracker.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.satwik.expense_tracker.dto.DashboardResponse;
import com.satwik.expense_tracker.dto.ExpenseResponse;
import com.satwik.expense_tracker.dto.IncomeResponse;
import com.satwik.expense_tracker.entity.Expense;
import com.satwik.expense_tracker.entity.Income;
import com.satwik.expense_tracker.repository.ExpenseRepository;
import com.satwik.expense_tracker.repository.IncomeRepository;

@Service
public class DashboardService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    public DashboardResponse getDashboard(Long userId, int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(userId, start, end);
        List<Income> incomeList = incomeRepository.findByUserIdAndDateBetween(userId, start, end);

        double totalExpense = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        double totalIncome = incomeList.stream()
                .mapToDouble(Income::getAmount)
                .sum();

        double savings = totalIncome - totalExpense;

        Map<String, Double> expenseByCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getCategory() == null ? "Uncategorized" : e.getCategory(),
                        Collectors.summingDouble(Expense::getAmount)
                ));

        List<ExpenseResponse> recentExpenses = expenses.stream()
                .sorted(Comparator.comparing(Expense::getDate).reversed())
                .limit(5)
                .map(e -> new ExpenseResponse(
                        e.getId(), e.getTitle(), e.getAmount(), e.getDate(),
                        e.getCategory(), e.getDescription(), e.getUser().getId(), e.getUser().getName()
                ))
                .collect(Collectors.toList());

        List<IncomeResponse> recentIncome = incomeList.stream()
                .sorted(Comparator.comparing(Income::getDate).reversed())
                .limit(5)
                .map(i -> new IncomeResponse(
                        i.getId(), i.getSource(), i.getAmount(), i.getDate(),
                        i.getUser().getId(), i.getUser().getName()
                ))
                .collect(Collectors.toList());

        return new DashboardResponse(totalIncome, totalExpense, savings, expenseByCategory, recentExpenses, recentIncome);
    }
}