import { useState, useCallback } from 'react';

interface WorkflowState {
  selectedTopics: string[];
  selectedMentions: string[];
  urls: Array<{
    id: string;
    url: string;
    isValid: boolean;
    error?: string;
  }>;
  urlInput: string;
}

export const useWorkflow = () => {
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    selectedTopics: [],
    selectedMentions: [],
    urls: [],
    urlInput: ''
  });

  // Validar URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Agregar URL
  const addUrl = useCallback(() => {
    if (!workflowState.urlInput.trim()) return;

    const trimmedUrl = workflowState.urlInput.trim();
    
    // Verificar si la URL ya existe
    const urlExists = workflowState.urls.some(url => url.url.toLowerCase() === trimmedUrl.toLowerCase());
    
    if (urlExists) {
      return { success: false, error: 'Esta URL ya ha sido agregada' };
    }

    const newUrl = {
      id: Date.now().toString(),
      url: trimmedUrl,
      isValid: isValidUrl(trimmedUrl),
      error: isValidUrl(trimmedUrl) ? undefined : 'URL inválida'
    };

    setWorkflowState(prev => ({
      ...prev,
      urls: [...prev.urls, newUrl],
      urlInput: ''
    }));

    return { success: true };
  }, [workflowState.urlInput, workflowState.urls]);

  // Eliminar URL
  const removeUrl = useCallback((id: string) => {
    setWorkflowState(prev => ({
      ...prev,
      urls: prev.urls.filter(url => url.id !== id)
    }));
  }, []);

  // Limpiar todas las URLs
  const clearUrls = useCallback(() => {
    setWorkflowState(prev => ({
      ...prev,
      urls: []
    }));
  }, []);

  // Toggle de tema
  const toggleTopic = useCallback((topicName: string) => {
    setWorkflowState(prev => ({
      ...prev,
      selectedTopics: prev.selectedTopics.includes(topicName)
        ? prev.selectedTopics.filter(name => name !== topicName)
        : [...prev.selectedTopics, topicName]
    }));
  }, []);

  // Toggle de mención
  const toggleMention = useCallback((mentionName: string) => {
    setWorkflowState(prev => ({
      ...prev,
      selectedMentions: prev.selectedMentions.includes(mentionName)
        ? prev.selectedMentions.filter(name => name !== mentionName)
        : [...prev.selectedMentions, mentionName]
    }));
  }, []);

  // Seleccionar todos los temas
  const selectAllTopics = useCallback((topics: string[]) => {
    setWorkflowState(prev => ({
      ...prev,
      selectedTopics: topics
    }));
  }, []);

  // Limpiar temas
  const clearTopics = useCallback(() => {
    setWorkflowState(prev => ({
      ...prev,
      selectedTopics: []
    }));
  }, []);

  // Seleccionar todas las menciones
  const selectAllMentions = useCallback((mentions: string[]) => {
    setWorkflowState(prev => ({
      ...prev,
      selectedMentions: mentions
    }));
  }, []);

  // Limpiar menciones
  const clearMentions = useCallback(() => {
    setWorkflowState(prev => ({
      ...prev,
      selectedMentions: []
    }));
  }, []);

  // Actualizar input de URL
  const setUrlInput = useCallback((value: string) => {
    setWorkflowState(prev => ({
      ...prev,
      urlInput: value
    }));
  }, []);

  // Validaciones
  const isTopicsStepValid = workflowState.selectedTopics.length > 0;
  const isMentionsStepValid = workflowState.selectedMentions.length > 0;
  const isUrlsStepValid = workflowState.urls.length > 0 && workflowState.urls.some(url => url.isValid);

  return {
    workflowState,
    addUrl,
    removeUrl,
    clearUrls,
    toggleTopic,
    toggleMention,
    selectAllTopics,
    clearTopics,
    selectAllMentions,
    clearMentions,
    setUrlInput,
    isTopicsStepValid,
    isMentionsStepValid,
    isUrlsStepValid
  };
};
