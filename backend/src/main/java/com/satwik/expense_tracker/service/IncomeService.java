package com.satwik.expense_tracker.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.satwik.expense_tracker.dto.IncomeRequest;
import com.satwik.expense_tracker.dto.IncomeResponse;
import com.satwik.expense_tracker.entity.Income;
import com.satwik.expense_tracker.entity.User;
import com.satwik.expense_tracker.exception.ResourceNotFoundException;
import com.satwik.expense_tracker.repository.IncomeRepository;
import com.satwik.expense_tracker.repository.UserRepository;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserRepository userRepository;

    private IncomeResponse toResponse(Income income) {
        return new IncomeResponse(
                income.getId(),
                income.getSource(),
                income.getAmount(),
                income.getDate(),
                income.getUser().getId(),
                income.getUser().getName()
        );
    }

    public IncomeResponse createIncome(IncomeRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + request.getUserId()));

        Income income = new Income();
        income.setSource(request.getSource());
        income.setAmount(request.getAmount());
        income.setDate(request.getDate());
        income.setUser(user);

        Income saved = incomeRepository.save(income);
        return toResponse(saved);
    }

    public List<IncomeResponse> getIncomeByUser(Long userId) {
        return incomeRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public IncomeResponse updateIncome(Long id, IncomeRequest request) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id " + id));

        income.setSource(request.getSource());
        income.setAmount(request.getAmount());
        income.setDate(request.getDate());

        Income saved = incomeRepository.save(income);
        return toResponse(saved);
    }

    public void deleteIncome(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Income not found with id " + id);
        }
        incomeRepository.deleteById(id);
    }
}