const axios = require('axios');
const config = require('./config');
const logger = require('./util/logger');

const { exec } = require('child_process');
const chalk = require('chalk');

const DeviceModel = require('./Models/device');
const Device = DeviceModel(config.sequelize);

async function startAllSessions() {
    const host = config?.host ? `${config?.host}:${config?.port}` : config?.host_ssl;
    const sessions = await Device.findAll();

    if (sessions != null) {
        // Atualizar todos os dispositivos sem where
        await Device.update({
            qrCode: '',
            attempts: 0,
            urlCode: '',
            attempts_start: 0,
            last_start: 'NULL',
            state: 'DISCONNECTED',
            status: 'notLogged',
            updated_at: new Date()
        }, { where: {} });

        logger.info(`Iniciando ${sessions.length} sessões...`);

        async function startSession(object) {
            const sessionData = {
                ...object.dataValues,
                apitoken: config.token,
            };

            try {
                await axios.post(`${host}/start`, {
                    session: sessionData.session,
                    wh_connect: sessionData.wh_connect,
                    wh_qrcode: sessionData.wh_qrcode,
                    wh_status: sessionData.wh_status,
                    wh_message: sessionData.wh_message,
                    AutoRejectCall: sessionData.AutoRejectCall,
                    AnswerMissedCall: sessionData.AnswerMissedCall
                }, {
                    headers: {
                        apitoken: sessionData.apitoken,
                        sessionkey: sessionData.sessionkey
                    }
                });

                console.log(chalk.green(`[SESSION] ${chalk.bold.green(sessionData.session)} - ${chalk.bold.green(`Iniciada com sucesso!`)}`));

            } catch (error) {
                console.log(chalk.red(`[ERROR] Falha ao iniciar a sessão ${sessionData.session}: ${error.message}`));
            }
        }

        // Iniciar sessões sequencialmente com um intervalo de 15 segundos
        for (let i = 0; i < sessions.length; i++) {
            sessionData = sessions[i];
            await startSession(sessionData);

            if (i < sessions.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 15000)); // 15 segundos
            }
        }
    } else {
        // Limpar pasta instances
        exec('rm -rf ./instances/*', (err) => {
            if (err) {
                console.error("Erro ao apagar a pasta instances:", err);
            }
        });
    }
}

module.exports.startAllSessions = startAllSessions;
