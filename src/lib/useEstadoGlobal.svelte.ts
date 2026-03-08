import { getContext } from 'svelte';
import type { EstadoAlcancia } from './estadoGlobal.svelte';

export function useEstadoGlobal(): EstadoAlcancia
{
	return getContext<EstadoAlcancia>('estadoGlobal');
}