import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import * as XLSX from 'xlsx'

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A'
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return String(dateStr)
  }
}

function escapeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""'
  const str = String(value)
  // If the cell contains comma, double quote, or newlines, quote it and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return `"${str}"`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = (searchParams.get('format') || 'xlsx').toLowerCase()

    // 1. Fetch real latest records from Supabase
    const { data, error } = await supabaseAdmin
      .from('project_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase export error:', error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    const records = data || []

    // 2. Format records with exact required column order:
    // Email Address | Phone Number | Project Title | Project Description | Submission Date
    const formattedRows = records.map((row: any) => ({
      'Email Address': row.email || '',
      'Phone Number': row.phone_number || '',
      'Project Title': row.project_title || '',
      'Project Description': row.project_description || '',
      'Submission Date': formatDate(row.created_at),
    }))

    // 3. Handle CSV Export
    if (format === 'csv') {
      const headers = ['Email Address', 'Phone Number', 'Project Title', 'Project Description', 'Submission Date']
      
      const csvLines: string[] = []
      csvLines.push(headers.map(escapeCsvCell).join(','))

      formattedRows.forEach((row) => {
        const line = [
          escapeCsvCell(row['Email Address']),
          escapeCsvCell(row['Phone Number']),
          escapeCsvCell(row['Project Title']),
          escapeCsvCell(row['Project Description']),
          escapeCsvCell(row['Submission Date']),
        ].join(',')
        csvLines.push(line)
      })

      // Add UTF-8 BOM for automatic Excel compatibility
      const csvContent = '\uFEFF' + csvLines.join('\r\n')
      const buffer = Buffer.from(csvContent, 'utf-8')

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="futurebuilds-project-requests.csv"',
          'Content-Length': String(buffer.length),
        },
      })
    }

    // 4. Handle Excel (.xlsx) Export
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(formattedRows, {
      header: ['Email Address', 'Phone Number', 'Project Title', 'Project Description', 'Submission Date'],
    })

    // Set responsive column widths
    worksheet['!cols'] = [
      { wch: 30 }, // Email Address
      { wch: 20 }, // Phone Number
      { wch: 32 }, // Project Title
      { wch: 55 }, // Project Description
      { wch: 24 }, // Submission Date
    ]

    // Create worksheet named "Project Requests"
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Project Requests')

    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="futurebuilds-project-requests.xlsx"',
        'Content-Length': String(excelBuffer.length),
      },
    })
  } catch (err: any) {
    console.error('Export error:', err)
    return NextResponse.json({ success: false, message: err?.message || 'Export error' }, { status: 500 })
  }
}
