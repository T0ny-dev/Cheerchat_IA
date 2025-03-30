# API de Asistente Virtual con Groq y Supabase

API que utiliza Groq para generar respuestas basadas en el contexto de stands almacenados en Supabase.

## 🚀 Características

- Integración con Supabase para obtener contexto
- Uso de Groq para generar respuestas inteligentes
- API RESTful con endpoints documentados
- CORS configurado para desarrollo local y producción

## 🛠️ Tecnologías

- Node.js
- Express
- Supabase
- Groq API
- Vercel (despliegue)

## 📋 Requisitos

- Node.js (v14 o superior)
- Cuenta en Supabase
- API Key de Groq
- Cuenta en Vercel (para despliegue)

## 🔧 Configuración

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd chatgpt-vercel-backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` con las siguientes variables:
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_anon_key_de_supabase
GROQ_API_KEY=tu_api_key_de_groq
```

## 🚀 Despliegue en Vercel

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Vercel desplegará automáticamente tu API

## 📝 Endpoints

### GET /api/health
Verifica el estado del servidor.

### GET /api
Proporciona información sobre cómo usar la API.

### POST /api
Endpoint principal para hacer preguntas.

**Body:**
```json
{
    "pregunta": "¿Qué información tienes sobre los stands?"
}
```

## 🔒 Seguridad

- Las variables de entorno están protegidas
- CORS configurado para dominios específicos
- Validación de entrada en todas las peticiones

## 📄 Licencia

ISC 