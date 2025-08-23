interface PageBackgroundProps {
  backgroundImage?: string;
  overlayOpacity?: number;
  className?: string;
  children: React.ReactNode;
}

export default function PageBackground({
  backgroundImage = '/images/fondodashboard.png',
  overlayOpacity = 0.05,
  className = '',
  children
}: PageBackgroundProps) {
  return (
    <div className={`dashboard-container w-full h-screen relative overflow-x-hidden ${className}`} style={{ backgroundColor: '#1e293b' }}>
      {/* Fondo que cubre TODA la pantalla */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          zIndex: 0
        }}
      ></div>

      {/* Overlay muy sutil */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen" 
        style={{ 
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          zIndex: 1 
        }}
      ></div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
