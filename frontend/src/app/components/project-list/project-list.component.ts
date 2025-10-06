import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ProjectFormComponent, TaskFormComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  showProjectForm = false;
  projectToEdit: Project | null = null;

  projectService = inject(ProjectService)

  constructor() {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
    });
  }

  toggleProjectForm() {
    this.showProjectForm = !this.showProjectForm;
    if (!this.showProjectForm) {
      this.projectToEdit = null;
    }
  }

  editProject(project: Project) {
    this.projectToEdit = project;
    this.showProjectForm = true;
  }

  onProjectSaved() {
    this.loadProjects();
    this.showProjectForm = false;
    this.projectToEdit = null;
  }
}
