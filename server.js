const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('.')); // Serve seu HTML/CSS/JS

// CONFIGURAÇÕES (Troque pelos seus dados)
const ROBLOX_API_KEY = "W0rswKGR00+Z7N6Pk/gOIVe5xlN8frsA6eupDtjo2YZQ46z/ZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SWxjd2NuTjNTMGRTTURBcldqZE9ObEJyTDJkUFNWWmxOWGhzVGpobWNuTkJObVYxY0VSMGFtOHlXVnBSTkRaNkx5SXNJbTkzYm1WeVNXUWlPaUkzTVRnMk5qWXpOeUlzSW1WNGNDSTZNVGMzTXpJMk9EWTVOU3dpYVdGMElqb3hOemN6TWpZMU1EazFMQ0p1WW1ZaU9qRTNOek15TmpVd09UVjkuT3dPemluQTctVXgzYWI5VVM4cFBnclhFOHpfd0tuaHMtY0pZVkZyN1h0M213Y3NSbGRmV3lFS1RiWDM3cGNtVFRhN1hTSHJpZjBGRzlpUThZTmFHamxsblVOb25DdmQwVDJMOXRodEltUVdQMTQ1VVBqM3Y3TlNtd1BfWktmcG1FTUFVbUl3MjZxU3ZqVmNDZGxuRk1CZ21SUXhMaUtvOU5fTlQ4UUVYejlTa1UwNGl0T1pyTWM5X1d2ZmZOMy1YcXhwdEFkOVJJQ2FmZnRtZEYya3NVa1VRRVppWjdrZ2dGVTV0NHpjbUU2RWtfS2hyTXV1TkFhQUQ5Q0VYTm5SMFRGQW1sUDNKNDZJOWpYQUNiSG1YeXpualNoLWJqcHFwUmNGTUluazFyMmRMOU51TFRGSDlkYjNwV25OMUdyaWh0akx3UC1DQW5mY2RsV1EwNkJ0cEh3"; 
const UNIVERSE_ID = "9838709987"; // O ID do Universo (não o ID do Place)
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1481407833214816356/UEepbiAzz4j80NRO6JP7uhB6iGuIIcZdbq_GiQ3-stx5lxmsloGeBVQKm1qq5gd5RBcA";

// Rota para Banir
app.post('/banir', async (req, res) => {
    const { userId, reason } = req.body;

    try {
        // 1. Envia para o Roblox (MessagingService)
        await axios.post(
            `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/PainelAdmin_Ban`,
            { message: JSON.stringify({ UserId: userId, Reason: reason }) },
            { headers: { 'x-api-key': ROBLOX_API_KEY, 'Content-Type': 'application/json' } }
        );

        // 2. Envia para o Discord
        await axios.post(DISCORD_WEBHOOK, {
            embeds: [{
                title: "🚫 BANIMENTO APLICADO",
                description: `O administrador baniu um usuário via painel.`,
                color: 15548997,
                fields: [
                    { name: "ID do Alvo", value: userId, inline: true },
                    { name: "Motivo", value: reason, inline: true }
                ]
            }]
        });

        res.status(200).send("Comando enviado com sucesso!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao processar comando.");
    }
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
