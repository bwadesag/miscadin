import { ReactNode } from 'react'

interface AdminPageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}

const AdminPageHeader = ({ eyebrow = 'Administration', title, description, action }: AdminPageHeaderProps) => (
  <div className="border-b border-gold-600/20 bg-gradient-to-r from-black via-dark-50/50 to-black">
    <div className="px-4 md:px-8 py-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="text-gold-600 text-xs font-semibold uppercase tracking-widest mb-2">{eyebrow}</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gold-400">{title}</h1>
        {description && <p className="text-gold-500 mt-2 max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  </div>
)

export default AdminPageHeader
