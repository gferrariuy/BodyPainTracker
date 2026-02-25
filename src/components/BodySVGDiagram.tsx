'use client';

import React, { useState } from 'react';
import { PainSlider } from './PainSlider';
import SubdivisionSelector from './SubdivisionSelector';
import { bodyPartCatalog } from '../lib/body-parts';
import { bodyPartCatalogRefined } from '../lib/body-parts-refined';
import {
  getRegionVariantsForSide,
  getPrimaryRegionFromId,
  mapToLegacyDiagramId,
} from '../lib/body-parts-utils';
import { PainEntry } from '../lib/data-models';

interface BodySVGDiagramProps {
  location: 'front' | 'back';
  painEntry?: PainEntry;
  onBodyPartSelected: (bodyPartId: string, intensity: number) => void;
}

interface BodyPartPosition {
  id: string;
  x: number;
  y: number;
  radius: number;
}

const FRONT_BODY_PARTS: BodyPartPosition[] = [
  { id: 'head', x: 150, y: 40, radius: 25 },
  { id: 'neck', x: 150, y: 75, radius: 15 },
  { id: 'left_shoulder', x: 100, y: 95, radius: 18 },
  { id: 'right_shoulder', x: 200, y: 95, radius: 18 },
  { id: 'left_deltoid', x: 85, y: 110, radius: 16 },
  { id: 'right_deltoid', x: 215, y: 110, radius: 16 },
  { id: 'chest', x: 150, y: 125, radius: 25 },
  { id: 'left_bicep', x: 65, y: 135, radius: 15 },
  { id: 'right_bicep', x: 235, y: 135, radius: 15 },
  { id: 'abdomen', x: 150, y: 165, radius: 28 },
  { id: 'left_forearm', x: 50, y: 165, radius: 14 },
  { id: 'right_forearm', x: 250, y: 165, radius: 14 },
  { id: 'left_hip', x: 110, y: 200, radius: 18 },
  { id: 'right_hip', x: 190, y: 200, radius: 18 },
  { id: 'left_hand', x: 40, y: 200, radius: 12 },
  { id: 'right_hand', x: 260, y: 200, radius: 12 },
  { id: 'left_thigh', x: 110, y: 260, radius: 22 },
  { id: 'right_thigh', x: 190, y: 260, radius: 22 },
  { id: 'left_knee', x: 110, y: 320, radius: 16 },
  { id: 'right_knee', x: 190, y: 320, radius: 16 },
  { id: 'left_shin', x: 110, y: 370, radius: 14 },
  { id: 'right_shin', x: 190, y: 370, radius: 14 },
  { id: 'left_foot', x: 110, y: 405, radius: 12 },
  { id: 'right_foot', x: 190, y: 405, radius: 12 },
];

const BACK_BODY_PARTS: BodyPartPosition[] = [
  { id: 'neck', x: 150, y: 75, radius: 15 },
  { id: 'left_shoulder', x: 100, y: 95, radius: 18 },
  { id: 'right_shoulder', x: 200, y: 95, radius: 18 },
  { id: 'left_deltoid', x: 85, y: 110, radius: 16 },
  { id: 'right_deltoid', x: 215, y: 110, radius: 16 },
  { id: 'upper_back', x: 150, y: 125, radius: 25 },
  { id: 'left_tricep', x: 65, y: 135, radius: 15 },
  { id: 'right_tricep', x: 235, y: 135, radius: 15 },
  { id: 'mid_back', x: 150, y: 160, radius: 25 },
  { id: 'left_forearm', x: 50, y: 165, radius: 14 },
  { id: 'right_forearm', x: 250, y: 165, radius: 14 },
  { id: 'lower_back', x: 150, y: 195, radius: 28 },
  { id: 'left_glute', x: 110, y: 225, radius: 20 },
  { id: 'right_glute', x: 190, y: 225, radius: 20 },
  { id: 'left_thigh', x: 110, y: 275, radius: 22 },
  { id: 'right_thigh', x: 190, y: 275, radius: 22 },
  { id: 'left_shin', x: 110, y: 370, radius: 14 },
  { id: 'right_shin', x: 190, y: 370, radius: 14 },
  { id: 'left_foot', x: 110, y: 405, radius: 12 },
  { id: 'right_foot', x: 190, y: 405, radius: 12 },
];

