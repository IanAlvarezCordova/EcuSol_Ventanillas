import { Routes, Route, Navigate } from 'react-router-dom'; // SIN BrowserRouter
import { Toaster } from 'react-hot-toast';
import { useCajeroStore } from '@/store/useCajeroStore';

import LoginCajero from '@/pages/LoginCajero';
import MenuCajero from '@/pages/MenuCajero';
// OperacionCajero YA NO SE USA, bórralo de los imports si quieres

const RutaPrivada = ({ children }: { children: JSX.Element }) => {
  const token = useCajeroStore(state => state.token);
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginCajero />} />
        <Route path="/menu" element={
          <RutaPrivada><MenuCajero /></RutaPrivada>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster position="top-right" toastOptions={{
         duration: 4000,
         style: { background: '#333', color: '#fff' }
      }}/>
    </>
  );
}

export default App;