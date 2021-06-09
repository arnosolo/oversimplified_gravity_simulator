/**
 * Author: Arno Solo
 * Link: https://github.com/arnosolo
 */

// Settings
const G = 10 // Gravitational constant
const FRAME_RATE = 50
let moverConfigs = moverConfigs3
let referenceName = 'Sun'
let cameraFollow = 'Sun'

// Globals
let cam1
let fontThinItalic
const origin = { position: { x: 0, y: 0, z:0 } } // Could be used as an reference
let camPos = { x: 0, y: 0, z:450 }
let movers = []
let referencePicker
let cameraPicker
let prevReferenceName = referenceName

// Main
function preload() {
  fontThinItalic = loadFont('./libraries/Roboto-ThinItalic.ttf');
}

function setup() {
  let myCanvas = createCanvas(500, 400, WEBGL)
  myCanvas.parent("canvas-container");
  frameRate(FRAME_RATE)
  cam1 = createCamera();

  moverConfigs.forEach(config => {
    movers.push(new Mover(config))
  })

  // GUI
  let controlPanel = document.getElementById('control-panel')
  
  // hide/show path
  let hidePathBtn = document.createElement('button')
  hidePathBtn.innerHTML = 'Hide Path'
  hidePathBtn.onclick = (e) => {
    if(hidePathBtn.innerHTML == 'Hide Path'){
      hidePathBtn.innerHTML = 'Show Path'
    } else {
      hidePathBtn.innerHTML = 'Hide Path'
    }
    movers.forEach(m => m.hidePath = !m.hidePath)
  }
  hidePathBtn.className = 'button'
  controlPanel.append(hidePathBtn)

  // referencePicker
  let referenceLabel = document.createElement('label')
  referenceLabel.innerHTML = 'Reference'
  referencePicker = document.createElement('select')
  movers.forEach(mover => {
    let option = document.createElement('option')
    option.nodeValue = mover.tag
    option.innerHTML = mover.tag
    referencePicker.appendChild(option)
  })
  referencePicker.onchange = (event) => {
    let picker=event.target
    let moverName = picker.options[picker.selectedIndex].value;
    referenceName = moverName
  }
  referenceLabel.appendChild(referencePicker)
  referenceLabel.className = 'moverPicker'
  controlPanel.append(referenceLabel)

  // cameraPicker
  let cameraLabel = document.createElement('label')
  cameraLabel.innerHTML = 'Camera follow '
  cameraPicker = document.createElement('select')
  movers.forEach(mover => {
    let option = document.createElement('option')
    option.nodeValue = mover.tag
    option.innerHTML = mover.tag
    cameraPicker.appendChild(option)
  })
  cameraPicker.onchange = (event) => {
    let picker=event.target
    let moverName = picker.options[picker.selectedIndex].value;
    cameraFollow = moverName
  }
  cameraLabel.appendChild(cameraPicker)
  cameraLabel.className = 'moverPicker'
  controlPanel.append(cameraLabel)
}

function draw() {
  background(220);

  // 1. Set reference 
  // NOTE: Luna is the Center of Universe !!!! [Doge]
  let reference
  // let reference = getCenter(movers, 'Sun', 'Earth') // Get center point of two Movers
  if(referenceName == 'origin') {
    reference = origin
  } else {
    reference = movers.find(mover => mover.tag == referenceName)
    if(!reference)reference = origin
  }

  // reset path if reference change
  if(prevReferenceName != referenceName){
    movers.forEach(mover => mover.relativePath = [])
    prevReferenceName = referenceName
  }

  // 2. Apply gravity
  movers.forEach(mover => {
    mover.attracted(movers.filter(item => item != mover))
  })

  // 3. Update movers status (Can't be merged with last step!)
  movers.forEach(mover => {
    mover.update(reference)
  })

  // 4. Set Camera
  // Option1: Follow the reference
  // cam1.setPosition(reference.position.x, reference.position.y, 500);
  // cam1.lookAt(reference.position.x, reference.position.y, 0);

  // Option2: Follow the Earth
  const temp = movers.find(mover => mover.tag == cameraFollow).position
  camPos.x = temp.x
  camPos.y = temp.y
  cam1.setPosition(camPos.x, camPos.y, camPos.z);
  cam1.lookAt(camPos.x, camPos.y, 0);

  // 5. Draw
  movers.forEach(mover => {
    mover.show(reference)
  })

}


// Utils
/**
 * Get Center point of two Movers by tagname
 * @param {Array} movers An array of movers
 * @param {string} tag1 TagName of Mover1
 * @param {string} tag2 TagName of Mover2
 * @return {Object} { position: {x: ,y: ,z: } }
 */
const getCenter = (movers, tag1, tag2) => {
  let m1 = movers.find(mover => mover.tag == tag1)
  let m2 = movers.find(mover => mover.tag == tag2)
  return {
    position: {
      x: (m1.position.x + m2.position.x) * 0.5,
      y: (m1.position.y + m2.position.y) * 0.5,
      z: (m1.position.z + m2.position.z) * 0.5,
    }
  }
}