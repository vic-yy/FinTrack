# FinTrack

- Quando queremos aplicar a migration:

    docker exec -it extratos-api npx prisma migrate dev --name V000X__create_XXX


- Quando editamos o dockerfile/ docker-compose

    docker-compose down -v 

    docker-compose up --build

- Quando editamos alguma coisa no código:
    
    npm run build

    docker-compose restart api

    rodamos a API

    docker logs -f extratos-api

