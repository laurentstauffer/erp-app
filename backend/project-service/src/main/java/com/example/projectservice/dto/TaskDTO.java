package com.example.projectservice.dto;

import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDTO {
    private Long id;
    private String name;
    private int duration;
    private String startDate; // Date de début
    private String dueDate; // Date de fin
    private boolean done;
    private String status;
    
    @Builder.Default
    private int progress = 0; // Pourcentage d'avancement (0-100)
    
    @Builder.Default
    private List<Long> predecessorIds = new ArrayList<>(); // IDs des tâches prédécesseurs
    
    @Builder.Default
    private List<Long> assigneeIds = new ArrayList<>(); // IDs des utilisateurs assignés
}
