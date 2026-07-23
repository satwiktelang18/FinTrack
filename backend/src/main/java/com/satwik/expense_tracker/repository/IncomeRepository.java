package com.satwik.expense_tracker.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.satwik.expense_tracker.entity.Income;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserId(Long userId);
    List<Income> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
}