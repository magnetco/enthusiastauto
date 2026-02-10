import { useState, useCallback } from 'react'
import { ChevronUp, ChevronDown, Trash2 } from './Icons'

type SortDirection = 'asc' | 'desc' | null

interface Column<T> {
  key: keyof T | string
  label: string
  editable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  onUpdate?: (id: string, field: string, value: string) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onRowClick?: (id: string) => void
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onUpdate,
  onDelete,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortKey(null)
        setSortDirection(null)
      } else {
        setSortDirection('asc')
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }, [sortKey, sortDirection])

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0
    
    const aVal = (a as Record<string, unknown>)[sortKey]
    const bVal = (b as Record<string, unknown>)[sortKey]
    
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1
    
    const comparison = String(aVal).localeCompare(String(bVal))
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const startEditing = (id: string, field: string, currentValue: unknown) => {
    setEditingCell({ id, field })
    setEditValue(String(currentValue ?? ''))
  }

  const cancelEditing = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const saveEdit = async () => {
    if (!editingCell || !onUpdate) return
    
    try {
      await onUpdate(editingCell.id, editingCell.field, editValue)
      cancelEditing()
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => handleSort(String(col.key))}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {sortKey === col.key && (
                    sortDirection === 'asc' ? <ChevronUp /> : <ChevronDown />
                  )}
                </div>
              </th>
            ))}
            {onDelete && <th className="w-16">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr 
              key={row.id}
              onClick={() => onRowClick?.(row.id)}
              className={onRowClick ? 'cursor-pointer' : ''}
            >
              {columns.map((col) => {
                const value = (row as Record<string, unknown>)[String(col.key)]
                const isEditing = editingCell?.id === row.id && editingCell?.field === String(col.key)
                
                return (
                  <td key={String(col.key)}>
                    {col.render ? (
                      col.render(value, row)
                    ) : col.editable && onUpdate ? (
                      isEditing ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={handleKeyDown}
                          className="w-full rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          style={{
                            backgroundColor: 'var(--input-bg)',
                            borderWidth: '1px',
                            borderColor: 'var(--input-border)',
                            color: 'var(--text-primary)',
                          }}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="editable-cell"
                          onClick={() => startEditing(row.id, String(col.key), value)}
                        >
                          {value !== null && value !== undefined ? String(value) : '—'}
                        </span>
                      )
                    ) : (
                      <span style={{ color: 'var(--text-primary)' }}>
                        {value !== null && value !== undefined ? String(value) : '—'}
                      </span>
                    )}
                  </td>
                )
              })}
              {onDelete && (
                <td>
                  <button
                    onClick={() => onDelete(row.id)}
                    className="p-1 hover:text-red-500 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    title="Delete"
                  >
                    <Trash2 />
                  </button>
                </td>
              )}
            </tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td 
                colSpan={columns.length + (onDelete ? 1 : 0)} 
                className="text-center py-8"
                style={{ color: 'var(--text-secondary)' }}
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

