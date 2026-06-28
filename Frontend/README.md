# 🐶 Magnus — Finanzas Personales

Magnus es una app móvil (Android-first) que lee las notificaciones de gastos que tu banco envía a tu Gmail y las convierte automáticamente en un registro de finanzas personales, ordenado y fácil de entender. Su mascota, **Magnus el perro**, te acompaña con un estilo visual amigable inspirado en Duolingo.

---

## ⚡ Inicio rápido (TL;DR)

> El código de la app vive en la carpeta **`Frontend/`**. Todos los comandos `npm` se ejecutan **dentro** de esa carpeta.

```powershell
# 1. Clonar el repo y entrar a la app
git clone https://github.com/solvark1/magnus-personal-finance.git
cd magnus-personal-finance/Frontend

# 2. (Solo Windows/PowerShell, una vez por terminal si npm/npx fallan por ExecutionPolicy)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

# 3. Instalar dependencias
npm install

# 4. Levantar backend simulado + app juntos
npm run dev
```

Luego, en la terminal de Expo, presiona **`w`** (navegador), **`a`** (emulador Android) o escanea el **QR** con Expo Go.

| Comando             | Qué hace                                          |
| ------------------- | ------------------------------------------------- |
| `npm install`       | Instala todas las dependencias del proyecto       |
| `npm run dev`       | Backend simulado **+** Expo en paralelo           |
| `npm start`         | Solo el servidor de desarrollo de Expo            |
| `npm run mock`      | Solo el backend simulado (puerto 4000)            |
| `npm run android`   | Abre la app en el emulador/dispositivo Android    |
| `npm run web`       | Abre la app en el navegador                       |
| `npm run lint`      | Linter                                            |

> 💡 Si el puerto 8081 está ocupado por un Expo anterior, ciérralo o acepta usar otro puerto cuando Expo lo pregunte. Requisitos: **Node.js 20+** y **npm**.

---

## 📱 Stack tecnológico

