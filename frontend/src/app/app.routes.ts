import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { PlanningListComponent } from './components/planning-list/planning-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'users', component: UserListComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/new', component: ProjectDetailComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: 'plannings', component: PlanningListComponent }
];
