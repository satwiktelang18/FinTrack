package com.satwik.expense_tracker.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.satwik.expense_tracker.dto.ExpenseRequest;
import com.satwik.expense_tracker.dto.ExpenseResponse;
import com.satwik.expense_tracker.entity.Expense;
import com.satwik.expense_tracker.entity.User;
import com.satwik.expense_tracker.exception.ResourceNotFoundException;
import com.satwik.expense_tracker.repository.ExpenseRepository;
import com.satwik.expense_tracker.repository.UserRepository;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    private ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getDate(),
                expense.getCategory(),
                expense.getDescription(),
                expense.getUser().getId(),
                expense.getUser().getName()
        );
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + request.getUserId()));

        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setUser(user);

        Expense saved = expenseRepository.save(expense);
        return toResponse(saved);
    }

    public List<ExpenseResponse> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id " + id));

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());

        Expense saved = expenseRepository.save(expense);
        return toResponse(saved);
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found with id " + id);
        }
        expenseRepository.deleteById(id);
    }

    public Page<ExpenseResponse> searchExpenses(
        Long userId, String category, String keyword,
        LocalDate startDate, LocalDate endDate,
        int page, int size, String sortBy, String direction
) {
    Specification<Expense> spec = Specification
            .where(ExpenseSpecification.hasUserId(userId))
            .and(ExpenseSpecification.hasCategory(category))
            .and(ExpenseSpecification.hasTitleContaining(keyword))
            .and(ExpenseSpecification.hasDateBetween(startDate, endDate));

    Sort sort = direction.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();

    Pageable pageable = PageRequest.of(page, size, sort);

    Page<Expense> results = expenseRepository.findAll(spec, pageable);

    return results.map(this::toResponse);
}
}