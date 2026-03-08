<script lang="ts">
	import { useEstadoGlobal } from "$lib/useEstadoGlobal.svelte";

	const estadoGlobal = useEstadoGlobal();

	// Denominaciones disponibles
	const denominaciones = [
		100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000,
	];

	// Contadores para cada denominación
	let contadores = $state(
		Object.fromEntries(denominaciones.map((d) => [d, 0])),
	);

	// Monto manual
	let montoManual = $state("");

	// Calcular total de contadores
	let totalContadores = $derived(() => {
		return Object.entries(contadores).reduce((sum, [denom, cantidad]) => {
			return sum + parseInt(denom) * cantidad;
		}, 0);
	});

	// Calcular total visual (contadores + manual si es válido)
	let totalVisual = $derived(() => {
		const manual = parseInt(montoManual) || 0;
		return totalContadores() + manual;
	});

	function incrementar(denominacion: number) {
		contadores[denominacion]++;
	}

	function decrementar(denominacion: number) {
		if (contadores[denominacion] > 0) {
			contadores[denominacion]--;
		}
	}

	function resetearContadores() {
		contadores = Object.fromEntries(denominaciones.map((d) => [d, 0]));
		montoManual = "";
	}

	function confirmarAhorro() {
		const total = totalVisual();
		if (total <= 0) return;

		// Actualizar estado global
		estadoGlobal.ahorroTotal += total;
		estadoGlobal.historial.push({
			tipo: "ahorro",
			monto: total,
			fecha: new Date().toISOString(),
			detalle: montoManual ? "Mixto (botones + manual)" : "Solo botones",
		});

		// Resetear
		resetearContadores();

		// Feedback visual (podría ser un toast)
		alert(
			`¡Has ahorrado ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(total)}!`,
		);
	}

	const formatoPesos = (valor: number) => {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
		}).format(valor);
	};
</script>

<div class="space-y-4">
	<div class="flex items-center gap-2 mb-4">
		<span class="text-3xl">💰</span>
		<h3 class="card-title text-success text-xl m-0">Agregar Ahorro</h3>
	</div>

	<!-- Input Manual -->
	<div class="form-control">
		<label for="montomanual" class="label">
			<span class="label-text">Monto manual (opcional)</span>
		</label>
		<div class="join w-full">
			<span class="join-item btn btn-disabled no-animation">$</span>
			<input
				id="montomanual"
				type="number"
				bind:value={montoManual}
				placeholder="0"
				class="join-item input input-bordered input-success w-full"
				min="0"
			/>
		</div>
	</div>

	<div class="divider text-sm">o usa los botones</div>

	<!-- Grid de Denominaciones -->
	<div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
		{#each denominaciones as denom}
			<div class="btn-group">
				<button
					onclick={() => decrementar(denom)}
					class="btn btn-sm btn-outline btn-success w-1/3"
					disabled={contadores[denom] === 0}
				>
					−
				</button>
				<button
					onclick={() => incrementar(denom)}
					class="btn btn-sm btn-success w-2/3 flex-col h-auto py-2"
				>
					<span class="text-xs opacity-75">{contadores[denom]}x</span>
					<span class="font-bold">${denom.toLocaleString("es-CO")}</span>
				</button>
			</div>
		{/each}
	</div>

	<!-- Resumen y Acciones -->
	<div class="bg-success/10 rounded-lg p-4 space-y-3">
		<div class="flex justify-between items-center">
			<span class="text-success font-medium">Total a ahorrar:</span>
			<span class="text-2xl font-bold text-success"
				>{formatoPesos(totalVisual())}</span
			>
		</div>

		<div class="flex gap-2">
			<button
				onclick={resetearContadores}
				class="btn btn-ghost btn-sm flex-1"
				disabled={totalVisual() === 0}
			>
				🔄 Resetear
			</button>
			<button
				onclick={confirmarAhorro}
				class="btn btn-success flex-2"
				disabled={totalVisual() === 0}
			>
				💾 Guardar Ahorro
			</button>
		</div>
	</div>
</div>
