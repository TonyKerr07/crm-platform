package com.crm.platform.mapper;

import com.crm.platform.domain.entity.Lead;
import com.crm.platform.dto.request.LeadRequest;
import com.crm.platform.dto.response.LeadResponse;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeadMapper {

    @Mapping(target = "statusLabel", expression = "java(lead.getStatus().getLabel())")
    LeadResponse toResponse(Lead lead);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Lead toEntity(LeadRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntity(LeadRequest request, @MappingTarget Lead lead);
}
