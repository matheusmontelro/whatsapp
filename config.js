//'use strict';
const dotenv = require('dotenv');
const assert = require('assert');
const { Sequelize } = require('sequelize');

// Carrega o arquivo .env
dotenv.config();

// Importa a configuração do banco de dados a partir do config.json
const database_config = require('./config/config.json');

// Determina se o ambiente é de produção
const is_production = process.env.PRODUCTION === 'true';

// Se for produção, desabilita o logging do Sequelize
if (is_production) {
    database_config.development.logging = false;
}

// Define o ambiente atual (padrão é 'development')
const env = process.env.NODE_ENV || 'development';
let sequelize = new Sequelize(database_config[env]);

// Testa a conexão com o banco de dados
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Carrega variáveis de ambiente
const {
    PORT,
    HOST,
    HOST_SSL,
    TOKEN,
    HTTPS,
    VERSION,
    COMPANY,
    LOGO,
    START_ALL_SESSIONS,
    FORCE_CONNECTION_USE_HERE,
    CORS_ORIGIN,
    TIME_TYPING
} = process.env;

// Verifica se as variáveis de ambiente obrigatórias estão definidas
assert(PORT, 'PORT is required, please set the PORT variable value in the .env file');
assert(TOKEN, 'TOKEN is required, please set the ENGINE variable value in the .env file');
assert(CORS_ORIGIN, 'CORS_ORIGIN is required, please set the CORS_ORIGIN variable value in the .env file');

// Exporta a configuração da aplicação
module.exports = {
    port: PORT,
    host: HOST || 'http://localhost', // Usa a variável HOST ou um valor padrão
    host_ssl: HOST_SSL ? HOST_SSL : `${HOST}:${PORT}`, // Define o host com SSL ou sem SSL
    token: TOKEN,
    https: HTTPS,
    version: VERSION,
    company: COMPANY || 'myzap', // Define um valor padrão para COMPANY
    logo: LOGO ? LOGO : 'https://upload.wikimedia.org/wikipedia/commons/f/f7/WhatsApp_logo.svg', // Define um valor padrão para LOGO
    ssl_key_path: "", // Você pode adicionar caminhos para SSL se necessário
    ssl_cert_path: "",
    start_all_sessions: START_ALL_SESSIONS,
    useHere: FORCE_CONNECTION_USE_HERE,
    device_name: "", // Pode ser configurado se necessário
    cors_origin: CORS_ORIGIN,
    time_typing: TIME_TYPING,
    sequelize // Instância do Sequelize
};
