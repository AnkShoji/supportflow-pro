# SupportFlow Pro 🚀

Sistema profesional de gestión de tickets de soporte técnico, construido con React, TypeScript y Firebase.

## ✨ Características
- **Autenticación**: Inicio de sesión seguro con Google.
- **Tiempo Real**: Los tickets se actualizan instantáneamente en todos los dispositivos.
- **Hilos de Comentarios**: Comunicación fluida entre el usuario y el equipo de soporte dentro de cada ticket.
- **Roles de Usuario**:
  - **Usuarios**: Pueden crear tickets y ver el estado de las solicitudes.
  - **Administradores**: Tienen permisos exclusivos para marcar tickets como resueltos o eliminarlos.
- **Diseño Premium**: Interfaz moderna con Tailwind CSS, shadcn/ui y animaciones fluidas con Framer Motion.

---

## 📸 Capturas de Pantalla

Aquí puedes ver cómo luce el sistema en acción:

### 1. Inicio de Sesión
![Inicio de Sesión](https://via.placeholder.com/800x450?text=Arrastra+aquí+tu+captura+de+Login)
*Interfaz limpia y segura con autenticación de Google.*

### 2. Creación de Tickets
![Creación de Tickets](https://via.placeholder.com/800x450?text=Arrastra+aquí+tu+captura+de+Crear+Ticket)
*Formulario intuitivo para que los usuarios reporten sus incidencias.*

### 3. Panel de Administración
![Panel de Administración](https://via.placeholder.com/800x450?text=Arrastra+aquí+tu+captura+de+Admin)
*Vista exclusiva para administradores con opciones de gestión y borrado.*

---

## 🛠️ Guía de Instalación (Para GitHub)

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

## 👨‍💻 Tecnologías Utilizadas
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
