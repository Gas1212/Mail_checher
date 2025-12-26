# Exemples d'utilisation de l'API

## Base URL
```
http://localhost:8000/api
```

## 1. Vérifier un email

### Requête
```bash
curl -X POST http://localhost:8000/api/emails/check/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "check_smtp": true
  }'
```

### Réponse
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "test@gmail.com",
  "is_valid_syntax": true,
  "is_valid_dns": true,
  "is_valid_smtp": true,
  "is_disposable": false,
  "mx_records": [
    "gmail-smtp-in.l.google.com.",
    "alt1.gmail-smtp-in.l.google.com."
  ],
  "validation_message": "Email is valid and verified",
  "created_at": "2025-12-26T10:30:00Z",
  "ip_address": "127.0.0.1",
  "details": {
    "syntax": "Valid email syntax: test@gmail.com",
    "dns": "Found 5 MX record(s)",
    "smtp": "Email address exists",
    "disposable": "Not a known disposable email"
  }
}
```

## 2. Vérifier sans SMTP (plus rapide)

### Requête
```bash
curl -X POST http://localhost:8000/api/emails/check/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "check_smtp": false
  }'
```

## 3. Obtenir l'historique des validations

### Requête
```bash
curl http://localhost:8000/api/emails/history/?limit=10
```

### Réponse
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "email": "test@gmail.com",
    "is_valid_syntax": true,
    "is_valid_dns": true,
    "is_valid_smtp": true,
    "is_disposable": false,
    "mx_records": ["gmail-smtp-in.l.google.com."],
    "validation_message": "Email is valid and verified",
    "created_at": "2025-12-26T10:30:00Z",
    "ip_address": "127.0.0.1"
  },
  ...
]
```

## 4. Obtenir les statistiques

### Requête
```bash
curl http://localhost:8000/api/emails/stats/
```

### Réponse
```json
{
  "total_validations": 150,
  "valid_emails": 120,
  "disposable_emails": 15,
  "valid_percentage": 80.0
}
```

## 5. Lister les domaines jetables

### Requête
```bash
curl http://localhost:8000/api/disposable-domains/
```

### Réponse
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "domain": "tempmail.com",
    "added_at": "2025-12-26T09:00:00Z",
    "is_active": true
  },
  ...
]
```

## 6. Ajouter un domaine jetable

### Requête
```bash
curl -X POST http://localhost:8000/api/disposable-domains/ \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "fakeemail.com",
    "is_active": true
  }'
```

## 7. Ajouter plusieurs domaines jetables

### Requête
```bash
curl -X POST http://localhost:8000/api/disposable-domains/bulk-add/ \
  -H "Content-Type: application/json" \
  -d '{
    "domains": [
      "tempmail.org",
      "throwaway.email",
      "fakeinbox.com"
    ]
  }'
```

### Réponse
```json
{
  "added": 3,
  "skipped": 0
}
```

## Exemples en JavaScript (Frontend)

### Vérifier un email
```javascript
const checkEmail = async (email) => {
  const response = await fetch('http://localhost:8000/api/emails/check/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      check_smtp: true
    })
  });

  const data = await response.json();
  return data;
};

// Utilisation
const result = await checkEmail('test@example.com');
console.log(result);
```

### Obtenir les statistiques
```javascript
const getStats = async () => {
  const response = await fetch('http://localhost:8000/api/emails/stats/');
  const data = await response.json();
  return data;
};

// Utilisation
const stats = await getStats();
console.log(stats);
```

## Exemples en Python

### Vérifier un email
```python
import requests

def check_email(email, check_smtp=True):
    url = 'http://localhost:8000/api/emails/check/'
    data = {
        'email': email,
        'check_smtp': check_smtp
    }
    response = requests.post(url, json=data)
    return response.json()

# Utilisation
result = check_email('test@example.com')
print(result)
```

### Obtenir l'historique
```python
import requests

def get_history(limit=10):
    url = f'http://localhost:8000/api/emails/history/?limit={limit}'
    response = requests.get(url)
    return response.json()

# Utilisation
history = get_history(limit=20)
for item in history:
    print(f"{item['email']}: {item['validation_message']}")
```

## Codes d'état HTTP

- `200 OK` - Requête réussie
- `201 Created` - Ressource créée avec succès
- `400 Bad Request` - Données invalides
- `404 Not Found` - Ressource non trouvée
- `500 Internal Server Error` - Erreur serveur

## Gestion des erreurs

### Exemple d'erreur
```json
{
  "error": "Invalid request",
  "details": {
    "email": ["This field is required."]
  }
}
```
