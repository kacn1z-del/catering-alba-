import React from 'react';

/**
 * CostaRicaRibbon
 * Cintas decorativas delgadas con los colores de la bandera de Costa Rica,
 * ubicadas en ambas esquinas superiores.
 *
 * Uso:
 * 1. Guarda este archivo como src/components/CostaRicaRibbon.jsx
 * 2. Importalo en tu componente principal (App.jsx o donde esté tu Header):
 *      import CostaRicaRibbon from './components/CostaRicaRibbon';
 * 3. Colócalo justo arriba de tu Header, dentro de un contenedor con
 *    position: relative (o al inicio del <body> visual de tu página):
 *
 *      <div style={{ position: 'relative' }}>
 *        <CostaRicaRibbon />
 *        <Header />
 *        ...
 *      </div>
 */

export default function CostaRicaRibbon() {
  return (
    <>
      {/* Cinta esquina superior izquierda */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '90px',
          height: '90px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <svg
          viewBox="0 0 90 90"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <g transform="rotate(-45 0 0) translate(-20,-10)">
            <rect x="0" y="0" width="140" height="7" fill="#002B7F" />
            <rect x="0" y="7" width="140" height="4" fill="#FFFFFF" />
            <rect x="0" y="11" width="140" height="10" fill="#CE1126" />
            <rect x="0" y="21" width="140" height="4" fill="#FFFFFF" />
            <rect x="0" y="25" width="140" height="7" fill="#002B7F" />
          </g>
        </svg>
      </div>

      {/* Cinta esquina superior derecha */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '90px',
          height: '90px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <svg
          viewBox="0 0 90 90"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <g transform="rotate(45 90 0) translate(-50,-10)">
            <rect x="0" y="0" width="140" height="7" fill="#002B7F" />
            <rect x="0" y="7" width="140" height="4" fill="#FFFFFF" />
            <rect x="0" y="11" width="140" height="10" fill="#CE1126" />
            <rect x="0" y="21" width="140" height="4" fill="#FFFFFF" />
            <rect x="0" y="25" width="140" height="7" fill="#002B7F" />
          </g>
        </svg>
      </div>
    </>
  );
}
