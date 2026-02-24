'use client';

import React, { useState } from 'react';
import { PainSlider } from './PainSlider';
import { BodyPartButton } from './BodyPartButton';
import { bodyPartCatalog } from '../lib/body-parts';
import { PainEntry } from '../lib/data-models';

interface BodyDiagramProps {
  location: 'front' | 'back';
  painEntry?: PainEntry;
  onBodyPartSelected: (bodyPartId: string, intensity: number) => void;
}

export function BodyDiagram({
  location,
  painEntry,
  onBodyPartSelected,
}: BodyDiagramProps) {
  const [selectedBodyPartId, setSelectedBodyPartId] = useState<string | null>(
    null
  );
  const [sliderValue, setSliderValue] = useState(5);

  const bodyPartIds =
    location === 'front'
      ? bodyPartCatalog.frontDiagram
      : bodyPartCatalog.backDiagram;

  const visibleParts = bodyPartIds
    .map((id) => bodyPartCatalog.parts[id])
    .filter(Boolean);

  const handleBodyPartClick = (bodyPartId: string) => {
    const existingEntry = painEntry?.bodyPartEntries[bodyPartId];
    setSelectedBodyPartId(bodyPartId);
    setSliderValue(existingEntry?.intensityLevel || 5);
  };

  const handleSliderConfirm = () => {
    if (selectedBodyPartId) {
      onBodyPartSelected(selectedBodyPartId, sliderValue);
      setSelectedBodyPartId(null);
    }
  };

  const handleSliderCancel = () => {
    setSelectedBodyPartId(null);
  };

  const title = location === 'front' ? 'Front View' : 'Back View';

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full mb-6">
        {visibleParts.map((part) => (
          <BodyPartButton
            key={part.id}
            id={part.id}
            name={part.abbreviation || part.anatomicalName}
            intensityLevel={painEntry?.bodyPartEntries[part.id]?.intensityLevel}
            isSelected={selectedBodyPartId === part.id}
            onClick={() => handleBodyPartClick(part.id)}
          />
        ))}
      </div>

      {selectedBodyPartId && (
        <PainSlider
          value={sliderValue}
          onChange={setSliderValue}
          onConfirm={handleSliderConfirm}
          onCancel={handleSliderCancel}
          bodyPartName={
            bodyPartCatalog.parts[selectedBodyPartId]?.anatomicalName ||
            'Body Part'
          }
        />
      )}
    </div>
  );
}
