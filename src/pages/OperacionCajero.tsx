import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCajeroStore } from '@/store/useCajeroStore';
import { cajeroService } from '@/services/cajeroService';
import { toast } from 'react-hot-toast';
// IMPORT CORREGIDO: Loader2 ya está incluido aquí
import { ArrowLeft, CheckCircle2, Delete, Loader2 } from 'lucide-react';

const OperacionCajero = () => {
  const { tipo } = useParams(); // 'deposito' o 'retiro'
  const navigate = useNavigate();
  const { numeroCuentaActiva } = useCajeroStore();
  
  const [monto, setMonto] = useState('');
  const [procesando, setProcesando] = useState(false);

  const esDeposito = tipo === 'deposito';
  const titulo = esDeposito ? 'Realizar Depósito' : 'Realizar Retiro';
  const color = esDeposito ? 'text-green-600' : 'text-red-600';

  // Teclado numérico virtual (para toque)
  const handleNum = (n: string) => {
    if (monto.length < 6) setMonto(prev => prev + n);
  };

  const handleBorrar = () => {
    setMonto(prev => prev.slice(0, -1));
  };

  const handleConfirmar = async () => {
    if (!monto || parseFloat(monto) <= 0) return;
    if (!numeroCuentaActiva) return;

    setProcesando(true);
    try {
      const datos = {
        numeroCuenta: numeroCuentaActiva,
        monto: parseFloat(monto),
        descripcion: `${esDeposito ? 'Depósito' : 'Retiro'} en Cajero ATM`
      };

      if (esDeposito) {
        await cajeroService.depositar(datos);
      } else {
        await cajeroService.retirar(datos);
      }

      // Éxito
      toast.custom((t) => (
        <div className="bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 border-l-8 border-green-500">
          <CheckCircle2 size={40} className="text-green-500"/>
          <div>
            <h1 className="text-xl font-bold">¡Transacción Exitosa!</h1>
            <p className="text-gray-500">Retire su comprobante.</p>
          </div>
        </div>
      ), { duration: 4000 });

      setTimeout(() => navigate('/menu'), 2000);

    } catch (error: any) {
      toast.error(error.message || "Error en la transacción");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm flex items-center justify-between">
        <button onClick={() => navigate('/menu')} className="flex items-center gap-2 text-gray-600 font-bold text-xl">
          <ArrowLeft /> Cancelar
        </button>
        <h1 className={`text-3xl font-bold ${color} uppercase`}>{titulo}</h1>
        <div className="w-20"></div> {/* Espaciador */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        
        {/* Visor */}
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg mb-8 text-right border-2 border-ecusol-primario">
          <p className="text-gray-400 text-sm mb-1">Monto a operar</p>
          <div className="text-5xl font-mono font-bold text-gray-800">
            $ {monto || '0.00'}
          </div>
        </div>

        {/* Teclado Numérico ATM */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num}
              onClick={() => handleNum(num.toString())}
              className="bg-white p-6 rounded-xl shadow-md text-3xl font-bold text-ecusol-primario hover:bg-gray-50 active:scale-95 transition-all"
              disabled={procesando}
            >
              {num}
            </button>
          ))}
          <button 
            onClick={handleBorrar}
            className="bg-red-100 p-6 rounded-xl shadow-md text-red-600 flex items-center justify-center active:scale-95"
          >
            <Delete size={32}/>
          </button>
          <button 
            onClick={() => handleNum('0')}
            className="bg-white p-6 rounded-xl shadow-md text-3xl font-bold text-ecusol-primario hover:bg-gray-50 active:scale-95"
          >
            0
          </button>
          <button 
            onClick={handleConfirmar}
            disabled={procesando || !monto}
            className="bg-green-500 p-6 rounded-xl shadow-md text-white font-bold text-xl flex items-center justify-center active:scale-95 disabled:opacity-50"
          >
            {procesando ? <Loader2 className="animate-spin"/> : 'OK'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default OperacionCajero;