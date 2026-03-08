<script lang="ts">
	import { useEstadoGlobal } from "$lib/useEstadoGlobal.svelte";
	import Ahorrar from "./Ahorrar.svelte";
	import Retirar from "./Retirar.svelte";
	import MetaConfig from "./MetaConfig.svelte";

	const estadoGlobal = useEstadoGlobal();

	// Formato de pesos colombianos
	const formatoPesos = (valor: number) => {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
		}).format(valor);
	};

	// Calcular progreso para el gráfico
	let progreso = $derived(() => {
		if (estadoGlobal.meta <= 0) return 0;
		const porcentaje = (estadoGlobal.ahorroTotal / estadoGlobal.meta) * 100;
		return Math.min(porcentaje, 100);
	});

	let mensajeMeta = $derived(() => {
		const { ahorroTotal, meta } = estadoGlobal;
		if (meta <= 0) return null;

		const faltante = meta - ahorroTotal;

		if (ahorroTotal < meta) {
			return {
				tipo: "pendiente",
				texto: `Te faltan ${formatoPesos(faltante)} para llegar a tu meta de ${formatoPesos(meta)}`,
			};
		} else if (ahorroTotal === meta) {
			return {
				tipo: "completada",
				texto: `¡Has llegado a tu meta de ${formatoPesos(meta)}! 🎉`,
			};
		} else {
			return {
				tipo: "superada",
				texto: `¡Has superado tu meta de ${formatoPesos(meta)}! Tienes ${formatoPesos(ahorroTotal)}`,
			};
		}
	});

	let mostrarConfigMeta = $state(false);

	function resetearTodo() {
		if (
			confirm(
				"¿Estás seguro de que quieres empezar de cero? Se perderá todo tu progreso.",
			)
		) {
			estadoGlobal.nombre = "";
			estadoGlobal.ahorroTotal = 0;
			estadoGlobal.meta = 0;
			estadoGlobal.historial = [];
			estadoGlobal.pasoActual = "bienvenida";
		}
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<header
		class="flex flex-col md:flex-row justify-between items-center gap-4 bg-base-100 p-6 rounded-2xl shadow-lg"
	>
		<div class="text-center md:text-left">
			<h1 class="text-2xl md:text-3xl font-bold text-primary">
				¡Hola, {estadoGlobal.nombre}! 👋
			</h1>
			<p class="text-base-content/70">Veamos cómo vas con tu ahorro</p>
		</div>
		<button onclick={resetearTodo} class="btn btn-ghost btn-sm text-error">
			Cerrar sesión
		</button>
	</header>

	<!-- Grid Principal tipo Bento -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		<!-- Tarjeta Principal: Ahorro Total (ocupa 2 columnas en desktop) -->
		<div
			class="lg:col-span-2 card bg-linear-to-br from-neutral to-primary-focus text-primary-content shadow-xl"
		>
			<div class="card-body">
				<div class="flex flex-col md:flex-row items-center gap-8">
					<!-- Gráfico Circular de Progreso -->
					<div class="relative w-48 h-48 shrink-0">
						<svg
							class="w-full h-full transform -rotate-90"
							viewBox="0 0 100 100"
						>
							<!-- Círculo de fondo -->
							<circle
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke="currentColor"
								stroke-width="8"
								class="text-primary-content/20"
							/>
							<!-- Círculo de progreso -->
							<circle
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke="currentColor"
								stroke-width="8"
								stroke-linecap="round"
								stroke-dasharray={2 * Math.PI * 45}
								stroke-dashoffset={2 * Math.PI * 45 * (1 - progreso() / 100)}
								class="text-primary-content transition-all duration-1000 ease-out"
							/>
						</svg>
						<div
							class="absolute inset-0 flex flex-col items-center justify-center"
						>
							<span class="text-4xl font-bold">{Math.round(progreso())}%</span>
							<span class="text-xs opacity-80">completado</span>
						</div>
					</div>

					<!-- Info del Ahorro -->
					<div class="text-center md:text-left space-y-4 flex-1">
						<div>
							<p class="text-primary-content/80 text-lg">Tienes ahorrado</p>
							<p class="text-4xl md:text-5xl font-bold">
								{formatoPesos(estadoGlobal.ahorroTotal)}
							</p>
						</div>

						{#if mensajeMeta()}
							<div
								class="alert {mensajeMeta()?.tipo === 'pendiente'
									? 'alert-warning'
									: 'alert-success'} bg-white/20 border-0 text-primary-content"
							>
								<span class="text-lg">{mensajeMeta()?.texto}</span>
							</div>
						{:else}
							<button
								onclick={() => (mostrarConfigMeta = true)}
								class="btn btn-outline btn-primary-content"
							>
								Establecer una meta
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Tarjeta de Configuración Rápida -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h3 class="card-title text-lg">⚙️ Configuración</h3>
				<div class="space-y-4 mt-4">
					<div class="flex justify-between items-center">
						<span class="text-base-content/70">Tu meta:</span>
						<span class="font-bold text-lg">
							{estadoGlobal.meta > 0
								? formatoPesos(estadoGlobal.meta)
								: "Sin definir"}
						</span>
					</div>
					<button
						onclick={() => (mostrarConfigMeta = true)}
						class="btn btn-outline btn-primary w-full"
					>
						{estadoGlobal.meta > 0 ? "Cambiar meta" : "Definir meta"}
					</button>
				</div>

				{#if estadoGlobal.historial.length > 0}
					<div class="divider"></div>
					<div class="stats stats-vertical shadow">
						<div class="stat">
							<div class="stat-title">Transacciones</div>
							<div class="stat-value text-primary text-2xl">
								{estadoGlobal.historial.length}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Sección de Ahorrar (ocupa 1 columna) -->
		<div class="card bg-base-100 shadow-xl border-2 border-success/20">
			<div class="card-body">
				<Ahorrar />
			</div>
		</div>

		<!-- Sección de Retirar (ocupa 1 columna) -->
		<div class="card bg-base-100 shadow-xl border-2 border-error/20">
			<div class="card-body">
				<Retirar />
			</div>
		</div>

		<!-- Historial Reciente (ocupa 1 columna) -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h3 class="card-title text-lg mb-4">📋 Historial reciente</h3>
				<div class="space-y-2 max-h-64 overflow-y-auto">
					{#if estadoGlobal.historial.length === 0}
						<p class="text-center text-base-content/50 py-8">
							No hay movimientos aún
						</p>
					{:else}
						{#each estadoGlobal.historial.slice(-5).reverse() as movimiento}
							<div
								class="flex justify-between items-center p-3 rounded-lg {movimiento.tipo ===
								'ahorro'
									? 'bg-success/10'
									: 'bg-error/10'}"
							>
								<div class="flex items-center gap-2">
									<span class="text-xl"
										>{movimiento.tipo === "ahorro" ? "💰" : "💸"}</span
									>
									<div class="flex flex-col">
										<span class="font-medium"
											>{formatoPesos(movimiento.monto)}</span
										>
										<span class="text-xs text-base-content/50"
											>{new Date(movimiento.fecha).toLocaleDateString(
												"es-CO",
											)}</span
										>
									</div>
								</div>
								<span
									class="badge {movimiento.tipo === 'ahorro'
										? 'badge-success'
										: 'badge-error'} badge-sm"
								>
									{movimiento.tipo === "ahorro" ? "Ingreso" : "Retiro"}
								</span>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Modal de Configuración de Meta -->
{#if mostrarConfigMeta}
	<MetaConfig onclose={() => (mostrarConfigMeta = false)} />
{/if}
