# Contract: Body Diagram Specification

**Version**: 1.0 | **Status**: Specification | **Date**: 2026-02-24

## Overview

This document specifies the Structure, anatomy, and interaction model for the interactive body diagrams (front and back views) with 30+ clickable anatomical regions.

## Diagram Specifications

### General Requirements

- **Format**: SVG (Scalable Vector Graphics)
- **Regions**: 30+ anatomically specific body parts
- **Views**: 2 diagrams (front and back)
- **Interactivity**: Clickable regions trigger pain intensity input
- **Accessibility**: ARIA labels, semantic regions, keyboard navigation

### Dimensions

- **Viewbox**: 200x600 (proportions: width:height = 1:3)
- **Width (responsive)**: 100% of container (max 400px on desktop)
- **Height (responsive)**: Maintains aspect ratio
- **Mobile**: Full width, stackable layout

---

## Front View Diagram

### Layout

- **Head region**: Top (y: 0-50)
- **Neck region**: (y: 50-70)
- **Torso**: Shoulders, arms, chest, abdomen (y: 70-350)
- **Legs**: Hips, thighs, knees, shins (y: 350-500)
- **Feet**: (y: 500-600)

### Body Parts (Front View)

| ID | Anatomical Name | Position | Type | Colors |
|----|-----------------|----------|------|--------|
| `head` | Head | (100, 35) r=30 | Circle | Skin |
| `neck` | Neck | (100, 70) rect | Rectangle | Skin |
| `left_shoulder` | Left Shoulder | (60, 110) | Circle | Skin |
| `right_shoulder` | Right Shoulder | (140, 110) | Circle | Skin |
| `left_deltoid` | Left Deltoid | (50, 130) | Path | Muscle |
| `right_deltoid` | Right Deltoid | (150, 130) | Path | Muscle |
| `left_bicep` | Left Bicep | (40, 180) | Path | Muscle |
| `right_bicep` | Right Bicep | (160, 180) | Path | Muscle |
| `left_forearm` | Left Forearm | (30, 250) | Path | Skin |
| `right_forearm` | Right Forearm | (170, 250) | Path | Skin |
| `left_hand` | Left Hand | (20, 320) | Circle | Skin |
| `right_hand` | Right Hand | (180, 320) | Circle | Skin |
| `chest` | Chest | (100, 200) | Path | Ribcage |
| `abdomen` | Abdomen | (100, 280) | Path | Organ |
| `left_breast` | Left Breast | (80, 200) | Circle | Skin |
| `right_breast` | Right Breast | (120, 200) | Circle | Skin |
| `left_hip` | Left Hip | (70, 340) | Circle | Bone |
| `right_hip` | Right Hip | (130, 340) | Circle | Bone |
| `left_thigh` | Left Thigh | (70, 420) | Path | Muscle |
| `right_thigh` | Right Thigh | (130, 420) | Path | Muscle |
| `left_knee` | Left Knee | (70, 480) | Circle | Joint |
| `right_knee` | Right Knee | (130, 480) | Circle | Joint |
| `left_shin` | Left Shin | (70, 540) | Path | Skin |
| `right_shin` | Right Shin | (130, 540) | Path | Skin |
| `left_foot` | Left Foot | (70, 590) | Path | Skin |
| `right_foot` | Right Foot | (130, 590) | Path | Skin |

---

## Back View Diagram

### Layout

- **Neck region**: (y: 50-70)
- **Torso**: Back muscles, spine (y: 70-350)
- **Legs**: Gluteals, thighs, calves (y: 350-500)
- **Feet**: (y: 500-600)

### Body Parts (Back View)

| ID | Anatomical Name | Position | Type |
|----|-----------------|----------|------|
| `neck` | Neck | (100, 70) | Rectangle |
| `upper_back` | Upper Back (Trapezius) | (100, 150) | Path |
| `mid_back` | Mid Back (Rhomboid) | (100, 220) | Path |
| `lower_back` | Lower Back (Lumbar) | (100, 280) | Path |
| `left_shoulder` | Left Shoulder | (60, 110) | Circle |
| `right_shoulder` | Right Shoulder | (140, 110) | Circle |
| `left_deltoid` | Left Deltoid | (50, 130) | Path |
| `right_deltoid` | Right Deltoid | (150, 130) | Path |
| `left_glute` | Left Gluteal | (70, 340) | Path |
| `right_glute` | Right Gluteal | (130, 340) | Path |
| `left_thigh` | Left Thigh | (70, 420) | Path |
| `right_thigh` | Right Thigh | (130, 420) | Path |
| `left_knee` | Left Knee | (70, 480) | Circle |
| `right_knee` | Right Knee | (130, 480) | Circle |
| `left_shin` | Left Shin | (70, 540) | Path |
| `right_shin` | Right Shin | (130, 540) | Path |
| `left_foot` | Left Foot | (70, 590) | Path |
| `right_foot` | Right Foot | (130, 590) | Path |

---

## SVG Structure

### Template

```xml
<svg 
  viewBox="0 0 200 600" 
  xmlns="http://www.w3.org/2000/svg"
  className="body-diagram"
  role="application"
  aria-label="Interactive Body Diagram - Front View"
>
  <!-- Front view body outline and regions -->
  
  <!-- Head -->
  <circle 
    id="head" 
    cx="100" cy="35" 
    r="30" 
    className="body-part" 
    role="button"
    tabindex="0"
    aria-label="Head"
    data-body-part-id="head"
  />
  
  <!-- Left Deltoid -->
  <path 
    id="left_deltoid" 
    d="M 50 110 L 30 140 L 70 140 Z" 
    className="body-part" 
    role="button"
    tabindex="0"
    aria-label="Left Deltoid (Shoulder)"
    data-body-part-id="left_deltoid"
  />
  
  <!-- ... more regions ... -->
</svg>
```

