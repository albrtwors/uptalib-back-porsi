import { supabase } from "./supabase";





export async function deleteFile(supabasePath: string, bucket: string): Promise<void> {
    const bucketName = bucket; // ⚠️ Usa el mismo nombre de tu bucket

    // Supabase pide un array de strings con las rutas de los archivos a eliminar
    const { data, error } = await supabase.storage
        .from(bucketName)
        .remove([supabasePath]); // <-- Pasamos el path dentro de un Array

    if (error) {
        throw new Error(`Error al eliminar archivo de Supabase: ${error.message}`);
    }

    console.log(`Archivo eliminado con éxito de Supabase: ${supabasePath}`);
}