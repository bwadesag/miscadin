import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  MessageSquare,
  Store,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Produits', icon: Package },
  { to: '/admin/categories', label: 'Catégories', icon: FolderOpen },
  { to: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
]

const AdminLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { user } = useAuthStore()

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 min-h-[44px] ${
      isActive
        ? 'bg-gold-600/15 text-gold-400 border border-gold-600/30'
        : 'text-gold-500 hover:text-gold-300 hover:bg-dark-100 border border-transparent'
    }`

  return (
    <div className="min-h-[calc(100vh-73px)] bg-black">
      {/* Mobile admin bar */}
      <div className="md:hidden border-b border-gold-600/20 bg-dark-50/80 backdrop-blur-sm sticky top-[73px] z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-gold-600 uppercase tracking-wider">Administration</p>
            <p className="text-sm font-semibold text-gold-300 truncate">{user?.name}</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-lg border border-gold-600/20 text-gold-400 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Menu administration"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileNavOpen && (
          <nav className="px-4 pb-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
                onClick={() => setMobileNavOpen(false)}
              >
                <item.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gold-500 hover:text-gold-300 hover:bg-dark-100 min-h-[44px] border border-transparent"
              onClick={() => setMobileNavOpen(false)}
            >
              <Store className="w-4 h-4" aria-hidden="true" />
              Retour à la boutique
            </Link>
          </nav>
        )}
      </div>

      <div className="flex">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex w-64 lg:w-72 shrink-0 flex-col border-r border-gold-600/20 bg-gradient-to-b from-dark-50/80 to-black min-h-[calc(100vh-73px)] sticky top-[73px] h-[calc(100vh-73px)]">
          <div className="p-6 border-b border-gold-600/10">
            <p className="text-xs font-semibold text-gold-600 uppercase tracking-widest mb-1">
              MISCADIN
            </p>
            <h2 className="text-lg font-bold text-gold-400">Panneau admin</h2>
            <p className="text-sm text-gold-600 mt-1 truncate">{user?.email}</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                <item.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gold-600/10">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gold-500 hover:text-gold-300 hover:bg-dark-100 transition-colors duration-200 min-h-[44px]"
            >
              <Store className="w-4 h-4" aria-hidden="true" />
              Voir la boutique
            </Link>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
