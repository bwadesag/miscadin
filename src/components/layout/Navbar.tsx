import { Link } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, Search, ChevronDown, LogOut, Store, Shield } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const { user, logout, isAdmin } = useAuthStore()
  const { getItemCount } = useCartStore()

  // Fermer le menu profil si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  return (
    <nav className="bg-black border-b border-gold-600/20 shadow-lg shadow-gold-600/10 sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gold-400 hover:text-gold-300 transition">
            MISCADIN
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-gold-200 hover:text-gold-400 font-medium transition">
              Accueil
            </Link>
            <Link to="/products" className="text-gold-200 hover:text-gold-400 font-medium transition">
              Vêtements
            </Link>
            <Link to="/products" className="text-gold-200 hover:text-gold-400 font-medium transition">
              Chaussures
            </Link>
            <Link to="/products" className="text-gold-200 hover:text-gold-400 font-medium transition">
              Accessoires
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-600 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="input-field w-full pl-10 pr-4 py-2 rounded-full"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingBag className="w-6 h-6 text-gold-200 hover:text-gold-400 transition" />
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-600 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getItemCount()}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative hidden md:block" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 text-gold-200 hover:text-gold-400 transition"
                >
                  <User className="w-6 h-6" />
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Menu déroulant profil */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-100 rounded-lg shadow-xl shadow-gold-600/20 border border-gold-600/30 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gold-600/20">
                      <p className="font-semibold text-sm text-gold-200">{user.name}</p>
                      <p className="text-xs text-gold-400">{user.email}</p>
                    </div>
                    <Link
                      to="/products"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gold-200 hover:bg-dark-200 transition"
                    >
                      <Store className="w-4 h-4" />
                      Boutique
                    </Link>
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gold-200 hover:bg-dark-200 transition"
                      >
                        <Shield className="w-4 h-4" />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        setIsProfileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-dark-200 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden md:block">
                <User className="w-6 h-6 text-gold-200 hover:text-gold-400 transition" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gold-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gold-600/20">
            <div className="flex flex-col gap-4 pt-4">
              <Link
                to="/"
                className="text-gold-200 hover:text-gold-400 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/products"
                className="text-gold-200 hover:text-gold-400 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Vêtements
              </Link>
              <Link
                to="/products"
                className="text-gold-200 hover:text-gold-400 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Chaussures
              </Link>
              <Link
                to="/products"
                className="text-gold-200 hover:text-gold-400 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Accessoires
              </Link>
              {user ? (
                <>
                  <Link
                    to="/products"
                    className="text-gold-200 hover:text-gold-400 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Boutique
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="text-gold-200 hover:text-gold-400 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="text-left text-gold-200 hover:text-gold-400 font-medium"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gold-200 hover:text-gold-400 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="text-gold-200 hover:text-gold-400 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

