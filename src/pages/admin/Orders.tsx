import { useState, useEffect } from 'react'
import { Package, Eye, Loader2 } from 'lucide-react'
import { Order } from '../../types'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import { formatPrice } from '../../utils/currency'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { StatusBadge, getStatusLabel } from '../../components/admin/orderStatus'

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
    } catch (error) {
      toast.error('Erreur lors du chargement des commandes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus })
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
      toast.success('Statut mis à jour')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
      console.error(error)
    }
  }

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const flow: Partial<Record<Order['status'], Order['status']>> = {
      pending: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
    }
    return flow[currentStatus] || null
  }

  const filteredOrders =
    statusFilter === 'all' ? orders : orders.filter((order) => order.status === statusFilter)

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  }

  const filters = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const

  return (
    <div>
      <AdminPageHeader
        title="Commandes"
        description="Suivez et gérez les commandes clients."
      />

      <div className="px-4 md:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer ${
                statusFilter === status
                  ? 'bg-gold-600 text-black'
                  : 'bg-dark-200 text-gold-400 border border-gold-600/20 hover:border-gold-500/40'
              }`}
            >
              {status === 'all' ? 'Toutes' : getStatusLabel(status)} ({statusCounts[status]})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-4" aria-hidden="true" />
            <p className="text-gold-400">Chargement des commandes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="card p-12 text-center">
                  <Package className="w-12 h-12 text-gold-600 mx-auto mb-4" aria-hidden="true" />
                  <p className="text-gold-400">Aucune commande trouvée</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className={`card p-5 w-full text-left transition-all duration-200 cursor-pointer ${
                      selectedOrder?.id === order.id
                        ? 'border-gold-600/50 ring-1 ring-gold-600/30'
                        : 'hover:border-gold-600/25'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-bold text-gold-200">#{order.id}</h3>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-gold-600">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-lg font-bold text-gold-500 mt-2">{formatPrice(order.total)}</p>
                        <p className="text-xs text-gold-600 mt-1">
                          {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <Eye className="w-5 h-5 text-gold-600 shrink-0" aria-hidden="true" />
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="lg:col-span-1">
              {selectedOrder ? (
                <div className="card p-6 sticky top-28 space-y-6">
                  <h2 className="text-lg font-bold text-gold-400">Détails</h2>

                  <div>
                    <p className="text-xs text-gold-600 uppercase tracking-wider mb-2">Statut</p>
                    <StatusBadge status={selectedOrder.status} />
                    <div className="mt-4 space-y-2">
                      {getNextStatus(selectedOrder.status) && (
                        <button
                          type="button"
                          onClick={() =>
                            updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status)!)
                          }
                          className="btn-primary w-full text-sm min-h-[44px] cursor-pointer"
                        >
                          Passer à {getStatusLabel(getNextStatus(selectedOrder.status)!)}
                        </button>
                      )}
                      {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                          className="w-full text-sm min-h-[44px] rounded-lg border border-red-600/30 text-red-400 hover:bg-red-600/10 transition-colors cursor-pointer"
                        >
                          Annuler la commande
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gold-600 uppercase tracking-wider mb-3">Articles</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-xl bg-dark-200/50 border border-gold-600/10"
                        >
                          <img
                            src={item.product.images[0] || 'https://via.placeholder.com/48'}
                            alt=""
                            className="w-12 h-12 object-cover rounded-lg shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-gold-200 truncate">{item.product.name}</p>
                            <p className="text-xs text-gold-600">
                              {item.size} · {item.color} · ×{item.quantity}
                            </p>
                            <p className="text-xs text-gold-500 mt-1">{formatPrice(item.product.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gold-600/20 pt-4 flex justify-between font-bold text-gold-400">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>

                  <div>
                    <p className="text-xs text-gold-600 uppercase tracking-wider mb-2">Livraison</p>
                    <div className="p-3 rounded-xl bg-dark-200/50 border border-gold-600/10 text-sm text-gold-400">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>
                        {selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}
                      </p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card p-8 text-center sticky top-28">
                  <Eye className="w-10 h-10 text-gold-600 mx-auto mb-3" aria-hidden="true" />
                  <p className="text-gold-500 text-sm">Sélectionnez une commande</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
