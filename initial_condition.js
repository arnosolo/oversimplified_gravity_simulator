// Add Mars
const moverConfigs3 = [
  { // Star
    pX: 0, pY: -100, vX: 0, vY: 0, accX: 0, accY: 0,
    mass: 6000, radius: 12, tag: 'Sun', color: {r:230, g:150, b:0},
    pathLenMax: 200,
  },
  { // Mercury
    pX: -60, pY: -100, vX: 0, vY: 30, accX: 0, accY: 0,
    mass: 80, radius: 4, tag: 'Mercury', color: {r:120, g:180, b:0}, 
    pathLenMax: 80,
  },
  { // Earth
    pX: -180, pY: -100, vX: 0, vY: 18, accX: 0, accY: 0,
    mass: 100, radius: 6, tag: 'Earth', color: {r:20, g:150, b:220},
    pathLenMax: 200
  },
  { // Luna
    pX: -190, pY: -100, vX: 0, vY: 8, accX: 0, accY: 0,
    mass: 2, radius: 2, tag: 'Luna', color: {r:180, g:180, b:150}, 
    pathLenMax: 30, hide: false, hideTag: true
  },
  { // Mars
    pX: -350, pY: -100, vX: 0, vY: 13, accX: 0, accY: 0,
    mass: 80, radius: 5, tag: 'Mars', color: {r:200, g:80, b:20},
    pathLenMax: 700
  },
  { // Mars moon Phobos
    pX: -360, pY: -100, vX: 0, vY: 4, accX: 0, accY: 0,
    mass: 1, radius: 1.6, tag: 'Phobos', color: {r:149, g:165, b:166},
    pathLenMax: 30, hideTag: true
  },
  { // Mars moon Deimos
    pX: -350, pY: -120, vX: 6.5, vY: 13, accX: 0, accY: 0,
    mass: 0.6, radius: 1.6, tag: 'Deimos', color: {r:170, g:140, b:134},
    pathLenMax: 60, hideTag: true
  },
]

// Two Suns
const moverConfigs4 = [
  { // Star
    pX: 0, pY: -100, vX: 0, vY: 0, accX: 0, accY: 0,
    mass: 6000, radius: 12, tag: 'Sun', color: {r:230, g:150, b:0},
    pathLenMax: 600,
  },
  { // Star
    pX: 80, pY: -100, vX: 0, vY: 40, accX: 0, accY: 0,
    mass: 6000, radius: 12, tag: 'Sun2', color: {r:230, g:150, b:0},
    pathLenMax: 600,
  },
  { // Mercury
    pX: -60, pY: -100, vX: 0, vY: 60, accX: 0, accY: 0,
    mass: 80, radius: 4, tag: 'Mercury', color: {r:120, g:180, b:0}, 
    pathLenMax: 80,
  },
  { // Earth
    pX: -180, pY: -100, vX: 0, vY: 45, accX: 0, accY: 0,
    mass: 100, radius: 6, tag: 'Earth', color: {r:20, g:150, b:220}
  },
  { // Luna
    pX: -190, pY: -100, vX: 0, vY: 35, accX: 0, accY: 0,
    mass: 2, radius: 2, tag: 'Luna', color: {r:180, g:180, b:150}, 
    pathLenMax: 30, hide: false
  },
  { // Mars
    pX: -350, pY: -100, vX: 0, vY: 38, accX: 0, accY: 0,
    mass: 80, radius: 5, tag: 'Mars', color: {r:200, g:80, b:0},
    pathLenMax: 500
  },
  { // Mars moon Phobos
    pX: -360, pY: -100, vX: 0, vY: 30, accX: 0, accY: 0,
    mass: 1, radius: 1.6, tag: '', color: {r:149, g:165, b:166},
    pathLenMax: 30
  },
  { // Mars moon Deimos
    pX: -350, pY: -120, vX: 6, vY: 38, accX: 0, accY: 0,
    mass: 0.6, radius: 1.6, tag: '', color: {r:210, g:165, b:166},
    pathLenMax: 30
  },
]