| Capa             | Tecnología                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| Framework        | [Expo](https://expo.dev) SDK 56 + React Native 0.85                                                            |
| Navegación       | [expo-router](https://docs.expo.dev/router/introduction/) (file-based)                                         |
| Lenguaje         | TypeScript (strict)                                                                                            |
| Datos / caché    | [TanStack Query v5](https://tanstack.com/query)                                                                |
| HTTP             | axios                                                                                                          |
| Animaciones      | react-native-reanimated 4                                                                                      |
| Tipografía       | Nunito (`@expo-google-fonts/nunito`)                                                                           |
| Backend simulado | [json-server](https://github.com/typicode/json-server) (mientras se construye el backend real en ASP.NET Core) |

---

## 🗂️ Estructura del proyecto

```
magnus-personal-finance/
├── mock-server/             # Backend simulado (json-server)
│   ├── db.json              # Datos de prueba (usuario, categorías, transacciones…)
│   └── server.js            # Servidor que emula la API real (/api/v1, envelopes, auth)
├── src/
│   ├── api/                 # Cliente HTTP, React Query, claves y tipos del API
│   ├── app/                 # Rutas (expo-router)
│   │   ├── (auth)/          # Login
│   │   ├── (tabs)/          # Transacciones · Remitentes · Sincronización
│   │   └── transaction/     # Detalle de transacción (modal)
│   ├── components/
│   │   ├── ui/              # Design system (Button, Card, Text, Input, Badge…)
│   │   └── magnus/          # La mascota Magnus
│   ├── config/              # Variables de entorno
│   ├── features/            # Módulos por dominio (auth, transactions, gmailSync…)
│   │   └── <feature>/       # cada uno con: .api.ts · .hooks.ts · components/
│   ├── lib/                 # Utilidades (formato, almacenamiento seguro)
│   ├── theme/               # Tokens de diseño (colores, tipografía, espaciado…)
│   └── types/               # Modelos de dominio
└── .env                     # URL del API (no se sube a git)
```

**Principios de arquitectura:** modular por _feature_, design system centralizado, KISS y tokens de diseño únicos (ningún color/medida suelto en los componentes). Esto mantiene la app escalable y consistente.

---

## ✅ Requisitos previos

- **Node.js 20+** (probado con Node 24)
- **npm**
- Para probar en Android:
  - **Expo Go** (app gratuita en Play Store) para desarrollo, **o**
  - **Android Studio** con un emulador, **o**
  - Un teléfono físico en la misma red Wi-Fi

> 💡 **Windows / PowerShell:** si `npm` o `npx` fallan con un error de _ExecutionPolicy_, ejecuta una vez por sesión de terminal:
>
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
> ```

---

## 🚀 Cómo correr la app (desarrollo)

### 1. Instalar dependencias

```powershell
npm install
```

### 2. Configurar la URL del API

El archivo `.env` define a dónde apunta la app. Según dónde la pruebes:

| Escenario            | `EXPO_PUBLIC_API_URL`                                                      |
| -------------------- | -------------------------------------------------------------------------- |
| Web / iOS Simulator  | `http://localhost:4000/api/v1`                                             |
| **Emulador Android** | `http://10.0.2.2:4000/api/v1`                                              |
| **Teléfono físico**  | `http://<IP-DE-TU-PC>:4000/api/v1` (ej. `http://192.168.1.10:4000/api/v1`) |

> Para conocer la IP de tu PC: `ipconfig` → _Dirección IPv4_.

### 3. Levantar backend simulado + app juntos

```powershell
npm run dev          # mock-server + Expo
# o por separado:
npm run mock         # solo el backend simulado (puerto 4000)
npm start            # solo Expo
```

### 4. Abrir la app

- Escanea el QR con **Expo Go** (teléfono físico), o
- Presiona `a` en la terminal para abrir el **emulador de Android**, o
- Presiona `w` para abrir en el navegador.

---

## 🎨 Sistema de diseño

Todo el aspecto visual vive en `src/theme/` y `src/components/ui/`:

- **Colores de marca:** Púrpura `#6E72E4` (primario), Dorado `#FFC857` (acento), Coral `#FF8C66`, Azul Profundo `#1E1F3F` (texto), Gris Claro `#F2F4F7` (fondo).
- **Tipografía:** Nunito (redondeada y amigable).
- **Botones estilo Duolingo:** efecto 3D que se "hunde" al presionar.
- **Mascota Magnus:** componente reutilizable con estados de ánimo (`happy`, `wave`, `thinking`, `celebrate`). Hoy usa un emoji como _placeholder_; se puede cambiar por una ilustración o animación Lottie sin tocar las pantallas.

> Regla de oro: los componentes **nunca** usan colores o medidas "sueltas"; siempre consumen los tokens de `@/theme`. Así, cambiar la marca (o agregar modo oscuro) es trivial.

---

## 📦 Cómo generar un APK para Android (ejecutable instalable)

Expo usa **EAS Build** para compilar tu código en la nube y darte un `.apk` (o `.aab` para Play Store) sin necesidad de instalar Android Studio.

### Paso 1 — Crear una cuenta de Expo (gratis)

Regístrate en [expo.dev](https://expo.dev/signup).

### Paso 2 — Instalar EAS CLI e iniciar sesión

```powershell
npm install -g eas-cli
eas login
```

### Paso 3 — Configurar el proyecto para build

```powershell
eas build:configure
```

Esto crea un archivo `eas.json`. Asegúrate de tener un perfil que genere un **APK** instalable directamente (no solo `.aab`):

```jsonc
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk", // APK que puedes instalar a mano
      },
    },
    "production": {
      "android": {
        "buildType": "app-bundle", // .aab para publicar en Play Store
      },
    },
  },
}
```

### Paso 4 — Compilar el APK

```powershell
eas build -p android --profile preview
```

- La primera vez, EAS te ofrecerá **generar automáticamente las llaves de firma** (acepta).
- La compilación corre en la nube. Al terminar te da un **enlace de descarga** del `.apk`.

### Paso 5 — Instalar en tu teléfono

1. Descarga el `.apk` desde el enlace (o el QR que muestra EAS).
2. En el teléfono, permite _"Instalar apps de orígenes desconocidos"_.
3. Abre el archivo y ¡listo! 🐶

> ⚠️ **Importante sobre el backend en un APK:** el `.apk` no incluye el `mock-server`. Para que la app funcione instalada, `EXPO_PUBLIC_API_URL` debe apuntar a un backend accesible desde internet (el backend real de ASP.NET Core desplegado, o el mock expuesto temporalmente con una herramienta como [ngrok](https://ngrok.com)). `localhost` y `10.0.2.2` **solo** sirven durante el desarrollo.

### Alternativa rápida sin instalar nada: Expo Go

Para _probar_ en tu teléfono durante el desarrollo no necesitas compilar: instala **Expo Go** desde Play Store, corre `npm start` y escanea el QR. Es la forma más rápida de ver cambios en vivo.

---

## 🧪 Scripts disponibles

| Script            | Qué hace                                       |
| ----------------- | ---------------------------------------------- |
| `npm start`       | Inicia el servidor de desarrollo de Expo       |
| `npm run android` | Abre la app en el emulador/dispositivo Android |
| `npm run web`     | Abre la app en el navegador                    |
| `npm run mock`    | Levanta el backend simulado (puerto 4000)      |
| `npm run dev`     | Backend simulado **+** Expo en paralelo        |
| `npm run lint`    | Linter                                         |

---

## 🛣️ Próximos pasos

- Conectar el backend real (ASP.NET Core) reemplazando la URL del `.env`.
- Sustituir el emoji de Magnus por una ilustración/Lottie.
- OAuth real de Google/Gmail.
- Gráficos de gastos por categoría en la pantalla de resumen.
