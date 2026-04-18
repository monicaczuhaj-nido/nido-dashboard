'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  DoorOpen,
  CalendarDays,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { logoutAction } from '@/app/(auth)/actions'
import { getInitials } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Panel Principal', icon: LayoutDashboard },
  { href: '/consultorios', label: 'Consultorios', icon: DoorOpen },
  { href: '/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/pacientes', label: 'Pacientes', icon: Users },
  { href: '/sesiones/nueva', label: 'Nueva sesión', icon: FileText },
]

interface SidebarProps {
  userFullName: string
  userRole: string
}

export default function Sidebar({ userFullName, userRole }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const close = () => setIsOpen(false)

  const navContent = (
    <>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-purple-300 hover:text-white hover:bg-[#3D2D5A]'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#3D2D5A]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {getInitials(userFullName)}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-medium truncate">{userFullName}</p>
            <p className="text-purple-300 text-xs capitalize">{userRole}</p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 text-purple-300 hover:text-white hover:bg-[#3D2D5A] rounded-lg text-sm transition-colors"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#2D1F4A] flex items-center gap-3 px-4 border-b border-[#3D2D5A]">
        <button
          onClick={() => setIsOpen(true)}
          className="text-indigo-300 hover:text-white transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
        <span className="text-white text-sm font-semibold">Centro de Psicología</span>
      </header>

      {/* Backdrop overlay (mobile only) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 min-h-screen bg-[#2D1F4A] flex flex-col
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo — hidden on mobile (shown in top bar instead), visible on desktop */}
        <div className="p-6 border-b border-[#3D2D5A] flex items-center justify-between">
          <h1 className="text-white font-semibold text-sm leading-tight">
            Centro de
            <br />
            Psicología
          </h1>
          {/* Close button inside sidebar (mobile only) */}
          <button
            onClick={close}
            className="md:hidden text-indigo-300 hover:text-white transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {navContent}
      </aside>
    </>
  )
}
