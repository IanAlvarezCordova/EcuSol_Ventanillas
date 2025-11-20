import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cajeroService } from '@/services/cajeroService';
import { useCajeroStore } from '@/store/useCajeroStore';
import { LogoEcuSol } from '@/components/common/LogoEcuSol';
import { Boton } from '@/components/common/Boton';
import { toast } from 'react-hot-toast';
import { Search, KeyRound, Loader2, Monitor } from 'lucide-react';

const LoginCajero = () => {
  const navigate = useNavigate();
  const setSesion = useCajeroStore(state => state.login);
  
  const [cuenta, setCuenta] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await cajeroService.authCliente(cuenta, pin);
      setSesion(data.token, cuenta);
      toast.success("Cliente Validado Correctamente");
      navigate('/menu');
    } catch (error: any) {
      toast.error("Credenciales inválidas. Verifique identidad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden flex">
        {/* Lado Izquierdo: Branding Sistema */}
        <div className="w-1/3 bg-ecusol-primario p-8 flex flex-col justify-between text-white">
          <div>
            <LogoEcuSol className="text-white mb-4" size={50}/>
            <h2 className="text-xl font-bold">Sistema Ventanilla</h2>
            <p className="text-blue-200 text-sm mt-2">Módulo de atención al cliente v2.0</p>
          </div>
          <div className="text-center opacity-50">
            <Monitor size={64} className="mx-auto"/>
            <p className="text-xs mt-2">Terminal Segura #001</p>
          </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="w-2/3 p-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Identificación de Cliente</h1>
          
          <form onSubmit={handleValidarCliente} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Nro. Cuenta Cliente</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20}/>
                <input 
                  type="text" 
                  className="w-full pl-10 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-ecusol-primario outline-none"
                  placeholder="Ingrese cuenta..."
                  value={cuenta}
                  onChange={e => setCuenta(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Clave de Acceso / PIN</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 text-gray-400" size={20}/>
                <input 
                  type="password" 
                  className="w-full pl-10 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-ecusol-primario outline-none"
                  placeholder="Validación de seguridad"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                />
              </div>
            </div>

            <Boton 
              type="submit" 
              className="w-full py-3 bg-ecusol-primario hover:bg-blue-900"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mx-auto"/> : 'Acceder al Perfil'}
            </Boton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginCajero;