// Add Mars
const moverConfigs1 = [
  { // Star
    tag: 'Sun', pX: 0, pY: -100, vX: 0, vY: 0,
    mass: 60000, radius: 12, color: '#e69600',
    pathLenMax: 200,
  },
  { // Hi
    tag: 'Hi', pX: 5, pY: 5, vX: 32, vY: 0,
    mass: 0.1, radius: 3, color: '#95a5a6',
    pathLenMax: 50,
  },
  { // Mercury
    tag: 'Mercury', pX: -80, pY: -100, vX: 0, vY: 27.386,
    mass: 150, radius: 4, color: '#78b400',
    pathLenMax: 40,
  },
  { // Earth
    tag: 'Earth', pX: -180, pY: -100, vX: 0, vY: 19,
    mass: 300, radius: 6, color: '#1496dc',
    pathLenMax: 200
  },
  { // Luna
    tag: 'Luna', pX: -190, pY: -100, vX: 0, vY: 13,
    mass: 5, radius: 2, color: '#b4b496',
    pathLenMax: 30, hide: false, hideTag: true
  },
  { // Mars
    tag: 'Mars', pX: -350, pY: -100, vX: 0, vY: 14,
    mass: 200, radius: 5, color: '#c85014',
    pathLenMax: 700
  },
  { // Mars moon Phobos
    tag: 'Phobos', pX: -360, pY: -100, vX: 0, vY: 9.528,
    mass: 2, radius: 1.6, color: '#95a5a6',
    pathLenMax: 30, hideTag: true
  },
  { // Mars moon Deimos
    tag: 'Deimos', pX: -370, pY: -100, vX: 0, vY: 10.8377,
    mass: 2, radius: 1.6, color: '#aa8c86',
    pathLenMax: 60, hideTag: true
  },
]

// Two Suns
const moverConfigs2 = [
  { // Star
    tag: 'Sun',
    pX: 0, pY: -100, vX: 0, vY: 0,
    mass: 60000, radius: 12,  color: '#e69600',
    pathLenMax: 600,
  },
  { // Star
    tag: 'Sun2',
    pX: 80, pY: -100, vX: 0, vY: 40,
    mass: 60000, radius: 12, color: '#e69600',
    pathLenMax: 600,
  },
  { // Mercury
    tag: 'Mercury',
    pX: -60, pY: -100, vX: 0, vY: 60,
    mass: 800, radius: 4, color: '#78b400',
    pathLenMax: 80,
  },
  { // Earth
    tag: 'Earth',
    pX: -180, pY: -100, vX: 0, vY: 45,
    mass: 1000, radius: 6, color: '#1496dc'
  },
  { // Luna
    tag: 'Luna',
    pX: -190, pY: -100, vX: 0, vY: 35,
    mass: 20, radius: 2, color: '#b4b496',
    pathLenMax: 30, hide: false, hideTag: true
  },
  { // Mars
    tag: 'Mars',
    pX: -350, pY: -100, vX: 0, vY: 38,
    mass: 800, radius: 5, color: '#c85014',
    pathLenMax: 500
  },
  { // Mars moon Phobos
    tag: 'Phobos',
    pX: -360, pY: -100, vX: 0, vY: 30,
    mass: 10, radius: 1.6, color: '#95a5a6',
    pathLenMax: 30, hideTag: true,
  },
  { // Mars moon Deimos
    tag: 'Deimos',
    pX: -350, pY: -120, vX: 6, vY: 38,
    mass: 6, radius: 1.6, color: '#aa8c86',
    pathLenMax: 30, hideTag: true,
  },
]

// Three Suns
let speedMag = 17.320508075688775
const moverConfigs3 = [
  { // Sun
    tag: 'Sun',
    pX: -100, pY: 0, vX: speedMag * 0.5, vY: speedMag * Math.cos(Math.PI / 6),
    mass: 60000, radius: 12, color: '#e69600',
    pathLenMax: 30, forceScale: 0.0005, velScale: 2,
  },
  { // Sun2
    tag: 'Sun3',
    pX: 0, pY: -100 * Math.tan(Math.PI/3), vX: -speedMag, vY: 0,
    mass: 60000, radius: 12, color: '#e69600',
    pathLenMax: 30, forceScale: 0.0005, velScale: 2,
  },
  { // Sun3
    tag: 'Sun3',
    pX: 100, pY: 0, vX: speedMag * 0.5, vY: speedMag * -Math.cos(Math.PI / 6),
    mass: 60000, radius: 12, color: '#e69600',
    pathLenMax: 30, forceScale: 0.0005, velScale: 2,
  },
]


/* figure-8 solution to the three-body problem
 * https://en.wikipedia.org/wiki/Three-body_problem#cite_note-11
 */
const pScaler = 200
const vScaler = 15
const moverConfigs4 = [
  { // Sun
    tag: 'Sun',
    pX: -0.97000436 * pScaler, pY: 0.24308753 * pScaler, vX: 0.4662036850 * vScaler, vY: 0.4323657300 * vScaler,
    mass: pScaler * vScaler * vScaler, radius: 9, color: '#e69600',
    pathLenMax: 120, hideTag: true, forceScale: 0.0005, velScale: 2,
  },
  { // Sun2
    tag: 'Sun2',
    pX: 0, pY: 0, vX: -0.93240737 * vScaler, vY: -0.86473146 * vScaler,
    mass: pScaler * vScaler * vScaler, radius: 9, color: '#e69600',
    pathLenMax: 120, hideTag: true, forceScale: 0.0005, velScale: 2,
  },
  { // Sun3
    tag: 'Sun3',
    pX: 0.97000436 * pScaler, pY: -0.24308753 * pScaler, vX: 0.4662036850 * vScaler, vY: 0.4323657300* vScaler,
    mass: pScaler * vScaler * vScaler, radius: 9, color: '#e69600',
    pathLenMax: 120, hideTag: true, forceScale: 0.0005, velScale: 2,
  },
]