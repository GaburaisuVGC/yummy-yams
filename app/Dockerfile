# Utilisation de l'image officielle Node.js
FROM node:latest AS builder

# Définition du répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copie des dépendances du package.json et du package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install
RUN npm i -g vite @vitejs/plugin-react react react-dom lucide-react axios jose react-responsive-carousel dotenv gsap
RUN ln -s /usr/local/lib/node_modules/ ../node_modules

# Copie de tout le contenu de l'application React dans le conteneur
COPY . .

# Exposition du port sur lequel l'application frontend fonctionnera
EXPOSE 3000

# Commande par défaut pour lancer l'application frontend
CMD ["npm", "run", "dev"]
