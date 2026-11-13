import { getContext, setContext } from 'svelte';
import type { EstadoAlcancia } from './estadoGlobal.svelte';

const CONTEXT_KEY = 'estadoGlobal';

/** Publica el estado global para los componentes hijos (se llama una vez, en el layout). */
export function proveerEstadoGlobal(estado: EstadoAlcancia): void
{
	setContext(CONTEXT_KEY, estado);
}

export function useEstadoGlobal(): EstadoAlcancia
{
	return getContext<EstadoAlcancia>(CONTEXT_KEY);
}
