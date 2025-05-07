const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Función para leer la base de conocimiento
async function readKnowledgeBase() {
  try {
    const filePath = path.join(__dirname, '../data/knowledge_base.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer la base de conocimiento:', error);
    throw error;
  }
}

// Endpoint para obtener respuesta
app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'La pregunta es requerida' });
    }

    // Leer la base de conocimiento
    const knowledgeBase = await readKnowledgeBase();
    
    // Preparar el contexto para Groq
    const context = knowledgeBase.knowledge_base.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      links: item.links || []
    }));

    // Crear el prompt para Groq
    const prompt = `
    Eres un asistente virtual llamado Cheersy que responde preguntas sobre CheersChat y BRM.
    Usa la siguiente base de conocimiento para responder:

    ${JSON.stringify(context, null, 2)}

    Pregunta del usuario: ${question}

    Instrucciones:
    1. Responde de manera amigable y profesional
    2. Si la pregunta no está relacionada con CheersChat o BRM, indica que solo puedes responder sobre estos temas
    3. Si la pregunta es ofensiva o inapropiada, responde educadamente que no puedes responder a ese tipo de preguntas
    4. Incluye los enlaces relevantes en tu respuesta si están disponibles
    5. Mantén un tono positivo y servicial
    `;

    // Obtener respuesta de Groq
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';

    res.json({ response });
  } catch (error) {
    console.error('Error en el endpoint /api/chat:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
}); 