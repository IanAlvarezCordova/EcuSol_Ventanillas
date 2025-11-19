import { useCajeroStore } from "@/store/useCajeroStore";

const BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const { token, logout } = useCajeroStore.getState();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 1. Leer texto crudo UNA SOLA VEZ para evitar "body stream already read"
    const rawResponse = await response.text();

    // 2. Manejo de sesión expirada (401/403)
    if ((response.status === 401 || response.status === 403) && !endpoint.includes('/auth/login-cajero')) {
      logout();
      window.location.href = '/'; // Redirigir al login del cajero
      throw new Error('Su sesión ha expirado.');
    }

    // 3. Si hay error del servidor (400, 500, etc)
    if (!response.ok) {
      let errorMessage = 'Ocurrió un error inesperado';
      try {
        const errorJson = JSON.parse(rawResponse);
        if (errorJson.message) errorMessage = errorJson.message;
      } catch {
        if (rawResponse) errorMessage = rawResponse;
      }
      throw new Error(errorMessage);
    }

    // 4. Respuesta exitosa
    try {
        // Si el string está vacío, devolvemos objeto vacío, si no, parseamos
        return rawResponse ? JSON.parse(rawResponse) : ({} as T);
    } catch {
        // Si es texto plano (ej: "Operación exitosa"), lo devolvemos tal cual
        return rawResponse as unknown as T;
    }

  } catch (error: any) {
    console.error("API Error:", error);
    throw error; 
  }
};