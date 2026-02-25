'use client';

import React, { useState } from 'react';

interface MigrationNotificationProps {
  status: 'pending' | 'needs-migration' | 'migrated' | 'no-migration' | 'error';
  error?: string;
  onDismiss: () => void;
  onMigrate?: () => void;
}

export function MigrationNotification({
  status,
  error,
  onDismiss,
  onMigrate,
}: MigrationNotificationProps) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss();
  };

  const handleMigrate = () => {
    setDismissed(true);
    if (onMigrate) {
      onMigrate();
    }
  };

  if (dismissed || status === 'pending' || status === 'no-migration') {
    return null;
  }

  if (status === 'needs-migration') {
    return (
      <div className="fixed top-4 right-4 max-w-md z-40 animate-slide-in">
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded shadow-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-xl">ℹ️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">
                Actualización Disponible
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Tu sistema de seguimiento puede actualizarse a anatomía más precisa con 60 regiones corporales.
              </p>
              <p className="text-xs text-blue-600 mb-3">
                Se crearemos una copia de seguridad de tus datos antes de proceder. Esto no eliminará nada.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleMigrate}
                  className="text-sm font-semibold px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Migrar Ahora
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Omitir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed top-4 right-4 max-w-sm z-40 animate-slide-in">
        <div className="bg-red-50 border-l-4 border-red-500 rounded shadow-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-500 text-xl">❌</span>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">
                Error en la Migración
              </h3>
              <p className="text-sm text-red-700 mb-3">
                {error || 'No se pudo migrar los datos al nuevo sistema.'}
              </p>
              <p className="text-xs text-red-600 mb-3">
                Tu información anterior se ha mantenido. Contacta al soporte si el problema persiste.
              </p>
              <button
                onClick={handleDismiss}
                className="text-sm font-semibold text-red-700 hover:text-red-900"
              >
                Descartar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'migrated') {
    return (
      <div className="fixed top-4 right-4 max-w-sm z-40 animate-slide-in">
        <div className="bg-green-50 border-l-4 border-green-500 rounded shadow-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✅</span>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-1">
                Migración Completada
              </h3>
              <p className="text-sm text-green-700 mb-3">
                Se ha actualizado el sistema de seguimiento a anatomía más precisa con 60 regiones corporales.
              </p>
              <p className="text-xs text-green-600 mb-3">
                Tus datos anteriores han sido migrados correctamente. Ahora puedes registrar dolor con mayor precisión.
              </p>
              <button
                onClick={handleDismiss}
                className="text-sm font-semibold text-green-700 hover:text-green-900"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
