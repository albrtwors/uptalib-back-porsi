import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rbjwiwprccycrkzzazmn.supabase.co';
const supabaseKey = 'sb_publishable_EBpubCNdomi4aMEW0FG1tQ_imBv3pa4';

export const supabase = createClient(supabaseUrl, supabaseKey);