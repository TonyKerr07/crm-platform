package com.crm.platform.repository;

import com.crm.platform.domain.entity.Task;
import com.crm.platform.domain.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    Page<Task> findByClientId(UUID clientId, Pageable pageable);

    Page<Task> findByStatus(TaskStatus status, Pageable pageable);

    List<Task> findByClientIdAndStatus(UUID clientId, TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status IN ('ABERTA', 'EM_ANDAMENTO')")
    long countOpenTasks();

    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < :today AND t.status IN ('ABERTA', 'EM_ANDAMENTO')")
    long countOverdueTasks(@Param("today") LocalDate today);

    @Query("SELECT t FROM Task t WHERE t.dueDate < :today AND t.status IN ('ABERTA', 'EM_ANDAMENTO')")
    List<Task> findOverdueTasks(@Param("today") LocalDate today);
}
