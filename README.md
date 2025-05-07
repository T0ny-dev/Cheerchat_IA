# API de Asistente Virtual CheersChat IA

API que utiliza Groq para generar respuestas concisas basadas en una base de conocimiento local sobre CheersChat y BRM.

## 🚀 Características

- Base de conocimiento local en JSON
- Uso de Groq para generar respuestas inteligentes y concisas
- API RESTful con endpoints documentados
- CORS configurado para desarrollo local y producción
- Interfaz web amigable con documentación integrada

## 🛠️ Tecnologías

- Node.js
- Express
- Groq API
- Swagger UI (documentación)

## 📋 Requisitos

- Node.js (v14 o superior)
- API Key de Groq

## 🔧 Configuración

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd emeia-chatbot
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` con las siguientes variables:
```env
GROQ_API_KEY=tu_api_key_de_groq
PORT=3000
```

## 📝 Endpoints

### GET /
Interfaz web principal con documentación visual.

### GET /api/v1/health
Verifica el estado del servidor.

### GET /api/v1/docs
Documentación completa de la API (Swagger UI).

### POST /api/v1/query
Endpoint principal para hacer preguntas.

**Body:**
```json
{
    "pregunta": "¿Qué es CheersChat?"
}
```

**Respuesta:**
```json
{
    "respuesta": "CheersChat es una app que te permite conocer personas en bares y restaurantes usando el WiFi del lugar. Disponible en App Store y Google Play."
}
```

## 🔒 Seguridad

- Las variables de entorno están protegidas
- CORS configurado para dominios específicos
- Validación de entrada en todas las peticiones

## 📄 Licencia

ISC 