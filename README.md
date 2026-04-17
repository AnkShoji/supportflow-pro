# SupportFlow Pro 

Sistema profesional de gestión de tickets de soporte técnico, diseñado para simular flujos reales de atención en entornos empresariales.

---

## 🚀 Descripción

**SupportFlow Pro** es una aplicación full stack que permite gestionar solicitudes de soporte técnico mediante un sistema de tickets en tiempo real.

El sistema permite a los usuarios crear solicitudes, hacer seguimiento de su estado y comunicarse con el equipo de soporte a través de comentarios, mientras que los administradores gestionan y resuelven los tickets.

---

## ⚙️ Funcionalidades principales

### 🔐 Autenticación
- Inicio de sesión seguro con Google (Firebase Authentication)

---

### 📋 Gestión de tickets
- Creación de tickets de soporte  
- Visualización de tickets en tiempo real  
- Estados de tickets:
  - Pendiente  
  - Resuelto  

---

### 💬 Sistema de comentarios
- Comunicación directa dentro de cada ticket  
- Historial de mensajes entre usuario y soporte  

---

### 👥 Roles de usuario
- **Usuario:**
  - Crear tickets  
  - Ver estado de sus solicitudes  

- **Administrador:**
  - Marcar tickets como resueltos  
  - Eliminar tickets  

---

### ⚡ Tiempo real
- Actualización automática de tickets sin recargar la página  
- Sincronización en todos los dispositivos  

---

### 🎨 Interfaz
- Diseño moderno con Tailwind CSS  
- Componentes UI con shadcn/ui  
- Animaciones con Framer Motion  


---

## 📸 Capturas de Pantalla

Aquí puedes ver cómo luce el sistema en acción:

### 1. Inicio de Sesión
<img width="1452" height="922" alt="Captura de pantalla 2026-04-15 105300" src="https://github.com/user-attachments/assets/99f7f51a-79e4-4956-8903-f29a8a4775c2" />


### 2. Creación de Tickets
<img width="1794" height="991" alt="Captura de pantalla 2026-04-15 102550" src="https://github.com/user-attachments/assets/9df6c249-45b1-4e02-bfba-63603eb1b1d8" />


### 3. Panel de Administración
<img width="1771" height="1069" alt="Captura de pantalla 2026-04-17 132042" src="https://github.com/user-attachments/assets/de946201-da63-47b8-bf35-8b1b0bba63de" />


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
Por seguridad y privacidad, el sistema no incluye correos reales en el código compartido. Debes editar dos archivos para darte permisos de administrador:

1. **Base de Datos (`firestore.rules`)**:
   Busca la función `isAdmin()` y cambia `"TU_CORREO@gmail.com"` por tu correo real de Google.
   ```javascript
   function isAdmin() {
     return ... || request.auth.token.email == "tu-correo@gmail.com";
   }
   ```
   *No olvides publicar estas reglas en tu consola de Firebase Firestore.*

2. **Código Frontend (`src/AuthContext.tsx`)**:
   Busca la línea donde se valida el correo (`const initialRole = ...`) y cambia `"TU_CORREO@gmail.com"` por el tuyo.
   ```typescript
   const initialRole = user.email === 'tu-correo@gmail.com' ? 'admin' : 'user';
   ```

*Nota: Alternativamente, puedes cambiar el rol a 'admin' directamente en el documento del usuario en la consola de Firebase Firestore.*

### 4. Ejecutar el Proyecto
Instala las dependencias y lanza el servidor de desarrollo:
```bash
npm install
npm run dev
```

---

## Tecnologías Utilizadas
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
