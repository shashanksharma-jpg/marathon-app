import { createClient } from '@supabase/supabase-js'

// ─── Replace these with your real Supabase project values ─────────────────────
// Find them at: https://supabase.com/dashboard → your project → Settings → API
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Key used to store all app state in one Supabase row ──────────────────────
export const STATE_KEY = 'marathon-app-shashank'

// ─── Load state from Supabase ─────────────────────────────────────────────────
export async function loadState() {
  const { data, error } = await supabase
    .from('app_state')
    .select('value')
    .eq('key', STATE_KEY)
    .single()

  if (error || !data) return null
  try { return JSON.parse(data.value) } catch { return null }
}

// ─── Save state to Supabase (upsert = insert or update) ───────────────────────
export async function saveState(state) {
  const { error } = await supabase
    .from('app_state')
    .upsert({ key: STATE_KEY, value: JSON.stringify(state), updated_at: new Date().toISOString() })

  if (error) console.error('Supabase save error:', error)
  return !error
}
