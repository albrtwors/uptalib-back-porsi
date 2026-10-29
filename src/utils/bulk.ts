/**
 * Utilidades compartidas por los endpoints de operaciones masivas (lotes).
 */

/** Convierte cualquier excepción de Nest/class-validator en un mensaje legible. */
export function bulkErrorMessage(error: any): string {
    const message = error?.message ?? error?.response ?? 'Error desconocido';
    if (Array.isArray(message)) return message.join('. ');
    return `${message}`;
}

/** Redacta el resumen que muestran los buscadores tras ejecutar un lote. */
export function bulkSummaryMessage(parts: { created?: number; updated?: number; deleted?: number; failed?: number }): string {
    const summary: string[] = [];
    if (parts.created) summary.push(`${parts.created} creado(s)`);
    if (parts.updated) summary.push(`${parts.updated} actualizado(s)`);
    if (parts.deleted) summary.push(`${parts.deleted} eliminado(s)`);
    if (parts.failed) summary.push(`${parts.failed} con error`);
    return summary.length > 0 ? `Operación en lote: ${summary.join(', ')}` : 'No se procesó ningún registro';
}
