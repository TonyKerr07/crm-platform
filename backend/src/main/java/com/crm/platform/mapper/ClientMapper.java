package com.crm.platform.mapper;

import com.crm.platform.domain.entity.Client;
import com.crm.platform.dto.request.ClientRequest;
import com.crm.platform.dto.response.ClientResponse;
import org.mapstruct.*;

/**
 * MapStruct gera o código de mapeamento em tempo de compilação.
 * É muito mais rápido que reflexão (ex.: ModelMapper) e tem erros em compile-time.
 *
 * componentModel = "spring" → gera um @Component que pode ser injetado com @Autowired/@Inject
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ClientMapper {

    ClientResponse toResponse(Client client);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "tasks", ignore = true)
    Client toEntity(ClientRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    void updateEntity(ClientRequest request, @MappingTarget Client client);
}
