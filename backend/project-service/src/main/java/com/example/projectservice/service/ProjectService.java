package com.example.projectservice.service;

import com.example.projectservice.model.Project;
import com.example.projectservice.model.Task;
import com.example.projectservice.repository.ProjectRepository;
import com.example.projectservice.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public ProjectService(ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    // ----- Projects -----
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProject(Long id) {
        return projectRepository.findById(id);
    }

    public Project saveProject(Project project) {
        // Si le projet a des tâches, configurer la relation bidirectionnelle
        if (project.getTasks() != null && !project.getTasks().isEmpty()) {
            for (Task task : project.getTasks()) {
                task.setProject(project);
            }
        }
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    // ----- Tasks -----
    public List<Task> getTasksByProject(Long projectId) {
        return projectRepository.findById(projectId)
                .map(Project::getTasks)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Task addTask(Long projectId, Task task) {
        return projectRepository.findById(projectId).map(project -> {
            task.setProject(project);
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Task updateTask(Long projectId, Long taskId, Task updatedTask) {
        return taskRepository.findById(taskId).map(task -> {
            task.setName(updatedTask.getName());
            task.setDuration(updatedTask.getDuration());
            task.setDone(updatedTask.isDone());
            task.setDueDate(updatedTask.getDueDate());
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}
