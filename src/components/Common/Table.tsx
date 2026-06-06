import React from 'react';
import Spinner from './Spinner';

interface Column<T> {
  key: keyof T;
  label: string;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  className?: string;
  keyExtractor?: (row: T, index: number) => string | number;
}

const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  className = '',
  keyExtractor,
}: TableProps<T>): React.ReactNode => {
  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-gray-200 ${className}`}>
      <table className="w-full border-collapse">
        {/* Header */}
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                style={{ width: column.width }}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center">
                <Spinner size="md" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={keyExtractor ? keyExtractor(row, index) : index}
                className={`border-b border-gray-200 transition-colors duration-200 hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-4 py-3 text-sm text-gray-700"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
