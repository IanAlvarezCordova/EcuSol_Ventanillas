export interface LoginCajeroResponse {
  token: string;
}

export interface VentanillaOpDTO {
  numeroCuenta: string;
  cuentaDestino?: string; // Opcional (solo para transferencias)
  monto: number;
  descripcion: string;
}

// NUEVO: Para recibir saldo y nombre
export interface InfoCuentaDTO {
  numeroCuenta: string;
  titular: string;
  saldo: number;
  tipo: string;
}