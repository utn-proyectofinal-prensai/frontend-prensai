import { useState } from 'react';
import apiService from '../services/api';

export interface ClippingReport {
  id: number;
  clipping_id: number;
  content: string;
  metadata: {
    fecha_generacion?: string;
    tiempo_generacion?: number;
    total_tokens?: number;
    modelo_ia?: string;
    version?: string;
    manually_edited?: boolean;
  };
  manually_edited: boolean;
  created_at: string;
  updated_at: string;
  creator?: { id: number; name: string };
  reviewer?: { id: number; name: string } | null;
}

export interface ClippingReportResponse {
  clipping_report: ClippingReport;
}

export const useClippingReport = (clippingId: number) => {
  const [report, setReport] = useState<ClippingReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async (): Promise<ClippingReport | null> => {
    setLoading(true);
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🤖 Generando reporte con IA para clipping', clippingId);
      const response = await apiService.generateClippingReport(clippingId);
      console.log('✅ Reporte generado exitosamente:', response);
      setReport(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.errors?.[0] || 'Error al generar el reporte';
      setError(errorMessage);
      console.error('❌ Error generating report:', err);
      return null;
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const getReport = async (): Promise<ClippingReport | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getClippingReport(clippingId);
      setReport(response);
      return response;
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No se encontró el reporte');
      } else {
        const errorMessage = err.response?.data?.errors?.[0] || 'Error al obtener el reporte';
        setError(errorMessage);
      }
      console.error('Error getting report:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (content: string, metadata?: any): Promise<ClippingReport | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.updateClippingReport(clippingId, { content, metadata });
      setReport(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.errors?.[0] || 'Error al actualizar el reporte';
      setError(errorMessage);
      console.error('Error updating report:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const exportPdf = async (): Promise<Blob | null> => {
    setDownloading(true);
    setError(null);
    
    try {
      const blob = await apiService.exportClippingReportPdf(clippingId);
      return blob;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al exportar el PDF';
      setError(errorMessage);
      console.error('Error exporting PDF:', err);
      return null;
    } finally {
      setDownloading(false);
    }
  };

  const downloadPdf = async (filename?: string): Promise<boolean> => {
    const pdfBlob = await exportPdf();
    if (!pdfBlob) return false;

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `reporte-clipping-${clippingId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  };

  const clearError = () => setError(null);

  return {
    report,
    loading,
    downloading,
    error,
    isGenerating,
    generateReport,
    getReport,
    updateReport,
    exportPdf,
    downloadPdf,
    clearError
  };
};
