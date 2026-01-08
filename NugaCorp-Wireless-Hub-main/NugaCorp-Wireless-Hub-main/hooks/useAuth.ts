import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';

/**
 * Hook useAuth
 * Acceso seguro al contexto de autenticación
 * 
 * Lanza error si se usa fuera de AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de <AuthProvider>');
  }
  
  return context;
}
