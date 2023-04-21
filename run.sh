#!/bin/bash

# Récupérer le nom du conteneur
container_name="App-GTA-Manager"

# Récupérer l'ID du conteneur
container_id=$(docker ps -aqf "name=$container_name")

# Vérifier si le conteneur a été trouvé
if [ -n "$container_id" ]; then
    nb=$((RANDOM % 1000)) # Générer un nombre aléatoire entre 0 et 999
    container_name="$container_name$nb"
fi

docker run --name "$container_name" -it -w /app -v "$PWD:/app" node:16-alpine sh -c "yarn install && yarn run serve"