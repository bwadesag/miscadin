import { useState, useEffect } from 'react'
import { MessageSquare, Send, User, Loader2 } from 'lucide-react'
import { Message } from '../../types'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import AdminPageHeader from '../../components/admin/AdminPageHeader'

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const res = await api.get('/messages')
      setMessages(res.data)
    } catch (error) {
      toast.error('Erreur lors du chargement des messages')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendResponse = async (messageId: string) => {
    if (!response.trim()) {
      toast.error('Veuillez entrer une réponse')
      return
    }

    setSending(true)
    try {
      await api.put(`/messages/${messageId}/response`, { response })
      setMessages(
        messages.map((msg) =>
          msg.id === messageId ? { ...msg, adminResponse: response, read: true } : msg
        )
      )
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, adminResponse: response, read: true })
      }
      setResponse('')
      toast.success('Réponse envoyée')
    } catch (error) {
      toast.error("Erreur lors de l'envoi")
      console.error(error)
    } finally {
      setSending(false)
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div>
      <AdminPageHeader
        title="Messages clients"
        description="Répondez aux demandes et questions de vos clients."
        action={
          unreadCount > 0 ? (
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-600/15 text-red-400 border border-red-600/30 text-sm font-semibold">
              {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            </span>
          ) : undefined
        }
      />

      <div className="px-4 md:px-8 py-8">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-4" aria-hidden="true" />
            <p className="text-gold-400">Chargement des messages...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <div className="card p-8 text-center">
                  <MessageSquare className="w-10 h-10 text-gold-600 mx-auto mb-3" aria-hidden="true" />
                  <p className="text-gold-500 text-sm">Aucun message</p>
                </div>
              ) : (
                messages.map((message) => (
                  <button
                    key={message.id}
                    type="button"
                    onClick={() => setSelectedMessage(message)}
                    className={`card p-4 w-full text-left transition-all duration-200 cursor-pointer ${
                      selectedMessage?.id === message.id
                        ? 'border-gold-600/50 ring-1 ring-gold-600/30'
                        : !message.read
                        ? 'border-gold-600/30 bg-gold-600/5'
                        : 'hover:border-gold-600/25'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-gold-600/10 border border-gold-600/20 shrink-0">
                        <User className="w-4 h-4 text-gold-500" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-semibold text-gold-200 truncate">
                            {message.user?.name || 'Utilisateur'}
                          </p>
                          {!message.read && (
                            <span className="shrink-0 text-[10px] uppercase tracking-wide bg-gold-600 text-black px-2 py-0.5 rounded-full font-bold">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gold-600 truncate">{message.content}</p>
                        <p className="text-xs text-gold-700 mt-1">
                          {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="card p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gold-600/10">
                    <div className="p-3 rounded-full bg-gold-600/10 border border-gold-600/20">
                      <User className="w-5 h-5 text-gold-500" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gold-200">{selectedMessage.user?.name || 'Utilisateur'}</h3>
                      <p className="text-sm text-gold-600">{selectedMessage.user?.email}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-dark-200/50 border border-gold-600/10">
                    <p className="text-gold-300 leading-relaxed">{selectedMessage.content}</p>
                    <p className="text-xs text-gold-700 mt-3">
                      {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>

                  {selectedMessage.adminResponse && (
                    <div className="p-4 rounded-xl bg-gold-600/5 border border-gold-600/20 border-l-4 border-l-gold-600">
                      <p className="text-xs font-semibold text-gold-500 uppercase tracking-wider mb-2">
                        Votre réponse
                      </p>
                      <p className="text-gold-300">{selectedMessage.adminResponse}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="admin-response" className="block text-sm font-medium text-gold-300 mb-2">
                      Répondre
                    </label>
                    <textarea
                      id="admin-response"
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Tapez votre réponse..."
                      className="input-field resize-none mb-4"
                      rows={4}
                    />
                    <button
                      type="button"
                      onClick={() => handleSendResponse(selectedMessage.id)}
                      disabled={sending}
                      className="btn-primary flex items-center gap-2 min-h-[44px] cursor-pointer disabled:opacity-50"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="w-4 h-4" aria-hidden="true" />
                      )}
                      Envoyer la réponse
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card p-12 text-center h-full min-h-[300px] flex flex-col items-center justify-center">
                  <MessageSquare className="w-12 h-12 text-gold-600 mb-4" aria-hidden="true" />
                  <p className="text-gold-500">Sélectionnez un message pour répondre</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminMessages
