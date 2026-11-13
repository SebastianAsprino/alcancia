# Alcancía digital 🐷

Aplicación web para llevar la cuenta de una alcancía en pesos colombianos: registrar lo que se ahorra
(con botones por denominación o un monto manual), registrar retiros, fijar una meta y ver el progreso.
Todo vive en el navegador: no hay cuentas ni servidor de datos.

## Características

- **Bienvenida**: pide un nombre y abre el panel personal.
- **Ahorrar**: contadores por billete o moneda (de $100 a $100.000) más un monto manual opcional; el
  total se calcula en vivo y se registra en el historial.
- **Retirar**: retiro de un monto con motivo opcional (pide confirmación si supera el 50 % del saldo)
  o retiro total.
- **Meta**: monto objetivo con sugerencias rápidas; anillo de progreso en SVG y mensaje según si falta,
  se alcanzó o se superó.
- **Historial**: últimos 5 movimientos y número total de transacciones.
- **Persistencia** en `localStorage`: el estado se guarda en cada cambio y se restaura al volver.
  "Cerrar sesión" borra todo y vuelve a la bienvenida.
- PWA básica: favicons y `site.webmanifest`.

## Stack

- [SvelteKit 2](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev) (runes: `$state`, `$derived`, `$effect`)
- TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) + [daisyUI 5](https://daisyui.com) (tema `caramellatte`)
- [`@sveltejs/adapter-cloudflare`](https://svelte.dev/docs/kit/adapter-cloudflare) para Cloudflare Pages
- [Bun](https://bun.sh) como gestor de paquetes

## Arquitectura

```text
src/
├── routes/
│   ├── +layout.svelte          # crea el estado global, lo publica por contexto y lo sincroniza con localStorage
│   ├── +page.svelte            # muestra Bienvenida o Dashboard según `pasoActual`
│   └── layout.css              # Tailwind + daisyUI
└── lib/
    ├── estadoGlobal.svelte.ts  # tipos, estado inicial y lectura/escritura en localStorage
    ├── useEstadoGlobal.svelte.ts # acceso al estado vía contexto de Svelte
    ├── formato.ts              # formato de pesos (COP) y conversión de inputs a enteros
    └── components/
        ├── Bienvenida.svelte
        ├── Dashboard.svelte    # tarjetas: progreso, configuración, ahorrar, retirar, historial
        ├── Ahorrar.svelte
        ├── Retirar.svelte
        └── MetaConfig.svelte   # modal de la meta
static/                         # favicons, manifest y robots.txt
```

El estado es un único objeto reactivo (`$state`) que se crea en el layout y se comparte con
`setContext`/`getContext`; los componentes lo modifican directamente y un `$effect` lo guarda en
`localStorage` (clave `alcanciaData`). Si el dato guardado está corrupto o el almacenamiento no está
disponible, la app arranca vacía y sigue funcionando en memoria.

## Desarrollo

Requiere [Bun](https://bun.sh).

```sh
bun install
bun run dev        # servidor de desarrollo en http://localhost:5173
bun run check      # svelte-check (tipos y diagnósticos de Svelte)
bun run build      # build para Cloudflare en .svelte-kit/cloudflare
bun run preview    # sirve el build con wrangler pages dev en http://localhost:4173
```

## Despliegue

La app usa el adapter de Cloudflare y `wrangler.jsonc` apunta a `.svelte-kit/cloudflare`:

```sh
bun run build
bunx wrangler pages deploy
```

También se puede conectar el repositorio a Cloudflare Pages con el comando de build `bun run build` y
el directorio de salida `.svelte-kit/cloudflare`.

## Integración continua

`.github/workflows/ci.yml` corre en cada push a `main` y en cada pull request: instala dependencias con
el lockfile congelado, ejecuta `bun run check` y `bun run build`.
