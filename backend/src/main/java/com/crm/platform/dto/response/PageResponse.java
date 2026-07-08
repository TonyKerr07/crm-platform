package com.crm.platform.dto.response;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Wrapper genérico para respostas paginadas.
 * O frontend recebe sempre o mesmo formato, independente do tipo de entidade.
 */
public record PageResponse<T>(
        List<T> content,
        int pageNumber,
        int pageSize,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
}
