import { useState, useEffect } from 'react'
import { MessageSquare, Send, User } from 'lucide-react'
import { Message } from '../../types'
import toast from 'react-hot-toast'
import api from '../../utils/api'

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await api.get('/messages')
      setMessages(response.data)
    } catch (error: any) {
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

    try {
      await api.put(`/messages/${messageId}/response`, { response })
      setMessages(
        messages.map((msg) =>
          msg.id === messageId
            ? { ...msg, adminResponse: response, read: true }
            : msg
        )
      )
      setResponse('')
      toast.success('Réponse envoyée')
    } catch (error: any) {
      toast.error('Erreur lors de l\'envoi de la réponse')
      console.error(error)
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Messages Clients</h1>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
            {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">Chargement des messages...</div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          {messages.length === 0 ? (
            <div className="card p-8 text-center">
              <MessageSquare className="w-12 h-12 text-dark-300 mx-auto mb-4" />
              <p className="text-dark-600">Aucun message pour le moment</p>
            </div>
          ) : (
            messages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`card p-4 cursor-pointer transition ${
                selectedMessage?.id === message.id
                  ? 'border-2 border-primary-600'
                  : message.read
                  ? 'border border-dark-200'
                  : 'border-2 border-primary-300 bg-primary-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary-100 p-2 rounded-full">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold truncate">{message.user?.name || 'Utilisateur'}</p>
                    {!message.read && (
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-dark-600 truncate">{message.content}</p>
                  <p className="text-xs text-dark-400 mt-1">
                    {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedMessage.user?.name || 'Utilisateur'}</h3>
                  <p className="text-sm text-dark-600">{selectedMessage.user?.email}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-dark-50 p-4 rounded-lg mb-4">
                  <p className="text-dark-700">{selectedMessage.content}</p>
                  <p className="text-xs text-dark-400 mt-2">
                    {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>

                {selectedMessage.adminResponse && (
                  <div className="bg-primary-50 p-4 rounded-lg border-l-4 border-primary-600">
                    <p className="font-semibold mb-2 text-primary-900">Votre réponse :</p>
                    <p className="text-dark-700">{selectedMessage.adminResponse}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-2">Répondre</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Tapez votre réponse..."
                  className="input-field mb-4"
                  rows={4}
                />
                <button
                  onClick={() => handleSendResponse(selectedMessage.id)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Envoyer la réponse
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <MessageSquare className="w-16 h-16 text-dark-300 mx-auto mb-4" />
              <p className="text-dark-600">Sélectionnez un message pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  )
}

export default AdminMessages

