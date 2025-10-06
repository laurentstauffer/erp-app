import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project, Task } from '../../models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  project: Project = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    tasks: []
  };
  
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  
  newTask: Task = {
    name: '',
    duration: 1,
    done: false,
    dueDate: ''
  };

  editingTaskIndex: number | null = null;

  projectService = inject(ProjectService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.loadProject(parseInt(id));
    }
  }

  loadProject(id: number): void {
    this.isLoading = true;
    this.projectService.getProject(id).subscribe({
      next: (data) => {
        this.project = data;
        if (!this.project.tasks) {
          this.project.tasks = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du projet:', error);
        this.errorMessage = 'Erreur lors du chargement du projet';
        this.isLoading = false;
      }
    });
  }

  saveProject(): void {
    if (!this.validateProject()) {
      return;
    }

    this.isLoading = true;
    
    // Assigner le projectId à toutes les tâches avant la sauvegarde
    if (this.project.tasks && this.project.tasks.length > 0) {
      this.project.tasks.forEach(task => {
        if (this.project.id) {
          task.projectId = this.project.id;
        }
      });
    }
    
    if (this.isEditMode && this.project.id) {
      this.projectService.updateProject(this.project.id, this.project).subscribe({
        next: () => {
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.errorMessage = 'Erreur lors de la mise à jour du projet';
          this.isLoading = false;
        }
      });
    } else {
      this.projectService.createProject(this.project).subscribe({
        next: (createdProject) => {
          // Après la création, assigner le projectId aux tâches et les créer
          if (this.project.tasks && this.project.tasks.length > 0 && createdProject.id) {
            // Les tâches ont déjà été envoyées avec le projet
            // Pas besoin de les créer séparément
          }
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.errorMessage = 'Erreur lors de la création du projet';
          this.isLoading = false;
        }
      });
    }
  }

  validateProject(): boolean {
    if (!this.project.name || !this.project.description || !this.project.startDate || !this.project.endDate) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return false;
    }
    
    if (new Date(this.project.startDate) > new Date(this.project.endDate)) {
      this.errorMessage = 'La date de fin doit être après la date de début';
      return false;
    }
    
    this.errorMessage = '';
    return true;
  }

  addTask(): void {
    if (!this.newTask.name || this.newTask.duration <= 0) {
      alert('Veuillez remplir tous les champs de la tâche');
      return;
    }

    if (!this.project.tasks) {
      this.project.tasks = [];
    }

    if (this.editingTaskIndex !== null) {
      // Mode édition : mettre à jour la tâche existante
      this.project.tasks[this.editingTaskIndex] = { ...this.newTask };
      this.editingTaskIndex = null;
    } else {
      // Mode ajout : ajouter une nouvelle tâche
      this.project.tasks.push({ ...this.newTask });
    }
    
    this.resetNewTask();
  }

  editTask(index: number): void {
    const task = this.project.tasks![index];
    this.newTask = { ...task };
    this.editingTaskIndex = index;
  }

  cancelEdit(): void {
    this.resetNewTask();
    this.editingTaskIndex = null;
  }

  removeTask(index: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.project.tasks?.splice(index, 1);
    }
  }

  resetNewTask(): void {
    this.newTask = {
      name: '',
      duration: 1,
      done: false,
      dueDate: ''
    };
    this.editingTaskIndex = null;
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }
}
