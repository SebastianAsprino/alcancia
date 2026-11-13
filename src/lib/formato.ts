const pesos = new Intl.NumberFormat('es-CO', {
	style: 'currency',
	currency: 'COP',
	minimumFractionDigits: 0
});

/** Formatea un valor en pesos colombianos sin decimales (p. ej. "$ 50.000"). */
export function formatoPesos(valor: number): string
{
	return pesos.format(valor);
}

/**
 * Convierte lo que llega de un input (número, texto, vacío) a un entero.
 * Devuelve 0 si no es un número válido.
 */
export function aEntero(valor: unknown): number
{
	return Number.parseInt(String(valor ?? ''), 10) || 0;
}
