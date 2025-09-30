import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { PlanningListComponent } from './components/planning-list/planning-list.component';

const routes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'plannings', component: PlanningListComponent },
  { path: '', redirectTo: '/users', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
