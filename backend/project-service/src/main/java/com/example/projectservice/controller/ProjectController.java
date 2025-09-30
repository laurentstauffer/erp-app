package com.example.projectservice.controller;

import com.example.projectservice.model.Project;
import com.example.projectservice.model.Task;
import com.example.projectservice.service.ProjectService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "http://localhost:4200") // Angular dev server
public class ProjectController {
    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    // ----- Project endpoints -----
    @GetMapping
    public List<Project> getProjects() {
        return service.getAllProjects();
    }

    @GetMapping("/{id}")
    public Project getProject(@PathVariable Long id) {
        return service.getProject(id).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) { 
        return service.saveProject(project);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project project) {
        project.setId(id);
        return service.saveProject(project);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        service.deleteProject(id);
    }

    // ----- Task endpoints -----
    @GetMapping("/{id}/tasks")
    public List<Task> getTasks(@PathVariable Long id) {
        return service.getTasksByProject(id);
    }

    @PostMapping("/{id}/tasks")
    public Task createTask(@PathVariable Long id, @RequestBody Task task) {
        return service.addTask(id, task);
    }

    @PutMapping("/{projectId}/tasks/{taskId}")
    public Task updateTask(@PathVariable Long projectId, @PathVariable Long taskId, @RequestBody Task task) {
        return service.updateTask(projectId, taskId, task);
    }

    @DeleteMapping("/{projectId}/tasks/{taskId}")
    public void deleteTask(@PathVariable Long projectId, @PathVariable Long taskId) {
        service.deleteTask(taskId);
    }
}
