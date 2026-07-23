package com.satwik.expense_tracker.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.satwik.expense_tracker.dto.DashboardResponse;
import com.satwik.expense_tracker.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/{userId}")
    public DashboardResponse getDashboard(
            @PathVariable Long userId,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        LocalDate now = LocalDate.now();
        int resolvedMonth = (month != null) ? month : now.getMonthValue();
        int resolvedYear = (year != null) ? year : now.getYear();

        return dashboardService.getDashboard(userId, resolvedMonth, resolvedYear);
    }
}