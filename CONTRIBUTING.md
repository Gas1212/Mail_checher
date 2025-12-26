# Guide de contribution - Email Checker

Merci de votre intérêt pour contribuer à Email Checker! Ce guide vous aidera à démarrer.

## Code de conduite

- Soyez respectueux et inclusif
- Accueillez les nouvelles idées
- Concentrez-vous sur ce qui est meilleur pour la communauté
- Faites preuve d'empathie envers les autres

## Comment contribuer

### Rapporter des bugs

1. Vérifier que le bug n'a pas déjà été rapporté dans les [issues](https://github.com/votre-repo/issues)
2. Créer une nouvelle issue avec:
   - Titre descriptif
   - Description détaillée du problème
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Captures d'écran si applicable
   - Environnement (OS, navigateur, versions)

### Proposer des fonctionnalités

1. Créer une issue avec le tag `enhancement`
2. Décrire clairement:
   - Le problème que cela résout
   - La solution proposée
   - Des alternatives considérées
   - Impact potentiel

### Contribuer du code

#### Prérequis
- Git installé
- Python 3.8+
- Node.js 18+
- Compte GitHub

#### Configuration de développement

1. **Fork le projet**
   ```bash
   # Cliquer sur "Fork" sur GitHub
   git clone https://github.com/votre-username/Mail-checker.git
   cd Mail-checker
   ```

2. **Configurer le backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # ou venv\Scripts\activate sur Windows
   pip install -r requirements.txt
   ```

3. **Configurer le frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Créer une branche**
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   # ou
   git checkout -b fix/correction-bug
   ```

#### Standards de code

##### Backend (Python/Django)
- Suivre [PEP 8](https://pep8.org/)
- Utiliser des docstrings pour les fonctions
- Maximum 80-100 caractères par ligne
- Noms de variables explicites en anglais

```python
# Bon
def validate_email_syntax(email: str) -> Tuple[bool, str]:
    """
    Validate email address syntax.

    Args:
        email: Email address to validate

    Returns:
        Tuple of (is_valid, message)
    """
    # Implementation
    pass

# Mauvais
def val(e):
    # pas de docstring
    pass
```

##### Frontend (TypeScript/React)
- Suivre les conventions TypeScript
- Utiliser des composants fonctionnels
- Props typées avec interfaces
- Noms de composants en PascalCase

```typescript
// Bon
interface EmailCheckerProps {
  onSubmit: (email: string) => void;
}

export default function EmailChecker({ onSubmit }: EmailCheckerProps) {
  // Implementation
}

// Mauvais
function checker(props) {
  // pas de types
}
```

#### Tests

##### Backend
```bash
cd backend
python manage.py test
```

Tous les tests doivent passer avant de soumettre une PR.

##### Frontend
```bash
cd frontend
npm test
```

**Couverture minimale**: 70%

#### Commit messages

Format:
```
type(scope): description courte

Description détaillée si nécessaire

Fixes #123
```

Types:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, pas de changement de code
- `refactor`: Refactoring
- `test`: Ajout de tests
- `chore`: Maintenance

Exemples:
```bash
feat(api): add bulk email validation endpoint

Add new endpoint to validate multiple emails at once.
Includes rate limiting and progress tracking.

Fixes #45

---

fix(validator): handle null MX records correctly

Previously crashed when MX records were None.
Now returns proper error message.

Fixes #67

---

docs(readme): update installation instructions

Add troubleshooting section for MongoDB connection.
```

#### Pull Requests

1. **Créer une PR**
   - Titre clair et descriptif
   - Description détaillée des changements
   - Référencer les issues liées
   - Screenshots pour les changements UI

2. **Checklist PR**
   - [ ] Tests ajoutés/mis à jour
   - [ ] Documentation mise à jour
   - [ ] Tous les tests passent
   - [ ] Code formaté correctement
   - [ ] Pas de console.log/print oubliés
   - [ ] Changelog mis à jour (si applicable)

3. **Review process**
   - Au moins 1 review requis
   - CI doit passer (quand configuré)
   - Résoudre les commentaires
   - Squash commits si demandé

## Structure des branches

- `main` - Production stable
- `develop` - Développement actif
- `feature/*` - Nouvelles fonctionnalités
- `fix/*` - Corrections de bugs
- `hotfix/*` - Corrections urgentes

## Documentation

### Documenter le code

**Backend:**
```python
class EmailValidator:
    """
    Comprehensive email validation class.

    Provides multiple validation methods including:
    - Syntax validation
    - DNS/MX record verification
    - SMTP validation
    - Disposable email detection

    Example:
        validator = EmailValidator()
        result = validator.validate_email_complete("test@example.com")
    """
```

**Frontend:**
```typescript
/**
 * Email validation result component
 *
 * Displays the results of an email validation including:
 * - Syntax validity
 * - DNS status
 * - SMTP verification
 * - Disposable email detection
 *
 * @param {EmailValidationResult} result - Validation result object
 */
```

### Mettre à jour la documentation

- README.md pour les changements majeurs
- API_EXAMPLES.md pour les nouveaux endpoints
- ROADMAP.md pour les nouvelles fonctionnalités planifiées

## Ressources

### Apprendre

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Outils utiles

- **Linting:**
  - Backend: `flake8`, `black`
  - Frontend: `eslint`, `prettier`

- **Testing:**
  - Backend: `pytest`
  - Frontend: `jest`, `testing-library`

- **Database:**
  - MongoDB Compass
  - Studio 3T

## Questions?

- Créer une issue avec le tag `question`
- Contacter les mainteneurs
- Consulter la documentation existante

## Reconnaissance

Les contributeurs seront:
- Listés dans CONTRIBUTORS.md
- Mentionnés dans les release notes
- Crédités dans la documentation

Merci de contribuer à Email Checker! 🎉
