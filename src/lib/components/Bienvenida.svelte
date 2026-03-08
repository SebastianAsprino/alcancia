<script lang="ts">
	import { useEstadoGlobal } from "$lib/useEstadoGlobal.svelte";
	import { onMount } from "svelte";
	let inputRef = $state<HTMLInputElement>();

	onMount(() => {
		inputRef?.focus();
	});

	const estadoGlobal = useEstadoGlobal();

	let nombreInput = $state("");
	let error = $state("");

	function continuar() {
		if (nombreInput.trim().length < 2) {
			error = "Por favor ingresa un nombre válido";
			return;
		}
		estadoGlobal.nombre = nombreInput.trim();
		estadoGlobal.pasoActual = "dashboard";
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Enter") continuar();
	}
</script>

<div class="min-h-[80vh] flex items-center justify-center">
	<div class="card bg-base-100 shadow-2xl w-full max-w-md">
		<div class="card-body text-center space-y-6">
			<div class="space-y-2">
				<div class="text-6xl mb-4">🐷</div>
				<h1 class="text-3xl font-bold text-primary">
					¡Bienvenido a tu Alcancía Digital!
				</h1>
				<p class="text-base-content/70">
					Tu camino hacia el ahorro inteligente comienza aquí
				</p>
			</div>

			<div class="form-control w-full">
				<label for="nombreinput" class="label">
					<span class="label-text text-lg">¿Cómo te llamas?</span>
				</label>
				<input
					id="nombreinput"
					type="text"
					bind:value={nombreInput}
					onkeydown={handleKeydown}
					placeholder="Tu nombre"
					class="input input-bordered input-primary input-lg text-center text-xl"
				/>
				{#if error}
					<label for="nombreinput" class="label">
						<span class="label-text-alt text-error">{error}</span>
					</label>
				{/if}
			</div>

			<button onclick={continuar} class="btn btn-primary btn-lg w-full">
				Comenzar a Ahorrar
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 7l5 5m0 0l-5 5m5-5H6"
					/>
				</svg>
			</button>
		</div>
	</div>
</div>
