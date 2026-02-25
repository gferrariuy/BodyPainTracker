# Feature Specification: Añadir tipo de dolor al registro

**Feature Branch**: `1-add-pain-type`  
**Created**: 2026-02-25  
**Status**: Draft  
**Input**: User description: "al mismo momento que se indica la intensidad del dolor, se debe indicar el tipo de dolor. los posibles valores son Pulsátil, Ardor, Eléctrico, Punzante, Profundo, Rigidez, Sensibilidad al tacto"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar dolor con intensidad y tipo (Priority: P1)

Un usuario registra un nuevo episodio de dolor seleccionando la región corporal y, tras indicar la intensidad, selecciona el tipo de dolor de una lista predefinida.

**Why this priority**: Es el flujo principal de captura de datos; asegurar que cada registro contenga tipo y intensidad mejora la calidad de los datos para estadísticas y tratamiento.

**Independent Test**: Abrir la pantalla de registro, seleccionar región → subdivisión → mover el slider de intensidad → seleccionar tipo de dolor → confirmar. Verificar que el registro aparece en historial con ambos campos.

**Acceptance Scenarios**:

1. **Given** app abierta y usuario en la pantalla principal, **When** selecciona región, subdivisión y ajusta intensidad, **Then** debe seleccionarse obligatoriamente un `tipo de dolor` antes de permitir guardar.
2. **Given** se intenta guardar sin tipo, **When** pulsa "Guardar", **Then** aparece validación y no se persiste hasta escoger tipo.
3. **Given** un registro guardado, **When** se visualiza en historial, **Then** muestra intensidad y tipo claramente.

---

### User Story 2 - Filtrar y agregar estadísticas por tipo (Priority: P2)

Un usuario en la vista Estadísticas puede filtrar y agrupar registros por `tipo de dolor` para ver qué tipos predominan en el tiempo.

**Why this priority**: Añade valor analítico y ayuda a identificar patrones clínicos.

**Independent Test**: Ir a Estadísticas → seleccionar filtro "Tipo de dolor: Punzante" → verificar que las métricas y ranking muestran sólo entradas de ese tipo.

**Acceptance Scenarios**:

1. **Given** hay registros con distintos tipos, **When** filtro por un tipo, **Then** métricas (conteo, promedio intensidad) sólo consideran ese subconjunto.

---

### User Story 3 - Editar registro para corregir tipo (Priority: P3)

Un usuario puede editar un registro previo y cambiar su `tipo de dolor` si se equivocó.

**Why this priority**: Mejora calidad de datos y corrige errores de entrada.

**Independent Test**: Abrir historial → editar entrada → cambiar tipo → guardar → comprobar histórico actualizado.

**Acceptance Scenarios**:

1. **Given** un registro existente, **When** se edita tipo y se guarda, **Then** el cambio se refleja en historial y estadísticas.

---

### Edge Cases

- Usuario intenta introducir un tipo no listado (debe rechazarse o almacenarse como "Otro" si se decide soportar).  
- Migración de registros legacy sin tipo: deben marcarse como `tipo: desconocido` y notificar al usuario la opción de editar.  
- Conexión lenta / localStorage llena: guardar en cola y avisar al usuario si no fue posible persistir.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir seleccionar un `tipo de dolor` al mismo tiempo que se guarda la intensidad. (Obligatorio)
- **FR-002**: La lista de valores permitidos es: Pulsátil, Ardor, Eléctrico, Punzante, Profundo, Rigidez, Sensibilidad al tacto.
- **FR-003**: No se permitirá guardar un registro sin que esté seleccionado un `tipo de dolor` (validación en UI y en lógica de persistencia).
- **FR-004**: El `tipo de dolor` será almacenado como un campo enumerado en cada `PainEntry` y deberá ser compatible con el esquema de migración (registros legacy sin tipo deben mapearse a `desconocido`).
- **FR-005**: La vista de Estadísticas MUST soportar filtrar y agrupar por `tipo de dolor` y calcular métricas (conteo, promedio de intensidad) por tipo.
- **FR-006**: La edición de un `PainEntry` debe permitir actualizar el `tipo de dolor` y re-calcular métricas correspondientes.
- **FR-007**: Los mensajes y etiquetas del `tipo de dolor` deben estar localizables (soporte al menos para español y inglés) — (Asunción: aplicación principal ya soporta i18n).
- **FR-008**: UI debe ofrecer selección accesible (rol, aria-label, foco teclado) y prevenir pérdida de datos accidental (confirmación si hay cambios no guardados).

### Key Entities *(include if feature involves data)*

- **PainEntry**: representacion de un registro de dolor. Atributos clave: `id`, `timestamp`, `regionId`, `subregionId?`, `intensity` (1-10), `painType` (enum), `note?`, `migratedFromLegacy?`.
- **PainType (enum)**: [Pulsátil, Ardor, Eléctrico, Punzante, Profundo, Rigidez, Sensibilidad al tacto, Desconocido]

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de nuevos registros requieren `tipo de dolor` antes de permitir guardar (verificable por prueba automática y manual).
- **SC-002**: Tras implementación, en un test de 100 entradas, al menos 95% incluyen `painType` correctamente guardado (meta de calidad de datos).
- **SC-003**: Filtrado por `tipo de dolor` en Estadísticas responde en menos de 1 segundo para datasets típicos (≤ 1k registros).
- **SC-004**: Usuarios pueden completar el flujo de registrar (seleccionar región → intensidad → tipo → confirmar) en menos de 30 segundos en móvil promedio.
- **SC-005**: Migración de datos legacy sin tipo marca entradas como `Desconocido` y no provoca pérdida de registros.

## Assumptions

- El campo `intensity` ya existe y es obligatorio; este cambio añade un campo obligatorio adicional `painType`.
- No se añadirán tipos personalizados por usuarios en la primera versión; sólo la lista enumerada.
- Localización i18n básica ya está disponible en la aplicación.

## Implementation Notes (non-normative)

- UI: después de ajustar el slider de intensidad, se mostrará inmediatamente un selector (dropdown/radio) con los tipos, o la selección puede abrirse automáticamente.
- Backend/localStorage: almacenar `painType` como string corto (ej. `pulsatile`, `burning`, `electric`, `sharp`, `deep`, `stiffness`, `tenderness`, `unknown`).
- Migration: los registros legacy sin `painType` se marcarán `unknown` y se incluirá una notificación en la pantalla de historia para editar los registros si el usuario lo desea.
