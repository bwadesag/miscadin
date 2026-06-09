import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Trash2, FolderOpen, Edit, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { useProductStore } from '../../store/productStore'
import { Category } from '../../types'
import toast from 'react-hot-toast'
import AdminPageHeader from '../../components/admin/AdminPageHeader'

const emptyForm = { name: '', slug: '', description: '', image: '' }

const AdminCategories = () => {
  const { categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory } =
    useProductStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

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
      setFormData(emptyForm)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setFormData(emptyForm)
  }

  useEffect(() => {
    if (searchParams.get('new') === 'true' && !isModalOpen) {
      handleOpenModal()
      setSearchParams({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
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
      fetchCategories()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return
    try {
      await deleteCategory(id)
      toast.success('Catégorie supprimée')
      fetchCategories()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      toast.error(message)
    }
  }

  if (loading && categories.length === 0) {
    return (
      <div className="py-16 text-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-4" aria-hidden="true" />
        <p className="text-gold-400">Chargement des catégories...</p>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Catégories"
        description="Organisez votre catalogue par familles de produits."
        action={
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2 min-h-[44px] cursor-pointer"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            Ajouter une catégorie
          </button>
        }
      />

      <div className="px-4 md:px-8 py-8">
        {categories.length === 0 ? (
          <div className="card p-12 text-center">
            <FolderOpen className="w-12 h-12 text-gold-600 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-bold text-gold-400 mb-2">Aucune catégorie</h2>
            <p className="text-gold-500 mb-6">Créez votre première catégorie pour structurer le catalogue.</p>
            <button type="button" onClick={() => handleOpenModal()} className="btn-primary cursor-pointer">
              Ajouter une catégorie
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {categories.map((category) => (
              <article
                key={category.id}
                className="card overflow-hidden hover:border-gold-600/30 transition-colors duration-200"
              >
                <div className="aspect-[16/9] bg-dark-200 relative overflow-hidden">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover opacity-90"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-900/20 to-dark-200">
                      <FolderOpen className="w-10 h-10 text-gold-600" aria-hidden="true" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-lg text-gold-200">{category.name}</h3>
                    <p className="text-xs text-gold-500 font-mono">{category.slug}</p>
                  </div>
                </div>
                <div className="p-4">
                  {category.description && (
                    <p className="text-sm text-gold-500 line-clamp-2 mb-4">{category.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(category)}
                      className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-sm min-h-[44px] cursor-pointer"
                      aria-label={`Modifier ${category.name}`}
                    >
                      <Edit className="w-4 h-4" aria-hidden="true" />
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category.id)}
                      className="px-4 py-2 rounded-lg border border-red-600/30 text-red-400 hover:bg-red-600/10 min-h-[44px] cursor-pointer"
                      aria-label={`Supprimer ${category.name}`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/80 cursor-pointer"
            onClick={() => !submitting && handleCloseModal()}
            aria-label="Fermer"
          />
          <div className="relative bg-dark-100 border border-gold-600/20 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-dark-100 border-b border-gold-600/20 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gold-400">
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button
                type="button"
                onClick={() => !submitting && handleCloseModal()}
                className="p-2 rounded-lg hover:bg-dark-200 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-gold-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="cat-name" className="block text-sm font-medium text-gold-300 mb-2">Nom</label>
                <input
                  id="cat-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="cat-slug" className="block text-sm font-medium text-gold-300 mb-2">Slug</label>
                <input
                  id="cat-slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-généré si vide"
                  className="input-field font-mono text-sm"
                />
              </div>
              <div>
                <label htmlFor="cat-desc" className="block text-sm font-medium text-gold-300 mb-2">Description</label>
                <textarea
                  id="cat-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="cat-image" className="block text-sm font-medium text-gold-300 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" aria-hidden="true" />
                  Image (URL)
                </label>
                <input
                  id="cat-image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="input-field"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Aperçu"
                    className="mt-3 w-full h-32 object-cover rounded-lg border border-gold-600/20"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/320x128'
                    }}
                  />
                )}
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button type="button" onClick={handleCloseModal} disabled={submitting} className="btn-secondary flex-1 min-h-[44px] cursor-pointer">
                  Annuler
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 min-h-[44px] flex items-center justify-center gap-2 cursor-pointer">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                  {editingCategory ? 'Mettre à jour' : 'Créer'}
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
