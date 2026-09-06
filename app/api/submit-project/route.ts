import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string): boolean {
  return /^[\+]?[\d\s\-\(\)]{7,20}$/.test(phone)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone_number, project_title, project_description } = body

    // Server-side validation
    const errors: Record<string, string> = {}

    if (!email || !validateEmail(String(email).trim())) {
      errors.email = 'Please enter a valid email address.'
    }
    if (!phone_number || !validatePhone(String(phone_number).trim())) {
      errors.phone_number = 'Please enter a valid phone number.'
    }
    if (!project_title || String(project_title).trim().length < 3) {
      errors.project_title = 'Project title must be at least 3 characters.'
    }
    if (!project_description || String(project_description).trim().length < 10) {
      errors.project_description = 'Project description must be at least 10 characters.'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const payload = {
      email: String(email).trim().toLowerCase(),
      phone_number: String(phone_number).trim(),
      project_title: String(project_title).trim(),
      project_description: String(project_description).trim(),
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin
      .from('project_requests')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Failed to save project request to Supabase.',
          details: error,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Your project request has been submitted successfully. The FutureBuilds team will review your details.',
      data,
    })
  } catch (err: any) {
    console.error('Submit project error:', err)
    return NextResponse.json(
      {
        success: false,
        message: err?.message || 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    )
  }
}
