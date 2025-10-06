import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProjectFormComponent {
  @Input() projectToEdit: Project | null = null;
  @Output() projectSaved = new EventEmitter<void>();

  project: Project = { name: '', description: '', startDate: '', endDate: '' };
  successMessage = '';
  errorMessage = '';

  projectService: ProjectService = inject(ProjectService);

  constructor() {}

  ngOnInit() {
    if (this.projectToEdit) {
      this.project = { ...this.projectToEdit };
    }
  }

  get isEditMode(): boolean {
    return this.projectToEdit !== null && this.projectToEdit.id !== undefined;
  }

  saveProject() {
    if (this.isEditMode && this.project.id) {
      this.projectService.updateProject(this.project.id, this.project).subscribe({
        next: () => {
          this.successMessage = 'Projet modifié avec succès !';
          this.errorMessage = '';
          this.projectSaved.emit();
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la modification du projet.';
          this.successMessage = '';
        },
      });
    } else {
      this.projectService.createProject(this.project).subscribe({
        next: () => {
          this.successMessage = 'Projet créé avec succès !';
          this.errorMessage = '';
          this.project = { name: '', description: '', startDate: '', endDate: '' };
          this.projectSaved.emit();
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la création du projet.';
          this.successMessage = '';
        },
      });
    }
  }
}
