import type { jsPDF } from 'jspdf'

const FONT_NORMAL_FILE = 'Arial.ttf'
const FONT_BOLD_FILE = 'Arial-Bold.ttf'
const FONT_FAMILY = 'Arial'

let normalBase64: string | null = null
let boldBase64: string | null = null

function toBase64(buffer: ArrayBuffer): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

async function loadFontBase64(path: string): Promise<string> {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`No se pudo cargar la fuente: ${path}`)
  }
  return toBase64(await response.arrayBuffer())
}

export async function registerArialFont(doc: jsPDF): Promise<void> {
  if (!normalBase64 || !boldBase64) {
    ;[normalBase64, boldBase64] = await Promise.all([
      loadFontBase64(`${import.meta.env.BASE_URL}fonts/Arial.ttf`),
      loadFontBase64(`${import.meta.env.BASE_URL}fonts/Arial-Bold.ttf`),
    ])
  }

  doc.addFileToVFS(FONT_NORMAL_FILE, normalBase64)
  doc.addFont(FONT_NORMAL_FILE, FONT_FAMILY, 'normal')
  doc.addFileToVFS(FONT_BOLD_FILE, boldBase64)
  doc.addFont(FONT_BOLD_FILE, FONT_FAMILY, 'bold')
}

export const ARIAL = FONT_FAMILY
