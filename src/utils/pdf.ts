import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import logoUrl from '../assets/INKO_LOGO.png'
import type { User, Product } from '../types'
import { registerArialFont, ARIAL } from './arialFont'

const PAGE_W = 210
const PAGE_H = 297
const MARGIN_TOP = 25
const MARGIN_LR = 20
const MARGIN_BOTTOM = 20
const PX_TO_MM = 0.264583
const LOGO_W = 120 * PX_TO_MM
const LOGO_H = 40 * PX_TO_MM

function formatDate(date = new Date()): string {
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

function drawSeparator(doc: jsPDF, y: number): number {
    doc.setDrawColor(200, 200, 200)
    doc.line(MARGIN_LR, y, PAGE_W - MARGIN_LR, y)
    return y + 10
}

function drawHeader(doc: jsPDF, line1: string, line2: string): number {
    const y = MARGIN_TOP

    doc.addImage(logoUrl, 'PNG', MARGIN_LR, y, LOGO_W, LOGO_H)

    const rightX = PAGE_W - MARGIN_LR

    doc.setFont(ARIAL, 'bold')
    doc.setFontSize(18)
    doc.setTextColor(51, 51, 51)
    doc.text(line1, rightX, y + 8, { align: 'right' })
    doc.text(line2, rightX, y + 16, { align: 'right' })

    doc.setFont(ARIAL, 'normal')
    doc.setFontSize(10)
    doc.setTextColor(51, 51, 51)
    doc.text(`Fecha: ${formatDate()}`, rightX, y + 24, { align: 'right' })

    const logoBottom = y + LOGO_H
    const titleBottom = y + 28
    return Math.max(logoBottom, titleBottom) + 8
}

function drawPageFooter(doc: jsPDF): void {
    const footerY = PAGE_H - MARGIN_BOTTOM

    doc.setDrawColor(200, 200, 200)
    doc.line(MARGIN_LR, footerY - 8, PAGE_W - MARGIN_LR, footerY - 8)

    doc.setFont(ARIAL, 'normal')
    doc.setFontSize(9)
    doc.setTextColor(136, 136, 136)
    doc.text(`Generado el: ${formatDate()}`, PAGE_W / 2, footerY, { align: 'center' })
}

const tableStyles = {
    margin: { left: MARGIN_LR, right: MARGIN_LR, bottom: MARGIN_BOTTOM + 14 },
    styles: {
        font: ARIAL,
        fontSize: 10,
        textColor: [51, 51, 51] as [number, number, number],
        cellPadding: 3,
    },
    headStyles: {
        font: ARIAL,
        fillColor: [245, 245, 245] as [number, number, number],
        textColor: [85, 85, 85] as [number, number, number],
        fontStyle: 'bold' as const,
        fontSize: 11,
    },
    alternateRowStyles: { fillColor: [248, 248, 248] as [number, number, number] },
}

export async function generateUsersByCompanyPdf(
    company: string,
    users: User[]
): Promise<void> {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    await registerArialFont(doc)

    let y = drawHeader(doc, 'INFORME DE USUARIOS', 'POR EMPRESA')
    y = drawSeparator(doc, y)

    doc.setFont(ARIAL, 'normal')
    doc.setFontSize(11)
    doc.setTextColor(51, 51, 51)
    doc.text(`Empresa: ${company}`, MARGIN_LR, y)
    y += 7
    doc.text(`Total de usuarios: ${users.length}`, MARGIN_LR, y)
    y = drawSeparator(doc, y + 4)

    autoTable(doc, {
        startY: y,
        head: [['Nombre', 'Email', 'Teléfono']],
        body: users.map((u) => [`${u.firstName} ${u.lastName}`, u.email, u.phone]),
        ...tableStyles,
        didDrawPage: () => drawPageFooter(doc),
    })

    doc.save(`informe-usuarios-${company.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}

export async function generateProductsByCategoryPdf(
    category: string,
    products: Product[]
): Promise<void> {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    await registerArialFont(doc)

    let y = drawHeader(doc, 'INFORME DE PRODUCTOS', 'POR CATEGORÍA')
    y = drawSeparator(doc, y)

    doc.setFont(ARIAL, 'normal')
    doc.setFontSize(11)
    doc.setTextColor(51, 51, 51)
    doc.text(`Categoría: ${category}`, MARGIN_LR, y)
    y += 7
    doc.text(`Total de productos: ${products.length}`, MARGIN_LR, y)
    y = drawSeparator(doc, y + 4)

    autoTable(doc, {
        startY: y,
        head: [['Título', 'Precio', 'Stock', 'Categoría']],
        body: products.map((p) => [
            p.title,
            `$${p.price.toFixed(2)}`,
            String(p.stock),
            p.category,
        ]),
        ...tableStyles,
        didDrawPage: () => drawPageFooter(doc),
    })

    doc.save(`informe-productos-${category.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}
