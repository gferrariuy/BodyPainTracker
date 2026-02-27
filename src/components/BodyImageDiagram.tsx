'use client';

import React from 'react';

export interface BodyPartArea {
  /** matches ids from bodyPartCatalog or refined catalog */
  id: string;
  /** html map coords string (x1,y1,x2,y2,... depending on shape) */
  coords: string;
  shape: 'poly' | 'rect' | 'circle';
  /** human-readable label shown in tooltip/aria */
  label?: string;
}

interface BodyImageDiagramProps {
  /** relative path to the body image containing front+back views */
  src: string;
  areas: BodyPartArea[];
  /** callback receives only the bodyPartId; parent is responsible for prompting intensity/type */
  onBodyPartSelected: (bodyPartId: string) => void;
  /** id used for the html map element */
  mapName?: string;
  /** base size attributes for image (optional) */
  width?: number;
  height?: number;
}

export function BodyImageDiagram({
  src,
  areas,
  onBodyPartSelected,
  mapName = 'bodymap',
  width,
  height,
}: BodyImageDiagramProps) {
  const handleClick = (e: React.MouseEvent<HTMLAreaElement>, id: string) => {
    e.preventDefault();
    onBodyPartSelected(id);
  };

  return (
    <div className="body-image-diagram relative">
      <img
        src={src}
        useMap={`#${mapName}`}
        alt="Diagrama corporal" // consider i18n
        className="w-full h-auto"
        {...(width ? { width } : {})}
        {...(height ? { height } : {})}
      />
      <map name={mapName}>
        {areas.map((area) => {
          // convert canonical id to human text (with optional Spanish translation)
          const toDisplay = (id: string) => {
            const map: Record<string, string> = {
              neck: 'cuello',
              left: 'izquierda',
              right: 'derecha',
              anterior: 'anterior',
              posterior: 'posterior',
              superior: 'superior',
              inferior: 'inferior',
              dorsal: 'dorsal',
              groin: 'ingle',
              thigh: 'muslo',
              shin: 'espinilla',
              forearm: 'antebrazo',
              arm: 'brazo',
              shoulder: 'hombro',
              lumbar: 'lumbar',
              gluteal: 'glúteo',
              ankle: 'tobillo',
              foot: 'pie',
              hand: 'mano',
              knee: 'rodilla',
              sacroiliac: 'sacroilíaco',
            };
            return id
              .split('_')
              .map((w) => map[w] || w)
              .join(' ');
          };

          const display = area.label || toDisplay(area.id);
          return (
            <area
              key={area.id}
              shape={area.shape}
              coords={area.coords}
              href="#"
              title={display}
              aria-label={display}
              style={{ cursor: 'pointer' }}
              onClick={(e) => handleClick(e, area.id)}
            />
          );
        })}
      </map>
    </div>
  );
}
