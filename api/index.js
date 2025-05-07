require('dotenv').config();
const axios = require('axios');
const cors = require('cors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// 🧾 Logs de inicio
console.log('Iniciando servidor...');
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Presente' : 'No encontrada');

// 🌐 Configuración de CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://www.cheerschat.com/', 'https://cheers-b-r-m-mnzz6e.flutterflow.app/'],
  methods: ['POST', 'OPTIONS', 'GET'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 📁 Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '..', 'public')));

// 📚 Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CheersChat IA API',
      version: '1.0.0',
      description: 'API para consultar la base de conocimiento de CheerChat IA',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./api/index.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🎨 Interfaz principal
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CheersChat IA</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .container {
                max-width: 800px;
                background: white;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                margin-top: 2rem;
            }
            .logo-container {
                text-align: center;
                margin-bottom: .5rem;
            }
            .logo {
                width: 90px;
                height: auto;
            }
            h1 {
                color: #2c3e50;
                text-align: center;
                margin-top: .5rem;
                margin-bottom: .5rem;
            }
            .endpoints {
                background: #f8f9fa;
                padding: 1.5rem;
                border-radius: 8px;
                margin-top: 1rem;
            }
            .endpoint {
                margin-bottom: 1rem;
                padding: 1rem;
                background: white;
                border-radius: 6px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            .method {
                display: inline-block;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-weight: bold;
                margin-right: 0.5rem;
            }
            .get { background: #e3f2fd; color: #1976d2; }
            .post { background: #e8f5e9; color: #2e7d32; }
            .path {
                font-family: monospace;
                color: #666;
            }
            .description {
                margin-top: 0.5rem;
                color: #666;
            }
            .docs-link {
                display: inline-block;
                margin-top: 1rem;
                padding: 0.5rem 1rem;
                background: #2196f3;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                transition: background 0.3s;
            }
            .docs-link:hover {
                background: #1976d2;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo-container">
                <img src="/logo.gif" alt="CheersChat IA" class="logo">
            </div>
            <h1>CheersChat IA</h1>
            <div class="endpoints">
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="path">/api/v1/health</span>
                    <div class="description">Verificar el estado del servidor</div>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="path">/api/v1/docs</span>
                    <div class="description">Documentación completa de la API (Swagger)</div>
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="path">/api/v1/query</span>
                    <div class="description">Consultar la base de conocimiento</div>
                </div>
            </div>
            <a href="/api/v1/docs" class="docs-link">Ver documentación completa</a>
        </div>
    </body>
    </html>
  `;
  res.send(html);
});

// 📚 Cargar datos de la base de conocimiento
const loadKnowledgeBase = () => {
  const dataPath = path.join(__dirname, '..', 'data', 'knowledge_base.json');
  try {
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error al cargar la base de conocimiento:', error);
    return { knowledge_base: [] };
  }
};

// 🧠 Middleware para leer JSON
app.use(express.json());

/* ---------- RUTAS ---------- */

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Verificar el estado del servidor
 *     description: Retorna el estado actual del servidor y un timestamp
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Servidor funcionando correctamente
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// 📄 Ruta informativa y documentación
app.get('/api/v1/docs', (req, res) => {
  res.json({
    status: 'info',
    message: 'Documentación de la API',
    version: '1.0.0',
    endpoints: {
      health: {
        method: 'GET',
        path: '/api/v1/health',
        description: 'Verificar estado del servidor'
      },
      query: {
        method: 'POST',
        path: '/api/v1/query',
        description: 'Consultar la base de conocimiento',
        body: {
          pregunta: 'string (requerido)',
          id: 'string (requerido)'
        },
        ejemplo: {
          pregunta: "¿Qué información tienes sobre este tema?",
          id: "ejemplo-tema"
        }
      }
    }
  });
});

/**
 * @swagger
 * /api/v1/query:
 *   post:
 *     summary: Consultar la base de conocimiento
 *     description: Realiza una consulta a la base de conocimiento usando Groq AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pregunta
 *             properties:
 *               pregunta:
 *                 type: string
 *                 description: La pregunta a realizar
 *                 example: ¿Qué información tienes sobre BRM?
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 respuesta:
 *                   type: string
 *       400:
 *         description: Pregunta requerida
 *       500:
 *         description: Error interno del servidor
 */
app.post('/api/v1/query', async (req, res) => {
  const { pregunta } = req.body;
  console.log('POST /api/v1/query - Pregunta recibida:', pregunta);

  if (!pregunta) {
    return res.status(400).json({ 
      error: 'La pregunta es requerida'
    });
  }

  try {
    // 🔍 Cargar toda la base de conocimiento
    const knowledgeBase = loadKnowledgeBase();
    
    // Construir el contexto con toda la información
    const contexto = knowledgeBase.knowledge_base.map(topic => `
${topic.title}:
${topic.content}
${topic.links ? `\nEnlaces útiles:\n${topic.links.map(link => `- ${link.title}: ${link.url}`).join('\n')}` : ''}
---`).join('\n');

    // 🧠 Construcción del mensaje para Groq
    const messages = [
      {
        role: "system",
        content: "Eres un asistente virtual de BRM llamado CheerChat IA. Responde de forma EXTREMADAMENTE concisa y directa, máximo 2-3 líneas. No uses emojis ni saludos largos. Ve al grano inmediatamente."
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
        model: 'llama-3.3-70b-versatile',
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
    path: req.path,
    available_routes: [
      '/api/v1/health',
      '/api/v1/docs',
      '/api/v1/query'
    ]
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
  console.log(`- GET  /api/v1/health`);
  console.log(`- GET  /api/v1/docs`);
  console.log(`- POST /api/v1/query`);
});