### SVG Classes

```css
/* Base styles */
.body-diagram {
  width: 100%;
  max-width: 400px;
  height: auto;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  padding: 16px;
}

/* Body part regions */
.body-part {
  fill: #e0e7ff;
  stroke: #6366f1;
  stroke-width: 1;
  cursor: pointer;
  transition: fill 0.2s, stroke 0.2s;
}

.body-part:hover {
  fill: #c7d2fe;
  stroke: #4f46e5;
  stroke-width: 2;
}

.body-part:focus {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

.body-part[data-selected="true"] {
  fill: #a5b4fc;
  stroke: #4f46e5;
  stroke-width: 2;
}

.body-part[data-pain-level="1-3"] {
  fill: #fef3c7;  /* Light yellow - mild */
}

.body-part[data-pain-level="4-6"] {
  fill: #fed7aa;  /* Orange - moderate */
}

.body-part[data-pain-level="7-10"] {
  fill: #fecaca;  /* Red - severe */
}
```

---

## Interaction Model

### Click Handler

```typescript
interface BodyPartClickEvent extends React.MouseEvent<SVGElement> {
  currentTarget: SVGElement;
}

function handleBodyPartClick(event: BodyPartClickEvent) {
  const bodyPartId = event.currentTarget.getAttribute('data-body-part-id');
  
  // 1. Emit event with body part ID
  onBodyPartSelected(bodyPartId);
  
  // 2. Visual feedback: highlight region
  event.currentTarget.setAttribute('data-selected', 'true');
  
  // 3. Trigger slider UI for pain input
  showPainSlider(bodyPartId);
}
```

### Keyboard Navigation

Navigate using arrow keys and Enter to select:

```typescript
function handleKeyDown(event: React.KeyboardEvent<SVGElement>) {
  const bodyPartId = event.currentTarget.getAttribute('data-body-part-id');
  
  switch (event.key) {
    case 'Enter':
    case ' ':
      onBodyPartSelected(bodyPartId);
      showPainSlider(bodyPartId);
      break;
    case 'ArrowDown':
      focusNextBodyPart();
      break;
    case 'ArrowUp':
      focusPreviousBodyPart();
      break;
    default:
      break;
  }
}
```

### Touch Handling

Native touch events on mobile:

```typescript
function handleTouchStart(event: React.TouchEvent<SVGElement>) {
  const touch = event.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  
  if (element?.classList.contains('body-part')) {
    const bodyPartId = element.getAttribute('data-body-part-id');
    onBodyPartSelected(bodyPartId);
    showPainSlider(bodyPartId);
  }
}
```

---

## Visual State Management

### Diagram States

```typescript
type BodyPartState = 'idle' | 'selected' | 'recorded' | 'hover';

interface BodyPartVisualState {
  bodyPartId: string;
  state: BodyPartState;
  painLevel?: number;  // 1-10 if recorded
  isHovered: boolean;
  isFocused: boolean;
}
```

### State-to-Color Mapping

```typescript
const stateColors = {
  idle: '#e0e7ff',        // Light indigo
  selected: '#a5b4fc',    // Medium indigo
  recorded: '#fecaca',    // Red (based on pain level)
  hover: '#c7d2fe',       // Lighter indigo
};

function getBodyPartColor(state: BodyPartVisualState): string {
  if (state.painLevel) {
    if (state.painLevel <= 3) return '#fef3c7';  // Mild (yellow)
    if (state.painLevel <= 6) return '#fed7aa';  // Moderate (orange)
    return '#fecaca';                             // Severe (red)
  }
  return stateColors[state.state] || stateColors.idle;
}
```

---

## Responsive Design

### Desktop (1024px+)

- Diagram width: 300px
- Regions proportionally sized for mouse interaction
- Touch targets: 40x40px minimum

### Tablet (768px-1023px)

- Diagram width: 80% of container, max 300px
- Regions: Slightly increased for touch accuracy
- Touch targets: 44x44px minimum

### Mobile (320px-767px)

- Diagram width: 100%, padding: 16px
- Diagram stacks vertically if needed
- Front and back on separate screens OR tabs
- Touch targets: 48x48px minimum

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <BodyDiagram location="front" />
  <BodyDiagram location="back" />
</div>
```

---

## Accessibility (WCAG 2.1 AA)

### ARIA Labels

Every body part region must have descriptive label:

```xml
<path 
  id="left_deltoid"
  aria-label="Left Deltoid (Shoulder) - Click to record pain level"
  role="button"
  tabindex="0"
/>
```

### Keyboard Navigation

- Tab through all regions
- Enter or Space to select
- Arrow keys to move focus
- Escape to deselect

### Screen Reader Support

```xml
<svg role="application">
  <!-- Large regions with >50px² area -->
  <!-- All regions > 44x44px touch target -->
  <!-- ARIA labels on all regions -->
</svg>
```

---

## Testing Checklist

- [ ] All 30+ regions defined and clickable
- [ ] Front and back diagrams display correctly
- [ ] Click events trigger slider UI
- [ ] Keyboard navigation works (Tab, Arrow, Enter)
- [ ] Touch events work on mobile
- [ ] Selected region visually highlighted
- [ ] Recorded pain levels color-coded
- [ ] Responsive on all breakpoints (320px-2560px)
- [ ] ARIA labels accessible to screen readers
- [ ] Touch targets ≥44x44px on mobile
- [ ] SVG loads without lag (< 50ms)
- [ ] Diagram remains clickable while slider visible

---

## Future Enhancements (Out of Scope)

- Animation on hover
- Gradient fills by pain severity
- 3D rotate view (advanced)
- Custom body measurements (future personalization)
- Pain "heat map" visualization across historical data
