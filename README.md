# 💳 Bank Digital Wallet - Frontend

Interfaz web moderna para la plataforma de Billetera Virtual (Digital Wallet). Desarrollada con **React 18, TypeScript, Vite y Lucide Icons**, con soporte completo para **Modo Claro y Modo Oscuro**.

---

## 🚀 Requisitos Previos

- **Node.js** (versión 18 o superior).
- El **Backend** de la API corriendo en `http://localhost:5000`.

---

## ⚙️ Instalación y Puesta en Marcha

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configuración de Variables de Entorno (Opcional):**
   Por defecto, la aplicación se conecta a `http://localhost:5000/api`. Si tu backend corre en otro puerto o dominio, creá un archivo `.env` basándote en `.env.example`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Iniciar el servidor en desarrollo:**
   ```bash
   npm run dev
   ```

4. Abrí tu navegador en:
   👉 **http://localhost:3000**

---

## 🛠️ Tecnologías y Características

- **Framework:** React 18 + Vite (TypeScript estricto).
- **Temas:** Modo Claro / Oscuro con persistencia en `localStorage`.
- **Módulos:**
  - `auth`: Login, Registro y gestión de sesión JWT.
  - `account`: Saldo en tiempo real, CVU, Alias, depósito y transferencias.
  - `movements`: Historial con balance previo/posterior y paginación.
  - `user`: Perfil, cambio de contraseña y Panel de Administración.
