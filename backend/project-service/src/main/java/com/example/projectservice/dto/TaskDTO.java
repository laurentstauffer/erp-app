package com.example.projectservice.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDTO {
    private Long id;
    private String name;
    private int duration;
    private boolean done;   
    private String dueDate; // Changed to String for simplicity
    
}
