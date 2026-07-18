import React from 'react'

export function DataTable({ columns, data, emptyMessage = "No data found." }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#F9F9F9] rounded-xl border border-[#E5E5E5] p-8 text-center">
        <p className="text-sm text-[#666666]">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
            {columns.map((col, i) => (
              <th 
                key={i} 
                className={`py-3 px-4 text-xs font-bold text-[#666666] uppercase tracking-wider ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E5E5]">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-[#F9F9F9] transition-colors duration-150">
              {columns.map((col, colIndex) => (
                <td 
                  key={colIndex} 
                  className={`py-3 px-4 text-sm text-[#111111] ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                  }`}
                >
                  {col.cell ? col.cell(row) : row[col.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
