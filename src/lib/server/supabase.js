import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

const supabaseUrl = env.SUPABASE_URL;
const supabaseSecretKey = env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
	throw new Error('Faltan las variables de Supabase del servidor');
}

export const supabaseServer = createClient(
	supabaseUrl,
	supabaseSecretKey,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
);
