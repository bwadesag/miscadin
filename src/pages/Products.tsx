import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import { useCartStore } from '../store/cartStore'
import {
  ShoppingCart,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Tag,
  Package,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/currency'

const ProductCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="aspect-square bg-dark-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-dark-200 rounded w-3/4" />
      <div className="h-6 bg-dark-200 rounded w-1/2" />
      <div className="h-10 bg-dark-200 rounded" />
    </div>
  </div>
)

const Products = () => {
  const { products, categories, fetchProducts, fetchCategories, loading } = useProductStore()
  const { addItem } = useCartStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default')

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [fetchProducts, fetchCategories])

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || ''
    setSelectedCategory(categoryFromUrl)
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price)
    if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name))

    return result
  }, [products, selectedCategory, searchTerm, sortBy])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    if (categoryId) {
      setSearchParams({ category: categoryId })
    } else {
      setSearchParams({})
    }
  }

  const handleAddToCart = (product: (typeof products)[0]) => {
    if (product.stock === 0) return
    if (product.sizes.length > 0 && product.colors.length > 0) {
      addItem(product, product.sizes[0], product.colors[0], 1)
      toast.success('Produit ajouté au panier')
      return
    }
    toast.error('Sélectionnez une taille et une couleur sur la fiche produit')
  }

  const selectedCategoryName = categories.find((c) => c.id === selectedCategory)?.name

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="product-search" className="block text-sm font-semibold text-gold-400 mb-2">
          Rechercher
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-600" aria-hidden="true" />
          <input
            id="product-search"
            type="search"
            placeholder="Nom, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gold-400 mb-3">Catégories</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange('')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer ${
              !selectedCategory
                ? 'bg-gold-600 text-black'
                : 'bg-dark-200 text-gold-300 border border-gold-600/20 hover:border-gold-500/50'
            }`}
          >
            Toutes
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer ${
                selectedCategory === category.id
                  ? 'bg-gold-600 text-black'
                  : 'bg-dark-200 text-gold-300 border border-gold-600/20 hover:border-gold-500/50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="sort-products" className="block text-sm font-semibold text-gold-400 mb-2">
          Trier par
        </label>
        <select
          id="sort-products"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="input-field cursor-pointer"
        >
          <option value="default">Par défaut</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name">Nom A-Z</option>
        </select>
      </div>

      {(selectedCategory || searchTerm) && (
        <button
          type="button"
          onClick={() => {
            setSearchTerm('')
            handleCategoryChange('')
          }}
          className="btn-secondary w-full flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
          Réinitialiser les filtres
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="border-b border-gold-600/20 bg-gradient-to-r from-black via-dark-50 to-black">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <p className="text-gold-600 text-sm font-semibold uppercase tracking-widest mb-2">Collection</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gold-400 mb-3">Nos Produits</h1>
          <p className="text-gold-300 max-w-2xl">
            {selectedCategoryName
              ? `Explorez notre sélection ${selectedCategoryName.toLowerCase()}.`
              : 'Prêt-à-porter, chaussures et accessoires pour homme.'}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gold-500">
            <span className="inline-flex items-center gap-1.5">
              <Package className="w-4 h-4" aria-hidden="true" />
              {loading ? '...' : `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''}`}
            </span>
            {categories.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Tag className="w-4 h-4" aria-hidden="true" />
                {categories.length} catégories
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gold-400 mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
                Filtres
              </h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="lg:hidden mb-6">
              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="btn-secondary w-full flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                aria-expanded={showMobileFilters}
              >
                <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                Filtres et tri
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="card p-12 text-center">
                <Package className="w-12 h-12 text-gold-600 mx-auto mb-4" aria-hidden="true" />
                <h2 className="text-xl font-bold text-gold-400 mb-2">Aucun produit trouvé</h2>
                <p className="text-gold-500 mb-6">Essayez de modifier vos filtres ou votre recherche.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    handleCategoryChange('')
                  }}
                  className="btn-primary cursor-pointer"
                >
                  Voir tous les produits
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const discount =
                    product.originalPrice && product.originalPrice > product.price
                      ? Math.round((1 - product.price / product.originalPrice) * 100)
                      : null

                  return (
                    <article key={product.id} className="card group flex flex-col">
                      <Link to={`/products/${product.id}`} className="relative block">
                        <div className="aspect-[4/5] bg-dark-200 overflow-hidden">
                          <img
                            src={product.images[0] || 'https://via.placeholder.com/400'}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.featured && (
                            <span className="inline-flex items-center gap-1 bg-gold-600 text-black text-xs font-bold px-2.5 py-1 rounded-full">
                              <Sparkles className="w-3 h-3" aria-hidden="true" />
                              Vedette
                            </span>
                          )}
                          {discount && (
                            <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                              -{discount}%
                            </span>
                          )}
                        </div>
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="bg-dark-100 text-gold-300 px-4 py-2 rounded-lg font-semibold text-sm border border-gold-600/30">
                              Rupture de stock
                            </span>
                          </div>
                        )}
                      </Link>

                      <div className="p-5 flex flex-col flex-1">
                        <p className="text-xs text-gold-600 uppercase tracking-wide mb-1">
                          {categories.find((c) => c.id === product.categoryId)?.name || 'Collection'}
                        </p>
                        <Link to={`/products/${product.id}`}>
                          <h3 className="font-semibold text-lg text-gold-200 group-hover:text-gold-400 transition-colors duration-200 line-clamp-2 mb-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gold-500 line-clamp-2 mb-4 flex-1">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl font-bold text-gold-500">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gold-600 line-through text-sm">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="w-full btn-primary flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                          {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filtres produits"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 cursor-pointer"
            onClick={() => setShowMobileFilters(false)}
            aria-label="Fermer les filtres"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-dark-100 rounded-t-2xl border-t border-gold-600/20 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gold-400">Filtres</h2>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-lg hover:bg-dark-200 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-gold-400" />
              </button>
            </div>
            <FilterPanel />
            <button
              type="button"
              onClick={() => setShowMobileFilters(false)}
              className="btn-primary w-full mt-6 min-h-[44px] cursor-pointer"
            >
              Voir {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
