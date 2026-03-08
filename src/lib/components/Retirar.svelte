<script lang="ts">
	import { useEstadoGlobal } from "$lib/useEstadoGlobal.svelte";

	const estadoGlobal = useEstadoGlobal();

	let montoRetiro = $state("");
	let motivo = $state("");
	let error = $state("");

	const formatoPesos = (valor: number) => {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
		}).format(valor);
	};

	function confirmarRetiro() {
		error = "";
		const monto = parseInt(montoRetiro);

		if (!monto || monto <= 0) {
			error = "Ingresa un monto válido";
			return;
		}

		if (monto > estadoGlobal.ahorroTotal) {
			error = `No tienes suficiente dinero. Tu saldo es ${formatoPesos(estadoGlobal.ahorroTotal)}`;
			return;
		}

		// Confirmación si es más del 50%
		if (monto > estadoGlobal.ahorroTotal * 0.5) {
			if (
				!confirm("¿Estás seguro? Estás retirando más del 50% de tus ahorros.")
			) {
				return;
			}
		}

		// Ejecutar retiro
		estadoGlobal.ahorroTotal -= monto;
		estadoGlobal.historial.push({
			tipo: "retiro",
			monto: monto,
			fecha: new Date().toISOString(),
			detalle: motivo || "Sin motivo especificado",
		});

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
			const monto = estadoGlobal.ahorroTotal;
			estadoGlobal.ahorroTotal = 0;
			estadoGlobal.historial.push({
				tipo: "retiro",
				monto: monto,
				fecha: new Date().toISOString(),
				detalle: "Retiro total de la alcancía",
			});

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
			disabled={!montoRetiro ||
				parseInt(montoRetiro) <= 0 ||
				parseInt(montoRetiro) > estadoGlobal.ahorroTotal}
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
