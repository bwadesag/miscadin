import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { useProductStore } from '../store/productStore'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/currency'

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getProductById, fetchProducts, products } = useProductStore()
  const { addItem } = useCartStore()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)

  let product = id ? getProductById(id) : undefined

  useEffect(() => {
    // Charger les produits si la liste est vide ou si le produit n'est pas trouvé
    if (products.length === 0 || !product) {
      fetchProducts().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Re-vérifier le produit après le chargement
  product = id ? getProductById(id) : undefined

  useEffect(() => {
    if (product) {
      if (product.sizes.length > 0) setSelectedSize(product.sizes[0])
      if (product.colors.length > 0) setSelectedColor(product.colors[0])
    }
  }, [product])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Chargement...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Produit non trouvé</p>
        <button onClick={() => navigate('/products')} className="btn-primary mt-4">
          Retour aux produits
        </button>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Veuillez sélectionner une taille et une couleur')
      return
    }
    addItem(product, selectedSize, selectedColor, quantity)
    toast.success('Produit ajouté au panier')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-dark-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square bg-dark-100 rounded-lg overflow-hidden mb-4">
            <img
              src={product.images[selectedImage] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image || 'https://via.placeholder.com/150'}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-gold-500">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gold-600 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-dark-600 mb-6">{product.description}</p>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block font-semibold mb-2">Taille</label>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded-lg transition ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-dark-300 hover:border-primary-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block font-semibold mb-2">Couleur</label>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded-lg transition ${
                      selectedColor === color
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-dark-300 hover:border-primary-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Quantité</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-dark-300 rounded-lg hover:bg-dark-100"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border border-dark-300 rounded-lg hover:bg-dark-100"
              >
                +
              </button>
              <span className="text-dark-600">({product.stock} en stock)</span>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || !selectedSize || !selectedColor}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            <ShoppingCart className="w-5 h-5" />
            Ajouter au panier
          </button>

          <div className="border-t border-dark-200 pt-6">
            <h3 className="font-semibold mb-2">Informations produit</h3>
            <ul className="space-y-2 text-dark-600">
              <li>Stock disponible: {product.stock} unités</li>
              <li>Catégorie: {product.category?.name || 'Non définie'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

