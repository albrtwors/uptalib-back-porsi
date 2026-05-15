"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = deleteFile;
const supabase_1 = require("./supabase");
async function deleteFile(supabasePath, bucket) {
    const bucketName = bucket;
    const { data, error } = await supabase_1.supabase.storage
        .from(bucketName)
        .remove([supabasePath]);
    if (error) {
        throw new Error(`Error al eliminar archivo de Supabase: ${error.message}`);
    }
    console.log(`Archivo eliminado con éxito de Supabase: ${supabasePath}`);
}
//# sourceMappingURL=deleteFile.js.map