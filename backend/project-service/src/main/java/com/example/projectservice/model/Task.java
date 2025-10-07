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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    // Tâches qui doivent être terminées avant celle-ci
    @ManyToMany(fetch = FetchType.LAZY)
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

    public enum TaskStatus {
        TODO,
        IN_PROGRESS,
        BLOCKED,
        COMPLETED
    }
}
