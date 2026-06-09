import { Link } from 'react-router-dom'
import { Package, Folder, MessageSquare, TrendingUp, ShoppingCart } from 'lucide-react'
import { useProductStore } from '../../store/productStore'
import { useState, useEffect } from 'react'
import api from '../../utils/api'

const AdminDashboard = () => {
  const { products, categories } = useProductStore()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStock: 0,
    totalMessages: 0,
    totalOrders: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, messagesRes] = await Promise.all([
          api.get('/orders').catch(() => ({ data: [] })),
          api.get('/messages').catch(() => ({ data: [] }))
        ])
        
        const orders = ordersRes.data || []
        const messages = messagesRes.data || []
        
        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          lowStock: products.filter((p) => p.stock < 10).length,
          totalMessages: messages.length,
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    setStats(prev => ({
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
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      title: 'Catégories',
      value: stats.totalCategories,
      icon: Folder,
      color: 'bg-green-500',
      link: '/admin/categories',
    },
    {
      title: 'Commandes',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      link: '/admin/orders',
      subtitle: stats.pendingOrders > 0 ? `${stats.pendingOrders} en attente` : undefined,
    },
    {
      title: 'Stock faible',
      value: stats.lowStock,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      link: '/admin/products?filter=low-stock',
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'bg-purple-500',
      link: '/admin/messages',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Tableau de bord Admin</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="card p-6 hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-sm text-dark-500 mt-1">{stat.subtitle}</p>
                )}
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products?new=true"
              className="block btn-primary text-center"
            >
              Ajouter un produit
            </Link>
            <Link
              to="/admin/categories?new=true"
              className="block btn-secondary text-center"
            >
              Ajouter une catégorie
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Produits récents</h2>
          <div className="space-y-2">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-dark-50 rounded-lg"
              >
                <span className="font-medium">{product.name}</span>
                <span className="text-sm text-dark-600">
                  Stock: {product.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

