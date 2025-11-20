import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCajeroStore } from '@/store/useCajeroStore';
import { cajeroService } from '@/services/cajeroService';
import { toast } from 'react-hot-toast';
import { ArrowUpCircle, ArrowDownCircle, ArrowRightLeft, LogOut, User, Wallet, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

// Helper simple para formatear dinero
const formatMoney = (monto: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(monto);

const MenuCajero = () => {
  const navigate = useNavigate();
  const { numeroCuentaActiva, logout } = useCajeroStore();
  
  // Datos del Cliente
  const [saldo, setSaldo] = useState<number | null>(null);
  const [titular, setTitular] = useState('Cargando cliente...');
  const [tipoCuenta, setTipoCuenta] = useState('');
  
  // Formulario
  const [tab, setTab] = useState<'DEPOSITO' | 'RETIRO' | 'TRANSFERENCIA'>('DEPOSITO');
  const [monto, setMonto] = useState('');
  const [destino, setDestino] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [procesando, setProcesando] = useState(false);

  // Cargar datos al entrar
  const cargarDatos = async () => {
    if (!numeroCuentaActiva) return;
    try {
      const info = await cajeroService.obtenerInfo(numeroCuentaActiva);
      setSaldo(info.saldo);
      setTitular(info.titular);
      setTipoCuenta(info.tipo);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar datos del cliente");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const ejecutarOperacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!numeroCuentaActiva) return;
    
    setProcesando(true);
    try {
      const datos = {
        numeroCuenta: numeroCuentaActiva,
        monto: parseFloat(monto),
        descripcion: descripcion || `Operación de ${tab}`,
        cuentaDestino: tab === 'TRANSFERENCIA' ? destino : undefined
      };

      if (tab === 'DEPOSITO') await cajeroService.depositar(datos);
      else if (tab === 'RETIRO') await cajeroService.retirar(datos);
      else if (tab === 'TRANSFERENCIA') await cajeroService.transferir(datos);

      // Notificación Bonita
      toast.custom((t) => (
        <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 animate-bounce-in">
            <CheckCircle2 size={28} />
            <div>
                <p className="font-bold text-lg">¡Éxito!</p>
                <p className="text-sm opacity-90">Saldo actualizado.</p>
            </div>
        </div>
      ), { duration: 3000 });

      // Limpiar formulario y Recargar saldo
      setMonto('');
      setDestino('');
      setDescripcion('');
      await cargarDatos(); 

    } catch (error: any) {
      toast.error(error.message || "Error en la operación");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Topbar */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="bg-ecusol-primario text-white px-3 py-1 rounded font-bold tracking-widest">ECUSOL</div>
           <span className="text-gray-400 text-sm uppercase font-bold tracking-wider border-l pl-4">Terminal de Ventanilla</span>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right hidden sm:block">
             <p className="text-sm font-bold text-gray-700">Operador: CAJERO_01</p>
             <p className="text-xs text-green-600 flex items-center justify-end gap-1">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Sistema En Línea
             </p>
           </div>
           <button onClick={handleLogout} className="bg-red-50 text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors" title="Cerrar Sesión">
             <LogOut size={20} />
           </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 p-6 gap-6 max-w-7xl mx-auto w-full">
        
        {/* PANEL IZQUIERDO: INFORMACIÓN DEL CLIENTE */}
        <aside className="w-full lg:w-1/3 space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                 <div className="bg-blue-50 p-4 rounded-full text-ecusol-primario">
                    <User size={32} />
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Cliente Identificado</p>
                    <p className="font-bold text-xl text-gray-800 leading-tight">{titular}</p>
                 </div>
              </div>
              
              <div className="space-y-5">
                 <div>
                    <p className="text-xs text-gray-400 mb-1">Producto</p>
                    <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <Wallet size={18} className="text-ecusol-secundario"/> 
                        <span className="font-medium">Cuenta {tipoCuenta}</span>
                    </div>
                 </div>

                 <div>
                    <p className="text-xs text-gray-400 mb-1">Número de Cuenta</p>
                    <p className="font-mono text-xl text-gray-600 tracking-wider font-bold">{numeroCuentaActiva}</p>
                 </div>
                 
                 {/* TARJETA DE SALDO */}
                 <div className="bg-gradient-to-r from-ecusol-primario to-blue-900 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-blue-200 text-xs font-bold uppercase mb-1">Saldo Disponible</p>
                        <div className="flex items-center justify-between">
                            <p className="text-4xl font-bold tracking-tight">
                                {saldo !== null ? formatMoney(saldo) : '---'}
                            </p>
                            <button onClick={cargarDatos} className="text-white/70 hover:text-white hover:rotate-180 transition-all p-1">
                                <RefreshCw size={20} />
                            </button>
                        </div>
                    </div>
                    {/* Decoración fondo */}
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                        <Wallet size={100} />
                    </div>
                 </div>
              </div>
           </div>
        </aside>

        {/* PANEL DERECHO: ÁREA DE TRANSACCIONES */}
        <main className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
           
           {/* TABS DE NAVEGACIÓN */}
           <div className="flex border-b border-gray-200 bg-gray-50/50">
              <button 
                onClick={() => setTab('DEPOSITO')}
                className={`flex-1 py-5 font-bold flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${tab === 'DEPOSITO' ? 'bg-white text-green-700 border-t-4 border-t-green-500 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <ArrowDownCircle /> DEPÓSITO
              </button>
              <button 
                onClick={() => setTab('RETIRO')}
                className={`flex-1 py-5 font-bold flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${tab === 'RETIRO' ? 'bg-white text-red-700 border-t-4 border-t-red-600 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <ArrowUpCircle /> RETIRO
              </button>
              <button 
                onClick={() => setTab('TRANSFERENCIA')}
                className={`flex-1 py-5 font-bold flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${tab === 'TRANSFERENCIA' ? 'bg-white text-blue-700 border-t-4 border-t-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <ArrowRightLeft /> TRANSFERENCIA
              </button>
           </div>

           {/* FORMULARIO */}
           <div className="p-8 sm:p-12 flex-1 flex flex-col items-center justify-center bg-white">
              
              <div className="w-full max-w-lg space-y-8">
                  <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {tab === 'DEPOSITO' && <span className="text-green-700">Ingreso de Efectivo</span>}
                        {tab === 'RETIRO' && <span className="text-red-700">Dispersión de Efectivo</span>}
                        {tab === 'TRANSFERENCIA' && <span className="text-blue-700">Transferencia a Terceros</span>}
                      </h2>
                      <p className="text-gray-400 text-sm mt-1">Complete los datos para procesar</p>
                  </div>

                  <form onSubmit={ejecutarOperacion} className="space-y-6">
                    
                    {/* CAMPO CUENTA DESTINO (Solo Transferencia) */}
                    {tab === 'TRANSFERENCIA' && (
                        <div className="animate-fade-in-down">
                          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Cuenta Destino</label>
                          <input 
                            type="text" 
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none font-mono text-lg transition-colors bg-gray-50 focus:bg-white"
                            placeholder="10XXXXXXXXXX"
                            value={destino}
                            onChange={e => setDestino(e.target.value)}
                            required
                          />
                        </div>
                    )}

                    {/* CAMPO MONTO */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Monto de la Operación</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl font-bold">$</span>
                            <input 
                              type="number" 
                              step="0.01"
                              className="w-full pl-10 p-4 text-4xl border-2 border-gray-200 rounded-xl focus:border-ecusol-primario focus:ring-0 outline-none font-bold text-gray-800 transition-colors"
                              placeholder="0.00"
                              value={monto}
                              onChange={e => setMonto(e.target.value)}
                              required
                            />
                        </div>
                    </div>

                    {/* CAMPO DESCRIPCIÓN */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Concepto / Referencia</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-ecusol-primario focus:ring-0 outline-none transition-colors"
                          placeholder="Ej: Depósito inicial..."
                          value={descripcion}
                          onChange={e => setDescripcion(e.target.value)}
                        />
                    </div>

                    {/* BOTÓN DE ACCIÓN */}
                    <button 
                      type="submit"
                      disabled={procesando}
                      className={`w-full py-5 rounded-xl text-white font-bold text-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex justify-center items-center gap-3 mt-4
                        ${tab === 'DEPOSITO' ? 'bg-green-600 hover:bg-green-700' : ''}
                        ${tab === 'RETIRO' ? 'bg-red-600 hover:bg-red-700' : ''}
                        ${tab === 'TRANSFERENCIA' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        disabled:opacity-70 disabled:cursor-not-allowed
                      `}
                    >
                      {procesando ? <Loader2 className="animate-spin" size={28}/> : 'PROCESAR AHORA'}
                    </button>

                  </form>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default MenuCajero;