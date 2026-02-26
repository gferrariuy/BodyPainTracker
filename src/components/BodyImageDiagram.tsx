'use client';

import React from 'react';
import type { PainTypeCode } from '../lib/types/painType';

export interface BodyPartArea {
  /** matches ids from bodyPartCatalog or refined catalog */
  id: string;
  /** html map coords string (x1,y1,x2,y2,... depending on shape) */
  coords: string;
  shape: 'poly' | 'rect' | 'circle';
  label?: string; // accessible name override
}

interface BodyImageDiagramProps {
  /** relative path to the body image containing front+back views */
  src: string;
  areas: BodyPartArea[];
  onBodyPartSelected: (bodyPartId: string, intensity: number, painType: PainTypeCode) => void;
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
    // default intensity and type; caller will prompt slider afterwards
    onBodyPartSelected(id, 5, 'unknown');
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
        {areas.map((area) => (
          <area
            key={area.id}
            shape={area.shape}
            coords={area.coords}
            href="#"
            aria-label={area.label || area.id}
            onClick={(e) => handleClick(e, area.id)}
          />
        ))}
      </map>
    </div>
  );
}
