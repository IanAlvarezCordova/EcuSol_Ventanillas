import { Routes, Route, Navigate } from 'react-router-dom'; // QUITÉ BrowserRouter de aquí
import { Toaster } from 'react-hot-toast';
import { useCajeroStore } from '@/store/useCajeroStore';

// Importa tus páginas del CAJERO
import LoginCajero from '@/pages/LoginCajero';
import MenuCajero from '@/pages/MenuCajero';
import OperacionCajero from '@/pages/OperacionCajero';

const RutaPrivada = ({ children }: { children: JSX.Element }) => {
  const token = useCajeroStore(state => state.token);
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
      {/* NO PONER BROWSERROUTER AQUÍ, YA ESTÁ EN MAIN.TSX */}
      <Routes>
        <Route path="/" element={<LoginCajero />} />
        
        <Route path="/menu" element={
          <RutaPrivada><MenuCajero /></RutaPrivada>
        } />
        
        <Route path="/operacion/:tipo" element={
          <RutaPrivada><OperacionCajero /></RutaPrivada>
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster position="bottom-center" toastOptions={{
        style: { fontSize: '1.2rem', padding: '16px', borderRadius: '12px', background: '#333', color: '#fff' }
      }}/>
    </>
  );
}

export default App;