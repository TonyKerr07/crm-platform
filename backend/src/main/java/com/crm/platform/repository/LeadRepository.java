package com.crm.platform.repository;

import com.crm.platform.domain.entity.Lead;
import com.crm.platform.domain.enums.LeadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public interface LeadRepository extends JpaRepository<Lead, UUID> {

    Page<Lead> findByStatus(LeadStatus status, Pageable pageable);

    @Query("""
            SELECT l FROM Lead l
            WHERE (
                LOWER(l.name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(l.email) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(l.companyName) LIKE LOWER(CONCAT('%', :search, '%'))
            )
            """)
    Page<Lead> searchByTerm(@Param("search") String search, Pageable pageable);

    @Query("SELECT l.status, COUNT(l) FROM Lead l GROUP BY l.status")
    List<Object[]> countGroupByStatus();

    long countByStatus(LeadStatus status);

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.status NOT IN ('GANHO', 'PERDIDO')")
    long countActiveLeads();
}
