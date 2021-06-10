// Add Mars
const moverConfigs1 = [
  { // Star
    pX: 0, pY: -100, vX: 0, vY: 0, 
    mass: 6000, radius: 12, tag: 'Sun', color: {r:230, g:150, b:0},
    pathLenMax: 200,
  },
  { // Mercury
    pX: -60, pY: -100, vX: 0, vY: 30, 
    mass: 80, radius: 4, tag: 'Mercury', color: {r:120, g:180, b:0}, 
    pathLenMax: 80,
  },
  { // Earth
    pX: -180, pY: -100, vX: 0, vY: 18, 
    mass: 100, radius: 6, tag: 'Earth', color: {r:20, g:150, b:220},
    pathLenMax: 200
  },
  { // Luna
    pX: -190, pY: -100, vX: 0, vY: 7, 
    mass: 2, radius: 2, tag: 'Luna', color: {r:180, g:180, b:150}, 
    pathLenMax: 30, hide: false, hideTag: true
  },
  { // Mars
    pX: -350, pY: -100, vX: 0, vY: 14, 
    mass: 80, radius: 5, tag: 'Mars', color: {r:200, g:80, b:20},
    pathLenMax: 700
  },
  { // Mars moon Phobos
    pX: -360, pY: -100, vX: 0, vY: 5, 
    mass: 0.5, radius: 1.6, tag: 'Phobos', color: {r:149, g:165, b:166},
    pathLenMax: 30, hideTag: true
  },
  { // Mars moon Deimos
    pX: -370, pY: -100, vX: 0, vY: 7, 
    mass: 0.5, radius: 1.6, tag: 'Deimos', color: {r:170, g:140, b:134},
    pathLenMax: 60, hideTag: true
  },
]

// Two Suns
const moverConfigs2 = [
  { // Star
    pX: 0, pY: -100, vX: 0, vY: 0, 
    mass: 6000, radius: 12, tag: 'Sun', color: {r:230, g:150, b:0},
    pathLenMax: 600,
  },
  { // Star
    pX: 80, pY: -100, vX: 0, vY: 40, 
    mass: 6000, radius: 12, tag: 'Sun2', color: {r:230, g:150, b:0},
    pathLenMax: 600,
  },
  { // Mercury
    pX: -60, pY: -100, vX: 0, vY: 60, 
    mass: 80, radius: 4, tag: 'Mercury', color: {r:120, g:180, b:0}, 
    pathLenMax: 80,
  },
  { // Earth
    pX: -180, pY: -100, vX: 0, vY: 45, 
    mass: 100, radius: 6, tag: 'Earth', color: {r:20, g:150, b:220}
  },
  { // Luna
    pX: -190, pY: -100, vX: 0, vY: 35, 
    mass: 2, radius: 2, tag: 'Luna', color: {r:180, g:180, b:150}, 
    pathLenMax: 30, hide: false,  hideTag: true
  },
  { // Mars
    pX: -350, pY: -100, vX: 0, vY: 38, 
    mass: 80, radius: 5, tag: 'Mars', color: {r:200, g:80, b:0},
    pathLenMax: 500
  },
  { // Mars moon Phobos
    pX: -360, pY: -100, vX: 0, vY: 30, 
    mass: 1, radius: 1.6, tag: 'Phobos', color: {r:149, g:165, b:166},
    pathLenMax: 30,  hideTag: true,
  },
  { // Mars moon Deimos
    pX: -350, pY: -120, vX: 6, vY: 38, 
    mass: 0.6, radius: 1.6, tag: 'Deimos', color: {r:210, g:165, b:166},
    pathLenMax: 30,  hideTag: true,
  },
]

let sp = 17.3852
// Three Suns
const moverConfigs3 = [
  { // Sun
    pX: -100, pY: 0, vX: sp*0.5, vY: sp*0.8660254, 
    mass: 6000, radius: 12, tag: 'Sun', color: {r:230, g:150, b:0},
    pathLenMax: 600,
  },
  { // Sun2
    pX: 100, pY: 0, vX: sp*0.5, vY: sp*-0.8660254, 
    mass: 6000, radius: 12, tag: 'Sun2', color: {r:230, g:150, b:0},
    pathLenMax: 600,
  },
  { // Sun3
    pX: 0, pY: -173.2, vX:-sp, vY: 0, 
    mass: 6000, radius: 12, tag: 'Sun3', color: {r:230, g:150, b:0},
    pathLenMax: 600,
  },
  // { // Mercury
  //   pX: -60, pY: -100, vX: 0, vY: 60, 
  //   mass: 80, radius: 4, tag: 'Mercury', color: {r:120, g:180, b:0}, 
  //   pathLenMax: 80,
  // },
  // { // Earth
  //   pX: -180, pY: -100, vX: 0, vY: 45, 
  //   mass: 100, radius: 6, tag: 'Earth', color: {r:20, g:150, b:220}
  // },
  // { // Luna
  //   pX: -190, pY: -100, vX: 0, vY: 35, 
  //   mass: 2, radius: 2, tag: 'Luna', color: {r:180, g:180, b:150}, 
  //   pathLenMax: 30, hide: false,  hideTag: true
  // },
  // { // Mars
  //   pX: -350, pY: -100, vX: 0, vY: 38, 
  //   mass: 80, radius: 5, tag: 'Mars', color: {r:200, g:80, b:0},
  //   pathLenMax: 500
  // },
  // { // Mars moon Phobos
  //   pX: -360, pY: -100, vX: 0, vY: 30, 
  //   mass: 1, radius: 1.6, tag: 'Phobos', color: {r:149, g:165, b:166},
  //   pathLenMax: 30,  hideTag: true,
  // },
  // { // Mars moon Deimos
  //   pX: -350, pY: -120, vX: 6, vY: 38, 
  //   mass: 0.6, radius: 1.6, tag: 'Deimos', color: {r:210, g:165, b:166},
  //   pathLenMax: 30,  hideTag: true,
  // },
]