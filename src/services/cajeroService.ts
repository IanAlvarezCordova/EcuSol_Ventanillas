// src/services/cajeroService.ts
import { apiClient } from "./apiClient";
import { LoginCajeroResponse, VentanillaOpDTO } from "@/types";

export const cajeroService = {
  // 1. Login Simulado (Validar Cuenta y Pass)
  login: async (numeroCuenta: string, password: string) => {
    return await apiClient<LoginCajeroResponse>('/auth/login-cajero', {
      method: 'POST',
      body: JSON.stringify({ numeroCuenta, password }),
    });
  },

  // 2. Operaciones (Sucursal ID 1 hardcodeado para demo)
  depositar: async (datos: VentanillaOpDTO) => {
    return await apiClient<string>(`/ventanilla/deposito?sucursalId=1`, {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  retirar: async (datos: VentanillaOpDTO) => {
    return await apiClient<string>(`/ventanilla/retiro?sucursalId=1`, {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  }
};