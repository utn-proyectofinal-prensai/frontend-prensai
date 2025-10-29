import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

interface ClippingReportButtonProps {
  clippingId: number;
  hasReport: boolean;
  variant?: 'primary' | 'success' | 'danger' | 'secondary' | 'outline' | 'ghost' | 'login' | 'stepper' | 'stepper-dropdown';
  size?: 'login' | 'stepper' | 'default' | 'sm' | 'lg' | 'icon' | 'modal-footer';
  className?: string;
}

export const ClippingReportButton: React.FC<ClippingReportButtonProps> = ({
  clippingId,
  hasReport,
  variant = 'ghost',
  size = 'icon',
  className = ''
}) => {
  const navigate = useNavigate();

  const getButtonTitle = () => {
    if (hasReport) {
      return 'Ver Reporte';
    }
    return 'Generar Reporte';
  };

  const getButtonIcon = () => {
    if (hasReport) {
      return 'FileText';
    }
    return 'Sparkles';
  };

  const handleClick = () => {
    navigate(`/clipping/${clippingId}/report`);
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      icon={getButtonIcon()}
      title={getButtonTitle()}
      className={className}
    >
      {size !== 'icon' && getButtonTitle()}
    </Button>
  );
};
