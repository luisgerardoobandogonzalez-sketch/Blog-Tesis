# Análisis Completo del Proyecto Blog Universitario UMG

## 1. Resumen del Proyecto
Este proyecto es una plataforma de blogging moderna y progresiva (PWA) diseñada para estudiantes universitarios de la UMG. Permite la creación, publicación y moderación de contenido académico y social, fomentando la interacción a través de comentarios, likes, chats privados y un sistema de gamificación.

## 2. Stack Tecnológico Actual
- **Frontend Framework:** Angular 21 (Standalone Components)
- **UI Framework:** Ionic 8.4
- **Lenguaje:** TypeScript 5.9
- **Estilos:** SCSS con soporte para Modo Oscuro (CSS Variables)
- **Editor de Texto:** Quill Editor (ngx-quill)
- **Gráficos:** Chart.js + ng2-charts
- **PDF:** jsPDF + html2canvas
- **Iconos:** Ionicons + Material Icons
- **Persistencia de Datos:** `localStorage` (Simulación de Backend)

## 3. Funcionalidades Implementadas

### Fase 1: Autenticación y Gestión de Usuarios
- **Registro e Inicio de Sesión:** Validación de formularios y manejo de tokens simulados.
- **Roles de Usuario:** Estudiante y Administrador (con permisos diferenciados).
- **Gestión de Perfil:** Edición de avatar, biografía, carrera y redes sociales.

### Fase 2: Core del Blog
- **CRUD de Blogs:** Crear, Leer, Actualizar y Eliminar publicaciones.
- **Editor Rico (WYSIWYG):** Formato de texto, listas, enlaces e imágenes.
- **Sistema de Tags:** Categorización y filtrado de contenido.
- **Favoritos:** Guardar publicaciones para lectura posterior.
- **Búsqueda:** Buscador en tiempo real por título o contenido.

### Fase 3: Socialización y Gamificación
- **Comentarios Avanzados:** Hilos de conversación con respuestas anidadas.
- **Interacciones:** Likes en blogs y comentarios.
- **Seguidores:** Sistema de Follow/Unfollow entre usuarios.
- **Gamificación:**
    - Puntos de Experiencia (XP) por acciones (publicar, comentar, recibir likes).
    - Niveles de usuario (Novato, Intermedio, Experto, etc.).
    - Insignias (Badges) desbloqueables.
    - Leaderboard (Ranking global de usuarios).
- **Notificaciones:** Centro de notificaciones para interacciones relevantes.

### Fase 4: Funcionalidades Avanzadas
- **Chat Privado:** Mensajería en tiempo real (simulada) entre usuarios.
- **Panel de Administración:**
    - Moderación de blogs (Aprobar/Rechazar).
    - Gestión de usuarios.
    - Dashboard de analíticas con gráficos.
- **Exportación:** Generación de PDF de los blogs.
- **Exportación de Datos:** Descarga de datos del usuario en JSON.
- **Personalización:** Selector de Tema Claro/Oscuro.
- **PWA:** Configuración básica para instalación en dispositivos móviles.

---

## 4. Guía de Integración Backend

Actualmente, el proyecto utiliza `localStorage` para simular una base de datos. Para llevarlo a producción, se recomienda integrar un backend real. A continuación, se detalla la arquitectura sugerida y los pasos para la migración.

### Arquitectura Recomendada
- **Backend:** Node.js con NestJS (Framework robusto y escalable para TypeScript).
- **Base de Datos:** MongoDB (Base de datos NoSQL ideal para estructuras flexibles como blogs y comentarios).
- **ORM:** Mongoose.
- **Autenticación:** JWT (JSON Web Tokens).
- **Almacenamiento de Archivos:** AWS S3 o Cloudinary (para imágenes de perfil y blogs).
- **WebSockets:** Socket.io (para chat y notificaciones en tiempo real).

### Pasos para la Migración

#### 1. Configuración del Servidor (NestJS)
Crear un nuevo proyecto NestJS y configurar la conexión a MongoDB.

```bash
npm i -g @nestjs/cli
nest new backend-blog-umg
npm install @nestjs/mongoose mongoose
```

#### 2. Definición de Esquemas (Mongoose)
Replicar los modelos de TypeScript del frontend (`src/app/shared/models/`) en esquemas de Mongoose en el backend.

**Ejemplo: User Schema**
```typescript
@Schema()
export class User {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) passwordHash: string;
  @Prop({ default: 'student' }) role: string;
  // ... otros campos
}
export const UserSchema = SchemaFactory.createForClass(User);
```

#### 3. Desarrollo de API RESTful
Crear controladores y servicios para cada entidad:
- `AuthModule`: Endpoints `/auth/login`, `/auth/register`.
- `UsersModule`: Endpoints `/users/:id`, `/users/profile`.
- `BlogsModule`: Endpoints `/blogs`, `/blogs/:id` (CRUD).
- `CommentsModule`: Endpoints para gestionar comentarios.
- `GamificationModule`: Lógica de XP y niveles en el servidor.

#### 4. Autenticación JWT
Implementar Guards en NestJS para proteger rutas privadas. El frontend deberá enviar el token en el header `Authorization: Bearer <token>`.

#### 5. Adaptación del Frontend (Angular)
Sustituir la lógica de `localStorage` en los servicios de Angular (`src/app/shared/services/`) por llamadas HTTP reales usando `HttpClient`.

**Ejemplo: BlogService**
*Antes (LocalStorage):*
```typescript
getBlogs() {
  const blogs = JSON.parse(localStorage.getItem('blogs'));
  return of(blogs);
}
```

*Después (HTTP):*
```typescript
constructor(private http: HttpClient) {}

getBlogs(): Observable<Blog[]> {
  return this.http.get<Blog[]>(`${this.apiUrl}/blogs`);
}
```

#### 6. WebSockets para Chat
Reemplazar el `BehaviorSubject` simulado en `ChatService` por una conexión real con `Socket.io-client`.

```typescript
// Frontend
this.socket = io('http://localhost:3000');
this.socket.on('message', (msg) => {
  this.messages.push(msg);
});
```

### Consideraciones Finales
- **Seguridad:** Validar todos los datos en el backend, no confiar solo en el frontend.
- **Variables de Entorno:** Usar archivos `.env` para guardar credenciales de base de datos y claves secretas.
- **Deploy:** El frontend se puede desplegar en Vercel/Netlify y el backend en Render/Railway/AWS.
