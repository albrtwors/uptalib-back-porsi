"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = 'https://rbjwiwprccycrkzzazmn.supabase.co';
const supabaseKey = 'sb_publishable_EBpubCNdomi4aMEW0FG1tQ_imBv3pa4';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
//# sourceMappingURL=supabase.js.map