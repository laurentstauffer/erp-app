import { Component, inject, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProjectFormComponent implements OnInit, OnChanges {
  @Input() projectToEdit: Project | null = null;
  @Output() projectSaved = new EventEmitter<void>();

  projectForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  projectService: ProjectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['projectToEdit'] && this.projectForm) {
      this.initForm();
    }
  }

  private initForm() {
    this.projectForm = this.fb.group({
      name: [this.projectToEdit?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.projectToEdit?.description || ''],
      startDate: [this.projectToEdit?.startDate || '', Validators.required],
      endDate: [this.projectToEdit?.endDate || '', Validators.required]
    });
  }

  get isEditMode(): boolean {
    return this.projectToEdit !== null && this.projectToEdit.id !== undefined;
  }

  get name() {
    return this.projectForm.get('name');
  }

  get startDate() {
    return this.projectForm.get('startDate');
  }

  get endDate() {
    return this.projectForm.get('endDate');
  }

  saveProject() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const projectData: Project = {
      ...this.projectForm.value,
      ...(this.isEditMode && this.projectToEdit?.id ? { id: this.projectToEdit.id } : {})
    };

    if (this.isEditMode && projectData.id) {
      this.projectService.updateProject(projectData.id, projectData).subscribe({
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
      this.projectService.createProject(projectData).subscribe({
        next: () => {
          this.successMessage = 'Projet créé avec succès !';
          this.errorMessage = '';
          this.projectForm.reset();
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
