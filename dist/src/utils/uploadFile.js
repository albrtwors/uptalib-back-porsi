"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = uploadFile;
const supabase_1 = require("./supabase");
async function uploadFile(file, bucket, newName, type = 'application/pdf') {
    const { data, error } = await supabase_1.supabase.storage
        .from(bucket)
        .upload(newName, file.buffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: type,
    });
    if (error) {
        console.error('Error uploading:', error);
    }
    else {
        console.log('Upload successful:', data);
    }
    const { data: publicUrlData } = supabase_1.supabase.storage
        .from(bucket)
        .getPublicUrl(newName);
    return publicUrlData.publicUrl;
}
//# sourceMappingURL=uploadFile.js.map