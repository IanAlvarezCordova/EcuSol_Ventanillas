import { useNavigate } from 'react-router-dom';
import { useCajeroStore } from '@/store/useCajeroStore';
import { ArrowDownCircle, ArrowUpCircle, LogOut } from 'lucide-react';

const MenuCajero = () => {
  const navigate = useNavigate();
  const { numeroCuentaActiva, logout } = useCajeroStore();

  const handleSalir = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-ecusol-primario p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center text-white mb-10">
        <div>
          <h2 className="text-xl opacity-80">Cuenta Activa</h2>
          <p className="text-3xl font-mono font-bold tracking-wider">
            **** {numeroCuentaActiva?.slice(-4)}
          </p>
        </div>
        <button 
          onClick={handleSalir}
          className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-colors font-bold"
        >
          <LogOut /> SALIR
        </button>
      </div>

      {/* Botones Gigantes */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full items-center">
        
        {/* Botón Depósito */}
        <button 
          onClick={() => navigate('/operacion/deposito')}
          className="h-64 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-4 group hover:bg-green-50 transition-colors"
        >
          <div className="p-6 bg-green-100 text-green-600 rounded-full group-hover:scale-110 transition-transform duration-300">
            <ArrowDownCircle size={64} />
          </div>
          <span className="text-4xl font-bold text-gray-800">DEPÓSITO</span>
          <span className="text-gray-400">Ingresar dinero</span>
        </button>

        {/* Botón Retiro */}
        <button 
          onClick={() => navigate('/operacion/retiro')}
          className="h-64 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-4 group hover:bg-red-50 transition-colors"
        >
          <div className="p-6 bg-red-100 text-red-600 rounded-full group-hover:scale-110 transition-transform duration-300">
            <ArrowUpCircle size={64} />
          </div>
          <span className="text-4xl font-bold text-gray-800">RETIRO</span>
          <span className="text-gray-400">Sacar efectivo</span>
        </button>

      </div>
      
      <div className="text-center text-white/30 mt-10">
        Seleccione una operación para continuar
      </div>
    </div>
  );
};

export default MenuCajero;