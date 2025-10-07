package com.example.projectservice.mapper;

import com.example.projectservice.dto.ProjectDTO;
import com.example.projectservice.model.Project;

import java.util.List;

public interface ProjectMapper {

    ProjectDTO toDto(Project project);

    Project toEntity(ProjectDTO dto);

    List<ProjectDTO> toDtoList(List<Project> projects);
}
