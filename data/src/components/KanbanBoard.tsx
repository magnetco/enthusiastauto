import { useState, useRef } from 'react'
import { updateField } from '../lib/api'
import { cardHover } from '../lib/animations'

interface KanbanColumn {
  id: string
  label: string
  color: string
}

interface KanbanItem {
  id: string
  [key: string]: unknown
}

interface KanbanBoardProps {
  data: KanbanItem[]
  columns: KanbanColumn[]
  statusField: string
  onItemClick?: (id: string) => void
  onRefresh: () => void
  endpoint: string
  renderCard: (item: KanbanItem) => React.ReactNode
}

export function KanbanBoard({
  data,
  columns,
  statusField,
  onItemClick,
  onRefresh,
  endpoint,
  renderCard,
}: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<KanbanItem | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const getItemsByStatus = (status: string) => {
    return data.filter((item) => item[statusField] === status)
  }

  const handleDragStart = (item: KanbanItem) => {
    setDraggedItem(item)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem[statusField] === newStatus) {
      setDraggedItem(null)
      setDragOverColumn(null)
      return
    }

    try {
      await updateField(endpoint, draggedItem.id as string, statusField, newStatus)
      await onRefresh()
    } catch (error) {
      console.error('Failed to update status:', error)
    }

    setDraggedItem(null)
    setDragOverColumn(null)
  }

  const getColumnColor = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
      yellow: { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.2)', text: '#facc15' },
      blue: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' },
      purple: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.2)', text: '#c084fc' },
      orange: { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.2)', text: '#fb923c' },
      green: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)', text: '#4ade80' },
      red: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', text: '#f87171' },
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const items = getItemsByStatus(column.id)
        const isDragOver = dragOverColumn === column.id
        const colors = getColumnColor(column.color)
        
        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div 
              className="rounded-lg p-3 mb-3"
              style={{
                backgroundColor: colors.bg,
                borderWidth: '1px',
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center justify-between">
                <h3 
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: colors.text }}
                >
                  {column.label}
                </h3>
                <span 
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                  }}
                >
                  {items.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div
              className="min-h-[400px] border-2 border-dashed rounded-lg p-2 transition-colors"
              style={{
                backgroundColor: isDragOver ? colors.bg : 'var(--bg-secondary)',
                borderColor: isDragOver ? colors.border : 'var(--border-color)',
              }}
            >
              <div className="space-y-2">
                {items.map((item) => {
                  const cardRef = useRef<HTMLDivElement>(null)
                  
                  return (
                    <div
                      key={item.id}
                      ref={cardRef}
                      draggable
                      onDragStart={() => handleDragStart(item)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onItemClick?.(item.id as string)}
                      onMouseEnter={() => cardHover(cardRef.current, true)}
                      onMouseLeave={() => cardHover(cardRef.current, false)}
                      className={`border rounded-lg p-3 cursor-move transition-colors ${
                        draggedItem?.id === item.id ? 'opacity-50' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      {renderCard(item)}
                    </div>
                  )
                })}
                
                {items.length === 0 && (
                  <div 
                    className="text-center py-8 text-sm"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    No items
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
