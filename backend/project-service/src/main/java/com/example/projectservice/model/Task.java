package com.example.projectservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int duration; // en jours
    private LocalDate startDate; // Date de début calculée
    private LocalDate dueDate; // Date de fin (calculée ou manuelle)
    private boolean done;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TaskStatus status = TaskStatus.TODO;

    // Pourcentage d'avancement (0-100)
    @Column(columnDefinition = "integer default 0")
    @Builder.Default
    private int progress = 0;

    // Affectation de ressources (IDs des utilisateurs assignés)
    @ElementCollection
    @CollectionTable(name = "task_assignees", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "user_id")
    @Builder.Default
    private List<Long> assigneeIds = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    // Tâches qui doivent être terminées avant celle-ci
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "task_dependencies",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "predecessor_id")
    )
    @Builder.Default
    private List<Task> predecessors = new ArrayList<>();

    // Tâches qui dépendent de celle-ci (relation inverse)
    @ManyToMany(mappedBy = "predecessors", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Task> successors = new ArrayList<>();

    /**
     * Cleanup method called before task deletion to remove all dependencies
     */
    @PreRemove
    private void removeTaskDependencies() {
        // Remove this task from all predecessors' successors lists
        for (Task predecessor : new ArrayList<>(predecessors)) {
            predecessor.getSuccessors().remove(this);
        }
        predecessors.clear();
        
        // Remove this task from all successors' predecessors lists
        for (Task successor : new ArrayList<>(successors)) {
            successor.getPredecessors().remove(this);
        }
        successors.clear();
    }

    public enum TaskStatus {
        TODO,
        IN_PROGRESS,
        BLOCKED,
        COMPLETED
    }
}
