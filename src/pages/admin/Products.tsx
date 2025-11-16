import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useProductStore } from '../../store/productStore'
import { Product } from '../../types'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/currency'

const AdminProducts = () => {
  const { products, categories, loading, fetchProducts, fetchCategories, addProduct, updateProduct, deleteProduct } = useProductStore()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
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
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
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
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        stock: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        sizes: '',
        colors: '',
        featured: false,
        images: '',
      })
    }
    setIsModalOpen(true)
  }
  
  // Ouvrir le modal si on arrive depuis le Dashboard
  useEffect(() => {
    if (searchParams.get('new') === 'true' && categories.length > 0 && !isModalOpen) {
      handleOpenModal()
      setSearchParams({}) // Nettoyer l'URL
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId,
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(s => s),
        colors: formData.colors.split(',').map((c) => c.trim()).filter(c => c),
        featured: formData.featured,
        images: formData.images 
          ? formData.images.split(',').map((img) => img.trim()).filter(img => img)
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
      fetchProducts() // Rafraîchir la liste
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(id)
        toast.success('Produit supprimé')
        fetchProducts() // Rafraîchir la liste
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la suppression')
      }
    }
  }

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Gestion des Produits</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter un produit
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-100">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Produit</th>
              <th className="px-6 py-4 text-left font-semibold">Prix</th>
              <th className="px-6 py-4 text-left font-semibold">Stock</th>
              <th className="px-6 py-4 text-left font-semibold">Catégorie</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-dark-200">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/50'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-dark-600">{product.description.substring(0, 50)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gold-200">{formatPrice(product.price)}</td>
                <td className="px-6 py-4">
                  <span className={product.stock < 10 ? 'text-red-600 font-semibold' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {categories.find((c) => c.id === product.categoryId)?.name || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false)
            }
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="input-field"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Prix (FCFA)</label>
                  <input
                    type="number"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Prix original (FCFA)</label>
                  <input
                    type="number"
                    step="1"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Catégorie</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                    className="input-field"
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">Tailles (séparées par des virgules)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="S, M, L, XL"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Couleurs (séparées par des virgules)</label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  placeholder="Blanc, Noir, Bleu"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Images (URLs séparées par des virgules)</label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  className="input-field"
                />
                <p className="text-sm text-dark-600 mt-1">
                  Entrez une ou plusieurs URLs d'images séparées par des virgules
                </p>
                {formData.images && formData.images.split(',').filter(img => img.trim()).length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {formData.images.split(',').filter(img => img.trim()).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.trim()}
                        alt={`Preview ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded border border-dark-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="font-semibold">Produit en vedette</label>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Mettre à jour' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts

