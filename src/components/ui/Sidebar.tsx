'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  DoorOpen,
  CalendarDays,
  Users,
  FileText,
  LogOut,
} from 'lucide-react'
import { logoutAction } from '@/app/(auth)/actions'
import { getInitials } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
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

  return (
    <aside className="w-64 min-h-screen bg-gray-900 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-white font-semibold text-sm leading-tight">
          Centro de
          <br />
          Psicología
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {getInitials(userFullName)}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-medium truncate">{userFullName}</p>
            <p className="text-gray-500 text-xs capitalize">{userRole}</p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-sm transition-colors"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  )
}
