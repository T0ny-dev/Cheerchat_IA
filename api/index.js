require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cors = require('cors');
const express = require('express');

const app = express();

// 🧾 Logs de inicio
console.log('Iniciando servidor...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Presente' : 'No encontrada');

// 🌐 Configuración de CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://emefest.vercel.app'],
  methods: ['POST', 'OPTIONS', 'GET'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 📦 Conexión a Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// 🧠 Middleware para leer JSON
app.use(express.json());

/* ---------- RUTAS ---------- */

// ✅ Ruta de verificación del servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// 📄 Ruta informativa
app.get('/api', (req, res) => {
  res.json({
    status: 'info',
    message: 'Esta API solo acepta peticiones POST',
    endpoint: '/api',
    method: 'POST',
    body: {
      pregunta: 'string (requerido)'
    },
    ejemplo: {
      pregunta: "¿Qué información tienes sobre los stands?"
    }
  });
});

// 🤖 Ruta principal que consulta Supabase y responde con Groq
app.post('/api', async (req, res) => {
  const { pregunta } = req.body;
  console.log('POST /api - Pregunta recibida:', pregunta);

  if (!pregunta) {
    return res.status(400).json({ error: 'La pregunta es requerida' });
  }

  try {
    // 🔍 Consultar Supabase para obtener contexto
    const { data: stands, error } = await supabase
      .from('stands')
      .select('ai_stands');

    if (error) {
      console.error('Error consultando Supabase:', error);
      return res.status(500).json({ error: 'Error al consultar Supabase' });
    }

    const contexto = stands.map(stand => stand.ai_stands).join('\n');

    // 🧠 Construcción del mensaje para Groq
    const messages = [
      {
        role: "system",
        content: "Eres un asistente especializado en proporcionar información sobre stands y eventos. Basa tus respuestas en el contexto proporcionado."
      },
      {
        role: "user",
        content: `Contexto:\n${contexto}\n\nPregunta:\n${pregunta}`
      }
    ];

    // 📡 Llamada a Groq
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile', // Reemplaza con el modelo seleccionado
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        stream: false
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const respuesta = response.data.choices[0].message.content.trim();
    console.log('Respuesta generada correctamente');

    res.status(200).json({ respuesta });

  } catch (err) {
    console.error('Error general:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: err.response?.data || err.message
    });
  }
});

// ❌ Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: 'La ruta solicitada no existe',
    path: req.path
  });
});

// 🛑 Manejador de errores globales
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: err.message
  });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`- GET  /api/health`);
  console.log(`- GET  /api`);
  console.log(`- POST /api`);
});