export function BodySVGDiagram({
  location,
  painEntry,
  onBodyPartSelected,
}: BodySVGDiagramProps) {
  const [selectedBodyPartId, setSelectedBodyPartId] = useState<string | null>(
    null
  );
  const [sliderValue, setSliderValue] = useState(5);
  const [showSubdivisionSelector, setShowSubdivisionSelector] = useState(false);
  const [subdivisionsOptions, setSubdivisionsOptions] = useState<{
    id: string;
    labelEs: string;
  }[]>([]);
  const [pendingPrimaryRegion, setPendingPrimaryRegion] = useState<{
    primary: string;
    side: 'left' | 'right';
  } | null>(null);

  const bodyParts =
    location === 'front' ? FRONT_BODY_PARTS : BACK_BODY_PARTS;

  const handleBodyPartClick = (bodyPartId: string) => {
    // Derive primary region and side from legacy catalog when possible
    const legacy = bodyPartCatalog.parts[bodyPartId];
    const side = (legacy?.side as 'left' | 'right') || 'left';

    // Attempt to get primary region from refined utilities; fallback to category
    let primary = getPrimaryRegionFromId(bodyPartId) || '';
    if (!primary) {
      // Map common legacy categories to primary region keys
      const category = legacy?.category || '';
      const map: Record<string, string> = {
        shoulders: 'shoulder',
        arms: 'arm',
        forearms: 'forearm',
        hands: 'hand',
        back: 'dorsal',
        lower_back: 'lumbar',
        pelvis: 'sacroiliac',
        thighs: 'thigh',
        knees: 'knee',
        shins: 'shin',
        feet: 'foot',
      };
      primary = map[category] || category || bodyPartId.split('_').slice(1).join('_');
    }

    // Build subdivision options for this primary region and side
    const variants = getRegionVariantsForSide(primary, side);
    const options = variants.map((vid) => {
      const info = bodyPartCatalogRefined.parts[vid];
      // labelEs: text after '-' if present, otherwise full name
      const parts = info?.anatomicalName?.split('-') || [vid];
      const labelEs = parts.length > 1 ? parts[1].trim() : info?.anatomicalName || vid;
      return { id: vid, labelEs };
    });

    if (options.length > 0) {
      setSubdivisionsOptions(options);
      setPendingPrimaryRegion({ primary, side });
      setShowSubdivisionSelector(true);
      return;
    }

    // Fallback: open slider directly for clicked id
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

  const getColorForIntensity = (intensity?: number): string => {
    if (!intensity) return '#e5e7eb';
    if (intensity <= 3) return '#fef08a';
    if (intensity <= 6) return '#fed7aa';
    if (intensity <= 8) return '#fca5a5';
    return '#dc2626';
  };

  const title = location === 'front' ? 'Vista Frontal' : 'Vista Trasera';

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>

      <div className="relative w-full flex justify-center">
        <svg
          viewBox="0 0 300 430"
          className="w-full max-w-xs h-auto"
          style={{ aspectRatio: '300/430' }}
        >
          {/* Body outline */}
          {location === 'front' ? (
            <>
              {/* Head */}
              <circle cx="150" cy="40" r="25" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" />
              {/* Neck */}
              <rect x="140" y="65" width="20" height="15" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" />
              {/* Torso */}
              <path
                d="M 120 85 L 80 130 L 90 200 L 120 220 L 150 220 L 180 220 L 210 200 L 220 130 L 180 85 Z"
                fill="#f3f4f6"
                stroke="#9ca3af"
                strokeWidth="2"
              />
              {/* Left arm */}
              <path d="M 80 95 Q 50 120 40 200" stroke="#9ca3af" strokeWidth="16" fill="none" strokeLinecap="round" />
              {/* Right arm */}
              <path d="M 220 95 Q 250 120 260 200" stroke="#9ca3af" strokeWidth="16" fill="none" strokeLinecap="round" />
              {/* Left leg */}
              <path d="M 130 220 L 110 320 L 110 405" stroke="#9ca3af" strokeWidth="18" fill="none" strokeLinecap="round" />
              {/* Right leg */}
              <path d="M 170 220 L 190 320 L 190 405" stroke="#9ca3af" strokeWidth="18" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Head (back view) */}
              <circle cx="150" cy="40" r="25" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" />
              {/* Neck */}
              <rect x="140" y="65" width="20" height="15" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" />
              {/* Back torso */}
              <path
                d="M 120 85 L 80 130 L 90 200 L 120 230 L 150 240 L 180 230 L 210 200 L 220 130 L 180 85 Z"
                fill="#f3f4f6"
                stroke="#9ca3af"
                strokeWidth="2"
              />
              {/* Left arm (back) */}
              <path d="M 80 95 Q 50 120 40 200" stroke="#9ca3af" strokeWidth="16" fill="none" strokeLinecap="round" />
              {/* Right arm (back) */}
              <path d="M 220 95 Q 250 120 260 200" stroke="#9ca3af" strokeWidth="16" fill="none" strokeLinecap="round" />
              {/* Left leg */}
              <path d="M 130 235 L 110 330 L 110 405" stroke="#9ca3af" strokeWidth="18" fill="none" strokeLinecap="round" />
              {/* Right leg */}
              <path d="M 170 235 L 190 330 L 190 405" stroke="#9ca3af" strokeWidth="18" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Body part circles (clickable areas) */}
          {bodyParts.map((part) => {
            // Find all entries that map to this legacy diagram ID
            let intensity: number | undefined;
            if (painEntry?.bodyPartEntries) {
              const mappedIntensities: number[] = [];
              for (const [regionId, entry] of Object.entries(painEntry.bodyPartEntries)) {
                const legacyId = mapToLegacyDiagramId(regionId);
                if (legacyId === part.id) {
                  mappedIntensities.push(entry.intensityLevel);
                }
              }
              // Use the maximum intensity from all mapped entries
              if (mappedIntensities.length > 0) {
                intensity = Math.max(...mappedIntensities);
              }
            }

            const color = getColorForIntensity(intensity);
            const isSelected = selectedBodyPartId === part.id;

            return (
              <g key={part.id} style={{ cursor: 'pointer' }}>
                <circle
                  cx={part.x}
                  cy={part.y}
                  r={part.radius}
                  fill={color}
                  stroke={isSelected ? '#1f2937' : '#6b7280'}
                  strokeWidth={isSelected ? 4 : 2}
                  className="transition-all hover:opacity-80"
                  onClick={() => handleBodyPartClick(part.id)}
                />
                <title>
                  {bodyPartCatalog.parts[part.id]?.anatomicalName || part.id}
                </title>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-200 border border-gray-400"></div>
          <span className="text-xs">Leve (1-3)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-orange-200 border border-gray-400"></div>
          <span className="text-xs">Moderado (4-6)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-200 border border-gray-400"></div>
          <span className="text-xs">Severo (7-8)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-600 border border-gray-400"></div>
          <span className="text-xs">Muy Severo (9-10)</span>
        </div>
      </div>

      {showSubdivisionSelector && pendingPrimaryRegion && (
        <SubdivisionSelector
          primaryRegionId={pendingPrimaryRegion.primary}
          subdivisions={subdivisionsOptions.map((s) => ({ id: s.id, labelEs: s.labelEs }))}
          onSelect={(subId) => {
            // Open slider for selected subdivision
            const existingEntry = painEntry?.bodyPartEntries[subId];
            setSelectedBodyPartId(subId);
            setSliderValue(existingEntry?.intensityLevel || 5);
            setShowSubdivisionSelector(false);
            setPendingPrimaryRegion(null);
          }}
          onCancel={() => {
            setShowSubdivisionSelector(false);
            setPendingPrimaryRegion(null);
          }}
        />
      )}

      {selectedBodyPartId && (
        <PainSlider
          value={sliderValue}
          onChange={setSliderValue}
          onConfirm={handleSliderConfirm}
          onCancel={handleSliderCancel}
          regionId={selectedBodyPartId}
        />
      )}
    </div>
  );
}
