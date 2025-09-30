import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- indispensable pour routerLink

@Component({
  selector: 'app-root',
  imports: [RouterModule],  // <-- ajoute RouterModule ici
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
