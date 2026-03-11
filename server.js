const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.')); // Serve seus arquivos HTML, CSS e JS

// --- CONFIGURAÇÕES ---
const ROBLOX_API_KEY = "W0rswKGR00+Z7N6Pk/gOIVe5xlN8frsA6eupDtjo2YZQ46z/ZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SWxjd2NuTjNTMGRTTURBcldqZE9ObEJyTDJkUFNWWmxOWGhzVGpobWNuTkJObVYxY0VSMGFtOHlXVnBSTkRaNkx5SXNJbTkzYm1WeVNXUWlPaUkzTVRnMk5qWXpOeUlzSW1WNGNDSTZNVGMzTXpJMk9EWTVOU3dpYVdGMElqb3hOemN6TWpZMU1EazFMQ0p1WW1ZaU9qRTNOek15TmpVd09UVjkuT3dPemluQTctVXgzYWI5VVM4cFBnclhFOHpfd0tuaHMtY0pZVkZyN1h0M213Y3NSbGRmV3lFS1RiWDM3cGNtVFRhN1hTSHJpZjBGRzlpUThZTmFHamxsblVOb25DdmQwVDJMOXRodEltUVdQMTQ1VVBqM3Y3TlNtd1BfWktmcG1FTUFVbUl3MjZxU3ZqVmNDZGxuRk1CZ21SUXhMaUtvOU5fTlQ4UUVYejlTa1UwNGl0T1pyTWM5X1d2ZmZOMy1YcXhwdEFkOVJJQ2FmZnRtZEYya3NVa1VRRVppWjdrZ2dGVTV0NHpjbUU2RWtfS2hyTXV1TkFhQUQ5Q0VYTm5SMFRGQW1sUDNKNDZJOWpYQUNiSG1YeXpualNoLWJqcHFwUmNGTUluazFyMmRMOU51TFRGSDlkYjNwV25OMUdyaWh0akx3UC1DQW5mY2RsV1EwNkJ0cEh3"; 
const UNIVERSE_ID = "9838709987"; 
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1481407833214816356/UEepbiAzz4j80NRO6JP7uhB6iGuIIcZdbq_GiQ3-stx5lxmsloGeBVQKm1qq5gd5RBcA";

// --- ROTAS ---

// Rota para Banir
app.post('/banir', async (req, res) => {
    const { userId, reason } = req.body;
    console.log(`Tentando banir: ${userId} por ${reason}`);

    try {
        // 1. Envia para o Roblox
        await axios.post(
            `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/PainelAdmin_Ban`,
            { message: JSON.stringify({ UserId: userId, Reason: reason }) },
            { headers: { 'x-api-key': ROBLOX_API_KEY, 'Content-Type': 'application/json' } }
        );

        // 2. Envia Log para o Discord
        await axios.post(DISCORD_WEBHOOK, {
            embeds: [{
                title: "🚫 BANIMENTO EXECUTADO",
                color: 15548997,
                fields: [
                    { name: "ID do Usuário", value: userId, inline: true },
                    { name: "Motivo", value: reason, inline: true }
                ],
                timestamp: new Date()
            }]
        });

        res.status(200).send("Sucesso");
    } catch (error) {
        console.error("Erro no Ban:", error.response ? error.response.data : error.message);
        res.status(500).send("Erro ao processar banimento");
    }
});

// Rota para Anúncio Global
app.post('/anunciar', async (req, res) => {
    const { message } = req.body;

    try {
        await axios.post(
            `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/PainelAdmin_Anuncio`,
            { message: message },
            { headers: { 'x-api-key': ROBLOX_API_KEY, 'Content-Type': 'application/json' } }
        );
        res.status(200).send("Sucesso");
    } catch (error) {
        res.status(500).send("Erro ao anunciar");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
    ✅ Servidor do Catch a Brasilrot Ativo!
    🌐 Acesse em: http://localhost:${PORT}
    `);
});
