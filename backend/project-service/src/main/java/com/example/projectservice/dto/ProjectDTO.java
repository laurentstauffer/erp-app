package com.example.projectservice.dto;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    private String startDate; // ISO date string
    private String endDate; // ISO date string

    private List<TaskDTO> tasks;

}
