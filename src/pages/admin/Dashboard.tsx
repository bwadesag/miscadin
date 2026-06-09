import { Link } from 'react-router-dom'
import {
  Package,
  FolderOpen,
  MessageSquare,
  AlertTriangle,
  ShoppingCart,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { useProductStore } from '../../store/productStore'
import { useState, useEffect } from 'react'
import api from '../../utils/api'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { formatPrice } from '../../utils/currency'

const AdminDashboard = () => {
  const { products, categories, fetchProducts, fetchCategories } = useProductStore()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStock: 0,
    totalMessages: 0,
    totalOrders: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [fetchProducts, fetchCategories])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, messagesRes] = await Promise.all([
          api.get('/orders').catch(() => ({ data: [] })),
          api.get('/messages').catch(() => ({ data: [] })),
        ])

        const orders = ordersRes.data || []
        const messages = messagesRes.data || []

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          lowStock: products.filter((p) => p.stock < 10).length,
          totalMessages: messages.length,
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: { status: string }) => o.status === 'pending').length,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    setStats((prev) => ({
      ...prev,
      totalProducts: products.length,
      totalCategories: categories.length,
      lowStock: products.filter((p) => p.stock < 10).length,
    }))

    fetchStats()
  }, [products, categories])

  const statCards = [
    {
      title: 'Produits',
      value: stats.totalProducts,
      icon: Package,
      link: '/admin/products',
      accent: 'from-gold-600/20 to-gold-800/5',
    },
    {
      title: 'Catégories',
      value: stats.totalCategories,
      icon: FolderOpen,
      link: '/admin/categories',
      accent: 'from-gold-500/15 to-transparent',
    },
    {
      title: 'Commandes',
      value: stats.totalOrders,
      icon: ShoppingCart,
      link: '/admin/orders',
      accent: 'from-gold-600/15 to-transparent',
      subtitle: stats.pendingOrders > 0 ? `${stats.pendingOrders} en attente` : undefined,
    },
    {
      title: 'Stock faible',
      value: stats.lowStock,
      icon: AlertTriangle,
      link: '/admin/products',
      accent: 'from-red-600/15 to-transparent',
      alert: stats.lowStock > 0,
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      link: '/admin/messages',
      accent: 'from-gold-500/10 to-transparent',
    },
  ]

  const quickActions = [
    { label: 'Ajouter un produit', to: '/admin/products?new=true', primary: true },
    { label: 'Ajouter une catégorie', to: '/admin/categories?new=true', primary: false },
    { label: 'Voir les commandes', to: '/admin/orders', primary: false },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de votre boutique MISCADIN."
      />

      <div className="px-4 md:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <Link
              key={stat.title}
              to={stat.link}
              className="card relative p-5 hover:border-gold-600/30 transition-all duration-200 group cursor-pointer overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-50 pointer-events-none`} />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gold-600 mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.alert ? 'text-red-400' : 'text-gold-400'}`}>
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-gold-500 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" aria-hidden="true" />
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className="p-2.5 rounded-xl bg-gold-600/10 border border-gold-600/20 group-hover:bg-gold-600/20 transition-colors">
                  <stat.icon className="w-5 h-5 text-gold-500" aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick actions */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gold-400 mb-5">Actions rapides</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl min-h-[44px] transition-colors duration-200 ${
                    action.primary
                      ? 'btn-primary'
                      : 'bg-dark-200/50 border border-gold-600/20 text-gold-300 hover:border-gold-500/40 hover:text-gold-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {action.primary && <Plus className="w-4 h-4" aria-hidden="true" />}
                    {action.label}
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-60" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent products */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gold-400">Produits récents</h2>
              <Link to="/admin/products" className="text-sm text-gold-600 hover:text-gold-400 transition-colors">
                Voir tout
              </Link>
            </div>
            <div className="space-y-2">
              {products.length === 0 ? (
                <p className="text-gold-600 text-sm py-4 text-center">Aucun produit pour le moment</p>
              ) : (
                products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-dark-200/40 border border-gold-600/10 hover:border-gold-600/25 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/40'}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-gold-600/10 shrink-0"
                      />
                      <span className="font-medium text-gold-200 truncate">{product.name}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gold-500">{formatPrice(product.price)}</p>
                      <p className={`text-xs ${product.stock < 10 ? 'text-red-400' : 'text-gold-600'}`}>
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
