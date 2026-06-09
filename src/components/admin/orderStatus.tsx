import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import { Order } from '../../types'

export const getStatusLabel = (status: Order['status']) => {
  const labels: Record<Order['status'], string> = {
    pending: 'En attente',
    processing: 'En traitement',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  }
  return labels[status] || status
}

export const getStatusStyles = (status: Order['status']) => {
  const styles: Record<Order['status'], string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    processing: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    delivered: 'bg-green-500/10 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
  }
  return styles[status] || 'bg-dark-200 text-gold-400 border-gold-600/20'
}

export const StatusIcon = ({ status }: { status: Order['status'] }) => {
  const iconClass = 'w-3.5 h-3.5'
  switch (status) {
    case 'pending':
      return <Clock className={iconClass} aria-hidden="true" />
    case 'processing':
      return <Package className={iconClass} aria-hidden="true" />
    case 'shipped':
      return <Truck className={iconClass} aria-hidden="true" />
    case 'delivered':
      return <CheckCircle className={iconClass} aria-hidden="true" />
    case 'cancelled':
      return <XCircle className={iconClass} aria-hidden="true" />
    default:
      return <Package className={iconClass} aria-hidden="true" />
  }
}

export const StatusBadge = ({ status }: { status: Order['status'] }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(status)}`}
  >
    <StatusIcon status={status} />
    {getStatusLabel(status)}
  </span>
)
