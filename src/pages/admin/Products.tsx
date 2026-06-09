import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Plus,
  Edit,
  Trash2,
  X,
  Package,
  AlertTriangle,
  Star,
  Image as ImageIcon,
  Search,
  Loader2,
} from 'lucide-react'
import { useProductStore } from '../../store/productStore'
import { Product } from '../../types'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/currency'
import AdminPageHeader from '../../components/admin/AdminPageHeader'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  stock: '',
  categoryId: '',
  sizes: '',
  colors: '',
  featured: false,
  images: '',
}

const AdminProducts = () => {
  const {
    products,
    categories,
    loading,
    fetchProducts,
    fetchCategories,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [fetchProducts, fetchCategories])

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        stock: product.stock.toString(),
        categoryId: product.categoryId,
        sizes: product.sizes.join(', '),
        colors: product.colors.join(', '),
        featured: product.featured,
        images: product.images.join(', '),
      })
    } else {
      setEditingProduct(null)
      setFormData({
        ...emptyForm,
        categoryId: categories.length > 0 ? categories[0].id : '',
      })
    }
    setIsModalOpen(true)
  }

  useEffect(() => {
    if (searchParams.get('new') === 'true' && categories.length > 0 && !isModalOpen) {
      handleOpenModal()
      setSearchParams({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock, 10),
        categoryId: formData.categoryId,
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
        featured: formData.featured,
        images: formData.images
          ? formData.images.split(',').map((img) => img.trim()).filter(Boolean)
          : ['https://via.placeholder.com/400'],
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        toast.success('Produit mis à jour')
      } else {
        await addProduct(productData)
        toast.success('Produit ajouté')
      }

      setIsModalOpen(false)
      fetchProducts()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
    try {
      await deleteProduct(id)
      toast.success('Produit supprimé')
      fetchProducts()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      toast.error(message)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || product.categoryId === filterCategory
    return matchesSearch && matchesCategory
  })

  const lowStockCount = products.filter((p) => p.stock < 10).length
  const featuredCount = products.filter((p) => p.featured).length
  const imagePreviews = formData.images.split(',').map((img) => img.trim()).filter(Boolean)

  return (
    <div>
      <AdminPageHeader
        title="Produits"
        description="Ajoutez, modifiez et gérez votre catalogue."
        action={
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center justify-center gap-2 min-h-[44px] cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            Ajouter un produit
          </button>
        }
      />

      <div className="px-4 md:px-8 py-8">
      {loading && products.length === 0 ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-4" aria-hidden="true" />
          <p className="text-gold-400">Chargement des produits...</p>
        </div>
      ) : (
        <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gold-600/10 border border-gold-600/20">
            <Package className="w-6 h-6 text-gold-500" aria-hidden="true" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gold-400">{products.length}</p>
            <p className="text-sm text-gold-600">Produits total</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gold-600/10 border border-gold-600/20">
            <Star className="w-6 h-6 text-gold-500" aria-hidden="true" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gold-400">{featuredCount}</p>
            <p className="text-sm text-gold-600">En vedette</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-600/10 border border-red-600/20">
            <AlertTriangle className="w-6 h-6 text-red-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gold-400">{lowStockCount}</p>
            <p className="text-sm text-gold-600">Stock faible (&lt;10)</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-600" aria-hidden="true" />
          <input
            type="search"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
            aria-label="Rechercher un produit"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input-field sm:w-56 cursor-pointer"
          aria-label="Filtrer par catégorie"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product list */}
      {filteredProducts.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-gold-600 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-xl font-bold text-gold-400 mb-2">Aucun produit</h2>
          <p className="text-gold-500 mb-6">Commencez par ajouter votre premier produit au catalogue.</p>
          <button type="button" onClick={() => handleOpenModal()} className="btn-primary cursor-pointer">
            <Plus className="w-4 h-4 inline mr-2" aria-hidden="true" />
            Ajouter un produit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="card p-4 flex gap-4 hover:border-gold-600/30 transition-colors duration-200"
            >
              <img
                src={product.images[0] || 'https://via.placeholder.com/120'}
                alt={product.name}
                className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg border border-gold-600/10 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gold-200 truncate">{product.name}</h3>
                      {product.featured && (
                        <span className="text-xs bg-gold-600/20 text-gold-400 px-2 py-0.5 rounded-full border border-gold-600/30">
                          Vedette
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gold-600 line-clamp-2">{product.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm">
                  <span className="font-bold text-gold-500">{formatPrice(product.price)}</span>
                  <span className={product.stock < 10 ? 'text-red-400 font-semibold' : 'text-gold-600'}>
                    Stock: {product.stock}
                  </span>
                  <span className="text-gold-600">
                    {categories.find((c) => c.id === product.categoryId)?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(product)}
                    className="btn-secondary flex items-center gap-1.5 px-4 py-2 text-sm min-h-[44px] cursor-pointer"
                    aria-label={`Modifier ${product.name}`}
                  >
                    <Edit className="w-4 h-4" aria-hidden="true" />
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm min-h-[44px] rounded-lg border border-red-600/30 text-red-400 hover:bg-red-600/10 transition-colors duration-200 cursor-pointer"
                    aria-label={`Supprimer ${product.name}`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    Supprimer
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/80 cursor-pointer"
            onClick={() => !submitting && setIsModalOpen(false)}
            aria-label="Fermer la fenêtre"
          />
          <div className="relative bg-dark-100 border border-gold-600/20 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl shadow-gold-600/10">
            <div className="sticky top-0 bg-dark-100 border-b border-gold-600/20 px-6 py-4 flex items-center justify-between z-10">
              <h2 id="product-modal-title" className="text-xl font-bold text-gold-400">
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
              <button
                type="button"
                onClick={() => !submitting && setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-dark-200 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-gold-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Informations générales */}
              <section>
                <h3 className="text-sm font-semibold text-gold-600 uppercase tracking-wider mb-4">
                  Informations générales
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="product-name" className="block text-sm font-medium text-gold-300 mb-2">
                      Nom du produit
                    </label>
                    <input
                      id="product-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="input-field"
                      placeholder="Ex: Chemise Premium"
                    />
                  </div>
                  <div>
                    <label htmlFor="product-description" className="block text-sm font-medium text-gold-300 mb-2">
                      Description
                    </label>
                    <textarea
                      id="product-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      className="input-field resize-none"
                      rows={3}
                      placeholder="Décrivez le produit..."
                    />
                  </div>
                  <div>
                    <label htmlFor="product-category" className="block text-sm font-medium text-gold-300 mb-2">
                      Catégorie
                    </label>
                    <select
                      id="product-category"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      required
                      className="input-field cursor-pointer"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Prix & stock */}
              <section>
                <h3 className="text-sm font-semibold text-gold-600 uppercase tracking-wider mb-4">
                  Prix et stock
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="product-price" className="block text-sm font-medium text-gold-300 mb-2">
                      Prix (FCFA)
                    </label>
                    <input
                      id="product-price"
                      type="number"
                      step="1"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="product-original-price" className="block text-sm font-medium text-gold-300 mb-2">
                      Prix barré
                    </label>
                    <input
                      id="product-original-price"
                      type="number"
                      step="1"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="input-field"
                      placeholder="Optionnel"
                    />
                  </div>
                  <div>
                    <label htmlFor="product-stock" className="block text-sm font-medium text-gold-300 mb-2">
                      Stock
                    </label>
                    <input
                      id="product-stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>
                </div>
              </section>

              {/* Variantes */}
              <section>
                <h3 className="text-sm font-semibold text-gold-600 uppercase tracking-wider mb-4">
                  Variantes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="product-sizes" className="block text-sm font-medium text-gold-300 mb-2">
                      Tailles
                    </label>
                    <input
                      id="product-sizes"
                      type="text"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="S, M, L, XL"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="product-colors" className="block text-sm font-medium text-gold-300 mb-2">
                      Couleurs
                    </label>
                    <input
                      id="product-colors"
                      type="text"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      placeholder="Noir, Blanc, Bleu"
                      className="input-field"
                    />
                  </div>
                </div>
              </section>

              {/* Images */}
              <section>
                <h3 className="text-sm font-semibold text-gold-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" aria-hidden="true" />
                  Images
                </h3>
                <div>
                  <label htmlFor="product-images" className="block text-sm font-medium text-gold-300 mb-2">
                    URLs des images (séparées par des virgules)
                  </label>
                  <input
                    id="product-images"
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://example.com/image1.jpg, https://..."
                    className="input-field"
                  />
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 flex gap-3 flex-wrap">
                      {imagePreviews.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Aperçu ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gold-600/20"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Options */}
              <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-gold-600/30 accent-gold-600 cursor-pointer"
                />
                <span className="font-medium text-gold-300">Mettre en vedette sur la page d&apos;accueil</span>
              </label>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 border-t border-gold-600/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="btn-secondary flex-1 min-h-[44px] cursor-pointer disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 min-h-[44px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                  {editingProduct ? 'Mettre à jour' : 'Créer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
      </div>
    </div>
  )
}

export default AdminProducts
