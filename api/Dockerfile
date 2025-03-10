# Escolha uma base Node (16, 18, etc). Vou usar 16-alpine
FROM node:20-alpine

# Cria diretório dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro
COPY package*.json ./

COPY prisma ./

# Instala as dependências
RUN npm install

# Copia todo o código para dentro do container
COPY . .

# Se estiver usando Prisma, você pode rodar:
# RUN npx prisma generate
# Caso precise de migrations na subida do container, 
# pode rodar 'npx prisma migrate deploy', etc.

# Compila o projeto NestJS
RUN npm run build

# Expõe a porta da aplicação
EXPOSE 3000

# Comando inicial
CMD ["node", "dist/main.js"]
