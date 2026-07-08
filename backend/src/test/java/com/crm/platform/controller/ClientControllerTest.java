package com.crm.platform.controller;

import com.crm.platform.dto.request.ClientRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Teste de integração para ClientController.
 * @ActiveProfiles("test") usa o H2 em memória em vez do PostgreSQL real.
 * @Transactional faz rollback depois de cada teste — banco sempre limpo.
 * @WithMockUser simula um usuário autenticado sem precisar do Keycloak.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("ClientController - Testes de Integração")
class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "EMPRESA")
    @DisplayName("POST /clients - deve criar cliente e retornar 201")
    void shouldCreateClientAndReturn201() throws Exception {
        ClientRequest request = new ClientRequest(
                "João Teste", "joao.teste@email.com", "11999990000",
                "Empresa Teste", null, "Notas iniciais"
        );

        mockMvc.perform(post("/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("João Teste"))
                .andExpect(jsonPath("$.email").value("joao.teste@email.com"))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    @WithMockUser(roles = "EMPRESA")
    @DisplayName("POST /clients - deve retornar 409 quando email duplicado")
    void shouldReturn409WhenEmailDuplicated() throws Exception {
        ClientRequest request = new ClientRequest(
                "João Teste", "joao.teste@email.com", null, null, null, null
        );

        // Cria o primeiro
        mockMvc.perform(post("/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Tenta criar com mesmo email
        mockMvc.perform(post("/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.title").value("Regra de negócio violada"));
    }

    @Test
    @WithMockUser(roles = "EMPRESA")
    @DisplayName("POST /clients - deve retornar 400 quando dados inválidos")
    void shouldReturn400WhenInvalidData() throws Exception {
        ClientRequest request = new ClientRequest(
                "", "email-invalido", null, null, null, null // nome vazio e email inválido
        );

        mockMvc.perform(post("/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors").isMap());
    }

    @Test
    @DisplayName("GET /clients - deve retornar 401 sem autenticação")
    void shouldReturn401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/clients"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "EMPRESA")
    @DisplayName("GET /clients - deve retornar lista paginada")
    void shouldReturnPaginatedList() throws Exception {
        mockMvc.perform(get("/clients")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.pageSize").value(10));
    }
}
