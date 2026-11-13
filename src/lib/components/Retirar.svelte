<script lang="ts">
	import { aEntero, formatoPesos } from "$lib/formato";
	import { useEstadoGlobal } from "$lib/useEstadoGlobal.svelte";

	const estadoGlobal = useEstadoGlobal();

	let montoRetiro = $state("");
	let motivo = $state("");
	let error = $state("");

	// Por encima de esta fracción del saldo se pide confirmación
	const UMBRAL_CONFIRMACION = 0.5;

	const montoValido = $derived.by(() => {
		const monto = aEntero(montoRetiro);
		return monto > 0 && monto <= estadoGlobal.ahorroTotal;
	});

	function registrarRetiro(monto: number, detalle: string) {
		estadoGlobal.ahorroTotal -= monto;
		estadoGlobal.historial.push({
			tipo: "retiro",
			monto,
			fecha: new Date().toISOString(),
			detalle,
		});
	}

	function confirmarRetiro() {
		error = "";
		const monto = aEntero(montoRetiro);

		if (monto <= 0) {
			error = "Ingresa un monto válido";
			return;
		}

		if (monto > estadoGlobal.ahorroTotal) {
			error = `No tienes suficiente dinero. Tu saldo es ${formatoPesos(estadoGlobal.ahorroTotal)}`;
			return;
		}

		// Confirmación si es más del 50%
		if (monto > estadoGlobal.ahorroTotal * UMBRAL_CONFIRMACION) {
			if (
				!confirm("¿Estás seguro? Estás retirando más del 50% de tus ahorros.")
			) {
				return;
			}
		}

		registrarRetiro(monto, motivo.trim() || "Sin motivo especificado");

		// Resetear
		montoRetiro = "";
		motivo = "";

		alert(`Has retirado ${formatoPesos(monto)}`);
	}

	function retirarTodo() {
		if (estadoGlobal.ahorroTotal === 0) {
			error = "No tienes dinero ahorrado";
			return;
		}

		if (
			confirm(
				`¿Retirar todo tu dinero (${formatoPesos(estadoGlobal.ahorroTotal)})?`,
			)
		) {
			registrarRetiro(estadoGlobal.ahorroTotal, "Retiro total de la alcancía");

			alert("Has vaciado tu alcancía");
		}
	}
</script>

<div class="space-y-4">
	<div class="flex items-center gap-2 mb-4">
		<span class="text-3xl">💸</span>
		<h3 class="card-title text-error text-xl m-0">Retirar Dinero</h3>
	</div>

	<div class="alert alert-info bg-info/10 text-info border-0 text-sm">
		<span
			>💡 Saldo disponible: <strong
				>{formatoPesos(estadoGlobal.ahorroTotal)}</strong
			></span
		>
	</div>

	<div class="form-control">
		<label for="montoretiro" class="label">
			<span class="label-text">Monto a retirar</span>
		</label>
		<div class="join w-full">
			<span class="join-item btn btn-disabled no-animation">$</span>
			<input
				id="montoretiro"
				type="number"
				bind:value={montoRetiro}
				placeholder="0"
				class="join-item input input-bordered input-error w-full"
				min="1"
				max={estadoGlobal.ahorroTotal}
			/>
		</div>
	</div>

	<div class="form-control">
		<label for="motivo" class="label">
			<span class="label-text">Motivo (opcional)</span>
		</label>
		<input
			id="motivo"
			type="text"
			bind:value={motivo}
			placeholder="¿Para qué necesitas este dinero?"
			class="input input-bordered input-sm"
		/>
	</div>

	{#if error}
		<div class="alert alert-error alert-sm py-2">
			<span class="text-sm">{error}</span>
		</div>
	{/if}

	<div class="flex flex-col gap-2 pt-2">
		<button
			onclick={confirmarRetiro}
			class="btn btn-error"
			disabled={!montoValido}
		>
			🡆 Retirar Monto
		</button>

		<button
			onclick={retirarTodo}
			class="btn btn-outline btn-error btn-sm"
			disabled={estadoGlobal.ahorroTotal === 0}
		>
			⚠️ Retirar Todo
		</button>
	</div>
</div>
