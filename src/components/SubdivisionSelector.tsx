import React from 'react';

interface Props {
  primaryRegionId: string; // e.g. 'shoulder'
  language?: 'es' | 'en';
  subdivisions: { id: string; labelEs: string; labelEn?: string }[];
  onSelect: (subdivisionId: string) => void;
  onCancel?: () => void;
}

export default function SubdivisionSelector({
  primaryRegionId,
  language = 'es',
  subdivisions,
  onSelect,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded bg-white p-4 shadow-lg">
        <header className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{language === 'es' ? 'Seleccione subdivisión' : 'Select subdivision'}</h3>
          <div className="text-sm text-gray-500">{primaryRegionId}</div>
          <button aria-label="Cerrar" onClick={onCancel} className="text-sm text-gray-600">×</button>
        </header>

        <div className="grid gap-2">
          {subdivisions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="w-full rounded border px-3 py-2 text-left hover:bg-gray-50"
              aria-label={s.labelEs}
            >
              <div className="text-base font-medium">{language === 'es' ? s.labelEs : s.labelEn || s.labelEs}</div>
            </button>
          ))}
        </div>

        <footer className="mt-4 flex justify-end">
          <button onClick={onCancel} className="rounded bg-gray-100 px-3 py-1 text-sm">{language === 'es' ? 'Cancelar' : 'Cancel'}</button>
        </footer>
      </div>
    </div>
  );
}
