package com.satwik.expense_tracker.service;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import com.satwik.expense_tracker.entity.Expense;

public class ExpenseSpecification {

    public static Specification<Expense> hasUserId(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Expense> hasCategory(String category) {
        return (root, query, cb) ->
                category == null ? null : cb.equal(root.get("category"), category);
    }

    public static Specification<Expense> hasTitleContaining(String keyword) {
        return (root, query, cb) ->
                keyword == null ? null : cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%");
    }

    public static Specification<Expense> hasDateBetween(LocalDate start, LocalDate end) {
        return (root, query, cb) -> {
            if (start == null && end == null) return null;
            if (start != null && end != null) return cb.between(root.get("date"), start, end);
            if (start != null) return cb.greaterThanOrEqualTo(root.get("date"), start);
            return cb.lessThanOrEqualTo(root.get("date"), end);
        };
    }
}