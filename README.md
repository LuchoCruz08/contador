# Contador

El objetivo era crear una página con un contador que gestionara las actualizaciones asíncronas con fluidez e incluyera un tiempo de espera entre acciones. Esta aplicación se diseñó para ofrecer:

- Una interfaz de usuario limpia.
- Una experiencia de usuario fluida mediante animaciones.
- Acciones de servidor (`app/actions`) para una lógica del lado del servidor clara y segura.

### 💡 Decisiones Técnicas
#### App Router + Acciones de Servidor
- Se utilizó App Router (app/) y componentes de servidor para lograr una separación clara de la lógica cliente/servidor.

- Se implementó src/actions/counter.ts para gestionar los cambios de forma segura en el servidor mediante use server.

#### Gestión de estados
- Se utiliza useTransition para proporcionar una retroalimentación fluida de la interfaz de usuario durante las actualizaciones asíncronas.

- El valor del contador se obtiene y se actualiza mediante useEffect y un intervalo de sondeo de 5 segundos para mantener la interfaz de usuario sincronizada con el backend.

#### Animaciones
- Framer Motion para obtener animaciones fluidas cuando el contador se actualiza o carga.

- Se utilizó AnimatePresence para animar los estados de carga de la card del contador.

- UX/UI
Se utilizaron componentes shadcn/ui y Tailwind CSS para lograr un diseño limpio.

- Se añadieron indicadores de carga, transiciones y retroalimentación temporal (p. ej., "Actualizando...") para una experiencia de usuario fluida.

### 🔁 Funcionalidad adicional
#### ⏳ Componente de temporizador de cuenta regresiva
- Se implementó un componente CountdownTimer que muestra cuanto falta para que el contador se reinicie.

#### 🔄 Sondeo de actualizaciones
Un mecanismo de sondeo de 5 segundos mantiene el contador sincronizado con el servidor incluso si otro usuario (u otra pestaña) lo actualiza.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/LuchoCruz08/contador.git
cd contador
```
2. Install dependencies
```bash
pnpm install
```
Or if you're using npm:
```bash
npm install
```
3. Set up environment variables
Create a .env.local file in the root with any required variables.
```bash
DATABASE_URL={SUPABASE_URL}.
```
4. Run the development server
```bash
pnpm dev
```
Or with npm:
```bash
npm run dev
```
Open http://localhost:3000 in your browser to see the app.

---


