import * as XLSX from 'xlsx'
import { ProjectRequest } from '@/lib/supabase'

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
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return `"${str}"`
}

export function formatExportRows(records: ProjectRequest[]) {
  return records.map((row) => ({
    'Email Address': row.email || '',
    'Phone Number': row.phone_number || '',
    'Project Title': row.project_title || '',
    'Project Description': row.project_description || '',
    'Submission Date': formatDate(row.created_at),
  }))
}

export function downloadCSV(records: ProjectRequest[]): { success: boolean; message?: string } {
  if (!records || records.length === 0) {
    return { success: false, message: 'No project request data is available to export.' }
  }

  try {
    const formatted = formatExportRows(records)
    const headers = ['Email Address', 'Phone Number', 'Project Title', 'Project Description', 'Submission Date']

    const csvLines: string[] = []
    csvLines.push(headers.map(escapeCsvCell).join(','))

    formatted.forEach((row) => {
      const line = [
        escapeCsvCell(row['Email Address']),
        escapeCsvCell(row['Phone Number']),
        escapeCsvCell(row['Project Title']),
        escapeCsvCell(row['Project Description']),
        escapeCsvCell(row['Submission Date']),
      ].join(',')
      csvLines.push(line)
    })

    // UTF-8 BOM + CRLF for perfect Excel rendering
    const csvContent = '\uFEFF' + csvLines.join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'futurebuilds-project-requests.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return { success: true }
  } catch (err: any) {
    console.error('CSV Export Error:', err)
    return { success: false, message: err?.message || 'Failed to generate CSV file.' }
  }
}

export function downloadXLSX(records: ProjectRequest[]): { success: boolean; message?: string } {
  if (!records || records.length === 0) {
    return { success: false, message: 'No project request data is available to export.' }
  }

  try {
    const formatted = formatExportRows(records)
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(formatted, {
      header: ['Email Address', 'Phone Number', 'Project Title', 'Project Description', 'Submission Date'],
    })

    worksheet['!cols'] = [
      { wch: 30 }, // Email Address
      { wch: 20 }, // Phone Number
      { wch: 34 }, // Project Title
      { wch: 60 }, // Project Description
      { wch: 24 }, // Submission Date
    ]

    // Worksheet named "Project Requests"
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Project Requests')

    // Write binary workbook
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'futurebuilds-project-requests.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return { success: true }
  } catch (err: any) {
    console.error('XLSX Export Error:', err)
    return { success: false, message: err?.message || 'Failed to generate Excel XLSX file.' }
  }
}
