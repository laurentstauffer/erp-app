# Guide d'Utilisation des Composants Reactive Forms

Ce document explique comment utiliser les composants de formulaires refactorisés avec Reactive Forms.

## 📦 Composants Disponibles

### 1. ProjectFormComponent
Formulaire pour créer et modifier des projets avec validation complète.

### 2. TaskFormComponent
Formulaire pour ajouter des tâches à un projet.

### 3. UserFormComponent
Formulaire pour créer des utilisateurs.

---

## 🚀 Comment Utiliser les Composants

### ProjectFormComponent

#### Import dans votre composant parent

```typescript
import { ProjectFormComponent } from './components/project-form/project-form.component';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [ProjectFormComponent, CommonModule],
  // ...
})
```

#### Utilisation dans le template

**Mode Création :**
```html
<app-project-form 
  (projectSaved)="onProjectSaved()">
</app-project-form>
```

**Mode Édition :**
```html
<app-project-form 
  [projectToEdit]="selectedProject"
  (projectSaved)="onProjectSaved()">
</app-project-form>
```

#### Inputs & Outputs

**@Input()**
- `projectToEdit: Project | null` - Projet à éditer (null pour mode création)

**@Output()**
- `projectSaved: EventEmitter<void>` - Émis après sauvegarde réussie

#### Exemple complet

```typescript
export class ProjectListComponent {
  selectedProject: Project | null = null;
  showForm = false;

  createProject() {
    this.selectedProject = null;
    this.showForm = true;
  }

  editProject(project: Project) {
    this.selectedProject = project;
    this.showForm = true;
  }

  onProjectSaved() {
    this.showForm = false;
    this.loadProjects(); // Recharger la liste
  }
}
```

```html
<button (click)="createProject()">Nouveau Projet</button>

<app-project-form 
  *ngIf="showForm"
  [projectToEdit]="selectedProject"
  (projectSaved)="onProjectSaved()">
</app-project-form>
```

---

### TaskFormComponent

#### Import

```typescript
import { TaskFormComponent } from './components/task-form/task-form.component';
```

#### Utilisation

```html
<app-task-form 
  [projectId]="currentProjectId">
</app-task-form>
```

#### Inputs

**@Input()**
- `projectId: number` - ID du projet (requis)

#### Exemple

```typescript
export class ProjectDetailComponent {
  projectId = 5;
}
```

```html
<h3>Ajouter une tâche</h3>
<app-task-form [projectId]="projectId"></app-task-form>
```

---

### UserFormComponent

#### Import

```typescript
import { UserFormComponent } from './components/user-form/user-form.component';
```

#### Utilisation

```html
<app-user-form 
  (saved)="onUserSaved()"
  (cancel)="onCancel()">
</app-user-form>
```

#### Outputs

**@Output()**
- `saved: EventEmitter<void>` - Émis après création réussie
- `cancel: EventEmitter<void>` - Émis quand l'utilisateur annule

#### Exemple avec Modal

```typescript
export class UserListComponent {
  showModal = false;

  openUserForm() {
    this.showModal = true;
  }

  onUserSaved() {
    this.showModal = false;
    this.loadUsers();
  }

  onCancel() {
    this.showModal = false;
  }
}
```

```html
<button (click)="openUserForm()">Ajouter Utilisateur</button>

<div class="modal" *ngIf="showModal">
  <app-user-form 
    (saved)="onUserSaved()"
    (cancel)="onCancel()">
  </app-user-form>
</div>
```

---

## ✅ Validations Intégrées

### ProjectFormComponent

| Champ | Règles de Validation |
|-------|---------------------|
| Nom | Requis, min 3 caractères |
| Description | Optionnel |
| Date de début | Requise |
| Date de fin | Requise |

**Messages d'erreur affichés :**
- "Le nom est requis"
- "Le nom doit contenir au moins 3 caractères"
- "La date de début est requise"
- "La date de fin est requise"

### TaskFormComponent

| Champ | Règles de Validation |
|-------|---------------------|
| Nom | Requis, min 3 caractères |
| Durée | Requise, min 0.1 |
| Done | Optionnel (checkbox) |
| Date d'échéance | Optionnel |

**Messages d'erreur :**
- "Le nom est requis"
- "Le nom doit contenir au moins 3 caractères"
- "La durée est requise"
- "La durée doit être supérieure à 0"

### UserFormComponent

| Champ | Règles de Validation |
|-------|---------------------|
| Username | Requis, min 3 caractères |
| Email | Requis, format email valide |
| Password | Requis, min 6 caractères |

**Messages d'erreur :**
- "Le nom d'utilisateur est requis"
- "Le nom d'utilisateur doit contenir au moins 3 caractères"
- "L'email est requis"
- "Format d'email invalide"
- "Le mot de passe est requis"
- "Le mot de passe doit contenir au moins 6 caractères"

---

## 🎨 Styles

Les composants utilisent des classes CSS pour le styling des erreurs :

```css
/* Champ en erreur */
input.error {
  border-color: red;
}

/* Message d'erreur */
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Message de succès */
.success {
  color: green;
}

/* Message d'erreur général */
.error {
  color: red;
}
```

Vous pouvez personnaliser ces styles dans le fichier CSS de chaque composant.

---

## 🔄 Comportements Automatiques

### 1. Désactivation du bouton
Le bouton submit est automatiquement désactivé quand le formulaire est invalide.

### 2. Affichage des erreurs
Les erreurs s'affichent uniquement quand :
- Le champ a été touché (clicked/focused puis quitté)
- OU une tentative de soumission a été faite

### 3. Reset du formulaire
- **ProjectFormComponent** : Reset après création réussie (pas en mode édition)
- **TaskFormComponent** : Reset après chaque création réussie
- **UserFormComponent** : Pas de reset automatique (géré par le parent)

### 4. Messages de feedback
Chaque composant affiche :
- Message de succès en vert après succès
- Message d'erreur en rouge en cas d'échec
- Les messages s'auto-remplacent

---

## 📝 Exemple d'Intégration
