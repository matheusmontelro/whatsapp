FROM ubuntu:18.04

WORKDIR /usr/src/app

# Copia todos os arquivos para o diretório de trabalho
COPY . .

# Atualiza os pacotes e instala dependências
RUN apt update && apt install curl -y

# Instala Node.js e Chromium
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt install -y nodejs
RUN apt install -y chromium-chromedriver

# Garante que o diretório de banco de dados exista
RUN mkdir -p /usr/src/app/database

# Instala as dependências do projeto
RUN npm install

# Comando para iniciar o aplicativo
CMD ["npm", "start"]
