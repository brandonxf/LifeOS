# Configuración de Firebase para Life OS

## Paso 1: Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Activa **Firestore Database** (no Realtime Database)
   - Ve a "Create database"
   - Choose "Start in test mode" (para desarrollo)
   - Choose location near you

## Paso 2: Obtener credenciales

1. En Firebase Console, ve a **Project Settings** (⚙️)
2.向下滚动到 "Your apps"
3. Click en el icono **</>** (Web)
4. Registra la app (nombre: LifeOS)
5. Copia el objeto `firebaseConfig`

## Paso 3: Configurar en el proyecto

Abre `src/firebase/config.js` y reemplaza las credenciales:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
}
```

## Paso 4: Habilitar Firebase en el código

Abre `src/components/FirebaseSync.jsx` y:
1. Descomenta todo el código de Firebase
2. Comenta o elimina la versión simple al final

## Paso 5: Reglas de Firestore (para producción)

Cuando tengas datos reales, cambia las reglas en Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Notas

- **Test Mode**: Allows read/write para todos mientras desarrollas
- **Autenticación anónima**: No requiere que usuarios creen cuenta
- **Sincronización**: Los datos se guardan automáticamente en la nube
- **Multi-dispositivo**: Tus datos estarán disponibles en cualquier dispositivo

## Solución de problemas

Si tienes errores:
1. Verifica que Firestore esté habilitado
2. Verifica las credenciales en config.js
3. Revisa la consola del navegador (F12)
4. Asegúrate de haber corrido `npm install firebase`
