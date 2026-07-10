import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function DataTable({ columns, data, loading, onRowClick, pagination }) {
  return (
    <div className="bg-white border border-border flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-border bg-surface">
              {columns.map((col, i) => (
                <th key={i} className="py-3 px-4 font-heading font-bold uppercase tracking-wider text-xs text-muted">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-muted font-body text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-muted font-body text-sm">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr 
                  key={row.id || i} 
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`border-b border-border transition-colors duration-[150ms] linear ${onRowClick ? 'cursor-pointer hover:bg-surface' : ''}`}
                >
                  {columns.map((col, j) => (
                    <td key={j} className="py-3 px-4 font-body text-sm text-text">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="p-4 border-t border-border flex items-center justify-between text-xs font-body text-muted bg-surface">
          <div>
            Showing {((pagination.page - 1) * pagination.perPage) + (data.length > 0 ? 1 : 0)} to {((pagination.page - 1) * pagination.perPage) + data.length} of {pagination.total} entries
          </div>
          <div className="flex items-center gap-4">
            <button 
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="flex items-center gap-1 hover:text-text disabled:opacity-50 transition-colors duration-[150ms] linear"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="font-bold text-text">{pagination.page}</span>
            <button 
              disabled={!pagination.hasMore}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="flex items-center gap-1 hover:text-text disabled:opacity-50 transition-colors duration-[150ms] linear"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
