import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { formatPrice } from '../utils/currency'

const Checkout = () => {
  const { items, getTotal, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: address,
      }
      
      await api.post('/orders', orderData)
      
      clearCart()
      toast.success('Commande passée avec succès !')
      navigate('/')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erreur lors de la commande'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl mb-4">Votre panier est vide</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Continuer vos achats
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Finaliser la commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">Adresse de livraison</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Nom complet</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="input-field bg-dark-50"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field bg-dark-50"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Adresse</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                  className="input-field"
                  placeholder="123 Rue de la Mode"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Code postal</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    required
                    className="input-field"
                    placeholder="75001"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Ville</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                    className="input-field"
                    placeholder="Paris"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">Pays</label>
                <input
                  type="text"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Résumé</h2>
            <div className="space-y-2 mb-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm text-gold-200">
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gold-600/20 pt-4 space-y-2">
              <div className="flex justify-between text-gold-200">
                <span>Sous-total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between text-gold-200">
                <span>Livraison</span>
                <span>{getTotal() >= 30000 ? 'Gratuite' : formatPrice(3000)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gold-600/20 text-gold-400">
                <span>Total</span>
                <span>{formatPrice(getTotal() + (getTotal() >= 30000 ? 0 : 3000))}</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !address.street || !address.city || !address.postalCode}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              {loading ? 'Traitement...' : 'Confirmer la commande'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

