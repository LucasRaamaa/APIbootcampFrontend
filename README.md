# Bank Digital Wallet - Frontend

Interfaz web moderna para la plataforma de Billetera Virtual (Digital Wallet). Desarrollada con **React 18, TypeScript, Vite y Lucide Icons**, con soporte completo para **Modo Claro y Modo Oscuro**.

---

## Requisitos Previos

- **Node.js** (version 18 o superior).
- El **Backend** de la API corriendo en `http://localhost:5000`.

---

## Instalacion y Puesta en Marcha

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configuracion de Variables de Entorno (Opcional):**
   Por defecto, la aplicacion se conecta a `http://localhost:5000/api`. Si tu backend corre en otro puerto o dominio, crea un archivo `.env` basandote en `.env.example`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Iniciar el servidor en desarrollo:**
   ```bash
   npm run dev
   ```

4. Abre tu navegador en:
   **http://localhost:3000**

---

## Tecnologias y Caracteristicas

- **Framework:** React 18 + Vite (TypeScript estricto).
- **Temas:** Modo Claro / Oscuro con persistencia en `localStorage`.
- **Modulos:**
  - `auth`: Login, Registro y gestion de sesion JWT.
  - `account`: Saldo en tiempo real, CVU, Alias, deposito y transferencias.
  - `movements`: Historial con balance previo/posterior y paginacion.
  - `user`: Perfil, cambio de contrasena y Panel de Administracion.
