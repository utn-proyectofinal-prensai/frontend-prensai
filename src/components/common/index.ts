// Exportar todos los componentes comunes
// Componentes reutilizables que se usan en toda la aplicación

// Componentes de formulario
export { FormField } from './FormField';
export type { FormFieldProps } from './FormField';

// Componentes de notificación
export { default as Snackbar } from './Snackbar';
export type { SnackbarProps } from './Snackbar';

// Componentes de confirmación
export { default as ConfirmationModal } from './ConfirmationModal';

// Componentes de edición
export { EditClippingModal } from './EditClippingModal';

export { default as UserDropdown } from './UserDropdown';

// Componentes de layout
export { default as PageBackground } from './PageBackground';

// Cards reutilizables
export { TopicCard } from './TopicCard';
export { MentionCard } from './MentionCard';

// Componentes de UI reutilizables
export { default as PanelCard } from './PanelCard';
export { default as CheckboxList } from './CheckboxList';
export { default as TabSelector } from './TabSelector';
export { default as InputWithButton } from './InputWithButton';

// Componentes de selección mejorados
export { default as EnhancedSelection } from './EnhancedSelection';
export { default as ChipSelection } from './ChipSelection';
export { default as DragDropSelection } from './DragDropSelection';
export { default as InteractiveCardSelection } from './InteractiveCardSelection';
export { default as CenteredCardSelection } from './CenteredCardSelection';

// Componentes de workflow
export { default as WorkflowStepper } from './WorkflowStepper';
export { default as SimpleWorkflowStepper } from './SimpleWorkflowStepper';

// Componentes de tabla
export { default as NewsTable } from './NewsTable';

// Componentes de filtros
export { default as NewsFilters } from './NewsFilters';
export { default as ClippingsFilters } from './ClippingsFilters';

// Componentes de badges
export { default as TopicBadge } from './TopicBadge';

// Componentes de resultados
export { default as BatchProcessResultsModal } from './BatchProcessResultsModal';

// Componentes de métricas
export { default as AdvancedMetricsCharts } from './AdvancedMetricsCharts';
export { default as DashboardLineChart } from './DashboardLineChart';
export { default as DashboardDonutChart } from './DashboardDonutChart';
export { default as DashboardBarChart } from './DashboardBarChart';
export { default as MetricCard } from './MetricCard';

// Componentes de reportes
export { ClippingReportButton } from './ClippingReportButton';
export { default as InfoModal } from './InfoModal';
