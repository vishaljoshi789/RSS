"use client"

import React, { useEffect, useRef, useState } from 'react'
import useAuth from '@/hooks/use-auth'

type OverlayField = {
  id: string
  label: string
  value: string
  top: number
  left: number
  fontSize?: number
  color?: string
  bold?: boolean
  removable?: boolean
  
  imageSrc?: string
  width?: number
  height?: number
}

export default function ImageOverlay() {
  const [imgUrl, setImgUrl] = useState<string>('/docs/icard.jpg')
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [fields, setFields] = useState<OverlayField[]>([])
  const { user } = useAuth()

  
  useEffect(() => {
  const isIcard = imgUrl.endsWith('icard.png') || imgUrl.includes('/icard.png') || imgUrl.endsWith('icard.jpg') || imgUrl.includes('/icard.jpg')
    setFields((prev) => {
      const hasName = prev.some((f) => f.id === 'name')
      if (isIcard) {
        if (hasName) return prev
        
        return [
          { id: 'name', label: 'Name', value: 'John Doe', top: 100, left: 60, fontSize: 18, color: '#000000', bold: true, removable: false },
          ...prev,
        ]
      } else {
        
        return prev.filter((f) => f.id !== 'name')
      }
    })
  }, [imgUrl])

  function updateField(id: string, patch: Partial<OverlayField>) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  function addField() {
    const id = `f_${Date.now()}`
    setFields((p) => [...p, { id, label: 'Label', value: 'Value', top: 60, left: 60, fontSize: 14, color: '#000', bold: false, removable: true }])
  }

  function addUserImageOverlay() {
    if (!user || !user.image) {
      alert('No user image found in auth. Make sure you are logged in and user.image is available.')
      return
    }
    const id = `img_${Date.now()}`
    setFields((p) => [
      ...p,
      {
        id,
        label: 'Avatar',
        value: '',
        top: 40,
        left: 40,
        removable: true,
        imageSrc: user.image,
        width: 120,
        height: 120,
      },
    ])
  }

  async function addQrOverlay(idValue?: string) {
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || (typeof window !== 'undefined' ? window.location.origin : '')
    const idStr = idValue || prompt('Enter id to include in QR (e.g. user id)') || ''
    if (!idStr) return
    const qrValue = `${baseUrl}/qrcode-verify/check/${idStr}`

    
    try {
      const qrcodeModule: any = await import('qrcode')
      const dataUrl = await qrcodeModule.toDataURL(qrValue, { margin: 1, scale: 8 })
      const id = `qr_${Date.now()}`
      setFields((p) => [
        ...p,
        { id, label: 'QR', value: '', top: 40, left: 200, removable: true, imageSrc: dataUrl, width: 180, height: 180 },
      ])
      return
    } catch (err) {
      
      const api = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrValue)}`
      const id = `qr_${Date.now()}`
      setFields((p) => [...p, { id, label: 'QR', value: '', top: 40, left: 200, removable: true, imageSrc: api, width: 180, height: 180 }])
      return
    }
  }

  function removeField(id: string) {
    setFields((p) => p.filter((f) => f.id !== id))
  }

  
  async function createMergedCanvas(): Promise<{ canvas: HTMLCanvasElement | null; hadImageErrors: boolean }> {
    const container = containerRef.current
    if (!container) return { canvas: null, hadImageErrors: false }
    const img = container.querySelector('img') as HTMLImageElement | null
    if (!img) return { canvas: null, hadImageErrors: false }

    
    const imgNaturalW = img.naturalWidth || img.width
    const imgNaturalH = img.naturalHeight || img.height

    const canvas = document.createElement('canvas')
    canvas.width = imgNaturalW
    canvas.height = imgNaturalH
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

  const imgRect = img.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  const scaleX = canvas.width / imgRect.width
  const scaleY = canvas.height / imgRect.height

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  
  const drawPromises: Promise<void>[] = []
  let hadImageErrors = false
  fields.forEach((f) => {
      
      const x = Math.round((f.left || 0) * scaleX)
      const y = Math.round((f.top || 0) * scaleY)
      if (f.imageSrc) {
        
        const w = Math.round((f.width || 100) * scaleX)
        const h = Math.round((f.height || 100) * scaleY)
        const p = new Promise<void>((resolve) => {
          const imgEl = new Image()
          imgEl.crossOrigin = 'anonymous'
          imgEl.onload = () => {
            try {
              ctx.drawImage(imgEl, x, y, w, h)
            } catch (e) {
              console.warn('Failed to draw overlay image', e)
              hadImageErrors = true
            }
            resolve()
          }
          imgEl.onerror = () => {
            console.warn('Failed to load overlay image', f.imageSrc)
            hadImageErrors = true
            resolve()
          }
          imgEl.src = f.imageSrc!
        })
        drawPromises.push(p)
      } else {
        const fontSize = (f.fontSize || 14) * ((scaleX + scaleY) / 2)
        ctx.font = `${f.bold ? 'bold ' : ''}${fontSize}px sans-serif`
        ctx.fillStyle = f.color || '#000'
        ctx.textBaseline = 'top'
        ctx.fillText(f.value || '', x, y)
      }
    })

    
    if (drawPromises.length) {
      await Promise.all(drawPromises)
    }

    return { canvas, hadImageErrors }
  }

  async function exportCanvasAsPNG() {
    const res = await createMergedCanvas()
    if (!res) return
    const { canvas, hadImageErrors } = res
    if (!canvas) return

    if (hadImageErrors) {
      
      alert('Some overlay images could not be embedded into the export due to cross-origin restrictions. Falling back to printable preview. Use the browser Print -> Save as PDF to capture the image as shown.')
      printDomPreview()
      return
    }

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'idcard.png'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    })
  }

  async function exportCanvasAsPDF() {
    const res = await createMergedCanvas()
    if (!res) return
    const { canvas, hadImageErrors } = res
    if (!canvas) return

    if (hadImageErrors) {
      alert('Some overlay images could not be embedded due to cross-origin restrictions. Opening printable preview instead.')
      printDomPreview()
      return
    }

    
    
    const dataUrl = canvas.toDataURL('image/png')
    const html = `<!doctype html><html><head><title>ID Card</title><style>html,body{margin:0;padding:0;height:100%}img{max-width:100%;height:auto;display:block;margin:0 auto}</style></head><body><img src="${dataUrl}"/></body></html>`
    const w = window.open('', '_blank')
    if (!w) {
      alert('Popup blocked. Please allow popups to export PDF.')
      return
    }
    w.document.write(html)
    w.document.close()
    
    setTimeout(() => {
      w.focus()
      w.print()
    }, 500)
  }

  async function exportTwoPagePDF() {
  
  const res = await createMergedCanvas()
  if (!res) return
  const { canvas, hadImageErrors } = res
  if (!canvas) return

    try {
  const resp = await fetch('/docs/image.jpg')
  if (!resp.ok) throw new Error('Failed to load /docs/image.jpg')
      const blob = await resp.blob()
      const reader = new FileReader()
      const imgDataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Failed to read image blob'))
        reader.readAsDataURL(blob)
      })

      if (hadImageErrors) {
        
        printDomPreview('/docs/image.jpg')
        return
      }

      let jsPDFModule: any
      try {
        jsPDFModule = await import('jspdf')
      } catch (err) {
        alert('jsPDF is not installed. Run `npm install jspdf` in the frontend folder and reload.')
        return
      }

      const { jsPDF } = jsPDFModule

      const w = canvas.width
      const h = canvas.height
      const pdf = new jsPDF({ unit: 'px', format: [w, h] })

      const page1DataUrl = canvas.toDataURL('image/png')
      pdf.addImage(page1DataUrl, 'PNG', 0, 0, w, h)

      
      pdf.addPage([w, h])
      
      pdf.addImage(imgDataUrl, 'PNG', 0, 0, w, h)

      pdf.save('idcard_two_page.pdf')
    } catch (err: any) {
      console.error(err)
      alert('Failed to create two-page PDF: ' + (err?.message || err))
    }
  }

  function printDomPreview(secondPageImage?: string) {
    const container = containerRef.current
    if (!container) {
      alert('Preview not available')
      return
    }

    const html = `<!doctype html><html><head><title>ID Card Preview</title><meta charset="utf-8"><style>
      html,body{margin:0;padding:0}
      .page{width:100%;height:100vh;display:block;position:relative}
      img.bg{max-width:100%;height:auto;display:block}
      .overlay{position:absolute}
      @media print { .page{page-break-after:always} }
    </style></head><body><div class="page">${container.innerHTML}</div>${secondPageImage ? `<div class="page"><img src="${secondPageImage}" style="max-width:100%;height:auto;display:block;margin:0 auto"/></div>` : ''}</body></html>`

    const w = window.open('', '_blank')
    if (!w) {
      alert('Popup blocked. Please allow popups to export PDF.')
      return
    }
    w.document.write(html)
    w.document.close()
    setTimeout(() => {
      w.focus()
      w.print()
    }, 500)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <select value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} className="border px-3 py-2 rounded">
          <option value="/docs/icard.jpg">/docs/icard.jpg</option>
          <option value="/docs/image.jpg">/docs/image.jpg</option>
        </select>
        <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={addField}>Add Field</button>
        <button className="bg-sky-600 text-white px-3 py-2 rounded" onClick={addUserImageOverlay}>Add my image</button>
        <button className="bg-indigo-600 text-white px-3 py-2 rounded" onClick={() => addQrOverlay(user?.id?.toString())}>Add QR</button>
        <button className="bg-gray-500 text-white px-3 py-2 rounded" onClick={() => window.open(imgUrl, '_blank')}>Open Image</button>
        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={() => exportCanvasAsPNG()}>Download PNG</button>
        <button className="bg-orange-600 text-white px-3 py-2 rounded" onClick={() => exportCanvasAsPDF()}>Export to PDF</button>
        <button className="bg-purple-700 text-white px-3 py-2 rounded" onClick={() => exportTwoPagePDF()}>Download 2-page PDF</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 space-y-3">
          {fields.map((f) => (
            <div key={f.id} className="border rounded p-2">
              <div className="flex items-center justify-between">
                <strong>{f.label}</strong>
                {f.removable ? (
                  <button className="text-red-600" onClick={() => removeField(f.id)}>Remove</button>
                ) : (
                  <span className="text-xs text-gray-400">fixed</span>
                )}
              </div>
              <div className="mt-2 space-y-1">
                <input className="w-full border px-2 py-1 rounded" value={f.label ?? ''} onChange={(e) => updateField(f.id, { label: e.target.value })} />
                <input className="w-full border px-2 py-1 rounded" value={f.value ?? ''} onChange={(e) => updateField(f.id, { value: e.target.value })} />
                <div className="flex items-center gap-2">
                  <label className="text-xs inline-flex items-center gap-1">
                    <input type="checkbox" checked={!!f.bold} onChange={(e) => updateField(f.id, { bold: e.target.checked })} />
                    <span>Bold</span>
                  </label>
                </div>
                <div className="flex gap-2 mt-1">
                  <label className="text-xs">Top</label>
                  <input type="number" className="w-20 border px-2 py-1 rounded" value={f.top ?? 0} onChange={(e) => updateField(f.id, { top: Number(e.target.value) })} />
                  <label className="text-xs">Left</label>
                  <input type="number" className="w-20 border px-2 py-1 rounded" value={f.left ?? 0} onChange={(e) => updateField(f.id, { left: Number(e.target.value) })} />
                </div>
                <div className="flex gap-2 mt-1">
                  <label className="text-xs">Size</label>
                  <input type="number" className="w-20 border px-2 py-1 rounded" value={f.fontSize ?? 14} onChange={(e) => updateField(f.id, { fontSize: Number(e.target.value) })} />
                  <label className="text-xs">Color</label>
                  <input type="color" className="w-12 h-8 p-0 border rounded" value={f.color ?? '#000000'} onChange={(e) => updateField(f.id, { color: e.target.value })} />
                </div>
                {f.imageSrc && (
                  <div className="flex gap-2 mt-1 items-center">
                    <label className="text-xs">Width</label>
                    <input type="number" className="w-24 border px-2 py-1 rounded" value={f.width ?? 100} onChange={(e) => updateField(f.id, { width: Number(e.target.value) })} />
                    <label className="text-xs">Height</label>
                    <input type="number" className="w-24 border px-2 py-1 rounded" value={f.height ?? 100} onChange={(e) => updateField(f.id, { height: Number(e.target.value) })} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-2">
          <div ref={containerRef} className="relative border rounded overflow-hidden" style={{ height: 720 }}>
            <img src={imgUrl} alt="preview" className="w-full h-full object-contain" />

            {(() => {
              
              const container = containerRef.current
              let offsetLeft = 0
              let offsetTop = 0
              if (container) {
                const imgEl = container.querySelector('img') as HTMLImageElement | null
                if (imgEl) {
                  const imgRect = imgEl.getBoundingClientRect()
                  const containerRect = container.getBoundingClientRect()
                  offsetLeft = imgRect.left - containerRect.left
                  offsetTop = imgRect.top - containerRect.top
                }
              }

              return fields.map((f) => {
                const renderTop = (f.top ?? 0) + offsetTop
                const renderLeft = (f.left ?? 0) + offsetLeft
                return (
                  <div key={f.id} style={{ position: 'absolute', top: renderTop, left: renderLeft, pointerEvents: 'none' }}>
                    {f.imageSrc ? (
                      <div
                        aria-label={f.label}
                        style={{
                          width: (f.width || 100),
                          height: (f.height || f.width || 100),
                          backgroundImage: `url(${f.imageSrc})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: f.fontSize, color: f.color, fontWeight: f.bold ? 700 : 400 }} className="bg-white/0 px-1">{f.value}</div>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
