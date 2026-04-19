import Image from 'next/image'

export const metadata = {
  title: 'Manual de Marca — Nido Centro de Terapias',
}

const colors = [
  { name: 'Sage 600', hex: '#8AAE9F', role: 'Primario', textLight: false },
  { name: 'Sage 500', hex: '#5EA697', role: 'Acento',   textLight: false },
  { name: 'Sage 700', hex: '#6B9488', role: 'Hover',    textLight: false },
  { name: 'Sage 900', hex: '#2F5F54', role: 'Sidebar',  textLight: true  },
  { name: 'Sage 100', hex: '#DEEEE8', role: 'Fondos suaves', textLight: false },
  { name: 'Crema',    hex: '#F5F2EC', role: 'Background',    textLight: false, border: true },
  { name: 'Purple 600', hex: '#9B7FC0', role: 'Acento UI', textLight: true },
  { name: 'Purple 100', hex: '#EBE0F5', role: 'Badge fondo', textLight: false },
  { name: 'Verde 600',  hex: '#7A9E77', role: 'Atendido',    textLight: true },
  { name: 'Negro',      hex: '#1C1C1C', role: 'Texto',       textLight: true },
]

const logoVariants = [
  { bg: '#8AAE9F', textColor: '#fff',     tagColor: 'rgba(255,255,255,0.75)', label: 'Primario (sage)' },
  { bg: '#2F5F54', textColor: '#fff',     tagColor: 'rgba(255,255,255,0.75)', label: 'Oscuro' },
  { bg: '#F5F2EC', textColor: '#2F5F54',  tagColor: '#6B7280',               label: 'Claro (crema)', border: true },
  { bg: '#1C1C1C', textColor: '#fff',     tagColor: 'rgba(255,255,255,0.6)', label: 'Negro' },
]

export default function BrandPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-14">

      {/* Header */}
      <section>
        <div
          className="rounded-2xl p-12 flex items-center justify-center gap-6"
          style={{ background: '#8AAE9F' }}
        >
          <Image src="/logo-bird.png" alt="Nido" width={120} height={120} className="object-contain" />
          <div className="flex flex-col leading-none">
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 64, letterSpacing: '0.03em', color: '#fff' }}>
              Nido
            </span>
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 18, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.8)', marginTop: 6 }}>
              Centro de terapias
            </span>
          </div>
        </div>
      </section>

      {/* Logo variants */}
      <section>
        <h2 className="text-2xl font-heading font-semibold mb-1">Logo</h2>
        <p className="text-sm text-gray-500 mb-6">El logo puede usarse sobre cualquiera de estos fondos. Siempre mantener el ícono del pájaro junto al wordmark.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {logoVariants.map((v) => (
            <div
              key={v.label}
              className="rounded-xl p-6 flex flex-col items-center gap-3"
              style={{ background: v.bg, border: v.border ? '1px solid #ddd' : undefined }}
            >
              <Image src="/logo-bird.png" alt="Nido" width={96} height={96} className="object-contain" />
              <div className="text-center leading-tight">
                <div style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 24, letterSpacing: '0.04em', color: v.textColor }}>
                  Nido
                </div>
                <div style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 10, letterSpacing: '0.12em', color: v.tagColor, marginTop: 3 }}>
                  Centro de terapias
                </div>
              </div>
              <span className="text-xs mt-1" style={{ color: v.tagColor }}>{v.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section>
        <h2 className="text-2xl font-heading font-semibold mb-1">Paleta de color</h2>
        <p className="text-sm text-gray-500 mb-6">Sage/teal es el color primario de la marca. Purple se reserva para elementos de estado en la UI.</p>
        <div className="flex flex-wrap gap-4">
          {colors.map((c) => (
            <div key={c.hex} className="flex flex-col gap-2 w-24">
              <div
                className="w-24 h-24 rounded-xl"
                style={{ background: c.hex, border: c.border ? '1px solid #ddd' : undefined }}
              />
              <div className="text-xs font-semibold text-gray-900">{c.name}</div>
              <div className="text-xs font-mono text-gray-500">{c.hex}</div>
              <div className="text-xs text-gray-400">{c.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-heading font-semibold mb-1">Tipografía</h2>
        <p className="text-sm text-gray-500 mb-8">Dos familias tipográficas complementarias: una serif elegante para títulos, una sans humanista para la interfaz.</p>
        <div className="space-y-8">
          <div className="flex gap-6 items-baseline">
            <div className="text-xs text-gray-400 w-40 shrink-0 leading-relaxed">
              Cormorant Garamond 700<br/>Títulos / Display
            </div>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 48, fontWeight: 700, lineHeight: 1.1 }}>
              Bienestar integral
            </div>
          </div>
          <div className="flex gap-6 items-baseline">
            <div className="text-xs text-gray-400 w-40 shrink-0 leading-relaxed">
              Cormorant Garamond 400i<br/>Subtítulos
            </div>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 28, fontStyle: 'italic', color: '#444' }}>
              Un espacio seguro para crecer
            </div>
          </div>
          <div className="flex gap-6 items-baseline">
            <div className="text-xs text-gray-400 w-40 shrink-0 leading-relaxed">
              DM Sans 500<br/>Labels / Navegación
            </div>
            <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 16, fontWeight: 500 }}>
              Panel Principal · Agenda · Pacientes
            </div>
          </div>
          <div className="flex gap-6 items-baseline">
            <div className="text-xs text-gray-400 w-40 shrink-0 leading-relaxed">
              DM Sans 400<br/>Cuerpo / UI
            </div>
            <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 15, color: '#6B7280', lineHeight: 1.6 }}>
              En Nido encontrás un espacio de escucha, cuidado y acompañamiento profesional para atravesar cada etapa de la vida.
            </div>
          </div>
        </div>
      </section>

      {/* Logo download */}
      <section>
        <h2 className="text-2xl font-heading font-semibold mb-4">Recursos</h2>
        <a
          href="/logo-bird.png"
          download
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 transition-colors"
        >
          Descargar logo (PNG transparente)
        </a>
      </section>

    </div>
  )
}
