'use client';

import React, { useState, useRef } from 'react';

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
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLAreaElement>, id: string) => {
    e.preventDefault();
    onBodyPartSelected(id);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLMapElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTooltipPos({ x, y });

    // Check which area the mouse is over
    let foundArea: string | null = null;
    for (const area of areas) {
      if (isPointInArea(x, y, area)) {
        foundArea = area.id;
        break;
      }
    }
    setHoveredArea(foundArea);
  };

  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  const isPointInArea = (x: number, y: number, area: BodyPartArea): boolean => {
    const coords = area.coords.split(',').map(Number);

    if (area.shape === 'poly') {
      // Point in polygon test (ray casting algorithm)
      let inside = false;
      for (let i = 0, j = coords.length - 2; i < coords.length; i += 2) {
        const xi = coords[i];
        const yi = coords[i + 1];
        const xj = coords[j];
        const yj = coords[j + 1];

        const intersect =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
        j = i;
      }
      return inside;
    } else if (area.shape === 'rect') {
      const [x1, y1, x2, y2] = coords;
      return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    } else if (area.shape === 'circle') {
      const [cx, cy, r] = coords;
      return (x - cx) ** 2 + (y - cy) ** 2 <= r ** 2;
    }
    return false;
  };

  const getDisplayText = (id: string) => {
    const translationMap: Record<string, string> = {
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
      .map((w) => translationMap[w] || w)
      .join(' ');
  };

  return (
    <div className="body-image-diagram relative" ref={containerRef}>
      <img
        src={src}
        useMap={`#${mapName}`}
        alt="Diagrama corporal"
        className="w-full h-auto"
        {...(width ? { width } : {})}
        {...(height ? { height } : {})}
      />
      <map name={mapName} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        {areas.map((area) => (
          <area
            key={area.id}
            shape={area.shape}
            coords={area.coords}
            href="#"
            aria-label={getDisplayText(area.id)}
            style={{ cursor: 'pointer' }}
            onClick={(e) => handleClick(e, area.id)}
          />
        ))}
      </map>

      {/* Custom Tooltip */}
      {hoveredArea && (
        <div
          className="fixed bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium pointer-events-none shadow-lg whitespace-nowrap z-50"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 40}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {getDisplayText(hoveredArea)}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
