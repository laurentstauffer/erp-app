import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Task } from '../../models/project.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TaskFormComponent {
  @Input() projectId!: number ;
  task: Task = { name: '', duration: 1, done: false, projectId: this.projectId };
  successMessage = '';
  errorMessage = '';

  constructor(private projectService: ProjectService) {}

  createTask() {
    this.projectService.createTask(this.projectId, this.task).subscribe({
      next: () => {
        this.successMessage = 'Tâche ajoutée avec succès !';
        this.errorMessage = '';
        this.task = { name: '', duration: 1, done: false , projectId: this.projectId };
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la création de la tâche.';
        this.successMessage = '';
      },
    });
  }
}
