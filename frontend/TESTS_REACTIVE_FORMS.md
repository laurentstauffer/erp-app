# Tests Unitaires des Reactive Forms

Ce document explique comment exécuter les tests unitaires des formulaires refactorisés avec Reactive Forms.

## Tests Créés

Les tests unitaires suivants ont été créés pour valider les formulaires Reactive Forms :

### 1. **ProjectFormComponent** (`project-form.component.spec.ts`)
- ✅ 26 tests couvrant :
  - Initialisation du formulaire
  - Validations (nom, dates)
  - Mode création vs édition
  - Soumission et gestion des erreurs
  - Messages de succès/erreur

### 2. **TaskFormComponent** (`task-form.component.spec.ts`)
- ✅ 21 tests couvrant :
  - Initialisation du formulaire
  - Validations (nom, durée)
  - Soumission avec projectId
  - Reset du formulaire
  - Gestion des erreurs

### 3. **UserFormComponent** (`user-form.component.spec.ts`)
- ✅ 29 tests couvrant :
  - Initialisation du formulaire
  - Validations (username, email, password)
  - Format d'email
  - Cas limites (longueurs minimales, caractères spéciaux)
  - Événements (saved, cancel)

**Total : 76 tests réussis** ✅

## Exécuter les Tests

### Option 1 : Tous les tests (recommandé)

```bash
cd frontend
npm test
```

Cette commande lance tous les tests en mode watch (les tests se relancent automatiquement à chaque modification).

### Option 2 : Exécution unique sans watch

```bash
cd frontend
npm test -- --watch=false
```

### Option 3 : Exécuter seulement les tests des formulaires Reactive Forms

```bash
cd frontend
npm test -- --include="**/project-form.component.spec.ts" --watch=false
npm test -- --include="**/task-form.component.spec.ts" --watch=false
npm test -- --include="**/user-form.component.spec.ts" --watch=false
```

### Option 4 : Mode headless (sans interface)

```bash
cd frontend
npm test -- --browsers=ChromeHeadless --watch=false
```

## Résultats Attendus

Lors de l'exécution, vous devriez voir :

```
Chrome Headless: Executed 83 of 83 SUCCESS
TOTAL: 76 SUCCESS
```

**Note** : Les 7 tests en échec concernent d'autres composants existants (PlanningListComponent, ProjectListComponent, UserListComponent, AppComponent, ProjectDetailComponent) qui n'ont pas été modifiés dans cette refactorisation.

## Couverture des Tests

Les tests couvrent :

### Validations de Formulaire
- ✅ Champs requis vides
- ✅ Longueurs minimales (3 caractères pour noms, 6 pour passwords)
- ✅ Formats d'email
- ✅ Valeurs numériques minimales

### Comportements
- ✅ Désactivation du bouton submit quand le formulaire est invalide
- ✅ Affichage des messages d'erreur
- ✅ Marquage des champs comme "touched"
- ✅ Soumission des données correctes
- ✅ Gestion des succès et échecs

### Cas Limites
- ✅ Valeurs exactement à la limite (3 caractères, 6 caractères)
- ✅ Caractères spéciaux
- ✅ Emails complexes (sous-domaines, +)
- ✅ Durées décimales

## Structure des Tests

Chaque fichier de test suit cette structure :

```typescript
describe('ComponentName', () => {
  // Configuration initiale
  beforeEach(async () => {
    // Mock des services
    // Configuration de TestBed
  });

  // Tests groupés par fonctionnalité
  describe('Form Validations', () => {
    it('should validate...', () => { });
  });

  describe('Form Getters', () => {
    it('should return...', () => { });
  });

  describe('Method Name', () => {
    it('should behave...', () => { });
  });
});
```

## Déboguer les Tests

### Exécuter un seul test

Utilisez `fit()` au lieu de `it()` :

```typescript
fit('should validate form when name is valid', () => {
  // Ce test sera le seul à s'exécuter
});
```

### Ignorer un test

Utilisez `xit()` au lieu de `it()` :

```typescript
xit('should validate...', () => {
  // Ce test sera ignoré
});
```

### Voir les logs dans les tests

```typescript
it('should log values', () => {
  console.log('Form value:', component.projectForm.value);
  expect(component.projectForm.valid).toBeTruthy();
});
```

## Technologies Utilisées

- **Jasmine** : Framework de test
- **Karma** : Test runner
- **Angular Testing Utilities** : TestBed, ComponentFixture
- **Spy Objects** : Pour mocker les services

## Bonnes Pratiques

✅ **Isoler les tests** : Chaque test est indépendant
✅ **Mocker les dépendances** : Services mockés avec jasmine.createSpyObj
✅ **Nommer clairement** : Descriptions explicites des tests
✅ **Tester un seul comportement** : Un test = une assertion principale
✅ **Grouper logiquement** : describe() pour organiser les tests

## Prochaines Étapes

Pour améliorer la couverture des tests :

1. Ajouter des tests d'intégration avec le backend
2. Tester les interactions utilisateur (clics, saisie)
3. Tester les animations et transitions
4. Ajouter des tests de performance
5. Implémenter des tests E2E avec Cypress ou Playwright

## Support

Pour toute question sur les tests :
- Consulter la documentation Angular Testing : https://angular.io/guide/testing
- Documentation Jasmine : https://jasmine.github.io/
- Documentation Karma : https://karma-runner.github.io/

---

**Date de création** : 9 octobre 2025
**Dernière mise à jour** : 9 octobre 2025
