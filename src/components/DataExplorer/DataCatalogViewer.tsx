import React, { useState } from 'react';

interface DataCatalogViewerProps {
  catalog: any;
}

export const DataCatalogViewer: React.FC<DataCatalogViewerProps> = ({ catalog }) => {
  const [selectedTable, setSelectedTable] = useState<any>(catalog?.tables?.[0] || null);
  const [preview, setPreview] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const loadPreview = async (tableName: string, offset: number = 0) => {
    setIsLoadingPreview(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/data/table/${tableName}/data?limit=10&offset=${offset}`
      );
      const data = await response.json();
      if (data.success) {
        setPreview(data.data);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error loading preview:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleSelectTable = (table: any) => {
    setSelectedTable(table);
    setPagination(null);
    loadPreview(table.name, 0);
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">📚 Catálogo de Datos</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de tablas */}
        <div className="lg:col-span-1">
          <h4 className="font-bold text-gray-900 mb-4">Tablas ({catalog?.tables?.length || 0})</h4>
          <div className="space-y-2">
            {catalog?.tables?.map((table: any) => (
              <button
                key={table.id}
                onClick={() => handleSelectTable(table)}
                className={`w-full text-left p-3 rounded transition ${
                  selectedTable?.id === table.id
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <p className="font-medium text-gray-900">📊 {table.name}</p>
                <p className="text-xs text-gray-500">{table.rowCount} filas</p>
              </button>
            ))}
          </div>
        </div>

        {/* Detalles de la tabla seleccionada */}
        <div className="lg:col-span-2">
          {selectedTable ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Columnas</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTable.columns?.map((col: any) => (
                    <div key={col.name} className="bg-gray-50 p-2 rounded text-sm">
                      <p className="font-medium text-gray-900">{col.name}</p>
                      <p className="text-xs text-gray-500">{col.type}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vista previa de datos */}
              {isLoadingPreview ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Cargando vista previa...</p>
                </div>
              ) : preview && preview.rows?.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Vista Previa de Datos</h4>
                    <div className="overflow-x-auto border border-gray-200 rounded">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b">
                          <tr>
                            {preview.columns?.map((col: any) => (
                              <th key={col.name} className="px-3 py-2 text-left font-medium text-gray-700">
                                {col.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {preview.rows?.map((row: any, idx: number) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              {preview.columns?.map((col: any) => (
                                <td key={col.name} className="px-3 py-2 text-gray-900 break-words max-w-xs">
                                  {String(row[col.name] || '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Controles de paginación */}
                  {pagination && (
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-gray-600">
                        Filas {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} de {pagination.total}
                      </p>
                      <div className="space-x-2">
                        <button
                          onClick={() => loadPreview(selectedTable.name, Math.max(0, pagination.offset - pagination.limit))}
                          disabled={pagination.offset === 0 || isLoadingPreview}
                          className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
                        >
                          ← Anterior
                        </button>
                        <button
                          onClick={() => loadPreview(selectedTable.name, pagination.offset + pagination.limit)}
                          disabled={!pagination.hasMore || isLoadingPreview}
                          className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
                        >
                          Siguiente →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Selecciona una tabla para ver detalles
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
