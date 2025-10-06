package com.example.projectservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.projectservice.dto.ProjectDTO;
import com.example.projectservice.dto.TaskDTO;
import com.example.projectservice.mapper.ProjectMapper;
import com.example.projectservice.mapper.TaskMapper;
import com.example.projectservice.model.Project;
import com.example.projectservice.model.Task;
import com.example.projectservice.service.ProjectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService service;
    private final ProjectMapper projectMapper;
    private final TaskMapper taskMapper;


    // ----- Project endpoints -----
    @GetMapping
    public List<ProjectDTO> getProjects() {
        List<Project> projects = service.getAllProjects();
        return projectMapper.toDtoList(projects);
    }

    @GetMapping("/{id}")
    public ProjectDTO getProject(@PathVariable Long id) {
        Project project = service.getProject(id).orElseThrow(() -> new RuntimeException("Project not found"));
        return projectMapper.toDto(project);
    }

    @PostMapping
    public ProjectDTO createProject(@RequestBody ProjectDTO projectDTO) { 
        Project project = projectMapper.toEntity(projectDTO);
        Project savedProject = service.saveProject(project);
        return projectMapper.toDto(savedProject);
    }

    @PutMapping("/{id}")
    public ProjectDTO updateProject(@PathVariable Long id, @RequestBody ProjectDTO projectDTO) {
        Project project = projectMapper.toEntity(projectDTO);
        project.setId(id);
        Project savedProject = service.saveProject(project);
        return projectMapper.toDto(savedProject);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        service.deleteProject(id);
    }

    // ----- Task endpoints -----
    @GetMapping("/{id}/tasks")
    public List<TaskDTO> getTasks(@PathVariable Long id) {
        List<Task> tasks = service.getTasksByProject(id);
        return taskMapper.toDtoList(tasks);
    }

    @PostMapping("/{id}/tasks")
    public TaskDTO createTask(@PathVariable Long id, @RequestBody TaskDTO taskDto) {
        return taskMapper.toDto(service.addTask(id, taskMapper.toEntity(taskDto)));
    }

    @PutMapping("/{projectId}/tasks/{taskId}")
    public TaskDTO updateTask(@PathVariable Long projectId, @PathVariable Long taskId, @RequestBody TaskDTO taskDto) {
        return taskMapper.toDto(service.updateTask(projectId, taskId, taskMapper.toEntity(taskDto)));
    }

    @DeleteMapping("/{projectId}/tasks/{taskId}")
    public void deleteTask(@PathVariable Long projectId, @PathVariable Long taskId) {
        service.deleteTask(taskId);
    }
}
