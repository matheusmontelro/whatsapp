FROM ubuntu:18.04

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Atualizar pacotes e instalar dependências essenciais
RUN apt update && apt install -y \
  curl \
  chromium-chromedriver

# Instalar Node.js 14.x
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
  apt install -y nodejs

# Copiar arquivos de dependências e instalar pacotes Node.js
COPY package*.json ./
RUN npm install

# Copiar o restante dos arquivos da aplicação
COPY . .

# Expor a porta que a aplicação vai usar (opcional, mas recomendado)
EXPOSE 3333

# Comando de inicialização
CMD PORT=$PORT node index.js
