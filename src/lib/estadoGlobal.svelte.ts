// Estado global de la alcancía con runes de Svelte 5, persistido en localStorage.

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

const STORAGE_KEY = 'alcanciaData';

/** Estado vacío. Es una función para que cada llamada tenga su propio `historial`. */
export function crearEstadoInicial(): EstadoAlcancia
{
	return {
		nombre: '',
		ahorroTotal: 0,
		meta: 0,
		historial: [],
		pasoActual: 'bienvenida'
	};
}

// $state tiene que ir en una declaración de variable, no directamente en el return.
export function crearEstadoGlobal(): EstadoAlcancia
{
	const estado = $state<EstadoAlcancia>(crearEstadoInicial());
	return estado;
}

/** Lee el estado guardado. Devuelve null en el servidor, si no hay nada o si el dato está corrupto. */
export function cargarDesdeStorage(): Partial<EstadoAlcancia> | null
{
	if (typeof window === 'undefined') return null;
	try
	{
		const guardado = localStorage.getItem(STORAGE_KEY);
		if (!guardado) return null;
		const datos: unknown = JSON.parse(guardado);
		return datos && typeof datos === 'object' ? (datos as Partial<EstadoAlcancia>) : null;
	}
	catch (err)
	{
		console.error('No se pudo leer el estado guardado:', err);
		return null;
	}
}

/** Guarda el estado completo (JSON.stringify lo recorre entero, incluido el historial). */
export function guardarEnStorage(estado: EstadoAlcancia): void
{
	if (typeof window === 'undefined') return;
	try
	{
		localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
	}
	catch (err)
	{
		// almacenamiento lleno o bloqueado (modo privado): la app sigue funcionando en memoria
		console.error('No se pudo guardar el estado:', err);
	}
}
