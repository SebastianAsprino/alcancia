<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import {
		crearEstadoGlobal,
		cargarDesdeStorage,
		guardarEnStorage,
	} from "$lib/estadoGlobal.svelte";

	let { children } = $props();

	// Crear estado global
	const estadoGlobal = crearEstadoGlobal();

	// Cargar datos guardados al iniciar (solo cliente)
	$effect(() => {
		if (typeof window !== "undefined") {
			const guardado = cargarDesdeStorage();
			if (guardado) {
				Object.assign(estadoGlobal, guardado);
			}
		}
	});

	// Guardar automáticamente cuando cambie el estado
	$effect(() => {
		// Dependencias explícitas para que Svelte trackee los cambios
		const { nombre, ahorroTotal, meta, historial, pasoActual } = estadoGlobal;
		guardarEnStorage(estadoGlobal);
	});

	// Hacer disponible el estado global para todos los componentes hijos
	// usando contexto de Svelte
	import { setContext } from "svelte";
	setContext("estadoGlobal", estadoGlobal);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-base-200 p-4 md:p-8">
	{@render children()}
</div>
