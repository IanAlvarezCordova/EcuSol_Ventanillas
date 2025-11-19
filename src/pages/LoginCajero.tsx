import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cajeroService } from '@/services/cajeroService';
import { useCajeroStore } from '@/store/useCajeroStore';
import { LogoEcuSol } from '@/components/common/LogoEcuSol';
import { Boton } from '@/components/common/Boton';
import { toast } from 'react-hot-toast';
import { CreditCard, Lock, Loader2 } from 'lucide-react';

const LoginCajero = () => {
  const navigate = useNavigate();
  const setSesion = useCajeroStore(state => state.login);
  
  const [cuenta, setCuenta] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIngresar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await cajeroService.login(cuenta, pin);
      setSesion(data.token, cuenta);
      toast.success("Identidad Verificada");
      navigate('/menu');
    } catch (error: any) {
      toast.error(error.message || "Error de lectura de tarjeta/PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ecusol-primario flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gray-50 p-8 text-center border-b border-gray-100">
          <div className="flex justify-center mb-4">
            <LogoEcuSol size={80} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Cajero Automático</h1>
          <p className="text-gray-500">Inserte sus credenciales para operar</p>
        </div>

        <form onSubmit={handleIngresar} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Número de Cuenta</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-4 text-gray-400" />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-ecusol-primario focus:ring-0 outline-none transition-all"
                placeholder="0000000000"
                value={cuenta}
                onChange={e => setCuenta(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Contraseña (PIN)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" />
              <input 
                type="password" 
                className="w-full pl-12 pr-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-ecusol-primario focus:ring-0 outline-none transition-all"
                placeholder="••••"
                value={pin}
                onChange={e => setPin(e.target.value)}
              />
            </div>
          </div>

          <Boton 
            type="submit" 
            className="w-full py-5 text-xl shadow-lg hover:scale-[1.02] transition-transform"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mx-auto"/> : 'INGRESAR'}
          </Boton>
        </form>
        
        <div className="bg-gray-100 p-4 text-center text-xs text-gray-500">
          Sistema Seguro EcuSol v1.0 - ATM
        </div>
      </div>
    </div>
  );
};

export default LoginCajero;