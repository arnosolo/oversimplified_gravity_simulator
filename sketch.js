/**
 * Author: Arno Solo
 * Link: https://github.com/arnosolo
 */

// Settings
const G = 10 // Gravitational constant
const FRAME_RATE = 50
// localStorage.setItem('moverConfigs1', JSON.stringify(moverConfigs1));
// let moverConfigs = JSON.parse(localStorage.getItem('moverConfigs1'));
let moverConfigs = moverConfigs1
let referenceName = 'Origin'
let cameraFollow = 'Origin'

// Globals
let cam1
let fontThinItalic
let camPos = { x: 0, y: 0, z:500 }
let movers = []
let referencePicker
let cameraPicker
let prevReferenceName = referenceName
let prevmoverConfigs = moverConfigs
const originConfig = { tag: 'Origin', pathLenMax: 1, hide: true }
let origin

// Main
function preload() {
  fontThinItalic = loadFont('./libraries/Roboto-ThinItalic.ttf');
}

function setup() {
  let myCanvas = createCanvas(500, 400, WEBGL)
  myCanvas.parent("canvas-container");
  frameRate(FRAME_RATE)
  cam1 = createCamera();
  
  origin = new Mover(originConfig)
  movers.push(origin)
  moverConfigs.forEach(config => {
    movers.push(new Mover(config))
  })

  setGUI()
}

function draw() {
  background(220);

  // Check if initial condition changed
  if(prevmoverConfigs != moverConfigs){
    movers = []

    origin = new Mover(originConfig)
    movers.push(origin)
    moverConfigs.forEach(config => {
      movers.push(new Mover(config))
    })

    setGUI()

    prevmoverConfigs = moverConfigs
  }

  // 1. Set reference 
  // NOTE: Luna is the Center of Universe !!!! [Doge]
  let reference = movers.find(mover => mover.tag == referenceName)
  // let reference = getCenter(movers, 'Sun', 'Earth') // Get center point of two Movers
  if(!reference)reference = origin

  // reset path if reference change
  if(prevReferenceName != referenceName){
    movers.forEach(mover => mover.relativePath = [])
    prevReferenceName = referenceName
  }

  // 2. Apply gravity
  movers.forEach(mover => {
    if(mover.tag != 'Origin') {
      mover.attracted(movers.filter(item => item != mover))
    }
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
  let temp = movers.find(mover => mover.tag == cameraFollow).position
  camPos.x = temp.x
  camPos.y = temp.y
  cam1.setPosition(camPos.x, camPos.y, camPos.z);
  cam1.lookAt(camPos.x, camPos.y, 0);

  // 5. Draw
  movers.forEach(mover => {
    mover.show(reference)
  })

}


// GUI
const setGUI = () => {
  let controlPanel = document.getElementById('controlPanel1')
  controlPanel.innerHTML = ''

  // referencePicker
  let referenceLabel = document.createElement('label')
  referenceLabel.innerHTML = '📍 Reference'
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
  cameraLabel.innerHTML = '📹 Cam follow '
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

  // hide/show path
  let hidePathBtn = document.createElement('button')
  hidePathBtn.innerHTML = '💫Hide Path'
  hidePathBtn.onclick = (e) => {
    if(hidePathBtn.innerHTML == '💫Hide Path'){
      hidePathBtn.innerHTML = '💫Show Path'
    } else {
      hidePathBtn.innerHTML = '💫Hide Path'
    }
    movers.forEach(m => m.hidePath = !m.hidePath)
  }
  hidePathBtn.className = 'button'
  controlPanel.append(hidePathBtn)

  // hide/show velocity
  let hideVelBtn = document.createElement('button')
  hideVelBtn.innerHTML = 'Show Velocity'
  hideVelBtn.onclick = (e) => {
    if(hideVelBtn.innerHTML == 'Show Velocity'){
      hideVelBtn.innerHTML = 'Hide Velocity'
    } else {
      hideVelBtn.innerHTML = 'Show Velocity'
    }
    movers.forEach(m => m.hideVel = !m.hideVel)
  }
  hideVelBtn.className = 'button'
  controlPanel.append(hideVelBtn)
  
  // Initial condition editor
  let initCondiEditor = document.getElementById('initial_condition')
  initCondiEditor.innerHTML = ''

  let initCondition = document.createElement('textarea')
  initCondition.id = 'initCondition'
  initCondition.cols = 30
  initCondition.rows = 22
  initCondition.value = JSON.stringify(moverConfigs)

  let applyConditionBtn = document.createElement('button')
  applyConditionBtn.className = 'button'
  applyConditionBtn.innerHTML = 'Apply Init condition'
  applyConditionBtn.onclick = (e) => {
    moverConfigs = JSON.parse(initCondition.value)
  }

  let saveConditionBtn = document.createElement('button')
  saveConditionBtn.className = 'button'
  saveConditionBtn.innerHTML = 'Save Init condition'
  let funDownload = function (content, filename) {
    // 创建隐藏的下载链接
    let link = document.createElement('a');
    link.download = filename;
    link.style.display = 'none';
    // 字符内容 -> blob
    let blob = new Blob([content]);
    link.href = URL.createObjectURL(blob);
    // 点击下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  saveConditionBtn.onclick = (e) => {
    const filename = `initCondition_${new Date().toLocaleTimeString()}.json`
    funDownload(JSON.stringify(moverConfigs), filename)
  }

  let readConditionBtn = document.createElement('button')
  readConditionBtn.className = 'button'
  readConditionBtn.innerHTML = 'Read local file'
  readConditionBtn.onclick = (e) => {
    let input = document.createElement('input');
    input.type = 'file'
    input.accept = 'json'
    input.style.display = 'none';
    input.click();
    input.onchange = (event) => {
      const file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        document.getElementById('initCondition').value = reader.result;
        moverConfigs = JSON.parse(reader.result)
      };
      reader.readAsText(file);
   }
    }


  initCondiEditor.append(applyConditionBtn)
  initCondiEditor.append(saveConditionBtn)
  initCondiEditor.append(readConditionBtn)
  initCondiEditor.append(initCondition)

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