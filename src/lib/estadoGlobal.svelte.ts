// Estado global usando $state (runes de Svelte 5)

export type Movimiento = {
	tipo: 'ahorro' | 'retiro';
	monto: number;
	fecha: string;
	detalle?: string;
};

export type EstadoAlcancia = {
	nombre: string;
	ahorroTotal: number;
	meta: number;
	historial: Movimiento[];
	pasoActual: 'bienvenida' | 'dashboard';
};

// Estado inicial
const estadoInicial: EstadoAlcancia = {
	nombre: '',
	ahorroTotal: 0,
	meta: 0,
	historial: [],
	pasoActual: 'bienvenida'
};

// ✅ CORRECTO: $state como declaración de variable, no en return
export function crearEstadoGlobal()
{
	const estado = $state<EstadoAlcancia>({ ...estadoInicial });
	return estado;
}

// Función para cargar desde localStorage
export function cargarDesdeStorage(): Partial<EstadoAlcancia> | null
{
	if (typeof window === 'undefined') return null;
	const guardado = localStorage.getItem('alcanciaData');
	return guardado ? JSON.parse(guardado) : null;
}

// Función para guardar en localStorage
export function guardarEnStorage(estado: EstadoAlcancia)
{
	if (typeof window === 'undefined') return;
	localStorage.setItem('alcanciaData', JSON.stringify(estado));
}