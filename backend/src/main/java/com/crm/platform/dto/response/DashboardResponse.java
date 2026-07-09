package com.crm.platform.dto.response;

import java.util.List;
import java.util.Map;

/**
 * DTO do Dashboard com métricas e insights de IA.
 */
public record DashboardResponse(
        // Totais
        long totalClients,
        long activeClients,
        long totalLeads,
        long openTasks,
        long overdueTasks,

        // Distribuição de leads por status (para gráfico de pizza/barras)
        Map<String, Long> leadsByStatus,

        // Novos clientes no mês atual
        long newClientsThisMonth,

        // Variação percentual de clientes em relação ao mês anterior
        double clientGrowthPercent,

        // Insights gerados por IA
        List<AiInsight> aiInsights
) {

    /**
     * Um card de insight inteligente exibido no dashboard.
     * type: INFO, WARNING, SUCCESS, ALERT
     */
    public record AiInsight(
            String title,
            String message,
            String type,
            String icon
    ) {}
}
