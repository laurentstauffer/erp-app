import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Task } from '../../models/project.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class TaskFormComponent implements OnInit {
  @Input() projectId!: number;
  
  taskForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      duration: [1, [Validators.required, Validators.min(0.1)]],
      done: [false],
      dueDate: ['']
    });
  }

  get name() {
    return this.taskForm.get('name');
  }

  get duration() {
    return this.taskForm.get('duration');
  }

  createTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskData: Task = {
      ...this.taskForm.value,
      projectId: this.projectId
    };

    this.projectService.createTask(this.projectId, taskData).subscribe({
      next: () => {
        this.successMessage = 'Tâche ajoutée avec succès !';
        this.errorMessage = '';
        this.taskForm.reset({ duration: 1, done: false });
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la création de la tâche.';
        this.successMessage = '';
      },
    });
  }
}
