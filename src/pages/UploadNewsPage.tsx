import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


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
  const navigate = useNavigate();
  const [urls, setUrls] = useState<NewsUrl[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'urls' | 'excel'>('urls');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [excelPreview, setExcelPreview] = useState<ExcelPreview | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

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
      // Mostrar error temporal
      setUrlInput('');
      setErrorMessage('Esta URL ya ha sido agregada');
      setTimeout(() => setErrorMessage(''), 3000); // Limpiar error después de 3 segundos
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
      // Validar tipo de archivo
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
      setErrorMessage('Error al previsualizar el archivo. Verifica que el formato sea correcto.');
    } finally {
      setIsPreviewing(false);
    }
  };

  // Procesar archivo Excel
  const processExcelFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingStatus('Iniciando importación...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:3000/api/upload/news', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al importar archivo');
      }

      await response.json();
      
      setProcessingProgress(100);
      setProcessingStatus('Importación completada exitosamente');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error importando archivo:', error);
      setProcessingStatus('Error en la importación');
      setErrorMessage('Error al importar el archivo. Verifica que el formato sea correcto.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Procesar set completo de URLs
  const processNewsSet = async () => {
    if (urls.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingStatus('Iniciando procesamiento...');

    try {
      // Simular envío al backend

      
      // Aquí iría la llamada real al backend
      // const response = await fetch('/api/news/process', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ urls: validUrls })
      // });

      // Simulación del procesamiento
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProcessingProgress(i);
        
        if (i < 30) {
          setProcessingStatus('Validando URLs...');
        } else if (i < 60) {
          setProcessingStatus('Descargando contenido...');
        } else if (i < 90) {
          setProcessingStatus('Analizando noticias...');
        } else {
          setProcessingStatus('Finalizando procesamiento...');
        }
      }

      // Éxito - redirigir al dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('Error procesando noticias:', error);
      setProcessingStatus('Error en el procesamiento');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="dashboard-container w-full h-screen relative overflow-x-hidden" style={{ backgroundColor: '#1e293b' }}>
      {/* Fondo que cubre TODA la pantalla */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen"
        style={{
          backgroundImage: `url('/images/fondodashboard.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          zIndex: 0
        }}
      ></div>

      {/* Overlay muy sutil */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-black/5" 
        style={{ zIndex: 1 }}
      ></div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full h-full">
        {/* Header transparente */}
        <div className="bg-black/20 backdrop-blur-md shadow-lg border-b border-white/10 w-full">
          <div className="w-full px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="w-32 h-32 flex items-center justify-center">
                  <img 
                    src="/images/fondoblanco.png" 
                    alt="PrensAI Logo" 
                    className="w-28 h-28 object-contain"
                    onError={(e) => {
                      console.log('Error loading logo:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                    PrensAI
                  </h1>
                  <p className="text-white/80 text-sm font-medium">Cargar set de noticias</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="w-full px-6 py-12 h-full flex items-start justify-center pt-20">
          <div className="max-w-4xl w-full">
            
            {/* Título de bienvenida */}
            <div className="mb-32 text-center">
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

            {/* Método URLs */}
            {uploadMethod === 'urls' && (
              <>
                {/* Formulario de entrada */}
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-48">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addUrl()}
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
                  
                  {/* Mensaje de error */}
                  {errorMessage && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                      <p className="text-red-300 text-sm font-medium">{errorMessage}</p>
                    </div>
                  )}
                </div>

                {/* Lista de URLs */}
                {urls.length > 0 && (
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-48">
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
                      disabled={isProcessing || urls.filter(url => url.isValid).length === 0}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    >
                      {isProcessing ? 'Procesando...' : `Procesar ${urls.filter(url => url.isValid).length} noticias`}
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
                  
                  {/* Mensaje de error */}
                  {errorMessage && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                      <p className="text-red-300 text-sm font-medium">{errorMessage}</p>
                    </div>
                  )}
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

            {/* Progreso de procesamiento */}
            {isProcessing && (
              <div className="mt-8 bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-4">{processingStatus}</h3>
                  <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${processingProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-white/80">{processingProgress}% completado</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 