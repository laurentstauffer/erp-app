import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { UserService, User } from '../../services/user.service';
import { Project, Task, TaskStatus } from '../../models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  projectForm!: FormGroup;
  taskForm!: FormGroup;
  
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
  editingTaskIndex: number | null = null;
  users: User[] = [];

  private fb = inject(FormBuilder);
  projectService = inject(ProjectService);
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit(): void {
    this.initForms();
    this.loadUsers();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.loadProject(parseInt(id));
    }
  }

  initForms(): void {
    // Formulaire de projet
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    // Formulaire de tâche
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      duration: [1, [Validators.required, Validators.min(1)]],
      status: [TaskStatus.TODO, Validators.required],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      dueDate: [''],
      startDate: [''],
      predecessorIds: [[]],
      assigneeIds: [[]]
    });
  }

  // Getters pour les champs du formulaire projet
  get name() { return this.projectForm.get('name'); }
  get description() { return this.projectForm.get('description'); }
  get startDate() { return this.projectForm.get('startDate'); }
  get endDate() { return this.projectForm.get('endDate'); }

  // Getters pour les champs du formulaire tâche
  get taskName() { return this.taskForm.get('name'); }
  get taskDuration() { return this.taskForm.get('duration'); }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    });
  }

  loadProject(id: number): void {
    this.isLoading = true;
    this.projectService.getProject(id).subscribe({
      next: (data) => {
        this.project = data;
        if (!this.project.tasks) {
          this.project.tasks = [];
        }
        // Remplir le formulaire avec les données du projet
        this.projectForm.patchValue({
          name: this.project.name,
          description: this.project.description,
          startDate: this.project.startDate,
          endDate: this.project.endDate
        });
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
          // Après la mise à jour du projet, mettre à jour les dépendances de chaque tâche
          this.updateTaskDependencies();
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

  updateTaskDependencies(): void {
    if (!this.project.id || !this.project.tasks || this.project.tasks.length === 0) {
      this.router.navigate(['/projects']);
      return;
    }

    // Mettre à jour chaque tâche qui a un ID (tâches existantes)
    const taskUpdates = this.project.tasks
      .filter(task => task.id) // Seulement les tâches existantes
      .map(task => 
        this.projectService.updateTask(this.project.id!, task.id!, task).toPromise()
      );

    Promise.all(taskUpdates)
      .then(() => {
        this.router.navigate(['/projects']);
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour des dépendances:', error);
        this.errorMessage = 'Erreur lors de la mise à jour des dépendances';
        this.isLoading = false;
      });
  }

  validateProject(): boolean {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.errorMessage = 'Tous les champs sont obligatoires';
      return false;
    }
    
    const formValues = this.projectForm.value;
    if (new Date(formValues.startDate) > new Date(formValues.endDate)) {
      this.errorMessage = 'La date de fin doit être après la date de début';
      return false;
    }
    
    // Synchroniser les valeurs du formulaire avec l'objet project
    this.project.name = formValues.name;
    this.project.description = formValues.description;
    this.project.startDate = formValues.startDate;
    this.project.endDate = formValues.endDate;
    
    this.errorMessage = '';
    return true;
  }

  addTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      alert('Veuillez remplir correctement tous les champs de la tâche');
      return;
    }

    if (!this.project.tasks) {
      this.project.tasks = [];
    }

    const taskData: Task = {
      ...this.taskForm.value,
      done: false
    };

    if (this.editingTaskIndex !== null) {
      // Mode édition : mettre à jour la tâche existante
      this.project.tasks[this.editingTaskIndex] = { ...taskData };
      this.editingTaskIndex = null;
    } else {
      // Mode ajout : ajouter une nouvelle tâche
      this.project.tasks.push(taskData);
    }
    
    this.resetTaskForm();
  }

  editTask(index: number): void {
    const task = this.project.tasks![index];
    this.taskForm.patchValue({
      name: task.name,
      duration: task.duration,
      status: task.status || TaskStatus.TODO,
      progress: task.progress || 0,
      dueDate: task.dueDate || '',
      startDate: task.startDate || '',
      predecessorIds: task.predecessorIds || [],
      assigneeIds: task.assigneeIds || []
    });
    this.editingTaskIndex = index;
  }

  cancelEdit(): void {
    this.resetTaskForm();
    this.editingTaskIndex = null;
  }

  removeTask(index: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.project.tasks?.splice(index, 1);
    }
  }

  resetTaskForm(): void {
    this.taskForm.reset({
      name: '',
      duration: 1,
      status: TaskStatus.TODO,
      progress: 0,
      dueDate: '',
      startDate: '',
      predecessorIds: [],
      assigneeIds: []
    });
    this.editingTaskIndex = null;
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }

  // Méthodes pour la gestion des dépendances et statuts

  getAvailablePredecessors(): Task[] {
    if (!this.project.tasks) {
      return [];
    }
    
    // Exclure la tâche en cours d'édition
    if (this.editingTaskIndex !== null) {
      return this.project.tasks.filter((_, index) => index !== this.editingTaskIndex);
    }
    
    return this.project.tasks;
  }

  getPredecessorNames(predecessorIds: number[]): string[] {
    if (!predecessorIds || !this.project.tasks) {
      return [];
    }
    
    return predecessorIds
      .map(id => {
        const task = this.project.tasks?.find(t => t.id === id);
        return task ? task.name : `Tâche #${id}`;
      });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'TODO': 'status-todo',
      'IN_PROGRESS': 'status-in-progress',
      'BLOCKED': 'status-blocked',
      'COMPLETED': 'status-completed'
    };
    return statusMap[status] || 'status-todo';
  }

  getStatusLabel(status: string): string {
    const labelMap: { [key: string]: string } = {
      'TODO': '📋 À faire',
      'IN_PROGRESS': '🔄 En cours',
      'BLOCKED': '🚫 Bloquée',
      'COMPLETED': '✅ Terminée'
    };
    return labelMap[status] || '📋 À faire';
  }

  recalculateDates(): void {
    if (!this.project.id) {
      alert('Veuillez d\'abord sauvegarder le projet');
      return;
    }

    this.isLoading = true;
    this.projectService.recalculateProjectDates(this.project.id).subscribe({
      next: () => {
        // Recharger le projet pour obtenir les dates mises à jour
        this.loadProject(this.project.id!);
        alert('Les dates ont été recalculées avec succès');
      },
      error: (error) => {
        console.error('Erreur lors du recalcul des dates:', error);
        this.errorMessage = 'Erreur lors du recalcul des dates';
        this.isLoading = false;
      }
    });
  }

  getAssigneeNames(assigneeIds: number[]): string[] {
    if (!assigneeIds || !this.users) {
      return [];
    }
    
    return assigneeIds
      .map(id => {
        const user = this.users.find(u => u.id === id);
        return user ? user.username : `User #${id}`;
      });
  }
}
