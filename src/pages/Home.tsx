import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Shirt, Footprints } from 'lucide-react'
import { useProductStore } from '../store/productStore'
import { useEffect } from 'react'
import { formatPrice } from '../utils/currency'

const Home = () => {
  const { products, fetchProducts, categories, fetchCategories, loading, error } = useProductStore()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const featuredProducts = products.filter(p => p.featured).slice(0, 4)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black via-dark-50 to-black text-gold-200 py-20 border-b border-gold-600/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gold-400">
              Style Moderne pour l'Homme Moderne
            </h1>
            <p className="text-xl mb-8 text-gold-300">
              Découvrez notre collection de prêt-à-porter, chaussures et accessoires
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 btn-primary"
            >
              Découvrir la collection
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gold-400">Nos Catégories</h2>
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-600/30 rounded-lg text-red-400 text-center">
              <p>Erreur: {error}</p>
              <p className="text-sm mt-2">Assurez-vous que le backend est démarré (python backend/run.py)</p>
            </div>
          )}
          {loading && categories.length === 0 && (
            <div className="text-center py-8 text-gold-400">
              <p>Chargement des catégories...</p>
            </div>
          )}
          {!loading && categories.length === 0 && !error && (
            <div className="text-center py-8 text-gold-400">
              <p>Aucune catégorie disponible</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="card group relative overflow-hidden"
              >
                <div className="aspect-square bg-gradient-to-br from-gold-900/30 to-gold-700/20 flex items-center justify-center overflow-hidden">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                      onError={(e) => {
                        // Fallback vers icône si l'image ne charge pas
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const fallback = target.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center ${category.image ? 'hidden' : ''}`}>
                    {category.slug === 'vetements' && <Shirt className="w-24 h-24 text-gold-500" />}
                    {category.slug === 'chaussures' && <Footprints className="w-24 h-24 text-gold-500" />}
                    {category.slug === 'accessoires' && <ShoppingBag className="w-24 h-24 text-gold-500" />}
                    {!['vetements', 'chaussures', 'accessoires'].includes(category.slug) && (
                      <ShoppingBag className="w-24 h-24 text-gold-500" />
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gold-200">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gold-400 mb-2">{category.description}</p>
                  )}
                  <p className="text-gold-500 group-hover:text-gold-400 transition">
                    Voir la collection →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-dark-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gold-400">Produits en Vedette</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="card group"
              >
                <div className="aspect-square bg-dark-200 overflow-hidden">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 text-gold-200">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gold-500">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-gold-600 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2"
            >
              Voir tous les produits
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black border-t border-gold-600/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-900/30 border border-gold-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gold-200">Livraison Gratuite</h3>
              <p className="text-gold-400">Dès 30 000 FCFA d'achat</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-900/30 border border-gold-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gold-200">Retours Gratuits</h3>
              <p className="text-gold-400">Sous 30 jours</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-900/30 border border-gold-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shirt className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gold-200">Qualité Premium</h3>
              <p className="text-gold-400">Produits sélectionnés</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

