import React, { useState } from 'react';
import { useNews, useEnabledTopics, useEnabledMentions } from '../hooks';
import { apiService, type BatchProcessRequest, parseApiError } from '../services/api';
import Snackbar from '../components/common/Snackbar';

interface NewsUrl {
  id: string;
  url: string;
  isValid: boolean;
  error?: string;
}

interface ExcelPreview {
  headers: string[];
  preview_rows: Record<string, string | number | boolean>[];
  total_rows: number;
}

export default function UploadNewsPage() {
  const { batchProcess, processing } = useNews();
  
  // Estados para URLs
  const [urls, setUrls] = useState<NewsUrl[]>([]);
  const [urlInput, setUrlInput] = useState('');
  
  // Estados para Excel
  const [uploadMethod, setUploadMethod] = useState<'urls' | 'excel'>('urls');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [excelPreview, setExcelPreview] = useState<ExcelPreview | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  // Estados para procesamiento (spinner simple por ahora)
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  
  // Estados para temas y menciones
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedMentions, setSelectedMentions] = useState<string[]>([]);
  
  // Estados para mensajes
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successVariant, setSuccessVariant] = useState<'success' | 'warning'>('success');
  
  // Hooks para obtener solo datos habilitados desde el backend (enabled=true)
  const { topics: enabledTopics, loading: topicsLoading } = useEnabledTopics();
  const { mentions: enabledMentions, loading: mentionsLoading } = useEnabledMentions();

  // Función para validar URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Agregar URL al set
  const addUrl = () => {
    if (!urlInput.trim()) return;

    const trimmedUrl = urlInput.trim();
    
    // Verificar si la URL ya existe
    const urlExists = urls.some(url => url.url.toLowerCase() === trimmedUrl.toLowerCase());
    
    if (urlExists) {
      setUrlInput('');
      setErrorMessage('Esta URL ya ha sido agregada');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const newUrl: NewsUrl = {
      id: Date.now().toString(),
      url: trimmedUrl,
      isValid: isValidUrl(trimmedUrl),
      error: isValidUrl(trimmedUrl) ? undefined : 'URL inválida'
    };

    setUrls([...urls, newUrl]);
    setUrlInput('');
  };

  // Eliminar URL del set
  const removeUrl = (id: string) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  // Manejar selección de archivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (!validTypes.includes(file.type)) {
        setErrorMessage('Por favor selecciona un archivo Excel (.xlsx, .xls) o CSV');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }
      
      setSelectedFile(file);
      setExcelPreview(null);
      setErrorMessage('');
    }
  };

  // Previsualizar archivo Excel
  const previewExcelFile = async () => {
    if (!selectedFile) return;

    setIsPreviewing(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:3000/api/upload/preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al previsualizar archivo');
      }

      const result = await response.json();
      setExcelPreview(result);
      
    } catch (error) {
      console.error('Error previsualizando archivo:', error);
      
      const errorMessage = parseApiError(error, 'Error al previsualizar el archivo. Verifica que el formato sea correcto.');
      setErrorMessage(errorMessage);
    } finally {
      setIsPreviewing(false);
    }
  };

  // Procesar archivo Excel
  const processExcelFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingStatus('Iniciando importación...');

    try {
      const result = await apiService.importNews(selectedFile);

      const total = (result as any).totalProcesadas ?? (result.importadas + result.errores);
      if (result.importadas > 0 && result.errores === 0) {
        setSuccessVariant('success');
        setProcessingStatus('Importación completada exitosamente');
        setSuccessMessage(`Listo: ${result.importadas}/${total} noticias importadas correctamente.`);
      } else if (result.importadas > 0 && result.errores > 0) {
        setSuccessVariant('warning');
        setProcessingStatus('Importación parcial');
        setSuccessMessage(`Parcial: ${result.importadas}/${total} importadas. ${result.errores} con error.`);
      } else {
        setProcessingStatus('Error en la importación');
        setErrorMessage('No se pudo importar ninguna noticia. Verifica el archivo.');
      }

    } catch (error) {
      console.error('Error importando archivo:', error);
      setProcessingStatus('Error en la importación');
      
      const errorMessage = parseApiError(error, 'Error al importar el archivo. Verifica que el formato sea correcto.');
      setErrorMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Procesar set completo de URLs
  const processNewsSet = async () => {
    if (urls.length === 0) return;

    const validUrls = urls.filter(url => url.isValid).map(url => url.url);
    if (validUrls.length === 0) {
      setErrorMessage('No hay URLs válidas para procesar');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Iniciando procesamiento...');

    try {
      const requestData: BatchProcessRequest = {
        urls: validUrls,
        topics: selectedTopics,
        mentions: selectedMentions
      };

      const response = await batchProcess(requestData);

      const allOk = response.received === response.persisted && response.persisted > 0;
      const partial = response.persisted > 0 && response.errors.length > 0;
      const none = response.persisted === 0 && response.errors.length > 0;

      if (allOk) {
        setSuccessVariant('success');
        setProcessingStatus('Procesamiento completado exitosamente');
        setSuccessMessage(`Listo: ${response.persisted}/${response.received} procesadas correctamente.`);
      } else if (partial) {
        setSuccessVariant('warning');
        setProcessingStatus('Procesamiento parcial');
        setSuccessMessage(`Parcial: ${response.persisted}/${response.received} OK. ${response.errors.length} con error.`);
      } else if (none) {
        setProcessingStatus('Error en el procesamiento');
        setErrorMessage('No se pudo procesar ninguna noticia. Revisa las URLs ingresadas.');
      } else {
        setSuccessVariant('warning');
        setProcessingStatus('Procesamiento finalizado');
        setSuccessMessage(`Resultado: ${response.persisted}/${response.received} procesadas.`);
      }
    } catch (error) {
      console.error('Error procesando noticias:', error);
      setProcessingStatus('Error en el procesamiento');
      
      const errorMessage = parseApiError(error, 'Error al procesar las noticias');
      setErrorMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Manejar selección de temas
  const handleTopicToggle = (topicName: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicName) 
        ? prev.filter(name => name !== topicName)
        : [...prev, topicName]
    );
  };

  // Manejar selección de menciones
  const handleMentionToggle = (mentionName: string) => {
    setSelectedMentions(prev => 
      prev.includes(mentionName) 
        ? prev.filter(name => name !== mentionName)
        : [...prev, mentionName]
    );
  };

  return (
    <div className="w-full">
      {/* Título de bienvenida */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Carga tus noticias para analizar</h2>
        <p className="text-white/90 text-lg font-medium drop-shadow-md">Elige el método que prefieras para cargar tus noticias.</p>
      </div>

      {/* Selector de método */}
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setUploadMethod('urls')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              uploadMethod === 'urls'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            URLs de noticias
          </button>
          <button
            onClick={() => setUploadMethod('excel')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              uploadMethod === 'excel'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Archivo Excel
          </button>
        </div>
      </div>

      {/* Selección de Temas y Menciones */}
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
        <h3 className="text-xl font-bold text-white mb-6">Configuración de análisis</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Temas */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Temas a analizar</h4>
            {topicsLoading ? (
              <div className="text-white/70">Cargando temas...</div>
            ) : enabledTopics.length === 0 ? (
              <div className="text-white/70">No hay temas habilitados</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {enabledTopics.map((topic) => (
                  <label key={topic.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic.name)}
                      onChange={() => handleTopicToggle(topic.name)}
                      className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <span className="text-white font-medium">{topic.name}</span>
                      {topic.description && (
                        <p className="text-white/60 text-sm">{topic.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Menciones */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Menciones a buscar</h4>
            {mentionsLoading ? (
              <div className="text-white/70">Cargando menciones...</div>
            ) : enabledMentions.length === 0 ? (
              <div className="text-white/70">No hay menciones habilitadas</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {enabledMentions.map((mention) => (
                  <label key={mention.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMentions.includes(mention.name)}
                      onChange={() => handleMentionToggle(mention.name)}
                      className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-white font-medium">{mention.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Método URLs */}
      {uploadMethod === 'urls' && (
        <>
          {/* Formulario de entrada */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="flex space-x-4">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addUrl()}
                placeholder="https://ejemplo.com/noticia..."
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
              />
              <button
                onClick={addUrl}
                disabled={!urlInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Lista de URLs */}
          {urls.length > 0 && (
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">URLs a procesar ({urls.length})</h3>
                <button
                  onClick={() => setUrls([])}
                  className="text-white hover:text-white/80 text-sm font-medium transition-colors"
                >
                  Limpiar todo
                </button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {urls.map((url) => (
                  <div 
                    key={url.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      url.isValid 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium truncate">{url.url}</p>
                      {url.error && (
                        <p className="text-red-400 text-sm mt-1">{url.error}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeUrl(url.id)}
                      className="text-white/60 hover:text-red-400 transition-colors ml-4"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón de procesamiento URLs */}
          {urls.length > 0 && (
            <div className="text-center">
              <button
                onClick={processNewsSet}
                disabled={isProcessing || processing || urls.filter(url => url.isValid).length === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                {isProcessing || processing ? 'Procesando...' : `Procesar ${urls.filter(url => url.isValid).length} noticias`}
              </button>
            </div>
          )}
        </>
      )}

      {/* Método Excel */}
      {uploadMethod === 'excel' && (
        <>
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Subir archivo Excel</h3>
                <p className="text-white/70 text-sm">Selecciona un archivo Excel (.xlsx, .xls) o CSV con tus noticias</p>
              </div>
              
              <div className="border-2 border-dashed border-white/30 rounded-xl p-8 hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block"
                >
                  <div className="text-center">
                    <svg className="w-12 h-12 text-white/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-white font-medium">
                      {selectedFile ? selectedFile.name : 'Haz clic para seleccionar archivo'}
                    </p>
                    <p className="text-white/50 text-sm mt-2">
                      {selectedFile ? 'Archivo seleccionado' : 'o arrastra el archivo aquí'}
                    </p>
                  </div>
                </label>
              </div>
              
              {selectedFile && (
                <div className="mt-6 flex space-x-4 justify-center">
                  <button
                    onClick={previewExcelFile}
                    disabled={isPreviewing}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    {isPreviewing ? 'Previsualizando...' : 'Previsualizar'}
                  </button>
                  <button
                    onClick={processExcelFile}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    {isProcessing ? 'Importando...' : 'Importar directamente'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Previsualización del Excel */}
          {excelPreview && (
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Previsualización del archivo</h3>
                <p className="text-white/70 text-sm">
                  Total de filas: {excelPreview.total_rows} | Mostrando primeras 5 filas
                </p>
              </div>
              
              {/* Headers */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">Columnas detectadas:</h4>
                <div className="flex flex-wrap gap-2">
                  {excelPreview.headers.map((header, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm font-medium border border-blue-500/30"
                    >
                      {header}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Preview de datos */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-2">Vista previa de datos:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white/10 rounded-lg overflow-hidden">
                    <thead className="bg-white/20">
                      <tr>
                        {excelPreview.headers.map((header, index) => (
                          <th key={index} className="px-4 py-2 text-left text-white font-semibold text-sm">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {excelPreview.preview_rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-white/10">
                          {excelPreview.headers.map((header, colIndex) => (
                            <td key={colIndex} className="px-4 py-2 text-white/90 text-sm">
                              {row[header] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Botón para importar después de previsualizar */}
              <div className="text-center">
                <button
                  onClick={processExcelFile}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  {isProcessing ? 'Importando...' : 'Importar noticias'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Overlay de procesamiento con spinner*/}
      {(isProcessing || processing) && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="processing-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div className="w-full max-w-md mx-4 rounded-2xl border border-white/20 bg-gradient-to-b from-slate-900/90 to-slate-800/90 shadow-2xl p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center animate-pulse-glow mb-4">
              <svg className="w-6 h-6 text-blue-300 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </div>
            <h3 id="processing-title" className="text-white font-bold text-lg">{processingStatus || 'Procesando noticias…'}</h3>
            <p className="text-white/70 text-sm mt-1">Esto puede tardar unos segundos.</p>
          </div>
        </div>
      )}

      {/* Snackbars para mensajes */}
      <Snackbar
        message={errorMessage}
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage('')}
        variant="error"
      />
      
      <Snackbar
        message={successMessage}
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        variant={successVariant}
      />
    </div>
  );
}
