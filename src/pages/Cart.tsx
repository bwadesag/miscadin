import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/currency'

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour passer commande')
      return
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-dark-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
          <Link to="/products" className="btn-primary inline-block">
            Continuer vos achats
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Mon Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="card p-4">
              <div className="flex gap-4">
                <img
                  src={item.product.images[0] || 'https://via.placeholder.com/150'}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.product.name}</h3>
                  <p className="text-sm text-dark-600 mb-2">
                    Taille: {item.size} | Couleur: {item.color}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )
                        }
                        className="w-8 h-8 border border-dark-300 rounded hover:bg-dark-100 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="w-8 h-8 border border-dark-300 rounded hover:bg-dark-100 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gold-200">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Résumé de la commande</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gold-200">
                <span>Sous-total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between text-gold-200">
                <span>Livraison</span>
                <span>{getTotal() >= 30000 ? 'Gratuite' : formatPrice(3000)}</span>
              </div>
              <div className="border-t border-gold-600/20 pt-2 flex justify-between font-bold text-lg text-gold-400">
                <span>Total</span>
                <span>{formatPrice(getTotal() + (getTotal() >= 30000 ? 0 : 3000))}</span>
              </div>
            </div>
            <Link
              to={isAuthenticated() ? '/checkout' : '/login'}
              onClick={handleCheckout}
              className="btn-primary w-full text-center block mb-4"
            >
              Passer la commande
            </Link>
            <Link to="/products" className="btn-secondary w-full text-center block">
              Continuer les achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

