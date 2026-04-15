import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    let errorMessage = "Algo salió mal. Por favor, intenta de nuevo.";
    let isFirebaseError = false;

    try {
      if (error?.message) {
        const parsed = JSON.parse(error.message);
        if (parsed.error && parsed.operationType) {
          isFirebaseError = true;
          if (parsed.error.includes("insufficient permissions")) {
            errorMessage = "No tienes permisos suficientes para realizar esta acción.";
          } else {
            errorMessage = `Error de base de datos: ${parsed.error}`;
          }
        }
      }
    } catch {
      // Not a JSON error
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Ups!</h2>
        <p className="text-gray-600 mb-6 max-w-md">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Recargar página
        </button>
        {isFirebaseError && (
          <p className="mt-4 text-xs text-gray-400">
            ID de error: {Math.random().toString(36).substr(2, 9)}
          </p>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
