import StatusBadge from './StatusBadge'

function DataTable({ columns, rows, onAction }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-100">
            {columns.map(col => (
              <th key={col.key} className="pb-3 font-medium pr-4">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
              {columns.map(col => (
                <td key={col.key} className="py-3 pr-4">

                  {/* Badge column */}
                  {col.type === 'badge' && (
                    <StatusBadge status={row[col.key]} />
                  )}

                  {/* Action button column */}
                  {col.type === 'action' && (
                    <button
                      onClick={() => onAction && onAction(row, col.key)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition
                        ${col.variant === 'dark'
                          ? 'bg-gray-800 text-white hover:bg-gray-700'
                          : col.variant === 'primary'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {col.label}
                    </button>
                  )}

                  {/* Token / mono text */}
                  {col.type === 'token' && (
                    <span className="font-mono text-xs text-gray-500">{row[col.key]}</span>
                  )}

                  {/* Patient name — blue clickable */}
                  {col.type === 'patient' && (
                    <span className="font-medium text-blue-600 cursor-pointer hover:underline">
                      {row[col.key]}
                    </span>
                  )}

                  {/* Custom cell renderer */}
                  {col.render && col.render(row, col)}

                  {/* Default plain text */}
                  {!col.type && !col.render && (
                    <span className="text-gray-600">{row[col.key]}</span>
                  )}

                </td>
              ))}
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-gray-400 text-sm">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable