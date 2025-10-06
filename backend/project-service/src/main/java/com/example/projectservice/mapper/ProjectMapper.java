package com.example.projectservice.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.example.projectservice.dto.ProjectDTO;
import com.example.projectservice.model.Project;

@Mapper(componentModel = "spring", uses = {TaskMapper.class})
public interface ProjectMapper {

    ProjectDTO toDto(Project project);

    Project toEntity(ProjectDTO dto);

    List<ProjectDTO> toDtoList(List<Project> projects);
}
