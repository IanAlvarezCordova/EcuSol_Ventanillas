import { apiClient } from "./apiClient";
import { LoginCajeroResponse, VentanillaOpDTO, InfoCuentaDTO } from "@/types";

export const cajeroService = {
  // 1. VALIDACIÓN DEL CLIENTE (Antes se llamaba 'login')
  // Este es el que te estaba dando error. Ahora se llama authCliente.
  authCliente: async (numeroCuenta: string, password: string) => {
    return await apiClient<LoginCajeroResponse>('/auth/login-cajero', {
      method: 'POST',
      body: JSON.stringify({ numeroCuenta, password }),
    });
  },

  // 2. OBTENER INFO (Saldo y Nombre)
  obtenerInfo: async (numeroCuenta: string) => {
    return await apiClient<InfoCuentaDTO>(`/ventanilla/info/${numeroCuenta}`, {
      method: 'GET'
    });
  },

  // 3. OPERACIONES
  depositar: async (datos: VentanillaOpDTO) => {
    return await apiClient<string>(`/ventanilla/deposito?sucursalId=1`, {
      method: 'POST', body: JSON.stringify(datos)
    });
  },

  retirar: async (datos: VentanillaOpDTO) => {
    return await apiClient<string>(`/ventanilla/retiro?sucursalId=1`, {
      method: 'POST', body: JSON.stringify(datos)
    });
  },

  transferir: async (datos: VentanillaOpDTO) => {
    return await apiClient<string>(`/ventanilla/transferencia?sucursalId=1`, {
      method: 'POST', body: JSON.stringify(datos)
    });
  }
};