package com.example.projectservice.mapper;

import com.example.projectservice.dto.ProjectDTO;
import com.example.projectservice.dto.TaskDTO;
import com.example.projectservice.model.Project;
import com.example.projectservice.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
public class ProjectMapperImpl implements ProjectMapper {

    @Autowired
    private TaskMapper taskMapper;

    @Override
    public ProjectDTO toDto(Project project) {
        if (project == null) {
            return null;
        }
        
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStartDate(dateToString(project.getStartDate()));
        dto.setEndDate(dateToString(project.getEndDate()));
        
        if (project.getTasks() != null) {
            List<TaskDTO> taskDtos = new ArrayList<>();
            for (Task task : project.getTasks()) {
                taskDtos.add(taskMapper.toDto(task));
            }
            dto.setTasks(taskDtos);
        }
        
        return dto;
    }

    @Override
    public Project toEntity(ProjectDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Project project = new Project();
        project.setId(dto.getId());
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStartDate(stringToDate(dto.getStartDate()));
        project.setEndDate(stringToDate(dto.getEndDate()));
        
        if (dto.getTasks() != null) {
            List<Task> tasks = new ArrayList<>();
            for (TaskDTO taskDto : dto.getTasks()) {
                Task task = taskMapper.toEntity(taskDto);
                task.setProject(project);
                tasks.add(task);
            }
            project.setTasks(tasks);
        }
        
        return project;
    }

    @Override
    public List<ProjectDTO> toDtoList(List<Project> projects) {
        if (projects == null) {
            return null;
        }
        
        List<ProjectDTO> dtos = new ArrayList<>();
        for (Project project : projects) {
            dtos.add(toDto(project));
        }
        return dtos;
    }
    
    private String dateToString(LocalDate date) {
        return date != null ? date.format(DateTimeFormatter.ISO_DATE) : null;
    }
    
    private LocalDate stringToDate(String date) {
        if (date == null || date.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(date, DateTimeFormatter.ISO_DATE);
        } catch (Exception e) {
            return null;
        }
    }
}
