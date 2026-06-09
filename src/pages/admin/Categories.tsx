import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Trash2, Folder, Edit } from 'lucide-react'
import { useProductStore } from '../../store/productStore'
import { Category } from '../../types'
import toast from 'react-hot-toast'

const AdminCategories = () => {
  const { categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory } = useProductStore()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
  })

  useEffect(() => {
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image || '',
      })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', slug: '', description: '', image: '' })
    }
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setFormData({ name: '', slug: '', description: '', image: '' })
  }
  
  // Ouvrir le modal si on arrive depuis le Dashboard
  useEffect(() => {
    if (searchParams.get('new') === 'true' && !isModalOpen) {
      handleOpenModal()
      setSearchParams({}) // Nettoyer l'URL
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])
  
  const handleOpenModalForNew = () => {
    handleOpenModal()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        image: formData.image || undefined,
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData)
        toast.success('Catégorie modifiée')
      } else {
        await addCategory(categoryData)
        toast.success('Catégorie ajoutée')
      }
      
      handleCloseModal()
      fetchCategories() // Rafraîchir la liste
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await deleteCategory(id)
        toast.success('Catégorie supprimée')
        fetchCategories() // Rafraîchir la liste
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la suppression')
      }
    }
  }

  if (loading && categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gold-400">Gestion des Catégories</h1>
        <button 
          onClick={handleOpenModalForNew}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter une catégorie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                      const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'block'
                    }}
                  />
                ) : null}
                <div className={`bg-gold-900/30 border border-gold-600/30 p-3 rounded-lg ${category.image ? 'hidden' : ''}`}>
                  <Folder className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gold-200">{category.name}</h3>
                  <p className="text-sm text-gold-400">{category.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="p-2 text-gold-500 hover:bg-gold-900/20 rounded transition"
                  title="Modifier la catégorie"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-red-400 hover:bg-red-900/20 rounded transition"
                  title="Supprimer la catégorie"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {category.description && (
              <p className="text-gold-400 text-sm mb-4">{category.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal()
            }
          }}
        >
          <div 
            className="bg-dark-100 border border-gold-600/30 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-gold-400">
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2 text-gold-200">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gold-200">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-généré si vide"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gold-200">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gold-200">Image (URL)</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/category-image.jpg"
                  className="input-field"
                />
                <p className="text-sm text-gold-400 mt-1">
                  Entrez l'URL de l'image de la catégorie
                </p>
                {(formData.image || editingCategory?.image) && (
                  <div className="mt-3">
                    <p className="text-sm text-gold-300 mb-2">Aperçu de l'image :</p>
                    <div className="flex gap-4">
                      {formData.image && (
                        <div>
                          <p className="text-xs text-gold-400 mb-1">Nouvelle image :</p>
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded border border-gold-600/30"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128'
                            }}
                          />
                        </div>
                      )}
                      {editingCategory?.image && editingCategory.image !== formData.image && (
                        <div>
                          <p className="text-xs text-gold-400 mb-1">Image actuelle :</p>
                          <img
                            src={editingCategory.image}
                            alt="Current"
                            className="w-32 h-32 object-cover rounded border border-gold-600/30 opacity-60"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingCategory ? 'Modifier' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
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

export default AdminCategories

