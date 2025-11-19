import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CajeroState {
  token: string | null;
  numeroCuentaActiva: string | null;
  login: (token: string, numeroCuenta: string) => void;
  logout: () => void;
}

export const useCajeroStore = create<CajeroState>()(
  persist(
    (set) => ({
      token: null,
      numeroCuentaActiva: null,
      login: (token, numeroCuenta) => set({ token, numeroCuentaActiva: numeroCuenta }),
      logout: () => set({ token: null, numeroCuentaActiva: null }),
    }),
    { name: 'ecusol-cajero' }
  )
);