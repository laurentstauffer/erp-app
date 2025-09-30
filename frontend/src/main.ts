import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { UserListComponent } from './app/components/user-list/user-list.component';
import { ProjectListComponent } from './app/components/project-list/project-list.component';
import { PlanningListComponent } from './app/components/planning-list/planning-list.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // <-- fournit HttpClient aux services
    provideRouter([
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UserListComponent },
      { path: 'projects', component: ProjectListComponent },
      { path: 'plannings', component: PlanningListComponent }
    ])
  ]
});
