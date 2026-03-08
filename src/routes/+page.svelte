<script>
	import { onMount } from "svelte";
	import Bienvenida from "$lib/components/Bienvenida.svelte";
	import Dashboard from "$lib/components/Dashboard.svelte";
	import { useEstadoGlobal } from "$lib/useEstadoGlobal.svelte";
	import { cargarDesdeStorage } from "$lib/estadoGlobal.svelte";

	const estadoGlobal = useEstadoGlobal();
	let cargando = $state(true);

	onMount(() => {
		const guardado = cargarDesdeStorage();
		if (guardado && guardado.nombre && guardado.nombre.trim() !== "") {
			// Restaurar todo el estado guardado
			Object.assign(estadoGlobal, guardado);
		}
		cargando = false;
	});
</script>

{#if cargando}
	<div class="min-h-screen flex items-center justify-center">
		<span class="loading loading-spinner loading-lg text-primary"></span>
	</div>
{:else}
	<div class="max-w-6xl mx-auto">
		{#if estadoGlobal.pasoActual === "bienvenida"}
			<Bienvenida />
		{:else}
			<Dashboard />
		{/if}
	</div>
{/if}
