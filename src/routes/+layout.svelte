<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import {
		crearEstadoGlobal,
		cargarDesdeStorage,
		guardarEnStorage,
	} from "$lib/estadoGlobal.svelte";
	import { proveerEstadoGlobal } from "$lib/useEstadoGlobal.svelte";

	let { children } = $props();

	// Crear estado global
	const estadoGlobal = crearEstadoGlobal();

	// Cargar datos guardados al iniciar (solo cliente)
	$effect(() => {
		const guardado = cargarDesdeStorage();
		if (guardado) {
			Object.assign(estadoGlobal, guardado);
		}
	});

	// Guardar automáticamente cuando cambie el estado: guardarEnStorage serializa todo el
	// objeto, así que el efecto depende de cada campo (también de los items del historial)
	$effect(() => {
		guardarEnStorage(estadoGlobal);
	});

	// Hacer disponible el estado global para todos los componentes hijos
	proveerEstadoGlobal(estadoGlobal);
</script>

<svelte:head
	><link rel="icon" href={favicon} />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Alcancia" />
	<link rel="manifest" href="/site.webmanifest" /></svelte:head
>

<div class="min-h-screen bg-base-200 p-4 md:p-8">
	{@render children()}
</div>
