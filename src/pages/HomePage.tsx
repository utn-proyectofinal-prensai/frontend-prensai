import { useAuth } from '../context/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ¡Bienvenido a PrensAI!
        </h1>
        <p className="text-xl text-gray-600">
          Impulsando la prensa con inteligencia artificial
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Panel de Control
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Usuario</h3>
            <p className="text-blue-700">{user?.username}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Email</h3>
            <p className="text-green-700">{user?.email}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">Rol</h3>
            <p className="text-purple-700">{user?.role}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Funcionalidades próximas
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Análisis de noticias con IA</li>
            <li>• Generación automática de resúmenes</li>
            <li>• Detección de tendencias</li>
            <li>• Dashboard de métricas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}