<script lang="ts">
	import { useEstadoGlobal } from "$lib/useEstadoGlobal.svelte";

	const estadoGlobal = useEstadoGlobal();

	let { onclose } = $props();

	let metaInput = $state(estadoGlobal.meta.toString());
	let error = $state("");

	const metasSugeridas = [
		{ valor: 100000, emoji: "🎮", desc: "Videojuego" },
		{ valor: 500000, emoji: "👟", desc: "Zapatillas" },
		{ valor: 1000000, emoji: "📱", desc: "Celular" },
		{ valor: 5000000, emoji: "💻", desc: "Portátil" },
		{ valor: 20000000, emoji: "🏍️", desc: "Moto" },
	];

	function guardarMeta() {
		const meta = parseInt(metaInput);
		if (!meta || meta <= 0) {
			error = "Ingresa un monto válido mayor a 0";
			return;
		}
		estadoGlobal.meta = meta;
		onclose();
	}

	function seleccionarSugerencia(valor: number) {
		metaInput = valor.toString();
	}

	const formatoPesos = (valor: number) => {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
		}).format(valor);
	};
</script>

<div class="modal modal-open">
	<div class="modal-box max-w-md">
		<h3 class="font-bold text-lg mb-4">🎯 Configurar Meta de Ahorro</h3>

		<div class="form-control mb-4">
			<label for="meta" class="label">
				<span class="label-text">¿Cuánto quieres ahorrar?</span>
			</label>
			<div class="join w-full">
				<span class="join-item btn btn-disabled no-animation">$</span>
				<input
					id="meta"
					type="number"
					bind:value={metaInput}
					placeholder="Ej: 1000000"
					class="join-item input input-bordered input-primary w-full"
					min="1"
				/>
			</div>
			{#if error}
				<label for="meta" class="label">
					<span class="label-text-alt text-error">{error}</span>
				</label>
			{/if}
		</div>

		<div class="mb-6">
			<p class="text-sm text-base-content/70 mb-2">Metas sugeridas:</p>
			<div class="flex flex-wrap gap-2">
				{#each metasSugeridas as sugerencia}
					<button
						onclick={() => seleccionarSugerencia(sugerencia.valor)}
						class="btn btn-sm btn-outline btn-primary gap-1"
					>
						<span>{sugerencia.emoji}</span>
						<span class="hidden sm:inline"
							>{formatoPesos(sugerencia.valor)}</span
						>
					</button>
				{/each}
			</div>
		</div>

		<div class="modal-action">
			<button onclick={onclose} class="btn btn-ghost">Cancelar</button>
			<button onclick={guardarMeta} class="btn btn-primary">
				Guardar Meta
			</button>
		</div>
	</div>
	<button
		type="button"
		class="modal-backdrop"
		onclick={onclose}
		aria-label="Cerrar modal"
	></button>
</div>
