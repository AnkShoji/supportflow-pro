# SupportFlow Pro

Sistema profesional de gestión de tickets de soporte técnico, construido con React, TypeScript y Firebase.

## Características
- **Autenticación**: Inicio de sesión seguro con Google.
- **Tiempo Real**: Los tickets se actualizan instantáneamente en todos los dispositivos.
- **Roles de Usuario**:
  - **Usuarios**: Pueden crear tickets y ver el estado de las solicitudes.
  - **Administradores**: Tienen permisos exclusivos para marcar tickets como resueltos o eliminarlos.
- **Diseño Premium**: Interfaz moderna con Tailwind CSS, shadcn/ui y animaciones fluidas con Framer Motion.

---

## Capturas de Pantalla

Aquí puedes ver cómo luce el sistema en acción:

### 1. Inicio de Sesión
<img width="1452" height="922" alt="Captura de pantalla 2026-04-15 105300" src="https://github.com/user-attachments/assets/85f4ba58-31df-4ac8-8819-1e2799ea2579" />

### 2. Creación de Tickets
<img width="1794" height="991" alt="Captura de pantalla 2026-04-15 102550" src="https://github.com/user-attachments/assets/acf18dee-9bc2-47fd-afa0-5e4aab8b26be" />

### 3. Panel de Administración
<img width="1766" height="782" alt="Captura de pantalla 2026-04-15 102613" src="https://github.com/user-attachments/assets/80db4068-9287-45e0-9d23-9da7fd44567c" />


---

## 🛠️ Guía de Instalación 

Si has descargado o clonado este proyecto, sigue estos pasos para ponerlo en marcha:

### 1. Configuración de Firebase
Este proyecto requiere una base de datos Firebase. Debes crear la tuya propia:
1. Ve a [Firebase Console](https://console.firebase.google.com/).
2. Crea un nuevo proyecto.
3. En la sección **Authentication**, habilita el método de inicio de sesión con **Google**.
4. En la sección **Firestore Database**, crea una base de datos en modo "producción" o "prueba".
5. Ve a la configuración del proyecto y añade una **Web App** para obtener tus credenciales.

### 2. Configurar Credenciales
Busca el archivo `firebase-applet-config.json` en la raíz del proyecto y reemplaza los valores con los de tu nuevo proyecto de Firebase:
```json
{
  "apiKey": "TU_API_KEY",
  "authDomain": "TU_AUTH_DOMAIN",
  "projectId": "TU_PROJECT_ID",
  "appId": "TU_APP_ID",
  "firestoreDatabaseId": "(default)"
}
```

### 3. Configurar el Administrador
Por seguridad, el sistema necesita saber quién es el administrador. Debes editar dos archivos:

1. **Base de Datos (`firestore.rules`)**:
   Busca la función `isAdmin()` y cambia `"TU_CORREO@gmail.com"` por tu correo real de Google.
   ```javascript
   function isAdmin() {
     return ... || request.auth.token.email == "tu-correo@gmail.com";
   }
   ```
   *No olvides publicar estas reglas en tu consola de Firebase Firestore.*

2. **Código Frontend (`src/AuthContext.tsx`)**:
   Busca la línea donde se valida el correo y cámbialo por el tuyo:
   ```typescript
   const initialRole = user.email === 'tu-correo@gmail.com' ? 'admin' : 'user';
   ```

### 4. Ejecutar el Proyecto
Instala las dependencias y lanza el servidor de desarrollo:
```bash
npm install
npm run dev
```

---

##  Tecnologías Utilizadas
- **React 18** + **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (Animaciones)
- **Lucide React** (Iconos)
- **Firebase** (Auth & Firestore)

## 📄 Licencia
Este proyecto es de código abierto. ¡Siéntete libre de usarlo y mejorarlo!

---
**Desarrollado por Brayan Rodríguez**
