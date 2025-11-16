import { useState, useEffect } from 'react'
import { Package, Eye, CheckCircle, XCircle, Truck, Clock } from 'lucide-react'
import { Order } from '../../types'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import { formatPrice } from '../../utils/currency'

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/orders')
      setOrders(response.data)
    } catch (error: any) {
      toast.error('Erreur lors du chargement des commandes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus })
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
      toast.success('Statut de la commande mis à jour')
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour du statut')
      console.error(error)
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente'
      case 'processing':
        return 'En traitement'
      case 'shipped':
        return 'Expédiée'
      case 'delivered':
        return 'Livrée'
      case 'cancelled':
        return 'Annulée'
      default:
        return status
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'processing':
        return <Package className="w-4 h-4" />
      case 'shipped':
        return <Truck className="w-4 h-4" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'pending':
        return 'processing'
      case 'processing':
        return 'shipped'
      case 'shipped':
        return 'delivered'
      default:
        return null
    }
  }

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter)

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Chargement des commandes...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Gestion des commandes</h1>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === status
                ? 'bg-primary-600 text-white'
                : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
            }`}
          >
            {status === 'all' ? 'Toutes' : getStatusLabel(status)} ({statusCounts[status]})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="card p-8 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-dark-400" />
              <p className="text-xl text-dark-600">Aucune commande trouvée</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`card p-6 cursor-pointer transition ${
                  selectedOrder?.id === order.id
                    ? 'border-2 border-primary-600'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">Commande #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-dark-600 mb-2">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-lg font-semibold text-gold-500">
                      {formatPrice(order.total)}
                    </p>
                    <p className="text-sm text-dark-500 mt-2">
                      {order.items.length} article{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedOrder(order)
                    }}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Détails de la commande</h2>
              
              {/* Status */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Statut</label>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                {getNextStatus(selectedOrder.status) && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status)!)}
                    className="btn-primary w-full text-sm"
                  >
                    Passer à {getStatusLabel(getNextStatus(selectedOrder.status)!)}
                  </button>
                )}
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    className="btn-secondary w-full text-sm mt-2 bg-red-600 hover:bg-red-700"
                  >
                    Annuler la commande
                  </button>
                )}
              </div>

              {/* Items */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Articles</label>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-dark-50 rounded-lg">
                      <img
                        src={item.product.images[0] || 'https://via.placeholder.com/50'}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-dark-600">
                          Taille: {item.size} • Couleur: {item.color}
                        </p>
                        <p className="text-xs text-gold-400">
                          Quantité: {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mb-6 border-t border-gold-600/20 pt-4">
                <div className="flex justify-between font-bold text-lg text-gold-400">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Adresse de livraison</label>
                <div className="p-3 bg-dark-50 rounded-lg text-sm">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>
                    {selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block font-semibold mb-2">Date de commande</label>
                <p className="text-sm text-dark-600">
                  {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="card p-6 text-center">
              <Eye className="w-12 h-12 mx-auto mb-4 text-dark-400" />
              <p className="text-dark-600">Sélectionnez une commande pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminOrders

