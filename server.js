// Importa as bibliotecas necessárias
const express = require('express');
const fetch = require('node-fetch'); // Precisaremos do fetch no ambiente Node.js
const app = express();
require('dotenv').config(); // Carrega as variáveis do arquivo .env

const PORT = process.env.PORT || 3000;

// Lógica da função da Vercel para uma rota no Express.

app.get('/api/get-jira-issues', async (req, res) => {
    const { filterId } = req.query; // Pega o filterId da URL

    if (!filterId) {
        return res.status(400).json({ error: 'Filter ID is required' });
    }

    // Suas variáveis de ambiente
    const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
    const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL;
    const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

    const apiUrl = `https://${JIRA_DOMAIN}/rest/api/3/search/jql`; // Corrigido para o endpoint correto de search

    // Codifica as credenciais
    const encodedCredentials = Buffer.from(
        `${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`
    ).toString('base64');

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jql: `filter=${filterId}`,
                // Os mesmos campos que você já pedia
                fields: ["summary", "status", "assignee", "priority", "issuetype"], 
                maxResults: 50
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            // Retorna o erro do Jira para o frontend
            return res.status(response.status).send(errorText);
        }

        const data = await response.json();
        return res.status(200).json(data); // Envia os dados para o frontend

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


// --- Servindo os arquivos do Frontend ---
// Esta linha faz com que o servidor sirva os arquivos estáticos (HTML, CSS, JS)
// que estão na raiz do projeto e nos subdiretórios.
app.use(express.static('.'));


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});