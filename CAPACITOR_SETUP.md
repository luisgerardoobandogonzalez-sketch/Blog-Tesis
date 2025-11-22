# 🚀 Guía de Instalación de Capacitor

## Pasos para Configurar Capacitor

### 1. Instalar Dependencias
```bash
cd frotend
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npm install @capacitor/camera @capacitor/share @capacitor/push-notifications @capacitor/status-bar @capacitor/splash-screen
```

### 2. Inicializar Capacitor
```bash
npx cap init "Blog Universitario" "com.universidad.blog" --web-dir=www
```

### 3. Compilar la Aplicación
```bash
ionic build
```

### 4. Agregar Plataformas
```bash
# Para Android
npx cap add android

# Para iOS (solo en macOS)
npx cap add ios
```

### 5. Sincronizar Cambios
```bash
npx cap sync
```

### 6. Abrir en IDE Nativo
```bash
# Para Android Studio
npx cap open android

# Para Xcode (macOS)
npx cap open ios
```

## Notas Importantes
- El archivo `capacitor.config.ts` ya está configurado
- Para actualizar la app móvil después de cambios: `ionic build && npx cap sync`
- Para live reload en dispositivo: `ionic cap run android -l --external`
