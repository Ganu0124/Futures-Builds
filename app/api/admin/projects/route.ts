import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET — list all project requests with search support
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    let query = supabaseAdmin
      .from('project_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (search.trim()) {
      const s = search.trim()
      query = query.or(
        `email.ilike.%${s}%,phone_number.ilike.%${s}%,project_title.ilike.%${s}%`
      )
    }

    const { data, error } = await query

    if (error) {
      console.error('Fetch projects error:', error)
      const isTableMissing =
        error.message?.includes('schema cache') ||
        error.message?.includes('does not exist') ||
        error.code === 'PGRST204' ||
        error.code === 'PGRST200' ||
        error.code === '42P01'

      return NextResponse.json(
        {
          success: false,
          message: error.message,
          code: error.code,
          tableNotFound: isTableMissing,
        },
        { status: isTableMissing ? 200 : 500 }
      )
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Server error' }, { status: 500 })
  }
}

// DELETE — remove project request by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing project ID' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('project_requests')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Project request deleted successfully.' })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Server error' }, { status: 500 })
  }
}
