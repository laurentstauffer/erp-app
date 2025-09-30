import { Routes } from '@angular/router';
import { UserListComponent } from './app/components/user-list/user-list.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { PlanningListComponent } from './app/components./planning-list/planning-list.component';

const routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'plannings', component: PlanningListComponent }
];