# Usar uma versão mais recente do Ubuntu
FROM ubuntu:20.04

WORKDIR /usr/src/app

# Copia todos os arquivos para o diretório de trabalho
COPY . .

# Atualiza os pacotes e instala dependências essenciais
RUN apt update && apt install -y \
    curl \
    libc6 \
    build-essential \
    g++ \
    python3 \
    chromium-chromedriver \
    && apt upgrade -y

# Instala Node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt install -y nodejs

# Garante que o diretório de banco de dados exista
RUN mkdir -p /usr/src/app/database

# Instala as dependências do projeto
RUN npm install

# Remove pacotes desnecessários para reduzir o tamanho da imagem
RUN apt clean && rm -rf /var/lib/apt/lists/*

# Comando para iniciar o aplicativo
CMD ["npm", "start"]
