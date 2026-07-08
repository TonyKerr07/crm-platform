package com.crm.platform.service;

import com.crm.platform.dto.response.DashboardResponse.AiInsight;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Serviço de relatórios inteligentes usando OpenAI GPT.
 *
 * Se a API key não estiver configurada (openai.api.enabled=false),
 * retorna insights pré-definidos baseados nos dados do banco — 100% funcional offline.
 *
 * Isso é importante para demo/portfolio: o recrutador consegue ver a feature
 * mesmo sem ter uma API key da OpenAI.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AIReportService {

    private final RestClient openAiRestClient;

    @Value("${openai.api.model:gpt-3.5-turbo}")
    private String model;

    @Value("${openai.api.enabled:false}")
    private boolean enabled;

    /**
     * Gera insights automáticos baseados nas métricas do dashboard.
     * Se OpenAI estiver habilitada, usa IA real. Senão, usa heurísticas locais.
     */
    public List<AiInsight> generateInsights(
            long totalClients,
            long activeClients,
            long totalLeads,
            long openTasks,
            long overdueTasks,
            double clientGrowthPercent,
            Map<String, Long> leadsByStatus) {

        if (enabled) {
            try {
                return generateWithOpenAi(totalClients, activeClients, totalLeads,
                        openTasks, overdueTasks, clientGrowthPercent, leadsByStatus);
            } catch (Exception e) {
                log.warn("Falha ao chamar OpenAI, usando insights locais. Erro: {}", e.getMessage());
            }
        }

        return generateLocalInsights(totalClients, activeClients, totalLeads,
                openTasks, overdueTasks, clientGrowthPercent, leadsByStatus);
    }

    // ----------------------------------------------------------------
    // OpenAI Integration
    // ----------------------------------------------------------------

    private List<AiInsight> generateWithOpenAi(
            long totalClients, long activeClients, long totalLeads,
            long openTasks, long overdueTasks, double clientGrowthPercent,
            Map<String, Long> leadsByStatus) {

        String prompt = buildPrompt(totalClients, activeClients, totalLeads,
                openTasks, overdueTasks, clientGrowthPercent, leadsByStatus);

        var requestBody = Map.of(
                "model", model,
                "max_tokens", 800,
                "messages", List.of(
                        Map.of("role", "system", "content",
                                "Você é um analista de CRM. Responda SOMENTE com um array JSON válido de insights. " +
                                "Cada insight deve ter: title (string), message (string), type (INFO|SUCCESS|WARNING|ALERT), icon (string com emoji). " +
                                "Máximo 4 insights. Seja direto e use dados reais da entrada. Responda em português brasileiro."),
                        Map.of("role", "user", "content", prompt)
                )
        );

        OpenAiResponse response = openAiRestClient
                .post()
                .body(requestBody)
                .retrieve()
                .body(OpenAiResponse.class);

        if (response == null || response.choices() == null || response.choices().isEmpty()) {
            return generateLocalInsights(totalClients, activeClients, totalLeads,
                    openTasks, overdueTasks, clientGrowthPercent, leadsByStatus);
        }

        String content = response.choices().get(0).message().content();
        return parseInsightsFromJson(content);
    }

    private String buildPrompt(long totalClients, long activeClients, long totalLeads,
                                long openTasks, long overdueTasks, double clientGrowthPercent,
                                Map<String, Long> leadsByStatus) {
        long negotiation = leadsByStatus.getOrDefault("NEGOCIACAO", 0L);
        long won = leadsByStatus.getOrDefault("GANHO", 0L);
        long lost = leadsByStatus.getOrDefault("PERDIDO", 0L);
        long total = leadsByStatus.values().stream().mapToLong(Long::longValue).sum();
        double negotiationPct = total > 0 ? (negotiation * 100.0 / total) : 0;
        double conversionRate = (won + lost) > 0 ? (won * 100.0 / (won + lost)) : 0;

        return String.format("""
                Dados do CRM:
                - Total de clientes: %d (ativos: %d)
                - Crescimento de clientes este mês: %.1f%%
                - Total de leads: %d
                - Leads em negociação: %d (%.1f%% do total)
                - Taxa de conversão: %.1f%%
                - Tarefas abertas: %d
                - Tarefas em atraso: %d
                
                Gere insights acionáveis sobre esses dados.
                """,
                totalClients, activeClients, clientGrowthPercent,
                totalLeads, negotiation, negotiationPct, conversionRate,
                openTasks, overdueTasks);
    }

    @SuppressWarnings("unchecked")
    private List<AiInsight> parseInsightsFromJson(String content) {
        try {
            // Remove possíveis marcações de código
            String clean = content.replaceAll("```json", "").replaceAll("```", "").trim();
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            List<Map<String, String>> raw = mapper.readValue(clean, List.class);
            return raw.stream()
                    .map(m -> new AiInsight(
                            m.getOrDefault("title", "Insight"),
                            m.getOrDefault("message", ""),
                            m.getOrDefault("type", "INFO"),
                            m.getOrDefault("icon", "💡")
                    ))
                    .toList();
        } catch (Exception e) {
            log.error("Erro ao parsear resposta da OpenAI: {}", e.getMessage());
            return List.of(new AiInsight("Análise disponível",
                    "Não foi possível processar os insights automaticamente.", "INFO", "ℹ️"));
        }
    }

    // ----------------------------------------------------------------
    // Local Heuristics (funciona sem OpenAI)
    // ----------------------------------------------------------------

    private List<AiInsight> generateLocalInsights(
            long totalClients, long activeClients, long totalLeads,
            long openTasks, long overdueTasks, double clientGrowthPercent,
            Map<String, Long> leadsByStatus) {

        List<AiInsight> insights = new ArrayList<>();

        // Insight sobre crescimento de clientes
        if (clientGrowthPercent > 10) {
            insights.add(new AiInsight(
                    "🚀 Crescimento acelerado",
                    String.format("Clientes ativos cresceram %.0f%% este mês. Ótimo momento para expandir a equipe de suporte!",
                            clientGrowthPercent),
                    "SUCCESS", "🚀"
            ));
        } else if (clientGrowthPercent < 0) {
            insights.add(new AiInsight(
                    "⚠️ Queda de clientes",
                    String.format("Base de clientes reduziu %.0f%% este mês. Considere ações de retenção.",
                            Math.abs(clientGrowthPercent)),
                    "WARNING", "⚠️"
            ));
        } else {
            insights.add(new AiInsight(
                    "📈 Base de clientes estável",
                    String.format("Você tem %d clientes ativos com crescimento de %.0f%% no mês.",
                            activeClients, clientGrowthPercent),
                    "INFO", "📈"
            ));
        }

        // Insight sobre leads em negociação
        long negotiation = leadsByStatus.getOrDefault("NEGOCIACAO", 0L);
        long total = leadsByStatus.values().stream().mapToLong(Long::longValue).sum();
        if (total > 0) {
            double pct = negotiation * 100.0 / total;
            insights.add(new AiInsight(
                    "💼 Funil de vendas",
                    String.format("%.0f%% dos seus leads (%.0f de %d) estão em fase de negociação. Foque no fechamento!",
                            pct, (double) negotiation, total),
                    pct > 20 ? "SUCCESS" : "INFO", "💼"
            ));
        }

        // Insight sobre tarefas em atraso
        if (overdueTasks > 0) {
            insights.add(new AiInsight(
                    "🔴 Tarefas em atraso",
                    String.format("Você tem %d tarefa(s) atrasada(s) de %d abertas. Revise as prioridades!",
                            overdueTasks, openTasks),
                    "ALERT", "🔴"
            ));
        } else if (openTasks > 0) {
            insights.add(new AiInsight(
                    "✅ Sem atrasos",
                    String.format("Todas as %d tarefas abertas estão dentro do prazo. Bom trabalho!",
                            openTasks),
                    "SUCCESS", "✅"
            ));
        }

        // Insight sobre conversão
        long won = leadsByStatus.getOrDefault("GANHO", 0L);
        long lost = leadsByStatus.getOrDefault("PERDIDO", 0L);
        if ((won + lost) > 0) {
            double conversionRate = won * 100.0 / (won + lost);
            insights.add(new AiInsight(
                    "🎯 Taxa de conversão",
                    String.format("Sua taxa de conversão é de %.0f%% (%d ganhos, %d perdidos). %s",
                            conversionRate, won, lost,
                            conversionRate >= 50 ? "Excelente resultado!" : "Há espaço para melhorar o processo de vendas."),
                    conversionRate >= 50 ? "SUCCESS" : "WARNING", "🎯"
            ));
        }

        return insights;
    }

    // ----------------------------------------------------------------
    // Records para deserializar resposta da OpenAI
    // ----------------------------------------------------------------

    record OpenAiResponse(List<Choice> choices) {}
    record Choice(Message message) {}
    record Message(String role, String content) {}
}
