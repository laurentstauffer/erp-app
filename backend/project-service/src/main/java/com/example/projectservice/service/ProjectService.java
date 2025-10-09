package com.example.projectservice.service;

import com.example.projectservice.model.Project;
import com.example.projectservice.model.Task;
import com.example.projectservice.repository.ProjectRepository;
import com.example.projectservice.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

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

    @Transactional
    public Project saveProject(Project project) {
        // Si le projet a des tâches, configurer la relation bidirectionnelle
        if (project.getTasks() != null && !project.getTasks().isEmpty()) {
            for (Task task : project.getTasks()) {
                task.setProject(project);
                
                // Si la tâche a un ID (mise à jour), gérer les prédécesseurs
                if (task.getId() != null) {
                    Task existingTask = taskRepository.findById(task.getId()).orElse(null);
                    if (existingTask != null) {
                        // Copier les prédécesseurs de la tâche existante
                        // car ils ne sont pas inclus dans l'objet task reçu
                        task.setPredecessors(existingTask.getPredecessors());
                        task.setSuccessors(existingTask.getSuccessors());
                    }
                }
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

    @Transactional
    public Task addTask(Long projectId, Task task) {
        return projectRepository.findById(projectId).map(project -> {
            task.setProject(project);
            
            // Initialiser le statut si non défini
            if (task.getStatus() == null) {
                task.setStatus(Task.TaskStatus.TODO);
            }
            
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Transactional
    public Task updateTask(Long projectId, Long taskId, Task updatedTask) {
        return taskRepository.findById(taskId).map(task -> {
            task.setName(updatedTask.getName());
            task.setDuration(updatedTask.getDuration());
            task.setDone(updatedTask.isDone());
            task.setStartDate(updatedTask.getStartDate());
            task.setDueDate(updatedTask.getDueDate());
            
            // Mettre à jour le statut
            if (updatedTask.getStatus() != null) {
                task.setStatus(updatedTask.getStatus());
            }
            
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
    }
    
    @Transactional
    public Task updateTaskWithPredecessors(Long projectId, Long taskId, Task updatedTask, List<Long> predecessorIds) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Mettre à jour les champs de base
        task.setName(updatedTask.getName());
        task.setDuration(updatedTask.getDuration());
        task.setDone(updatedTask.isDone());
        task.setStartDate(updatedTask.getStartDate());
        task.setDueDate(updatedTask.getDueDate());
        task.setProgress(updatedTask.getProgress()); // Pourcentage d'avancement
        
        if (updatedTask.getStatus() != null) {
            task.setStatus(updatedTask.getStatus());
        }
        
        // Mettre à jour les assignés (ressources)
        if (updatedTask.getAssigneeIds() != null) {
            task.setAssigneeIds(new ArrayList<>(updatedTask.getAssigneeIds()));
        }
        
        // Mettre à jour les prédécesseurs
        // IMPORTANT: Valider d'abord que tous les prédécesseurs existent AVANT de clear()
        List<Task> newPredecessors = new ArrayList<>();
        if (predecessorIds != null && !predecessorIds.isEmpty()) {
            for (Long predecessorId : predecessorIds) {
                Task predecessor = taskRepository.findById(predecessorId)
                    .orElseThrow(() -> new RuntimeException("Predecessor task not found: " + predecessorId));
                
                // Vérifier que les tâches sont dans le même projet
                if (!task.getProject().getId().equals(predecessor.getProject().getId())) {
                    throw new RuntimeException("Tasks must be in the same project");
                }
                
                // Vérifier qu'il n'y a pas de cycle
                if (wouldCreateCycle(task, predecessor)) {
                    throw new RuntimeException("Adding this dependency would create a cycle");
                }
                
                newPredecessors.add(predecessor);
            }
        }
        
        // Maintenant qu'on a validé tous les prédécesseurs, on peut clear et reconstruire
        task.getPredecessors().clear();
        task.getPredecessors().addAll(newPredecessors);
        
        Task savedTask = taskRepository.save(task);
        
        // Recalculer les dates si des prédécesseurs ont changé
        if (predecessorIds != null) {
            recalculateTaskDates(savedTask);
        }
        
        return savedTask;
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    // ----- Gestion des dépendances -----
    
    @Transactional
    public Task addPredecessor(Long taskId, Long predecessorId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        Task predecessor = taskRepository.findById(predecessorId)
            .orElseThrow(() -> new RuntimeException("Predecessor task not found"));
        
        // Vérifier que les deux tâches sont dans le même projet
        if (!task.getProject().getId().equals(predecessor.getProject().getId())) {
            throw new RuntimeException("Tasks must be in the same project");
        }
        
        // Vérifier qu'il n'y a pas de cycle
        if (wouldCreateCycle(task, predecessor)) {
            throw new RuntimeException("Adding this dependency would create a cycle");
        }
        
        task.getPredecessors().add(predecessor);
        Task savedTask = taskRepository.save(task);
        
        // Recalculer les dates
        recalculateTaskDates(savedTask);
        
        return savedTask;
    }

    @Transactional
    public Task removePredecessor(Long taskId, Long predecessorId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.getPredecessors().removeIf(p -> p.getId().equals(predecessorId));
        Task savedTask = taskRepository.save(task);
        
        // Recalculer les dates
        recalculateTaskDates(savedTask);
        
        return savedTask;
    }

    @Transactional
    public Task updateTaskPredecessors(Long taskId, List<Long> predecessorIds) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // IMPORTANT: Valider d'abord que tous les prédécesseurs existent AVANT de clear()
        List<Task> newPredecessors = new ArrayList<>();
        if (predecessorIds != null && !predecessorIds.isEmpty()) {
            for (Long predecessorId : predecessorIds) {
                Task predecessor = taskRepository.findById(predecessorId)
                    .orElseThrow(() -> new RuntimeException("Predecessor task not found: " + predecessorId));
                
                // Vérifier que les tâches sont dans le même projet
                if (!task.getProject().getId().equals(predecessor.getProject().getId())) {
                    throw new RuntimeException("Tasks must be in the same project");
                }
                
                // Vérifier qu'il n'y a pas de cycle
                if (wouldCreateCycle(task, predecessor)) {
                    throw new RuntimeException("Adding this dependency would create a cycle");
                }
                
                newPredecessors.add(predecessor);
            }
        }
        
        // Maintenant qu'on a validé tous les prédécesseurs, on peut clear et reconstruire
        task.getPredecessors().clear();
        task.getPredecessors().addAll(newPredecessors);
        
        Task savedTask = taskRepository.save(task);
        
        // Recalculer les dates
        recalculateTaskDates(savedTask);
        
        return savedTask;
    }

    /**
     * Vérifie si l'ajout d'une dépendance créerait un cycle
     */
    private boolean wouldCreateCycle(Task task, Task newPredecessor) {
        Set<Long> visited = new HashSet<>();
        return hasCycleDFS(newPredecessor, task.getId(), visited);
    }

    private boolean hasCycleDFS(Task current, Long targetId, Set<Long> visited) {
        if (current.getId().equals(targetId)) {
            return true;
        }
        
        if (visited.contains(current.getId())) {
            return false;
        }
        
        visited.add(current.getId());
        
        for (Task predecessor : current.getPredecessors()) {
            if (hasCycleDFS(predecessor, targetId, visited)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Recalcule automatiquement les dates de début et de fin d'une tâche
     * basées sur ses prédécesseurs
     */
    @Transactional
    public void recalculateTaskDates(Task task) {
        if (task.getPredecessors() == null || task.getPredecessors().isEmpty()) {
            // Pas de prédécesseurs : utiliser la date de début du projet
            Project project = task.getProject();
            if (project.getStartDate() != null && task.getStartDate() == null) {
                task.setStartDate(project.getStartDate());
            }
        } else {
            // Calculer la date de début comme le max des dates de fin des prédécesseurs
            LocalDate maxEndDate = task.getPredecessors().stream()
                .map(Task::getDueDate)
                .filter(Objects::nonNull)
                .max(LocalDate::compareTo)
                .orElse(null);
            
            if (maxEndDate != null) {
                task.setStartDate(maxEndDate.plusDays(1)); // Commence le jour suivant
            }
        }
        
        // Calculer la date de fin si on a une date de début et une durée
        if (task.getStartDate() != null && task.getDuration() > 0) {
            task.setDueDate(task.getStartDate().plusDays(task.getDuration() - 1));
        }
        
        taskRepository.save(task);
        
        // Recalculer récursivement pour les successeurs
        for (Task successor : task.getSuccessors()) {
            recalculateTaskDates(successor);
        }
    }

    /**
     * Recalcule les dates pour toutes les tâches d'un projet
     */
    @Transactional
    public void recalculateProjectDates(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        
        // Trouver les tâches sans prédécesseurs (points de départ)
        List<Task> rootTasks = project.getTasks().stream()
            .filter(task -> task.getPredecessors() == null || task.getPredecessors().isEmpty())
            .toList();
        
        // Recalculer à partir de chaque racine
        for (Task rootTask : rootTasks) {
            recalculateTaskDates(rootTask);
        }
    }
}
