# Yummy Yam's

Bienvenue sur le projet Yummy Yam's, où un potentiel nouveau client peut gagner des pâtisseries en lançant des dés.

## Attention !

- Il faut patienter quelques secondes après que docker lance les 3 containers, avant de lancer le front.
- Lors de votre premier docker-compose up, il se peut que l'api n'arrive pas à se connecter à la DB. Il suffit de relancer la commande pour que tout soit en ordre.



## Prérequis

Assurez-vous d'avoir installé les éléments suivants sur votre machine :
- Docker
- Docker Compose

## Installation

Suivez ces étapes pour installer et exécuter le projet :

### 1. Ajouter les fichiers `.env`

Créez deux fichiers `.env`, un pour le backend (`api`) et un pour le frontend (`app`), et remplissez-les avec les valeurs appropriées.

#### .env pour `api` :

```
MONGO_URI=mongodb://mongo:27017/yummy-yams
JWT_SECRET=your_jwt_secret
```


#### .env pour `app` :

```
VITE_REACT_APP_API_URL=http://localhost:3001
```



### 2. Construire et démarrer le projet

Utilisez Docker Compose pour construire et démarrer les conteneurs :

```sh
docker-compose up --build
```

### 3. Accéder aux services
- Frontend : http://localhost:5173
- Backend : http://localhost:3001
- Base de données : mongodb://localhost:27017

## Utilisation
Une fois les conteneurs démarrés, vous pouvez accéder à l'application frontend via le navigateur à l'adresse http://localhost:5173. L'API backend est accessible à http://localhost:3001.

## Structure du Projet
Le projet est divisé en deux parties principales :

- API Backend : Situé dans le répertoire api, il gère la logique du jeu, la gestion des utilisateurs, et la connexion à la base de données MongoDB.
- App Frontend : Situé dans le répertoire app, il gère l'interface utilisateur de l'application avec React.

