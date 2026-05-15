import { supabase } from "./supabase"

export async function uploadFile(file, bucket, newName, type = 'application/pdf') {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(newName, file.buffer, {
            cacheControl: '3600',
            upsert: true,
            contentType: type, // <-- ESTA LÍNEA ES LA CLAVE

        })

    if (error) {
        console.error('Error uploading:', error)
    } else {
        console.log('Upload successful:', data)
    }

    const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(newName);

    return publicUrlData.publicUrl; // Esto retorna la URL completa de Supabase
}