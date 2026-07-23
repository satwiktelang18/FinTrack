package com.satwik.expense_tracker.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.satwik.expense_tracker.entity.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {
    List<Expense> findByUserId(Long userId);
    List<Expense> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
}