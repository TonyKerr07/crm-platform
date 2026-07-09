package com.crm.platform.service;

import com.crm.platform.domain.entity.Client;
import com.crm.platform.dto.request.ClientRequest;
import com.crm.platform.dto.response.ClientResponse;
import com.crm.platform.exception.BusinessException;
import com.crm.platform.exception.ResourceNotFoundException;
import com.crm.platform.mapper.ClientMapper;
import com.crm.platform.repository.ClientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Testes unitários para ClientService.
 * Usamos Mockito para simular o banco — testes rápidos, sem I/O real.
 *
 * @Nested organiza os testes por método — fica muito mais fácil de ler.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ClientService")
class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private ClientMapper clientMapper;

    @InjectMocks
    private ClientService clientService;

    private UUID clientId;
    private Client clientEntity;
    private ClientRequest validRequest;
    private ClientResponse clientResponse;

    @BeforeEach
    void setUp() {
        clientId = UUID.randomUUID();

        clientEntity = Client.builder()
                .name("Ana Costa")
                .email("ana@empresa.com")
                .phone("11999990000")
                .companyName("Tech Ltda")
                .active(true)
                .build();

        validRequest = new ClientRequest(
                "Ana Costa", "ana@empresa.com", "11999990000",
                "Tech Ltda", "12345678000199", "Notas de teste"
        );

        clientResponse = new ClientResponse(
                clientId, "Ana Costa", "ana@empresa.com", "11999990000",
                "Tech Ltda", "12345678000199", "Notas de teste", true,
                LocalDateTime.now(), LocalDateTime.now()
        );
    }

    // =========================================================
    // CREATE
    // =========================================================
    @Nested
    @DisplayName("create()")
    class CreateTests {

        @Test
        @DisplayName("deve criar cliente quando email não existe")
        void shouldCreateClientWhenEmailIsNew() {
            when(clientRepository.existsByEmailIgnoreCase(validRequest.email())).thenReturn(false);
            when(clientMapper.toEntity(validRequest)).thenReturn(clientEntity);
            when(clientRepository.save(clientEntity)).thenReturn(clientEntity);
            when(clientMapper.toResponse(clientEntity)).thenReturn(clientResponse);

            ClientResponse result = clientService.create(validRequest);

            assertThat(result).isNotNull();
            assertThat(result.email()).isEqualTo("ana@empresa.com");
            verify(clientRepository, times(1)).save(any(Client.class));
        }

        @Test
        @DisplayName("deve lançar BusinessException quando email já existe")
        void shouldThrowWhenEmailAlreadyExists() {
            when(clientRepository.existsByEmailIgnoreCase(validRequest.email())).thenReturn(true);

            assertThatThrownBy(() -> clientService.create(validRequest))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("ana@empresa.com");

            verify(clientRepository, never()).save(any());
        }
    }

    // =========================================================
    // FIND BY ID
    // =========================================================
    @Nested
    @DisplayName("findById()")
    class FindByIdTests {

        @Test
        @DisplayName("deve retornar cliente quando ID existe")
        void shouldReturnClientWhenIdExists() {
            when(clientRepository.findById(clientId)).thenReturn(Optional.of(clientEntity));
            when(clientMapper.toResponse(clientEntity)).thenReturn(clientResponse);

            ClientResponse result = clientService.findById(clientId);

            assertThat(result).isNotNull();
            assertThat(result.id()).isEqualTo(clientId);
        }

        @Test
        @DisplayName("deve lançar ResourceNotFoundException quando ID não existe")
        void shouldThrowWhenIdNotFound() {
            UUID nonExistentId = UUID.randomUUID();
            when(clientRepository.findById(nonExistentId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> clientService.findById(nonExistentId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining(nonExistentId.toString());
        }
    }

    // =========================================================
    // DEACTIVATE (soft delete)
    // =========================================================
    @Nested
    @DisplayName("deactivate()")
    class DeactivateTests {

        @Test
        @DisplayName("deve desativar cliente (soft delete)")
        void shouldDeactivateClient() {
            when(clientRepository.findById(clientId)).thenReturn(Optional.of(clientEntity));
            when(clientRepository.save(any())).thenReturn(clientEntity);

            clientService.deactivate(clientId);

            assertThat(clientEntity.isActive()).isFalse();
            verify(clientRepository).save(clientEntity);
        }

        @Test
        @DisplayName("deve lançar exceção ao tentar desativar cliente inexistente")
        void shouldThrowWhenClientNotFound() {
            when(clientRepository.findById(clientId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> clientService.deactivate(clientId))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }
}
