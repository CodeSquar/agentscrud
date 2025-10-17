# Panel de Agentes con Chat de Soporte en Vivo

Aplicación web full stack que permite gestionar configuraciones de agentes de IA con funcionalidad de chat de soporte en tiempo real mediante WebSockets.

## Descripción del Proyecto

Este proyecto implementa un sistema completo de gestión de agentes de IA con las siguientes funcionalidades:

### Funcionalidades Principales

1. **Panel de Control CRUD de Agentes**
   - Crear nuevos agentes con configuraciones personalizadas
   - Listar todos los agentes existentes con paginación
   - Editar configuraciones de agentes existentes
   - Eliminar agentes del sistema

2. **Chat de Soporte en Tiempo Real**
   - Comunicación bidireccional mediante WebSockets (Socket.IO)
   - Persistencia de mensajes en base de datos
   - Interfaz de chat separada para clientes y administradores
   - Sincronización en tiempo real entre múltiples ventanas/usuarios

## Stack Tecnológico

### Backend
- **Next.js 15** (App Router)
- **Node.js** con servidor HTTP personalizado
- **Socket.IO** para comunicación WebSocket
- **Prisma ORM** para gestión de base de datos
- **PostgreSQL** como base de datos relacional

### Frontend
- **Next.js 15**
- **TypeScript**
- **Tailwind CSS 4** para estilos
- **Shadcn** para componentes UI
- **Lucide React** para iconos

### Infraestructura
- **Docker & Docker Compose** para containerización

## Arquitectura de la API

El proyecto implementa dos estrategias complementarias para la interacción con datos:

### API Routes (`/api/*`)

Los endpoints REST tradicionales ubicados en `src/app/api/` fueron implementados como parte del requisito de la prueba técnica. Proporcionan una API RESTful estándar para operaciones CRUD:

- `GET /api/agents` - Listar agentes
- `POST /api/agents` - Crear agente
- `GET /api/agents/[id]` - Obtener agente específico
- `PUT /api/agents/[id]` - Actualizar agente
- `DELETE /api/agents/[id]` - Eliminar agente
- `GET /api/messages` - Obtener historial de mensajes

### Server Actions (`src/lib/actions/`)

Adicionalmente, se implementaron Server Actions nativos de Next.js para mutaciones de datos. Esta no es una redundancia, sino una práctica recomendada por el framework para:

- Ejecutar código del lado del servidor sin necesidad de crear endpoints explícitos
- Proporcionar una forma más limpia y directa de manejar mutaciones desde componentes de React
- Aprovechar la integración nativa de Next.js con validación y manejo de errores
- Mejorar la experiencia de desarrollo con type-safety completo

Ambas estrategias coexisten: las API Routes para consumo REST estándar y las Server Actions para integraciones más directas desde el frontend.

## Modelo de Datos

### Agent
```typescript
{
  id: string                  // UUID
  name: string                // Nombre del agente
  system_prompt: string       // Prompt del sistema
  llm_model: LLMModel         // Enum: GPT_5_NANO | CLAUDE_4_OPUS | GEMINI_2_5_PRO
  llm_model_formatted: string // Versión legible del modelo
  temperature: number         // Valor entre 0.0 y 1.0
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Message
```typescript
{
  id: string          // UUID
  sender_id: string   // Identificador del remitente
  receiver_id: string // Identificador del destinatario (opcional)
  content: string     // Contenido del mensaje
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Ejecución con Docker

### Prerrequisitos

- Docker Desktop instalado y en ejecución
- Docker Compose v2 o superior

### Instrucciones

1. Clone el repositorio:
```bash
git clone <repository-url>
cd crudagants
```

2. Construya y levante los servicios:
```bash
docker-compose up --build
```

Este comando:
- Construirá la imagen de la aplicación Next.js
- Levantará un contenedor PostgreSQL
- Ejecutará las migraciones de Prisma automáticamente
- Iniciará la aplicación en http://localhost:3000

3. Para detener los servicios:
```bash
docker-compose down
```

### Variables de Entorno

Las variables de entorno están preconfiguradas en `compose.yaml`:

```yaml
DATABASE_URL: postgresql://postgres:passwordtest@db:5432/crudagents
NODE_ENV: production
PORT: 3000
NEXT_PUBLIC_API_URL: http://localhost:3000
```

Para ambientes productivos, se recomienda usar un archivo `.env` con valores seguros.

## Desarrollo Local (sin Docker)

Si prefiere ejecutar el proyecto localmente sin Docker:

1. Instale las dependencias:
```bash
npm install
```

2. Configure la base de datos PostgreSQL local y actualice el `DATABASE_URL` en un archivo `.env`:
```
DATABASE_URL="postgresql://usuario:password@localhost:5432/crudagents"
```

3. Ejecute las migraciones:
```bash
npx prisma migrate deploy
```

4. Inicie el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

## Estructura del Proyecto

```
crudagants/
├── prisma/
│   ├── migrations/          # Migraciones de base de datos
│   └── schema.prisma        # Esquema de Prisma
├── src/
│   ├── app/
│   │   ├── admin/          # Panel de administración
│   │   │   ├── messages/   # Vista de mensajes admin
│   │   │   └── page.tsx    # Dashboard de agentes
│   │   ├── api/            # API Routes REST
│   │   │   ├── agents/     # Endpoints CRUD de agentes
│   │   │   └── messages/   # Endpoint de mensajes
│   │   ├── support/        # Vista de chat de soporte
│   │   └── page.tsx        # Página principal
│   ├── components/
│   │   ├── agents/         # Componentes de gestión de agentes
│   │   ├── messages/       # Componentes de chat
│   │   └── ui/             # Componentes UI reutilizables
│   └── lib/
│       ├── actions/        # Server Actions de Next.js
│       ├── db/             # Lógica de acceso a datos
│       ├── websocket/      # Configuración de Socket.IO
│       └── types/          # Definiciones TypeScript
├── server.ts               # Servidor HTTP personalizado con WebSocket
├── Dockerfile              # Configuración Docker multi-stage
└── compose.yaml            # Orquestación de servicios
```

## Funcionalidad de WebSocket

El chat de soporte utiliza Socket.IO para comunicación en tiempo real:

### Eventos del Cliente
- `join_room` - Unirse a una sala de chat
- `send_message` - Enviar un mensaje
- `disconnect` - Desconexión del cliente

### Eventos del Servidor
- `receive_message` - Recibir un nuevo mensaje
- `load_messages` - Cargar historial de mensajes

## Decisiones Técnicas Destacadas

### Servidor HTTP Personalizado
Se implementó un servidor HTTP personalizado (`server.ts`) en lugar del servidor Next.js por defecto para integrar Socket.IO de manera óptima con el ciclo de vida de la aplicación.