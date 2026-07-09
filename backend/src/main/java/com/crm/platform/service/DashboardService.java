package com.crm.platform.service;

import com.crm.platform.dto.response.DashboardResponse;
import com.crm.platform.repository.ClientRepository;
import com.crm.platform.repository.LeadRepository;
import com.crm.platform.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final ClientRepository clientRepository;
    private final LeadRepository leadRepository;
    private final TaskRepository taskRepository;
    private final AIReportService aiReportService;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        // --- Métricas de clientes ---
        long totalClients = clientRepository.count();
        long activeClients = clientRepository.countByActiveTrue();

        // Clientes criados no mês atual
        YearMonth thisMonth = YearMonth.now();
        LocalDateTime startOfMonth = thisMonth.atDay(1).atStartOfDay();
        LocalDateTime startOfNextMonth = thisMonth.plusMonths(1).atDay(1).atStartOfDay();
        long newClientsThisMonth = clientRepository.countByCreatedAtBetween(startOfMonth, startOfNextMonth);

        // Comparativo com mês anterior
        LocalDateTime startOfLastMonth = thisMonth.minusMonths(1).atDay(1).atStartOfDay();
        long newClientsLastMonth = clientRepository.countByCreatedAtBetween(startOfLastMonth, startOfMonth);
        double clientGrowthPercent = newClientsLastMonth > 0
                ? ((newClientsThisMonth - newClientsLastMonth) * 100.0 / newClientsLastMonth)
                : (newClientsThisMonth > 0 ? 100.0 : 0.0);

        // --- Métricas de leads ---
        long totalLeads = leadRepository.count();

        // Distribuição por status (para gráfico no frontend)
        Map<String, Long> leadsByStatus = new LinkedHashMap<>();
        leadRepository.countGroupByStatus().forEach(row ->
                leadsByStatus.put(row[0].toString(), (Long) row[1]));

        // --- Métricas de tarefas ---
        long openTasks = taskRepository.countOpenTasks();
        long overdueTasks = taskRepository.countOverdueTasks(LocalDate.now());

        // --- Insights de IA ---
        var aiInsights = aiReportService.generateInsights(
                totalClients, activeClients, totalLeads,
                openTasks, overdueTasks, clientGrowthPercent, leadsByStatus);

        return new DashboardResponse(
                totalClients,
                activeClients,
                totalLeads,
                openTasks,
                overdueTasks,
                leadsByStatus,
                newClientsThisMonth,
                clientGrowthPercent,
                aiInsights
        );
    }
}
