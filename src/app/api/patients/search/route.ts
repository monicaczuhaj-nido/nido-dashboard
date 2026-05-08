import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const q = new URL(req.url).searchParams.get('q') ?? ''

  let query = supabase
    .from('patients')
    .select('id, first_name, last_name, dni')
    .order('last_name')
    .limit(20)

  if (q.trim()) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,dni.ilike.%${q}%`
    )
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data ?? [])
}
