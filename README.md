# Portal Doctorado en Ciencias de la Salud

Este es el portal oficial del **Doctorado en Ciencias de la Salud**. Una aplicación web moderna construida con Angular para gestionar información académica, estudiantes, docentes y eventos del programa.

## 🚀 Tecnologías Empleadas

El proyecto utiliza un stack tecnológico moderno y escalable:

- **Frontend**: [Angular 21](https://angular.dev/) (Standalone Components, Signals).
- **UI Framework**: [PrimeNG 21](https://primeng.org/) con temas personalizados y componentes avanzados.
- **Backend as a Service**: [Firebase](https://firebase.google.com/) (Firestore para base de datos y Authentication para gestión de usuarios).
- **Gestión de Medios**: [Cloudinary](https://cloudinary.com/) para el almacenamiento y optimización de imágenes.
- **Iconografía**: FontAwesome 7 y PrimeIcons.
- **Estilos**: Vanilla CSS con variables personalizadas y diseño responsivo.

## 🛠️ Instalación y Configuración

Sigue estos pasos para poner a correr el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd doctorado
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
El proyecto requiere claves de Firebase y Cloudinary para funcionar. 
1. Dirígete a `src/environments/`.
2. Renombra o copia el archivo `environment.ts.example` a `environment.ts`.
3. Completa los campos con tus propias credenciales:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: 'TU_API_KEY',
    // ... resto de la configuración
  },
  cloudinary: {
    cloudName: 'TU_CLOUD_NAME',
    uploadPreset: 'TU_PRESET',
  },
};
```

## 💻 Comandos de Desarrollo

### Servidor de Desarrollo
Para iniciar el servidor local y ver los cambios en tiempo real:
```bash
ng serve
```
Navega a `http://localhost:4200/`.

### Construcción para Producción
Para generar los archivos optimizados para despliegue:
```bash
ng build
```
Los archivos se generarán en la carpeta `dist/doctorado/browser`.

### Despliegue en Firebase
Si tienes configurado Firebase CLI:
```bash
firebase deploy
```

## 📄 Estructura del Proyecto
- `src/app/core`: Servicios, guardas y modelos globales.
- `src/app/layout`: Componentes de estructura como el Header y Footer.
- `src/app/pages`: Componentes de página (Inicio, Docentes, Admin, etc.).
- `public/`: Archivos estáticos y activos del sitio.

---
© 2026 Portal Doctorado - Universidad Surcolombiana.
