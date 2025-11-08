import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onlyIfTruncated?: boolean;
}

export function Tooltip({ 
  content, 
  children, 
  className,
  position = 'top',
  onlyIfTruncated = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isTruncated, setIsTruncated] = React.useState(false);
  const contentRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (onlyIfTruncated && contentRef.current) {
      // Buscar el elemento hijo que contiene el texto
      const textElement = contentRef.current.querySelector('.history-table-cell-content') || contentRef.current.firstElementChild as HTMLElement;
      if (textElement) {
        setIsTruncated(textElement.scrollWidth > textElement.clientWidth);
      } else {
        setIsTruncated(false);
      }
    } else {
      setIsTruncated(true);
    }
  }, [onlyIfTruncated, content]);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/98',
    bottom: 'absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900/98',
    left: 'absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900/98',
    right: 'absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900/98'
  };

  return (
    <span 
      ref={contentRef}
      className="relative inline-block w-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && isTruncated && (
        <div 
          className={cn(
            'absolute z-[9999] w-64 p-3 bg-gray-900/98 backdrop-blur-sm border border-white/30 rounded-lg shadow-2xl pointer-events-none',
            positionClasses[position],
            className
          )}
        >
          <div className="text-white text-sm leading-relaxed break-words text-center">
            {content}
          </div>
          <div className={arrowClasses[position]}></div>
        </div>
      )}
    </span>
  );
}

