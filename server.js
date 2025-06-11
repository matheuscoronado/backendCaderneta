const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/pergunta', async (req, res) => {
    const userInput = req.body.pergunta;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Você é um assistente de saúde." },
                    { role: "user", content: userInput }
                ],
                max_tokens: 200,
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        const respostaTexto = response.data.choices[0].message.content.trim();
        res.json({ resposta: respostaTexto });
    } catch (error) {
        console.error("Erro na API da OpenAI:", error.response?.data || error.message);
        res.status(500).json({ error: "Erro ao buscar resposta da IA" });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});